import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { GEMINI_MODEL, withRetry } from '../aiUtils';

export interface AIProvider {
    generateContent(prompt: string): Promise<string>;
    generateContentStream?(prompt: string): Promise<any>; // Optional for now
}

export class GeminiProvider implements AIProvider {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: GEMINI_MODEL });
    }

    async generateContent(prompt: string): Promise<string> {
        return withRetry(async () => {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        });
    }
}

export class DeepSeekProvider implements AIProvider {
    private client: OpenAI;
    private modelName: string = 'deepseek-chat';

    constructor(apiKey: string) {
        this.client = new OpenAI({
            baseURL: 'https://api.deepseek.com',
            apiKey: apiKey,
            dangerouslyAllowBrowser: true // Required for client-side usage in Vite
        });
    }

    async generateContent(prompt: string): Promise<string> {
        return withRetry(async () => {
            const completion = await this.client.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: this.modelName,
            });

            return completion.choices[0].message.content || '';
        });
    }
}

// ... (imports remain)

// ... (interfaces and classes remain until getAIProvider)

export class FallbackProvider implements AIProvider {
    private primary: AIProvider;
    private secondary: AIProvider;

    constructor(primary: AIProvider, secondary: AIProvider) {
        this.primary = primary;
        this.secondary = secondary;
    }

    async generateContent(prompt: string): Promise<string> {
        try {
            return await this.primary.generateContent(prompt);
        } catch (error) {
            console.warn('Primary AI provider failed, switching to secondary...', error);
            return await this.secondary.generateContent(prompt);
        }
    }
}



export class OpenRouterProvider implements AIProvider {
    private client: OpenAI;
    private modelName: string = 'google/gemini-2.0-flash-001'; // Default content model for OpenRouter

    constructor(apiKey: string) {
        this.client = new OpenAI({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey: apiKey,
            dangerouslyAllowBrowser: true,
            defaultHeaders: {
                "HTTP-Referer": window.location.origin, // Required by OpenRouter
                "X-Title": "PlanejaEdu" // Optional
            }
        });
    }

    async generateContent(prompt: string): Promise<string> {
        return withRetry(async () => {
            const completion = await this.client.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: this.modelName,
            });

            return completion.choices[0].message.content || '';
        });
    }
}

export class GroqProvider implements AIProvider {
    private client: OpenAI;
    private modelName: string = 'llama-3.3-70b-versatile'; // Fast and capable model

    constructor(apiKey: string) {
        this.client = new OpenAI({
            baseURL: 'https://api.groq.com/openai/v1',
            apiKey: apiKey,
            dangerouslyAllowBrowser: true
        });
    }

    async generateContent(prompt: string): Promise<string> {
        return withRetry(async () => {
            const completion = await this.client.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: this.modelName,
            });

            return completion.choices[0].message.content || '';
        });
    }
}

export function getAIProvider(): AIProvider {
    // 1. Check explicit configuration
    const providerType = import.meta.env.VITE_AI_PROVIDER;

    if (providerType === 'deepseek') {
        const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
        if (!apiKey) throw new Error('VITE_DEEPSEEK_API_KEY not found');
        return new DeepSeekProvider(apiKey);
    }

    if (providerType === 'openrouter') {
        const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
        if (!apiKey) throw new Error('VITE_OPENROUTER_API_KEY not found');
        return new OpenRouterProvider(apiKey);
    }

    if (providerType === 'groq') {
        const apiKey = import.meta.env.VITE_GROQ_API_KEY;
        if (!apiKey) throw new Error('VITE_GROQ_API_KEY not found');
        return new GroqProvider(apiKey);
    }

    // 2. Default Fallback Chain: Gemini -> Groq -> OpenRouter -> DeepSeek
    // We prioritize Gemini (Free specific rate limits)
    // Then Groq (Extremely fast, good free tier)
    // Then OpenRouter (Aggregator)
    // Then DeepSeek (Direct)

    const geminiKey = import.meta.env.VITE_GOOGLE_AI_KEY;
    const groqKey = import.meta.env.VITE_GROQ_API_KEY;
    const openRouterKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    const deepseekKey = import.meta.env.VITE_DEEPSEEK_API_KEY;

    if (!geminiKey) {
        // Fallback checks if Gemini is missing
        if (groqKey) return new GroqProvider(groqKey);
        if (openRouterKey) return new OpenRouterProvider(openRouterKey);
        if (deepseekKey) return new DeepSeekProvider(deepseekKey);

        throw new Error('VITE_GOOGLE_AI_KEY not found');
    }

    const geminiProvider = new GeminiProvider(geminiKey);
    let fallbackChain: AIProvider = geminiProvider;

    // Build chain: Gemini -> Groq
    if (groqKey) {
        fallbackChain = new FallbackProvider(fallbackChain, new GroqProvider(groqKey));
    }

    // Build chain: (Gemini->Groq) -> OpenRouter
    if (openRouterKey) {
        fallbackChain = new FallbackProvider(fallbackChain, new OpenRouterProvider(openRouterKey));
    }

    // Build chain: (Gemini->Groq->OpenRouter) -> DeepSeek
    if (deepseekKey) {
        fallbackChain = new FallbackProvider(fallbackChain, new DeepSeekProvider(deepseekKey));
    }

    return fallbackChain;
}
