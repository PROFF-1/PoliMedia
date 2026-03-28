const axios = require("axios");
const cheerio = require("cheerio");
const { AlleAIClient } = require("alle-ai-sdk");
const dotenv = require("dotenv");

dotenv.config({ path: "../.env" });

const alleai = new AlleAIClient({
  apiKey: process.env.ALLEAI_API_KEY,
});

/**
 * Step 1: Scrape Latest Ghana Politics News (Direct HTML)
 */
async function fetchNews() {
  console.log("📡 Scraping live politics news from Citi Newsroom...");
  try {
    const { data } = await axios.get("https://citinewsroom.com/category/news/politics/", {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(data);
    const items = [];

    // Updated selectors based on JNews theme used by Citi Newsroom
    $(".jeg_post").each((i, el) => {
      if (i >= 5) return; // Top 5 stories

      const titleEl = $(el).find(".jeg_post_title a");
      const title = titleEl.text().trim();
      const link = titleEl.attr("href");
      const snippet = $(el).find(".jeg_post_excerpt").text().trim();

      if (title && link) {
        items.push({
          title,
          link,
          contentSnippet: snippet,
          pubDate: new Date().toISOString()
        });
      }
    });

    console.log(`✅ Scraped ${items.length} news items.`);
    return items;
  } catch (error) {
    console.error("Scraping error:", error.message);
    return [];
  }
}

/**
 * Step 2: AI Harmonization (Transform news to CivicPulse Policy)
 */
async function harmonizeWithAI(newsItem) {
  console.log(`🤖 Harmonizing: ${newsItem.title}`);
  
  const prompt = `You are a policy analyst for CivicPulse Ghana. Convert this news item into a structured "Policy" object.

News Title: ${newsItem.title}
Snippet: ${newsItem.contentSnippet}

REQUIRED JSON OUTPUT FORMAT:
{
  "title": "Short, clear title",
  "summary": "1-2 sentence high-level summary",
  "category": "transport|finance|health|education|technology",
  "tags": [{"label": "Status", "direction": "up|down|neutral"}],
  "impacts": {
    "student": "1-sentence impact",
    "developer": "1-sentence impact",
    "trader": "1-sentence impact",
    "default": "generic impact"
  },
  "deepExplanation": "2-3 comprehensive sentences explaining the context (The Why)."
}

Instructions:
1. If the news is NOT about government/policy/public life, return null.
2. Focus on how it affects the livelihood of youth in Ghana.
3. Return ONLY valid JSON.`;

  try {
    const response = await alleai.chat.completions({
      models: ["gpt-4o"], // Verified active model
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

    // ROBUST EXTRACTION: AlleAI sometimes wraps results differently depending on the model/config
    let content = "";
    if (response.choices?.[0]?.message?.content) {
      content = response.choices[0].message.content;
    } else if (response.responses?.responses?.["gpt-4o"]?.message?.content) {
      content = response.responses.responses["gpt-4o"].message.content;
    } else if (response.result) {
      content = response.result;
    } else if (response.content) {
      content = response.content;
    }

    console.log(`DEBUG: Extracted Content length: ${content.length}`);
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const policyData = JSON.parse(jsonMatch[0]);
      if (policyData.title && policyData.title !== "null") {
        console.log(`✨ Generated Policy: ${policyData.title}`);
        return {
          ...policyData,
          id: Date.now() + Math.random(),
          source: newsItem.link,
          sourceName: "Citi News Ghana",
          date: new Date().toISOString().split('T')[0]
        };
      }
    }
  } catch (error) {
    console.error("AI processing failed for item:", newsItem.title, error.message);
  }
  return null;
}

/**
 * Step 3: Run the Ingestion Pipeline
 */
async function runIngestion() {
  const news = await fetchNews();
  const validPolicies = [];

  for (const item of news) {
    const policy = await harmonizeWithAI(item);
    if (policy) {
      validPolicies.push(policy);
    }
    // Rate limit protection
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`✅ Ingestion complete. Generated ${validPolicies.length} new policies.`);
  return validPolicies;
}

module.exports = { runIngestion };
