"use client";

/**
 * useMagnetic — magnetic pull toward the cursor.
 * The element mathematically measures distance to the pointer; inside the
 * hit radius it travels toward it (with distance falloff), and on leave it
 * snaps home with an elastic ease.
 *
 * Usage:
 *   const ref = useMagnetic<HTMLAnchorElement>({ strength: 0.4, radius: 120 });
 *   <a ref={ref} href="#waitlist">JOIN</a>
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface MagneticOptions {
  strength?: number; // 0..1 — how far it travels toward the cursor
  radius?: number;   // px beyond the element bounds that still attracts
}

export function useMagnetic<T extends HTMLElement = HTMLElement>({
  strength = 0.35,
  radius = 100,
}: MagneticOptions = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const dist = Math.hypot(dx, dy);

      const hit = Math.max(rect.width, rect.height) / 2 + radius;
      if (dist < hit) {
        const falloff = 1 - dist / hit;
        xTo(dx * strength * (0.4 + falloff));
        yTo(dy * strength * (0.4 + falloff));
      } else {
        xTo(0);
        yTo(0);
      }
    };

    const onLeave = () => {
      // Elastic release — the signature magnet snap
      gsap.to(el, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, [strength, radius]);

  return ref;
}
