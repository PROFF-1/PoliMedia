import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";
import policies from "./data/policies.js";

dotenv.config({ path: "../.env" });

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
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

// POST /api/explain — AI-powered detailed explanation
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
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    });

    const explanation = message.content[0].text;
    res.json({ explanation });
  } catch (error) {
    console.error("Anthropic API error:", error.message);
    // Fallback to mock explanation if API fails
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
  console.log(`🚀 CivicPulse API running on http://localhost:${PORT}`);
});
