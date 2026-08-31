"use client";

/**
 * SmoothScroll — Lenis wrapper, synced to GSAP's ticker.
 * Lenis and ScrollTrigger share ONE rAF loop, so scrubbed parallax
 * timelines read the interpolated scroll position with zero jitter.
 */

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      // Exponential ease-out — removes native stutter, feels weighty
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    // ScrollTrigger reads Lenis' interpolated position on every frame
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker — one shared rAF loop for everything
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Programmatic scrolls: window.__lenis?.scrollTo("#waitlist")
    window.__lenis = lenis;

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return <>{children}</>;
}
