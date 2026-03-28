const dotenv = require("dotenv");
const { AlleAIClient } = require("alle-ai-sdk");

dotenv.config({ path: "../.env" });

const alleai = new AlleAIClient({
  apiKey: process.env.ALLEAI_API_KEY,
});

async function listModels() {
  console.log("Fetching models...");
  try {
    // Check if there's a listModels or common endpoint
    // Many AlleAI-like SDKs have a list method or models property
    console.log("SDK keys:", Object.keys(alleai));
    
    // I don't know the exact endpoint for models, but I'll try guess
    // Or I'll just check if it's available in the SDK
  } catch (error) {
    console.error("Error:", error.message);
  }
}

listModels();
