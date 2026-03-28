const axios = require("axios");
const cheerio = require("cheerio");

async function debugSources() {
  const sources = [
    { name: "JoyOnline", url: "https://www.myjoyonline.com/category/politics/" },
    { name: "GraphicOnline", url: "https://www.graphic.com.gh/news/politics.html" }
  ];

  for (const src of sources) {
    console.log(`\n--- Fetching ${src.name} ---`);
    try {
      const { data } = await axios.get(src.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const $ = cheerio.load(data);
      
      // Look for candidate titles/links
      $("a").each((i, el) => {
        const text = $(el).text().trim();
        const href = $(el).attr("href");
        if (text.length > 30 && href && href.includes("202")) { // 202* to catch current news links
           console.log(`Potential: [${text}] -> ${href}`);
           if (i > 20) return false;
        }
      });
    } catch (e) {
      console.error(`${src.name} error: ${e.message}`);
    }
  }
}
debugSources();
