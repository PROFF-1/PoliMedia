const dotenv = require("dotenv");
const { AlleAIClient } = require("alle-ai-sdk");

dotenv.config({ path: "../.env" });

const alleai = new AlleAIClient({
  apiKey: process.env.ALLEAI_API_KEY,
});

async function testAlleAI() {
  console.log("Testing AlleAI with Claude Opus...");
  console.log("Using API Key starting with:", process.env.ALLEAI_API_KEY ? process.env.ALLEAI_API_KEY.substring(0, 8) + "..." : "MISSING");

  try {
    const response = await alleai.chat.completions({
      models: ["gpt-4o"],
      response_format: { type: "text" },

      messages: [
        {
          user: [
            {
              type: "text",
              text: "Hello! Can you confirm you are Claude Opus and that you are working through Alle-AI?"
            }
          ]
        }
      ],
    });

    console.log("\n--- AI RESPONSE ---");
    console.log(JSON.stringify(response, null, 2));
    console.log("-------------------\n");
    console.log("✅ AlleAI integration is working!");
  } catch (error) {
    console.error("\n❌ AlleAI Test Failed!");
    console.error("Error Message:", error.message);
    if (error.status) console.error("Status Code:", error.status);
    if (error.details) console.error("Error Details:", JSON.stringify(error.details, null, 2));
  }

}

testAlleAI().then(() => {
  setTimeout(() => process.exit(0), 1000);
});

