// Lumin — waitlist-confirm Edge Function
// Invoked asynchronously by the Stripe webhook route AFTER payment verification.
// Handles heavy/slow post-payment work off the request path:
//   1. sends the confirmation email (via Resend, if configured)
//   2. stamps confirmed_at on the waitlist row
// Auth: custom shared-secret header (EDGE_TASK_SECRET) — this is a
// server-to-server task queue endpoint, never called from browsers.
// (Deployed live to project hazjyonpqungkgchqgro via Supabase MCP.)
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const TASK_SECRET = Deno.env.get("EDGE_TASK_SECRET") ?? "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // --- constant-time-ish shared secret check ---
  const provided = req.headers.get("x-task-secret") ?? "";
  if (!TASK_SECRET || provided.length !== TASK_SECRET.length) {
    return new Response("Unauthorized", { status: 401 });
  }
  let mismatch = 0;
  for (let i = 0; i < TASK_SECRET.length; i++) {
    mismatch |= provided.charCodeAt(i) ^ TASK_SECRET.charCodeAt(i);
  }
  if (mismatch !== 0) return new Response("Unauthorized", { status: 401 });

  let payload: { waitlist_id?: string; email?: string; position?: number };
  try {
    payload = await req.json();
  } catch {
    return new Response("Bad request", { status: 400 });
  }
  if (!payload.waitlist_id || !payload.email) {
    return new Response("Missing fields", { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // 1. Send confirmation email (best-effort; non-fatal if Resend not configured)
  if (RESEND_API_KEY) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Lumin <hello@updates.lumin.skin>",
          to: [payload.email],
          subject: "You're on the Lumin waitlist ✨",
          html: `
            <div style="font-family:Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#f8fafb;border-radius:16px;color:#191c1d">
              <h1 style="color:#016464;font-size:24px">Welcome to the Lumin waitlist</h1>
              <p>Your spot is confirmed${payload.position ? ` — you're <strong>#${payload.position}</strong> in line` : ""}.</p>
              <p>We'll email you the moment your personalized skin analysis is ready to unlock.</p>
              <p style="margin-top:24px;padding:12px 20px;background:#fbd9c1;border-radius:9999px;display:inline-block;font-weight:600">Status: Active</p>
            </div>`,
        }),
      });
    } catch (err) {
      console.error("resend_failed", err);
    }
  }

  // 2. Stamp confirmation
  const { error } = await supabase
    .from("waitlist")
    .update({ confirmed_at: new Date().toISOString() })
    .eq("id", payload.waitlist_id);

  if (error) {
    console.error("confirm_stamp_failed", error.message);
    return new Response(JSON.stringify({ ok: false }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
