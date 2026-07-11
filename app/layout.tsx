import type { Metadata } from "next";
import { Manrope, Hanken_Grotesk } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { Cursor } from "@/components/Cursor";
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
    default: "Lumin — See your skin like never before",
    template: "%s · Lumin",
  },
  description:
    "One scan. A powerful AI reads your face and matches you with products from brands you already love. Join the waitlist.",
  openGraph: {
    title: "Lumin — See your skin like never before",
    description: "Get a facial scan by a powerful AI. Join the waitlist.",
    type: "website",
    siteName: "Lumin",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${hanken.variable} ${GeistSans.variable}`}>
      <body>
        <SmoothScroll>
          <Cursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
