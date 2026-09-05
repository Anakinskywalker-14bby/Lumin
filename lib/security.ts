import "server-only";

import { SITE_URL } from "@/lib/site";

/**
 * CSRF defence for state-changing routes.
 *
 * All mutating endpoints are same-origin JSON POSTs from our own pages, so
 * requiring Origin/Referer to match our host blocks classic cross-site form
 * submissions. Combined with SameSite=Lax cookies this covers CSRF without
 * a token round-trip.
 */
export function assertSameOrigin(req: Request): { ok: boolean; reason?: string } {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");

  const allowed = new Set<string>();
  try {
    allowed.add(new URL(SITE_URL).origin);
  } catch {
    /* SITE_URL malformed; fall through to env-derived hosts */
  }
  if (process.env.VERCEL_URL) allowed.add(`https://${process.env.VERCEL_URL}`);
  if (process.env.NODE_ENV !== "production") {
    allowed.add("http://localhost:3000");
    allowed.add("http://127.0.0.1:3000");
  }

  if (origin) {
    return allowed.has(origin)
      ? { ok: true }
      : { ok: false, reason: "origin_mismatch" };
  }

  // Some privacy tooling strips Origin; fall back to Referer.
  if (referer) {
    try {
      return allowed.has(new URL(referer).origin)
        ? { ok: true }
        : { ok: false, reason: "referer_mismatch" };
    } catch {
      return { ok: false, reason: "referer_unparseable" };
    }
  }

  return { ok: false, reason: "missing_origin" };
}
