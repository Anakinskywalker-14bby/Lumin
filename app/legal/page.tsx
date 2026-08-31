import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { breadcrumbJsonLd } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy & Terms of Service",
  description:
    "How Lumin handles your data, payments, and beta reservations — plus the terms that govern using our AI skin analysis service.",
  alternates: { canonical: "/legal" },
  openGraph: {
    title: "Privacy Policy & Terms of Service · Lumin",
    description: "How Lumin handles your data, payments, and beta reservations.",
    url: "/legal",
  },
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Privacy & Terms", path: "/legal" },
];

const h2Style = {
  fontFamily: "'Hanken Grotesk', sans-serif",
  fontWeight: 800,
  fontSize: 28,
  color: "#1a1c1b",
  letterSpacing: "-0.5px",
  margin: "40px 0 12px",
} as const;

const h3Style = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontWeight: 700,
  fontSize: 16,
  letterSpacing: "0.8px",
  color: "#1a1c1b",
  textTransform: "uppercase",
  margin: "24px 0 8px",
} as const;

const pStyle = {
  fontFamily: "'Work Sans', sans-serif",
  fontSize: 16,
  color: "#484739",
  lineHeight: 1.75,
  margin: "0 0 14px",
} as const;

export default function LegalPage() {
  return (
    <main className="relative min-h-screen" style={{ background: "#f9f9f7" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }}
      />

      <nav
        className="flex items-center justify-between px-6 md:px-16 h-[72px]"
        style={{ background: "#f9f9f7", borderBottom: "3px solid #1a1c1b" }}
      >
        <Link href="/" style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 900, fontStyle: "italic", fontSize: 24, letterSpacing: -1.2, color: "#1a1c1b" }}>
          Lumin
        </Link>
        <Link
          href="/#beta"
          className="neo-shadow-sm neo-border px-7 py-2.5"
          style={{ background: "#e8e883", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: "0.7px", color: "#1a1c1b" }}
        >
          JOIN BETA
        </Link>
      </nav>

      <div className="max-w-[780px] mx-auto px-6 md:px-16 py-16">
        <Breadcrumbs items={crumbs} />

        <h1 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 900, fontSize: "clamp(34px, 5vw, 52px)", color: "#1a1c1b", letterSpacing: "-1.5px", lineHeight: 1.1, margin: "0 0 8px" }}>
          Privacy Policy &amp; Terms of Service
        </h1>
        <p style={{ ...pStyle, fontSize: 14 }}>Last updated: August 31, 2026</p>

        <div className="neo-border p-5 my-8" style={{ background: "#beeaf8" }}>
          <p style={{ ...pStyle, margin: 0, color: "#1a1c1b" }}>
            <strong>The plain-English version:</strong> we collect your email
            and, if you reserve a beta spot, a $1 refundable deposit processed
            entirely by Stripe. We never see your card. We don&apos;t sell your
            data. Recommendations may earn us a commission from brands — never
            at your expense, always labeled.
          </p>
        </div>

        {/* ── PRIVACY ─────────────────────────────────────────────── */}
        <h2 style={h2Style}>Privacy Policy</h2>

        <h3 style={h3Style}>What we collect</h3>
        <p style={pStyle}>
          When you join the waitlist we collect your email address. If you
          reserve a beta spot, our payment provider, Stripe, collects your
          payment details directly on its secure checkout — card numbers never
          touch our servers. We store your waitlist status, position, and
          Stripe transaction references so we can manage your reservation and
          refunds.
        </p>

        <h3 style={h3Style}>What we do with it</h3>
        <p style={pStyle}>
          We use your email to confirm your spot, tell you when your scan is
          ready, and send occasional product updates. We do not sell or rent
          personal information. We share data only with the service providers
          that run Lumin (Stripe for payments, Supabase for our database,
          Vercel for hosting) and only as needed to operate the service.
        </p>

        <h3 style={h3Style}>Future scan data</h3>
        <p style={pStyle}>
          When the Lumin app launches, skin scans will be governed by a
          separate, explicit consent flow before any photo is analyzed. Our
          standing commitments: scans are used to generate your results, we
          won&apos;t use your photos to train models without a separate
          opt-in, and you&apos;ll be able to delete your data.
        </p>

        <h3 style={h3Style}>Your choices</h3>
        <p style={pStyle}>
          You can unsubscribe from emails at any time via the link in any
          message, and you can request access to or deletion of your data by
          contacting us at the email below.
        </p>

        {/* ── TERMS ───────────────────────────────────────────────── */}
        <h2 style={h2Style}>Terms of Service</h2>

        <h3 style={h3Style}>The beta reservation</h3>
        <p style={pStyle}>
          The $1.00 beta deposit reserves your place in line for early access
          and is fully refundable on request until the beta launches, and
          automatically refunded if we can&apos;t offer you access. Reserving
          a spot doesn&apos;t guarantee a launch date.
        </p>

        <h3 style={h3Style}>Not medical advice</h3>
        <p style={pStyle}>
          Lumin provides cosmetic and wellness information to help you choose
          skincare products. It is not a medical device and does not diagnose,
          treat, or cure any condition. For medical concerns about your skin,
          see a qualified professional.
        </p>

        <h3 style={h3Style}>Affiliate disclosure</h3>
        <p style={pStyle}>
          Lumin recommends products from third-party brands and retailers.
          Some links are affiliate links: if you buy through them, the brand
          may pay us a commission at no extra cost to you. Paid or sponsored
          placements, if any, will be clearly labeled as such and kept
          distinct from scan-based matches.
        </p>

        <h3 style={h3Style}>Eligibility &amp; acceptable use</h3>
        <p style={pStyle}>
          You must be 18 or older to join the waitlist. Don&apos;t abuse,
          probe, or disrupt the service. We may refuse or revoke access (with
          a refund of any deposit) at our discretion.
        </p>

        <h3 style={h3Style}>Changes &amp; contact</h3>
        <p style={pStyle}>
          We may update these terms as Lumin evolves; material changes will be
          announced by email. For questions, refund requests, or data
          requests, reply to any email you&apos;ve received from Lumin — a
          dedicated support address is being set up and will be published
          here.
        </p>

        <div className="flex flex-wrap gap-4 mt-12">
          <Link href="/" className="neo-shadow neo-border px-8 py-4" style={{ background: "#f9f9f7", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: "0.9px", color: "#1a1c1b" }}>
            ← BACK HOME
          </Link>
          <Link href="/about" className="neo-shadow neo-border px-8 py-4" style={{ background: "#beeaf8", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: "0.9px", color: "#1a1c1b" }}>
            ABOUT US
          </Link>
        </div>
      </div>
    </main>
  );
}
