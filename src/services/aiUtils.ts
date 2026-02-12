/**
 * Simple retry utility with exponential backoff for AI service calls.
 * Specially tuned to handle 429 (Quota) and 503 (Busy) errors.
 */
export const GEMINI_MODEL = 'gemini-2.5-flash';

export async function withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    initialDelay: number = 3000
): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error: any) {
            lastError = error;

            const errorMessage = error?.message || String(error);

            // 503 is Service Unavailable (high demand) - Retryable
            // 429 is Too Many Requests (rate limit) - Retryable ONLY if not Quota Exceeded (Hard Limit)

            const isQuotaError = errorMessage.toLowerCase().includes('quota') || errorMessage.toLowerCase().includes('billing');

            // If it's a hard quota error, DO NOT RETRY. Throw immediately so FallbackProvider can switch to next provider.
            if (isQuotaError) {
                console.warn(`Quota exceeded (${errorMessage}). Aborting retries to trigger fallback.`);
                throw error;
            }

            const isRetryable = errorMessage.includes('503') ||
                errorMessage.includes('429') ||
                error?.status === 503 ||
                error?.status === 429;

            if (!isRetryable || attempt === maxRetries) {
                throw error;
            }

            // Extract suggested wait time if present in the error message (e.g. "retry in 55s")
            let delay = initialDelay * Math.pow(2, attempt);

            const retryMatch = errorMessage.match(/retry in ([\d\.]+)s/i);
            if (retryMatch && retryMatch[1]) {
                const suggestedDelay = parseFloat(retryMatch[1]) * 1000 + 1000; // Add 1s buffer
                delay = Math.max(delay, suggestedDelay);
            }

            console.warn(`AI Generation failed (Attempt ${attempt + 1}/${maxRetries + 1}). Retrying in ${Math.round(delay / 1000)}s...`, error);

            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw lastError;
}

// Helper to extract JSON from AI response that might contain markdown or text
export function extractJSON(text: string): any {
    try {
        // First try to parse as is
        return JSON.parse(text);
    } catch (e) {
        // Try to extract from markdown code blocks
        const markdownMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
        if (markdownMatch) {
            try {
                return JSON.parse(markdownMatch[1]);
            } catch (e2) {
                // Continue to next method
            }
        }

        // Try to find the first '{' and last '}'
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');

        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            const potentialJson = text.substring(firstBrace, lastBrace + 1);
            try {
                return JSON.parse(potentialJson);
            } catch (e3) {
                console.error('Failed to parse extracted JSON:', e3);
                throw new Error('Falha ao processar resposta da IA. Formato JSON inválido.');
            }
        }

        throw new Error('Não foi possível encontrar um JSON válido na resposta da IA.');
    }
}
