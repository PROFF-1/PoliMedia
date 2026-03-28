const axios = require("axios");
const cheerio = require("cheerio");

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://google.com'
};

/**
 * SOURCE 1: Citi Newsroom
 */
async function scrapeCitiNews() {
  console.log("📡 Scraping: Citi Newsroom...");
  try {
    const { data } = await axios.get("https://citinewsroom.com/category/news/politics/", { headers });
    const $ = cheerio.load(data);
    const items = [];
    $(".jeg_post").each((i, el) => {
      const titleEl = $(el).find(".jeg_post_title a");
      if (titleEl.length) items.push(titleEl.text().trim());
    });
    console.log(`✅ Citi found: ${items.length}`);
    return items;
  } catch (e) {
    console.error("Citi error:", e.message);
    return [];
  }
}

/**
 * SOURCE 2: JoyOnline
 */
async function scrapeJoyOnline() {
  console.log("📡 Scraping: JoyOnline...");
  try {
    const { data } = await axios.get("https://www.myjoyonline.com/category/politics/", { headers });
    const $ = cheerio.load(data);
    const items = [];
    // Select any link that looks like a news title
    $("h3 a").each((i, el) => {
        const title = $(el).text().trim();
        if (title.length > 20) items.push(title);
    });
    console.log(`✅ JoyOnline found: ${items.length}`);
    return items;
  } catch (e) {
    console.error("JoyOnline error:", e.message);
    return [];
  }
}

/**
 * SOURCE 3: Graphic Online
 */
async function scrapeGraphicOnline() {
  console.log("📡 Scraping: Graphic Online...");
  try {
    const { data } = await axios.get("https://www.graphic.com.gh/news/politics.html", { headers });
    const $ = cheerio.load(data);
    const items = [];
    // Targeting the main content list
    $("h4 a, h2 a").each((i, el) => {
        const title = $(el).text().trim();
        if (title.length > 20) items.push(title);
    });
    console.log(`✅ Graphic Online found: ${items.length}`);
    return items;
  } catch (e) {
    console.error("Graphic error:", e.message);
    return [];
  }
}

async function runTest() {
    await scrapeCitiNews();
    await scrapeJoyOnline();
    await scrapeGraphicOnline();
}
runTest();
