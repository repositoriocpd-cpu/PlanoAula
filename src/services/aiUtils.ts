/**
 * Simple retry utility with exponential backoff for AI service calls.
 * Specially tuned to handle 429 (Quota) and 503 (Busy) errors.
 */
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

            // 503 is Service Unavailable (high demand)
            // 429 is Too Many Requests (rate limit)
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
