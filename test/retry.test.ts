import { describe, it, expect, vi } from "vitest";
import { withRetry } from "@/lib/retry";

describe("withRetry", () => {
  it("returns immediately when the call succeeds", async () => {
    const fn = vi.fn().mockResolvedValue("ok");
    await expect(withRetry(fn)).resolves.toBe("ok");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("retries transient failures then succeeds", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("boom"))
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValue("ok");
    await expect(withRetry(fn, { baseMs: 1, maxMs: 2 })).resolves.toBe("ok");
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("gives up after the attempt budget and rethrows the last error", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("always"));
    await expect(withRetry(fn, { attempts: 3, baseMs: 1, maxMs: 2 })).rejects.toThrow("always");
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("does not retry when shouldRetry returns false", async () => {
    // A 400 from the email provider will never succeed on retry; looping on
    // it wastes the request budget and delays the user's response.
    const fn = vi.fn().mockRejectedValue(new Error("400 bad request"));
    await expect(
      withRetry(fn, { attempts: 5, baseMs: 1, shouldRetry: () => false })
    ).rejects.toThrow("400");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("reports each retry through onRetry with a bounded delay", async () => {
    const seen: number[] = [];
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("x"))
      .mockResolvedValue("ok");
    await withRetry(fn, {
      baseMs: 10,
      maxMs: 40,
      onRetry: (_a, delay) => seen.push(delay),
    });
    expect(seen).toHaveLength(1);
    // Full jitter: delay is random in [0, ceiling], never above the cap.
    expect(seen[0]).toBeGreaterThanOrEqual(0);
    expect(seen[0]).toBeLessThanOrEqual(40);
  });

  it("keeps backoff under maxMs even after many attempts", async () => {
    const seen: number[] = [];
    const fn = vi.fn().mockRejectedValue(new Error("x"));
    await expect(
      withRetry(fn, {
        attempts: 6,
        baseMs: 100,
        maxMs: 150,
        onRetry: (_a, delay) => seen.push(delay),
      })
    ).rejects.toThrow();
    for (const d of seen) expect(d).toBeLessThanOrEqual(150);
  });
});
