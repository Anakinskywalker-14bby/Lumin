import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Stripe webhook — /api/webhooks/stripe
 *
 * 1. Verifies the cryptographic signature against the RAW request body.
 * 2. On checkout.session.completed with payment_status=paid, promotes the
 *    waitlist row pending → active_waitlist.
 * 3. Immediately delegates heavy work (confirmation email, stamping) to
 *    the `waitlist-confirm` Supabase Edge Function so this handler stays
 *    fast and never hits serverless timeout limits.
 */
export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // RAW body — required for signature verification. Do not JSON.parse first.
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("[webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status !== "paid") break;

      const waitlistId = session.metadata?.waitlist_id;
      if (!waitlistId) {
        console.error("[webhook] session missing waitlist_id metadata", session.id);
        break;
      }

      const admin = createAdminClient();

      // Promote pending → active_waitlist (idempotent: keyed on id + status)
      const { data: updated, error } = await admin
        .from("waitlist")
        .update({
          status: "active_waitlist",
          stripe_session_id: session.id,
          stripe_payment_intent_id:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id ?? null,
          amount_paid_cents: session.amount_total,
        })
        .eq("id", waitlistId)
        .neq("status", "active_waitlist")
        .select("id,email,position")
        .maybeSingle();

      if (error) {
        console.error("[webhook] promotion failed:", error.message);
        // 500 → Stripe retries with backoff. Safe: update is idempotent.
        return NextResponse.json({ error: "Database update failed" }, { status: 500 });
      }

      // Already processed (retry delivery) — acknowledge quietly.
      if (!updated) break;

      // ── Async delegation to Supabase Edge Function ────────────────────
      const fnUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/waitlist-confirm`;
      const taskSecret = process.env.EDGE_TASK_SECRET;
      if (taskSecret) {
        try {
          await fetch(fnUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-task-secret": taskSecret,
            },
            body: JSON.stringify({
              waitlist_id: updated.id,
              email: updated.email,
              position: updated.position,
            }),
            // Never let the background hop stall the webhook response.
            signal: AbortSignal.timeout(4_000),
          });
        } catch (err) {
          // Non-fatal: the row is active; email delivery is best-effort
          // and can be replayed from the edge function logs.
          console.error("[webhook] edge delegation failed:", err);
        }
      }
      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      const waitlistId = session.metadata?.waitlist_id;
      if (waitlistId) {
        const admin = createAdminClient();
        await admin
          .from("waitlist")
          .update({ stripe_session_id: null })
          .eq("id", waitlistId)
          .eq("status", "pending");
      }
      break;
    }

    default:
      // Unhandled event types are acknowledged so Stripe stops retrying.
      break;
  }

  return NextResponse.json({ received: true });
}
