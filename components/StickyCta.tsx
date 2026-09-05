"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Mobile-only sticky CTA. Appears after the hero, hides once the signup
 * section is on screen so it never covers the form it points at.
 */
export function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const target = document.getElementById("beta");

    const onScroll = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.6;
      let betaVisible = false;
      if (target) {
        const r = target.getBoundingClientRect();
        betaVisible = r.top < window.innerHeight && r.bottom > 0;
      }
      setShow(pastHero && !betaVisible);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="md:hidden fixed inset-x-0 bottom-0 z-40 p-3 transition-transform duration-300"
      style={{
        transform: show ? "translateY(0)" : "translateY(120%)",
        pointerEvents: show ? "auto" : "none",
      }}
      aria-hidden={!show}
    >
      <Link
        href="/#beta"
        className="neo-shadow neo-border block w-full py-4 text-center"
        style={{ background: "#e8e883", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: "0.9px", color: "#1a1c1b" }}
        tabIndex={show ? 0 : -1}
      >
        JOIN THE WAITLIST — FREE
      </Link>
    </div>
  );
}
