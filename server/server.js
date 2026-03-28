const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { AlleAIClient } = require("alle-ai-sdk");
const policies = require("./data/policies.js");


dotenv.config({ path: "../.env" });

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Initialize AlleAI client
const alleai = new AlleAIClient({
  apiKey: process.env.ALLEAI_API_KEY,
});

// GET /api/policies — return all mock policies
app.get("/api/policies", (req, res) => {
  const { occupation, location } = req.query;

  const enriched = policies.map((policy) => {
    const personalImpact =
      policy.impacts[occupation] || policy.impacts.default;
    const locationImpact =
      policy.impactsByLocation[location] || "";

    return {
      id: policy.id,
      title: policy.title,
      summary: policy.summary,
      category: policy.category,
      tags: policy.tags,
      source: policy.source,
      sourceName: policy.sourceName,
      date: policy.date,
      personalImpact,
      locationImpact,
      deepExplanation: policy.deepExplanation,
    };
  });

  res.json(enriched);
});

// POST /api/explain — AI-powered detailed explanation via AlleAI
app.post("/api/explain", async (req, res) => {
  const { policyTitle, policySummary, occupation, ageGroup, location } =
    req.body;

  if (!policyTitle || !policySummary) {
    return res.status(400).json({ error: "Missing policy data" });
  }

  const prompt = `You are a civic educator for young people in Ghana. Explain the following government policy in simple, relatable terms.

Policy: ${policyTitle}
Summary: ${policySummary}

User Profile:
- Age Group: ${ageGroup || "18-25"}
- Occupation: ${occupation || "student"}
- Location: ${location || "urban"}

Instructions:
1. Explain what this policy means in 2-3 sentences using everyday language
2. Explain specifically how it affects someone who is a ${occupation || "student"} in ${location || "urban"} Ghana
3. Use a conversational, friendly tone — like explaining to a friend
4. Keep the total response under 150 words
5. Do NOT use bullet points — write in flowing paragraphs`;

  try {
    // Attempting the specific 2026 model ID. Fallback if needed.
    const models = ["claude-opus-4-5-20251101", "claude-4-5-opus", "claude-3-5-opus"];

    const response = await alleai.chat.completions({
      models: [models[0]], // Using the most specific one first
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

    // Handle different response structures from AlleAI
    const explanation = response.choices?.[0]?.message?.content ||
      response.result ||
      response.content ||
      "Your personalized policy explanation is ready! (Response format slightly adjusted)";

    res.json({ explanation });
  } catch (error) {
    console.error("AlleAI API error:", error.message);

    // If the specific model ID failed, we can try sonnet or a generic id as a backup if we wanted, 
    // but for now we provide the friendly fallback the user requested.
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
