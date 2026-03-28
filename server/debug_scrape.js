const axios = require("axios");
const cheerio = require("cheerio");

async function debug() {
  try {
    const { data } = await axios.get("https://citinewsroom.com/category/news/politics/", {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const $ = cheerio.load(data);
    
    // Look for article-like containers
    $("article, div, section").each((i, el) => {
        const className = $(el).attr("class");
        if (className && (className.includes("post") || className.includes("article"))) {
            console.log(`Class: ${className}`);
            console.log(`Text: ${$(el).find("h1, h2, h3").text().trim().substring(0, 50)}`);
            console.log(`Link: ${$(el).find("a").attr("href")}`);
            console.log("---");
        }
    });

  } catch (e) {
    console.error(e.message);
  }
}
debug();
