const Database = require("better-sqlite3");
const path = require("path");

// Initialize database file
const db = new Database(path.join(__dirname, "civicpulse.db"));

// Create Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS policies (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT,
    category TEXT,
    tags TEXT, -- JSON string
    impacts TEXT, -- JSON string
    relevance TEXT, -- JSON string {student: 1-5, etc}
    factContext TEXT, -- Historical/Did you know snippet
    deepExplanation TEXT,
    source TEXT,
    sourceName TEXT,
    date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT,
    source TEXT,
    sourceName TEXT,
    date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

/**
 * Helper to save a policy
 */
function savePolicy(policy) {
  const check = db.prepare("SELECT id FROM policies WHERE title = ?").get(policy.title);
  if (check) return false; // Duplicate

  const stmt = db.prepare(`
    INSERT INTO policies (id, title, summary, category, tags, impacts, relevance, factContext, deepExplanation, source, sourceName, date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    policy.id.toString(),
    policy.title,
    policy.summary,
    policy.category,
    JSON.stringify(policy.tags),
    JSON.stringify(policy.impacts),
    JSON.stringify(policy.relevance || { student: 1, developer: 1, trader: 1, default: 1 }),
    policy.factContext || "Ghana context available.",
    policy.deepExplanation,
    policy.source,
    policy.sourceName,
    policy.date
  );
  return true;
}

/**
 * Helper to save a general article
 */
function saveArticle(article) {
  const check = db.prepare("SELECT id FROM articles WHERE title = ?").get(article.title);
  if (check) return false;

  const stmt = db.prepare(`
    INSERT INTO articles (id, title, summary, source, sourceName, date)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    article.id.toString(),
    article.title,
    article.summary,
    article.source,
    article.sourceName,
    article.date
  );
  return true;
}

/**
 * Helper to get all policies
 */
function getAllPolicies() {
  const rows = db.prepare("SELECT * FROM policies ORDER BY date DESC").all();
  return rows.map(row => ({
    ...row,
    tags: JSON.parse(row.tags || "[]"),
    impacts: JSON.parse(row.impacts || "{}"),
    relevance: JSON.parse(row.relevance || "{}")
  }));
}

/**
 * Helper to get all explore articles
 */
function getAllArticles() {
  return db.prepare("SELECT * FROM articles ORDER BY date DESC").all();
}

module.exports = {
  savePolicy,
  saveArticle,
  getAllPolicies,
  getAllArticles
};
