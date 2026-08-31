import type { Metadata } from "next";
import NewLanding from "@/components/NewLanding";
import { organizationJsonLd, webSiteJsonLd } from "@/lib/site";

export const metadata: Metadata = {
  title: "Lumin — AI Skin Analysis. Stop Guessing. Start Knowing.",
  description:
    "One scan. Lumin's AI reads your skin and matches you with products from brands you already love. Refundable $1 deposit — join the beta, only 500 spots.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Lumin — AI Skin Analysis. Stop Guessing. Start Knowing.",
    description:
      "One scan. Lumin's AI reads your skin and matches you with skincare from brands you already love. Join the beta.",
    url: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <NewLanding />
    </>
  );
}
