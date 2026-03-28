const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { AlleAIClient } = require("alle-ai-sdk");
const cron = require("node-cron");
const { runIngestion } = require("./ingestor.js");
const { savePolicy, saveArticle, getAllPolicies, getAllArticles } = require("./database.js");
const initialMockData = require("./data/policies.js");

dotenv.config({ path: "../.env" });

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Initialize AlleAI client
const alleai = new AlleAIClient({
  apiKey: process.env.ALLEAI_API_KEY,
});

/**
 * SEED DATABASE: Ensure mock data exists in SQLite on startup
 */
function seedDatabase() {
  const existing = getAllPolicies();
  if (existing.length === 0) {
    console.log("🌱 Database is empty. Seeding with mock data...");
    initialMockData.forEach(p => savePolicy(p));
    console.log("✅ Seeding complete.");
  }
}
seedDatabase();

// GET /api/explore — Return ALL aggregated news entries
app.get("/api/explore", (req, res) => {
  const articles = getAllArticles();
  res.json(articles);
});

// GET /api/policies — Return personalized/filtered High-Impact policies
app.get("/api/policies", (req, res) => {
  const { occupation, location } = req.query;

  const dbPolicies = getAllPolicies();

  let enriched = dbPolicies.map((policy) => {
    const impacts = typeof policy.impacts === "string" ? JSON.parse(policy.impacts) : policy.impacts;
    const relevance = typeof policy.relevance === "string" ? JSON.parse(policy.relevance) : policy.relevance;
    
    const personalImpact = impacts[occupation] || impacts.default;
    const roleRelevance = relevance[occupation] || relevance.default || 2;

    return {
      ...policy,
      personalImpact,
      roleRelevance
    };
  });

  // Filter: If occupation is specified, only show things with some relevance (>1)
  if (occupation) {
    enriched = enriched.filter(p => p.roleRelevance > 1);
  }

  // Sort: By Relevance first, then Date
  enriched.sort((a, b) => {
     if (b.roleRelevance !== a.roleRelevance) {
       return b.roleRelevance - a.roleRelevance;
     }
     return new Date(b.date) - new Date(a.date);
  });

  res.json(enriched);
});

// POST /api/ingest — Trigger automated scraping & AI distribution
app.post("/api/ingest", async (req, res) => {
  console.log("🚀 Starting manual ingestion (Two-Tier)...");
  try {
    const processedItems = await runIngestion();
    
    let articleCount = 0;
    let policyCount = 0;

    for (const item of processedItems) {
      // 1. Always save to Explore (Articles)
      const aSaved = saveArticle({
        id: item.id,
        title: item.title,
        summary: item.generalSummary,
        source: item.source,
        sourceName: item.sourceName,
        date: item.date
      });
      if (aSaved) articleCount++;

      // 2. Save to Policies if classified as high-impact
      if (item.isPolicy && item.policyData) {
        const pSaved = savePolicy({
          ...item.policyData,
          id: item.id,
          source: item.source,
          sourceName: item.sourceName,
          date: item.date
        });
        if (pSaved) policyCount++;
      }
    }
    
    res.json({ 
      success: true, 
      ingested: {
        articles: articleCount,
        policies: policyCount
      },
      total: {
        explore: getAllArticles().length,
        home: getAllPolicies().length
      }
    });
  } catch (error) {
    console.error("Ingestion endpoint error:", error.message);
    res.status(500).json({ success: false, error: "Ingestion failed." });
  }
});

// POST /api/explain — AI-powered detailed explanation via AlleAI
app.post("/api/explain", async (req, res) => {
  const { policyTitle, policySummary, occupation, ageGroup, location } =
    req.body;

  if (!policyTitle || !policySummary) {
    return res.status(400).json({ error: "Missing policy data" });
  }

  const prompt = `You are a "Civic Mentor" for young people in Ghana. Explain this policy as if you were encouraging a friend to stay informed and active in their community.

Policy: ${policyTitle}
Summary: ${policySummary}

User Profile:
- Persona: ${occupation || "young person"}
- Location: ${location || "Ghana"}

Instructions:
1. Speak in a "Civic Mentor" tone: Informative, encouraging, and clear.
2. Direct Impact: Explain exactly how this hits the life of a ${occupation || "young person"}.
3. The Why: Why is this happening now? (Context).
4. Takeaway: One specific thing they should watch out for or do.
5. Keep it conversational — avoid bullet points. Final word count under 150 words.`;

  try {
    const response = await alleai.chat.completions({
      models: ["gpt-4o"],
      response_format: { type: "text" },
      messages: [
        {
          user: [
            {
              type: "text",
              text: prompt
            }
          ]
        }
      ],
    });

    // ROBUST EXTRACTION
    let explanation = "";
    if (response.choices?.[0]?.message?.content) {
      explanation = response.choices[0].message.content;
    } else if (response.responses?.responses?.["gpt-4o"]?.message?.content) {
      explanation = response.responses.responses["gpt-4o"].message.content;
    } else if (response.result) {
      explanation = response.result;
    } else if (response.content) {
      explanation = response.content;
    } else {
      explanation = "Your personalized policy explanation is ready! (Response format slightly adjusted)";
    }
                       
    res.json({ explanation });
  } catch (error) {
    console.error("AlleAI API error:", error.message);
    res.json({
      explanation: `This policy on "${policyTitle}" directly affects you as a ${occupation || "young person"} in ${location || "your area"}. ${policySummary} Stay informed and plan ahead for how this might change your daily routine and expenses.`,
    });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Schedule Automated Ingestion: Every hour at the top of the hour
cron.schedule("0 * * * *", async () => {
    console.log("⏰ CRON: Starting automated news ingestion...");
    try {
        const newPolicies = await runIngestion();
        let addedCount = 0;
        for (const np of newPolicies) {
            const saved = savePolicy(np);
            if (saved) addedCount++;
        }
        console.log(`⏰ CRON: Automated ingestion complete. Added ${addedCount} new policies.`);
    } catch (error) {
        console.error("⏰ CRON: Automated ingestion failed:", error.message);
    }
});

app.listen(PORT, () => {
    console.log(`🚀 CivicPulse API running on http://localhost:${PORT} (Persistent SQLite)`);
    console.log(`⏰ Pulse Ingestor scheduled (Every 1 hour)`);
});
