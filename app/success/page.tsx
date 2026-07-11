import Link from "next/link";
import { Logo } from "@/components/Logo";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata = { title: "You're in" };
export const dynamic = "force-dynamic";

/**
 * Post-checkout landing. Looks the waitlist row up by the Stripe session
 * id (server-side, service role — never exposed). The webhook may land a
 * beat after redirect, so 'pending' renders as "confirming".
 */
export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;
  let position: number | null = null;
  let status: string = "pending";

  if (sessionId && /^cs_[a-zA-Z0-9_]+$/.test(sessionId)) {
    try {
      const admin = createAdminClient();
      const { data } = await admin
        .from("waitlist")
        .select("position,status")
        .eq("stripe_session_id", sessionId)
        .maybeSingle();
      if (data) {
        position = data.position;
        status = data.status;
      }
    } catch {
      // Render the generic confirmation if lookup fails.
    }
  }

  const active = status === "active_waitlist";

  return (
    <main className="grain flex min-h-screen items-center justify-center bg-night px-5">
      <div className="w-full max-w-md rounded-2xl border border-frost/10 bg-night-2 p-10 text-center shadow-beam-lg">
        <div className="flex justify-center">
          <Logo />
        </div>
        <p className="hud-signal mt-10">
          {active ? "STATUS · CONFIRMED" : "STATUS · CONFIRMING"}
        </p>
        <h1 className="mt-4 font-headline text-4xl font-bold text-frost">
          {active ? "You're in." : "Almost there…"}
        </h1>
        <p className="mt-4 text-fog">
          {active
            ? "Your spot is locked. We'll email you the moment your scan is ready."
            : "Your reservation is being confirmed — it activates within a minute and you'll get an email."}
        </p>
        {position !== null && (
          <div className="mt-8 rounded-xl border border-signal/15 bg-signal/[0.05] px-6 py-5">
            <span className="hud">YOUR PLACE IN LINE</span>
            <p className="mt-1 font-headline text-6xl font-bold leading-tight text-signal">
              #{position}
            </p>
          </div>
        )}
        <Link href="/" className="btn-beam mt-10 w-full">
          Back to Lumin
        </Link>
      </div>
    </main>
  );
}
