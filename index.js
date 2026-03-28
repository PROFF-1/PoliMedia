import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

dotenv.config();

const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

async function run() {
    const response = await client.messages.create({
        model: "claude-3-5-sonnet-latest",
        max_tokens: 200,
        messages: [
            {
                role: "user",
                content: "Explain what a fuel tax is in simple terms.",
            },
        ],
    });

    console.log(response.content[0].text);
}

run();