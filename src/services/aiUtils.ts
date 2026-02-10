/**
 * Simple retry utility with exponential backoff for AI service calls.
 */
export async function withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    initialDelay: number = 2000
): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error: any) {
            lastError = error;

            // 503 is Service Unavailable (high demand)
            // 429 is Too Many Requests (rate limit)
            const isRetryable = error?.message?.includes('503') ||
                error?.message?.includes('429') ||
                error?.status === 503 ||
                error?.status === 429;

            if (!isRetryable || attempt === maxRetries) {
                throw error;
            }

            const delay = initialDelay * Math.pow(2, attempt);
            console.warn(`AI Generation failed (Attempt ${attempt + 1}/${maxRetries + 1}). Retrying in ${delay}ms...`, error);

            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw lastError;
}
