import "server-only";

import { SITE_URL } from "@/lib/site";

/**
 * CSRF defence for state-changing routes.
 *
 * All mutating endpoints are same-origin JSON POSTs from our own pages, so
 * requiring Origin/Referer to match the host that actually served the request
 * blocks classic cross-site form submissions. Combined with SameSite=Lax
 * cookies this covers CSRF without a token round-trip.
 *
 * The check compares against the REQUEST'S OWN HOST rather than a hardcoded
 * list of domains. An earlier version allow-listed SITE_URL plus VERCEL_URL,
 * which broke every real signup: Vercel serves the site from several hostnames
 * (branch alias, project alias, per-deployment URL, and later a custom
 * domain), and VERCEL_URL only ever contains the immutable per-deployment one.
 * A browser on the branch alias therefore sent an Origin that matched nothing
 * and got "invalid request origin".
 *
 * Comparing to the request host keeps the security property intact — a page on
 * evil.com posting here still sends Origin: https://evil.com while Host stays
 * ours, so it mismatches — while working on every alias, preview URL and
 * future custom domain with no configuration.
 */
export function assertSameOrigin(req: Request): { ok: boolean; reason?: string } {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");

  const allowed = new Set<string>();

  /** Register a host under both schemes we could legitimately be served on. */
  const allowHost = (host: string | null | undefined, proto?: string | null) => {
    if (!host) return;
    const h = host.trim().toLowerCase();
    if (!h) return;
    if (proto) allowed.add(`${proto.split(",")[0].trim()}://${h}`);
    allowed.add(`https://${h}`);
    if (process.env.NODE_ENV !== "production") allowed.add(`http://${h}`);
  };

  // 1. The host this request was actually addressed to. Behind Vercel's proxy
  //    the original host arrives in x-forwarded-host.
  allowHost(req.headers.get("x-forwarded-host"), req.headers.get("x-forwarded-proto"));
  allowHost(req.headers.get("host"), req.headers.get("x-forwarded-proto"));

  // 2. The canonical site URL, so a request proxied under a different host
  //    still works.
  try {
    allowed.add(new URL(SITE_URL).origin);
  } catch {
    /* SITE_URL malformed; the host-derived entries above still apply */
  }

  // 3. Vercel-provided hostnames, when present.
  allowHost(process.env.VERCEL_URL);
  allowHost(process.env.VERCEL_BRANCH_URL);
  allowHost(process.env.VERCEL_PROJECT_PRODUCTION_URL);

  if (process.env.NODE_ENV !== "production") {
    allowed.add("http://localhost:3000");
    allowed.add("http://127.0.0.1:3000");
  }

  if (origin) {
    return allowed.has(origin.toLowerCase())
      ? { ok: true }
      : { ok: false, reason: "origin_mismatch" };
  }

  // Some privacy tooling strips Origin; fall back to Referer.
  if (referer) {
    try {
      return allowed.has(new URL(referer).origin.toLowerCase())
        ? { ok: true }
        : { ok: false, reason: "referer_mismatch" };
    } catch {
      return { ok: false, reason: "referer_unparseable" };
    }
  }

  return { ok: false, reason: "missing_origin" };
}
