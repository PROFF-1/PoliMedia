const axios = require("axios");
const cheerio = require("cheerio");
const { AlleAIClient } = require("alle-ai-sdk");
const dotenv = require("dotenv");

dotenv.config({ path: "../.env" });

const alleai = new AlleAIClient({
  apiKey: process.env.ALLEAI_API_KEY,
});

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://www.google.com'
};

/**
 * SOURCE 1: Citi Newsroom (Handle 403 gracefully)
 */
async function scrapeCitiNews() {
  console.log("📡 Scraping: Citi Newsroom...");
  try {
    const { data } = await axios.get("https://citinewsroom.com/category/news/politics/", { headers: HEADERS, timeout: 5000 });
    const $ = cheerio.load(data);
    const items = [];
    $(".jeg_post").each((i, el) => {
      if (i >= 3) return;
      const titleEl = $(el).find(".jeg_post_title a");
      if (titleEl.length) {
        items.push({
          title: titleEl.text().trim(),
          link: titleEl.attr("href"),
          snippet: $(el).find(".jeg_post_excerpt").text().trim(),
          sourceName: "Citi News Ghana"
        });
      }
    });
    return items;
  } catch (e) {
    console.warn("⚠️ Citi News scrape blocked (403/502). Skipping.");
    return [];
  }
}

/**
 * SOURCE 2: JoyOnline (Broader Selectors)
 */
async function scrapeJoyOnline() {
  console.log("📡 Scraping: JoyOnline...");
  try {
    const { data } = await axios.get("https://www.myjoyonline.com/category/politics/", { headers: HEADERS, timeout: 5000 });
    const $ = cheerio.load(data);
    const items = [];
    
    // JoyOnline often uses h3 for titles in grids
    $("h3 a").each((i, el) => {
      const title = $(el).text().trim();
      const href = $(el).attr("href");
      if (title.length > 30 && href && href.includes("politics") && items.length < 5) {
        items.push({
          title,
          link: href.startsWith("http") ? href : "https://www.myjoyonline.com" + href,
          snippet: "",
          sourceName: "JoyOnline"
        });
      }
    });
    return items;
  } catch (e) {
    console.warn("⚠️ JoyOnline scrape failed. Skipping.");
    return [];
  }
}

/**
 * SOURCE 3: Graphic Online (Verified Working)
 */
async function scrapeGraphicOnline() {
  console.log("📡 Scraping: Graphic Online...");
  try {
    const { data } = await axios.get("https://www.graphic.com.gh/news/politics.html", { headers: HEADERS, timeout: 5000 });
    const $ = cheerio.load(data);
    const items = [];
    
    // Select both featured and list items
    $("h4 a, h2 a").each((i, el) => {
      const title = $(el).text().trim();
      const href = $(el).attr("href");
      if (title.length > 30 && href && items.length < 5) {
        items.push({
          title,
          link: href.startsWith("http") ? href : "https://www.graphic.com.gh" + href,
          snippet: "",
          sourceName: "Graphic Online"
        });
      }
    });
    return items;
  } catch (e) {
    console.warn("⚠️ Graphic Online scrape failed. Skipping.");
    return [];
  }
}

/**
 * AI Logic: General Summary + Policy Classification
 */
async function processNewsWithAI(newsItem) {
  console.log(`🤖 Processing [${newsItem.sourceName}]: ${newsItem.title.substring(0, 40)}...`);
  
  const prompt = `You are a policy analyst for CivicPulse Ghana. Analyze this news item.

News Title: ${newsItem.title}
Snippet: ${newsItem.snippet}

OUTPUT JSON FORMAT:
{
  "generalSummary": "A concise 1-sentence summary for a general news explore feed.",
  "isPolicy": true/false (Is this an actual significant government policy, law, or major public mandate?),
  "policyData": null OR {
     "title": "Clear policy title",
     "summary": "1-2 sentence high-impact summary",
     "category": "transport|finance|health|education|technology|public life",
     "tags": [{"label": "Status", "direction": "up|down|neutral"}],
     "relevance": { "student": 1-5, "developer": 1-5, "trader": 1-5, "default": 2 },
     "factContext": "A brief, 1-sentence historical or legal 'did you know?' about this topic in Ghana.",
     "impacts": {
        "student": "1-sentence impact",
        "developer": "1-sentence impact",
        "trader": "1-sentence impact",
        "default": "how it affects citizens generally"
     },
     "deepExplanation": "3-sentence dive into context/history/implications."
  }
}

Guidelines:
1. "isPolicy" should be true ONLY for government actions.
2. Return ONLY valid JSON.`;

  try {
    const response = await alleai.chat.completions({
      models: ["gpt-4o"],
      messages: [{ user: [{ type: "text", text: prompt }] }],
    });

    let content = "";
    if (response.choices?.[0]?.message?.content) {
      content = response.choices[0].message.content;
    } else if (response.responses?.responses?.["gpt-4o"]?.message?.content) {
      content = response.responses.responses["gpt-4o"].message.content;
    } else if (response.result) {
      content = response.result;
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      return {
        id: Date.now() + Math.random(),
        title: newsItem.title,
        generalSummary: data.generalSummary,
        source: newsItem.link,
        sourceName: newsItem.sourceName,
        date: new Date().toISOString().split('T')[0],
        isPolicy: data.isPolicy,
        policyData: data.policyData
      };
    }
  } catch (e) {
    console.error(`AI failed for ${newsItem.title}:`, e.message);
  }
  return null;
}

/**
 * Main Pipeline
 */
async function runIngestion() {
  const allRawNews = [];
  
  // Try fetching sources
  const results = await Promise.all([
    scrapeCitiNews(),
    scrapeJoyOnline(),
    scrapeGraphicOnline()
  ]);
  
  results.forEach(batch => allRawNews.push(...batch));
  console.log(`📡 Total raw news gathered: ${allRawNews.length}`);

  const processedItems = [];
  // Limit to processing 8 items total to save AI tokens/time
  const limitedNews = allRawNews.slice(0, 8);

  for (const item of limitedNews) {
    const processed = await processNewsWithAI(item);
    if (processed) {
      processedItems.push(processed);
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  return processedItems;
}

module.exports = { runIngestion };
