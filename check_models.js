import { GoogleGenerativeAI } from '@google/generative-ai';
// dotenv removed
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars manually since we are running a standalone script
// We need the API key which is in .env.local
// For simplicity in this script, I will hardcode the key I saw earlier or read it from the file.
// Since I can't easily rely on dotenv for .env.local without config, I'll read the file.

import fs from 'fs';

const envPath = path.resolve('.', '.env.local');
let apiKey = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/VITE_GOOGLE_AI_KEY=(.*)/);
    if (match) {
        apiKey = match[1].trim();
    }
} catch (e) {
    console.error("Could not read .env.local");
    process.exit(1);
}

if (!apiKey) {
    console.error("API KEY not found in .env.local");
    process.exit(1);
}

console.log("Using API Key ending in:", apiKey.slice(-4));

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Dummy model just to get the client, actually specific method exists on client?
        // The SDK structure: genAI.getGenerativeModel is for *using* a model.
        // To list models, we might strictly need to check if the SDK exposes it definitively or if we rely on a known model.
        // Wait, the error message said "Call ListModels to see the list". 
        // The Node SDK usually doesn't expose listModels directly on the main class in older versions, but let's check current docs or try a raw fetch if needed.
        // Actually, looking at recent SDK, it might not have listModels helper easily accessible or it might be on a different manager.

        // Let's try a direct REST call if SDK is ambiguous, but SDK is installed.
        // Let's try to just use a model we suspect works, BUT wait.

        // Alternative: The 404 message explicitly says "models/gemini-1.5-pro is not found...". 

        // Let's try to just output what happens when I request 'gemini-pro' specifically in this script.
        const m = genAI.getGenerativeModel({ model: 'gemini-pro' });
        console.log("Attempting to generate content with gemini-pro...");
        const result = await m.generateContent("Hello");
        console.log("gemini-pro Success:", result.response.text());

    } catch (error) {
        console.error("Detailed Error:", error);
        if (error.response) {
            console.error("Response:", error.response);
        }
    }
}

// Better approach: use fetch to call the list_models endpoint directly using the key.
async function fetchModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("Available Models:");
        if (data.models) {
            data.models.forEach(m => console.log(`- ${m.name} (${m.supportedGenerationMethods})`));
        } else {
            console.log("No models found in response:", data);
        }
    } catch (e) {
        console.error("Error fetching models:", e);
    }
}

fetchModels();
