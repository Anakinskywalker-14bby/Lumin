import { NextResponse } from "next/server";
import { getStripe, WAITLIST_FEE_CENTS } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { isValidEmail, getSiteUrl } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 8_192;

/**
 * POST /api/checkout — reserve a waitlist spot for $1.00.
 * The ENTIRE handler is wrapped so every failure mode (including missing
 * env configuration) returns clean JSON — the client never sees an empty
 * body it can't parse.
 */
export async function POST(req: Request) {
  try {
    return await handle(req);
  } catch (err) {
    console.error("[checkout] unhandled failure:", err);
    return NextResponse.json(
      { error: "Reservations are warming up — please try again shortly." },
      { status: 503 }
    );
  }
}

async function handle(req: Request) {
  // ── 1. Sliding-window rate limit ─────────────────────────────────────
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

  // ── 2. Parse + validate ──────────────────────────────────────────────
  const rawBody = await req.text();
  if (rawBody.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large." }, { status: 413 });
  }

  let body: { email?: unknown };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  // ── 3. Config sanity — fail with honest JSON, not a crash ────────────
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.STRIPE_SECRET_KEY) {
    console.error("[checkout] missing server configuration (Supabase/Stripe keys)");
    return NextResponse.json(
      { error: "Reservations open very soon — check back in a bit." },
      { status: 503 }
    );
  }

  const admin = createAdminClient();

  // ── 4. Idempotency: already active? Don't charge twice. ─────────────
  const { data: existing } = await admin
    .from("waitlist")
    .select("id,status")
    .eq("email", email)
    .maybeSingle();

  if (existing?.status === "active_waitlist") {
    return NextResponse.json(
      { error: "You're already on the waitlist — see you at launch." },
      { status: 409 }
    );
  }

  // ── 5. Upsert the pending row (service role, server-side only) ──────
  const { data: row, error: upsertError } = existing
    ? await admin
        .from("waitlist")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", existing.id)
        .select("id")
        .single()
    : await admin
        .from("waitlist")
        .insert({ email, status: "pending" })
        .select("id")
        .single();

  if (upsertError || !row) {
    console.error("[checkout] waitlist upsert failed:", upsertError?.message);
    return NextResponse.json({ error: "Could not reserve your spot." }, { status: 500 });
  }

  // ── 6. Stripe Checkout Session — $1.00 USD ───────────────────────────
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
              description: "Refundable $1 deposit — locks your place in line.",
            },
          },
        },
      ],
      metadata: { waitlist_id: row.id },
      payment_intent_data: { metadata: { waitlist_id: row.id } },
      success_url: `${site}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/#waitlist`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    },
    // Per-minute bucket: absorbs double-clicks, allows honest retries.
    { idempotencyKey: `waitlist-${row.id}-${Math.floor(Date.now() / 60_000)}` }
  );

  await admin.from("waitlist").update({ stripe_session_id: session.id }).eq("id", row.id);

  return NextResponse.json({ url: session.url });
}
