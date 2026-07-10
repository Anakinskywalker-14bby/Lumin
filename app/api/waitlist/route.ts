import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/waitlist — the signed-in user's own waitlist entry.
 * Read path runs with the USER's RLS-scoped client (anon key + JWT):
 * the `waitlist_select_own` policy is the actual gate, not app code.
 */
export async function GET(req: Request) {
  const ip = getClientIp(req);
  const { success } = await rateLimit(`waitlist-read:${ip}`);
  if (!success) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("waitlist")
    .select("status,position,configuration,created_at,confirmed_at")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Lookup failed." }, { status: 500 });
  }

  return NextResponse.json({ entry: data });
}
