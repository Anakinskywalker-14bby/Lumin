import type { Metadata } from "next";
import { Manrope, Hanken_Grotesk } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Lumin — Stop guessing. Start knowing.",
    template: "%s · Lumin",
  },
  description:
    "AI skin analysis for the modern age. One scan matches you with products from brands you already love. Join the beta.",
  openGraph: {
    title: "Lumin — Stop guessing. Start knowing.",
    description: "AI skin analysis for the modern age. Join the beta.",
    type: "website",
    siteName: "Lumin",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${hanken.variable} ${GeistSans.variable}`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
