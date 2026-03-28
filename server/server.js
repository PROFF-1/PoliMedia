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
