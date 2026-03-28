const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { AlleAIClient } = require("alle-ai-sdk");
const { runIngestion } = require("./ingestor.js");
const policies = require("./data/policies.js");

dotenv.config({ path: "../.env" });

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// In-memory storage for dynamically ingested policies
let ingestedPolicies = [];

// Initialize AlleAI client
const alleai = new AlleAIClient({
  apiKey: process.env.ALLEAI_API_KEY,
});

// GET /api/policies — return all policies (Mock + Ingested)
app.get("/api/policies", (req, res) => {
  const { occupation, location } = req.query;

  // Combine static mock data with any newly ingested live news
  const allData = [...policies, ...ingestedPolicies];

  const enriched = allData.map((policy) => {
    const personalImpact =
      policy.impacts[occupation] || policy.impacts.default;
    const locationImpact =
      policy.impactsByLocation?.[location] || "";

    return {
      id: policy.id,
      title: policy.title,
      summary: policy.summary,
      category: policy.category,
      tags: policy.tags,
      source: policy.source,
      sourceName: policy.sourceName || "Gov Source",
      date: policy.date,
      personalImpact,
      locationImpact,
      deepExplanation: policy.deepExplanation,
    };
  });

  // Sort by date descending
  enriched.sort((a, b) => new Date(b.date) - new Date(a.date));

  res.json(enriched);
});

// POST /api/ingest — Trigger automated scraping & AI harmonization
app.post("/api/ingest", async (req, res) => {
  console.log("🚀 Starting manual ingestion...");
  try {
    const newPolicies = await runIngestion();
    
    // Simple deduplication (by title)
    const uniqueNew = newPolicies.filter(np => 
      !ingestedPolicies.some(ip => ip.title === np.title)
    );
    
    ingestedPolicies = [...uniqueNew, ...ingestedPolicies];
    
    res.json({ 
      success: true, 
      added: uniqueNew.length, 
      totalIngested: ingestedPolicies.length 
    });
  } catch (error) {
    console.error("Ingestion endpoint error:", error.message);
    res.status(500).json({ success: false, error: "Automated ingestion failed." });
  }
});

// POST /api/explain — AI-powered detailed explanation via AlleAI
app.post("/api/explain", async (req, res) => {
  const { policyTitle, policySummary, occupation, ageGroup, location } =
    req.body;

  if (!policyTitle || !policySummary) {
    return res.status(400).json({ error: "Missing policy data" });
  }

  const systemPrompt = `You are a civic educator for young people in Ghana. Explain government policies in simple, relatable, conversational terms — like talking to a friend. Keep it under 120 words. Write in flowing paragraphs, no bullet points.`;

  const userPrompt = `Explain this policy to a ${ageGroup || "18-25"} year old ${occupation || "student"} living in ${location || "urban"} Ghana.

Policy: ${policyTitle}
Summary: ${policySummary}

Focus on: what it means in plain language, and how it specifically affects someone in their situation.`;


  try {
    const MODEL = "gpt-4o";

    const response = await alleai.chat.completions({
      models: [MODEL],
      messages: [
        {
          system: [{
            type: "text",
            text: systemPrompt
          }]
        },
        {
          user: [{
            type: "text",
            text: userPrompt
          }]
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
      stream: false
    });

    // AlleAI response shape: response.responses.choices[0].message.content
    const explanation =
      response.responses?.choices?.[0]?.message?.content ||
      response.responses?.choices?.[0]?.text ||
      null;

    if (!explanation) {
      throw new Error("Empty explanation from AlleAI");
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

app.listen(PORT, () => {
  console.log(`🚀 CivicPulse API running on http://localhost:${PORT} (Using AlleAI)`);
});
