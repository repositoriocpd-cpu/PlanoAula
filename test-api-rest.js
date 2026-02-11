import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import https from 'https';

// Helper to read env
const envPath = path.resolve(process.cwd(), '.env');
let apiKey = '';
try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/VITE_GOOGLE_AI_KEY="([^"]+)"/);
    if (match) apiKey = match[1];
} catch (e) {
    console.error('Erro ao ler .env', e);
}

console.log('Chave em uso:', apiKey ? apiKey.substring(0, 5) + '...' : 'NENHUMA');

if (!apiKey) process.exit(1);

// Test via REST API directly to list models
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log('Consultando lista de modelos via REST API...');

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.error) {
                console.error('ERRO DA API:', json.error);
            } else if (json.models) {
                console.log('SUCESSO! Modelos disponíveis para esta chave:');
                json.models.forEach(m => console.log(` - ${m.name} (${m.supportedGenerationMethods.join(', ')})`));
            } else {
                console.log('Resposta inesperada:', json);
            }
        } catch (e) {
            console.error('Erro ao processar resposta:', data);
        }
    });
}).on('error', (e) => {
    console.error('Erro na requisição:', e);
});
