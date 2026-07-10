import Link from "next/link";
import { Logo } from "@/components/Logo";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata = { title: "You're in" };
export const dynamic = "force-dynamic";

/**
 * Post-checkout landing. Looks the waitlist row up by the Stripe session
 * id (server-side, service role — never exposed). The webhook may land a
 * beat after redirect, so 'pending' is rendered as "confirming".
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
    <main className="flex min-h-screen items-center justify-center bg-hero-radial px-4">
      <div className="card-mint w-full max-w-md rounded-lg p-8 text-center !shadow-ambient-lg">
        <div className="flex justify-center">
          <Logo />
        </div>
        <p className="vial-label mt-8 text-primary">
          {active ? "STATUS · ACTIVE WAITLIST" : "STATUS · CONFIRMING PAYMENT"}
        </p>
        <h1 className="mt-3 font-headline text-headline-lg-m font-bold">
          {active ? "You're officially in. ✧" : "Almost there…"}
        </h1>
        <p className="mt-3 text-body-md text-on-surface-variant">
          {active
            ? "Your formula is locked and your confirmation email is on its way."
            : "Your payment is being verified — your spot activates within a minute and you'll get an email confirmation."}
        </p>
        {position !== null && (
          <div className="mt-6 rounded-lg bg-secondary-container/60 px-6 py-4">
            <span className="vial-label !text-secondary-on-container">YOUR PLACE IN LINE</span>
            <p className="font-headline text-[44px] font-bold leading-tight text-primary">
              #{position}
            </p>
          </div>
        )}
        <Link href="/" className="btn-primary mt-8">
          Back to Lumin
        </Link>
      </div>
    </main>
  );
}
