import "server-only";

/**
 * Retry with exponential backoff + full jitter.
 *
 * Used for outbound calls to third parties (email delivery). Jitter avoids
 * the thundering-herd problem where every failed request retries in lockstep.
 * Only retries errors the caller marks retryable, so a 400 never loops.
 */
export interface RetryOptions {
  attempts?: number;
  baseMs?: number;
  maxMs?: number;
  /** Return true to retry. Default: retry everything. */
  shouldRetry?: (error: unknown) => boolean;
  onRetry?: (attempt: number, delayMs: number, error: unknown) => void;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  {
    attempts = 3,
    baseMs = 250,
    maxMs = 4000,
    shouldRetry = () => true,
    onRetry,
  }: RetryOptions = {}
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === attempts || !shouldRetry(err)) break;

      // Exponential backoff with full jitter: random in [0, min(max, base*2^n)]
      const ceiling = Math.min(maxMs, baseMs * 2 ** (attempt - 1));
      const delay = Math.floor(Math.random() * ceiling);
      onRetry?.(attempt, delay, err);
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  throw lastError;
}
