import { GeminiProvider, DeepSeekProvider, FallbackProvider } from './src/services/ai/aiProvider';
import * as dotenv from 'dotenv';

// Load env vars manually for testing context
dotenv.config();

async function testFallback() {
    console.log('--- Testando Fallback Automático ---');

    // 1. Setup Providers
    // Intentionally invalid key for Gemini to force failure
    const geminiProvider = new GeminiProvider('INVALID_KEY_FOR_TESTING');

    const deepSeekKey = process.env.VITE_DEEPSEEK_API_KEY || 'sk-0fdb0ff842b044748431ed859c9ffcc3'; // Hardcoded fallback for script test
    const deepSeekProvider = new DeepSeekProvider(deepSeekKey);

    const fallbackProvider = new FallbackProvider(geminiProvider, deepSeekProvider);

    console.log('Providers configurados:');
    console.log('- Primary: Gemini (Chave Inválida)');
    console.log('- Secondary: DeepSeek');

    try {
        console.log('\nSolicitando geração de conteúdo...');
        const result = await fallbackProvider.generateContent('Responda apenas com a palavra: FUNCIONOU');
        console.log('\n✅ RESULTADO:', result);

        if (result.includes('FUNCIONOU')) {
            console.log('🎉 Fallback funcionou corretamente! O Gemini falhou e o DeepSeek respondeu.');
        } else {
            console.log('⚠️ O resultado não foi o esperado, mas algo foi retornado.');
        }

    } catch (error) {
        console.error('\n❌ ERRO FATAL: Ambos os providers falharam.', error);
    }
}

// Mock browser env for testing since OpenAI SDK might check it
global.window = {};
global.document = {};

testFallback();
