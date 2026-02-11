import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = envContent.split('\n').reduce((acc, line) => {
    const [key, value] = line.split('=');
    if (key && value) {
        acc[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
    }
    return acc;
}, {});

const apiKey = envVars.VITE_GOOGLE_AI_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName) {
    console.log(`\n--- Testando ${modelName} ---`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Teste: OK');
        console.log(`✅ SUCESSO com ${modelName}:`, result.response.text());
        return true;
    } catch (error) {
        console.error(`❌ FALHA com ${modelName}:`);
        // Log less verbose error
        if (error.message.includes('404')) console.error('  -> 404 Not Found');
        else if (error.message.includes('429')) console.error('  -> 429 Quota Exceeded / Limit 0');
        else console.error('  -> ' + error.message.split('\n')[0]);
        return false;
    }
}

async function runTests() {
    const candidates = [
        'gemini-2.5-flash',
        'gemini-flash-latest',
        'gemini-2.0-flash-lite',
        'gemini-1.5-pro-latest' // Just in case
    ];

    for (const model of candidates) {
        const success = await testModel(model);
        if (success) {
            console.log(`\n🎉 Recomendação: Use o modelo '${model}'`);
            break;
        }
    }
}

runTests();
