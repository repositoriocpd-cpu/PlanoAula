const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

// --- Mock Classes based on aiProvider.ts implementation ---

async function withRetry(operation) {
    try {
        return await operation();
    } catch (error) {
        throw error;
    }
}

class GeminiProvider {
    constructor(apiKey) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        // Use a model that definitely exists or fails auth first
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    async generateContent(prompt) {
        return withRetry(async () => {
            console.log('  [GeminiProvider] Enviando requisição...');
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        });
    }
}

class DeepSeekProvider {
    constructor(apiKey) {
        this.client = new OpenAI({
            baseURL: 'https://api.deepseek.com',
            apiKey: apiKey
        });
        this.modelName = 'deepseek-chat';
    }

    async generateContent(prompt) {
        return withRetry(async () => {
            console.log('  [DeepSeekProvider] Enviando requisição...');
            const completion = await this.client.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: this.modelName,
            });
            return completion.choices[0].message.content || '';
        });
    }
}

class FallbackProvider {
    constructor(primary, secondary) {
        this.primary = primary;
        this.secondary = secondary;
    }

    async generateContent(prompt) {
        try {
            console.log('Tentando Primary Provider (Gemini)...');
            return await this.primary.generateContent(prompt);
        } catch (error) {
            console.warn('⚠️ Primary falhou. Alternando para Secondary (DeepSeek)...');
            // Log a simplified error message
            if (error.message) console.warn(`   Erro: ${error.message.split('\n')[0]}`);
            return await this.secondary.generateContent(prompt);
        }
    }
}

// --- Test Execution ---

const envPath = path.resolve(process.cwd(), '.env');
let deepSeekKey = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/VITE_DEEPSEEK_API_KEY="([^"]+)"/);
    if (match) deepSeekKey = match[1];
} catch (e) {
    console.error('Erro ao ler .env', e);
}

if (!deepSeekKey) {
    deepSeekKey = "sk-0fdb0ff842b044748431ed859c9ffcc3";
}

async function runTest() {
    console.log('--- Teste de Fallback Automático (CJS) ---');

    // 1. Chave inválida para o Gemini
    const gemini = new GeminiProvider('INVALID_KEY_TEST');

    // 2. Chave válida para DeepSeek
    const deepseek = new DeepSeekProvider(deepSeekKey);

    // 3. Fallback System
    const provider = new FallbackProvider(gemini, deepseek);

    try {
        console.log('Prompt: "Responda apenas com a palavra: SUCESSO"');
        const resposta = await provider.generateContent('Responda apenas com a palavra: SUCESSO');
        console.log('\n✅ RESULTADO FINAL:', resposta);

        if (resposta && resposta.toUpperCase().includes('SUCESSO')) {
            console.log('🎉 TESTE APROVADO: Fallback executado com sucesso!');
        } else {
            console.log('❓ ALERTA: Resposta recebida, mas diferente do esperado.');
        }
    } catch (error) {
        console.error('❌ TESTE FALHOU:', error);
    }
}

runTest();
