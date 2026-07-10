import type { Metadata } from "next";
import { Manrope, Hanken_Grotesk } from "next/font/google";
import { GeistSans } from "geist/font/sans";
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
    default: "Lumin — AI Skin Intelligence",
    template: "%s · Lumin",
  },
  description:
    "Clinical-grade AI skin analysis from a single selfie. Personalized routines, whole-food infusions, and dermatology-level insight — without the clinic.",
  openGraph: {
    title: "Lumin — AI Skin Intelligence",
    description:
      "Clinical-grade AI skin analysis from a single selfie. Join the waitlist.",
    type: "website",
    siteName: "Lumin",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${hanken.variable} ${GeistSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
