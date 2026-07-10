import { NextResponse } from "next/server";
import { getStripe, WAITLIST_FEE_CENTS } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { isValidEmail, getSiteUrl } from "@/lib/utils";
import type { RitualConfiguration } from "@/types/waitlist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 8_192;

/** Whitelist-sanitize the configurator payload — never trust the client. */
function sanitizeConfiguration(raw: unknown): RitualConfiguration {
  const cfg = (raw ?? {}) as Record<string, unknown>;
  const str = (v: unknown, max = 40) =>
    typeof v === "string" ? v.slice(0, max) : "";
  const strArr = (v: unknown, maxItems = 6) =>
    Array.isArray(v)
      ? v.filter((x): x is string => typeof x === "string").slice(0, maxItems).map((s) => s.slice(0, 40))
      : [];
  const num = (v: unknown) =>
    typeof v === "number" && Number.isFinite(v) ? Math.max(0, Math.min(100, Math.round(v))) : 50;

  return {
    skinType: str(cfg.skinType),
    concerns: strArr(cfg.concerns, 3),
    infusions: strArr(cfg.infusions, 4),
    hydration: num(cfg.hydration),
    radiance: num(cfg.radiance),
    toneDepth: num(cfg.toneDepth),
  };
}

export async function POST(req: Request) {
  // ── 1. Sliding-window rate limit (Upstash-backed) ───────────────────────
  const ip = getClientIp(req);
  const { success, reset } = await rateLimit(`checkout:${ip}`);
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)) },
      }
    );
  }

  // ── 2. Parse + validate ──────────────────────────────────────────────────
  const rawBody = await req.text();
  if (rawBody.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large." }, { status: 413 });
  }

  let body: { email?: unknown; configuration?: unknown };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }
  const configuration = sanitizeConfiguration(body.configuration);

  const admin = createAdminClient();

  // ── 3. Idempotency: already active? Don't charge twice. ─────────────────
  const { data: existing } = await admin
    .from("waitlist")
    .select("id,status")
    .eq("email", email)
    .maybeSingle();

  if (existing?.status === "active_waitlist") {
    return NextResponse.json(
      { error: "This email is already on the active waitlist." },
      { status: 409 }
    );
  }

  // Attach the authenticated user if a session exists (optional).
  let userId: string | null = null;
  try {
    const supabase = createServerSupabase();
    const { data } = await supabase.auth.getUser();
    userId = data.user?.id ?? null;
  } catch {
    userId = null;
  }

  // ── 4. Upsert the pending row (service role — RLS-safe by design) ───────
  const { data: row, error: upsertError } = existing
    ? await admin
        .from("waitlist")
        .update({ configuration: configuration as never, user_id: userId })
        .eq("id", existing.id)
        .select("id")
        .single()
    : await admin
        .from("waitlist")
        .insert({
          email,
          status: "pending",
          configuration: configuration as never,
          user_id: userId,
        })
        .select("id")
        .single();

  if (upsertError || !row) {
    console.error("[checkout] waitlist upsert failed:", upsertError?.message);
    return NextResponse.json({ error: "Could not reserve your spot." }, { status: 500 });
  }

  // ── 5. Stripe Checkout Session — $1.00 USD ───────────────────────────────
  try {
    const stripe = getStripe();
    const site = getSiteUrl();

    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        customer_email: email,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: WAITLIST_FEE_CENTS,
              product_data: {
                name: "Lumin Waitlist Reservation",
                description: "Fully-refundable deposit — locks your custom formula and place in line.",
              },
            },
          },
        ],
        metadata: { waitlist_id: row.id },
        payment_intent_data: { metadata: { waitlist_id: row.id } },
        success_url: `${site}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${site}/#configure`,
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      },
      // Coarse per-minute bucket: absorbs double-clicks without
      // colliding when a user legitimately retries later.
      { idempotencyKey: `waitlist-${row.id}-${Math.floor(Date.now() / 60_000)}` }
    );

    await admin
      .from("waitlist")
      .update({ stripe_session_id: session.id })
      .eq("id", row.id);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] stripe session failed:", err);
    return NextResponse.json(
      { error: "Payment provider unavailable. Please try again." },
      { status: 502 }
    );
  }
}
