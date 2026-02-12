import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Manual simple env parser since dotenv might not be installed
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

console.log('Testando chave de API:', apiKey ? 'Encontrada e carregada' : 'NÃO ENCONTRADA');

if (!apiKey) {
    console.error('Erro: VITE_GOOGLE_AI_KEY não encontrada no .env');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        const modelName = 'gemini-1.5-flash';
        console.log(` Tentando gerar conteúdo com modelo: ${modelName}`);

        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Teste de disponibilidade: responda apenas "OK"');
        const response = await result.response;
        console.log(' SUCESSO! O modelo respondeu:', response.text());

    } catch (error) {
        console.error(' FALHA ao testar gemini-1.5-flash:');
        console.error(error.message);

        // Try fallback
        try {
            console.log('\n Tentando modelo alternativo: gemini-pro');
            const model2 = genAI.getGenerativeModel({ model: 'gemini-pro' });
            const result2 = await model2.generateContent('Teste: OK');
            console.log(' SUCESSO com gemini-pro:', result2.response.text());
        } catch (e) {
            console.error(' FALHA com gemini-pro:', e.message);
        }

        try {
            console.log('\n Tentando modelo alternativo: gemini-1.0-pro');
            const model3 = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });
            const result3 = await model3.generateContent('Teste: OK');
            console.log(' SUCESSO com gemini-1.0-pro:', result3.response.text());
        } catch (e) {
            console.error(' FALHA com gemini-1.0-pro:', e.message);
        }
    }
}

listModels();
