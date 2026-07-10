import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * PATCH /api/account/profile — critical profile modification.
 *
 * Re-authentication flow: beyond a valid session, the access token must
 * be FRESH (issued within the last 5 minutes). Stale-session requests get
 * 401 { code: "REAUTH_REQUIRED" } — the client then re-validates via
 * supabase.auth.reauthenticate() / refreshSession() and retries.
 */
const MAX_TOKEN_AGE_SECONDS = 5 * 60;

function tokenIssuedAt(accessToken: string): number | null {
  try {
    const payload = JSON.parse(
      Buffer.from(accessToken.split(".")[1]!, "base64url").toString("utf8")
    ) as { iat?: number };
    return typeof payload.iat === "number" ? payload.iat : null;
  } catch {
    return null;
  }
}

export async function PATCH(req: Request) {
  const ip = getClientIp(req);
  const { success } = await rateLimit(`profile:${ip}`);
  if (!success) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const supabase = createServerSupabase();

  // getUser() verifies the JWT against Supabase Auth (not just the cookie).
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  // ── Fresh-session challenge ──────────────────────────────────────────
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const iat = session?.access_token ? tokenIssuedAt(session.access_token) : null;
  const ageSeconds = iat ? Math.floor(Date.now() / 1000) - iat : Infinity;

  if (ageSeconds > MAX_TOKEN_AGE_SECONDS) {
    return NextResponse.json(
      {
        error: "Recent authentication required for profile changes.",
        code: "REAUTH_REQUIRED",
      },
      { status: 401 }
    );
  }

  // ── Whitelisted, validated fields only ───────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (typeof body.full_name === "string") {
    updates.full_name = body.full_name.slice(0, 120);
  }
  if (body.skin_profile && typeof body.skin_profile === "object" && !Array.isArray(body.skin_profile)) {
    updates.skin_profile = body.skin_profile;
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
  }

  // User-scoped client → RLS `profiles_update_own` enforces ownership.
  const { data, error } = await supabase
    .from("profiles")
    .update(updates as never)
    .eq("id", user.id)
    .select("id,full_name,skin_profile,glow_score,streak_days")
    .single();

  if (error) {
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }

  return NextResponse.json({ profile: data });
}
