"use client";

/**
 * useTextReveal — masked line-by-line reveal (Trionn-style).
 * Each line is wrapped in an overflow:hidden mask; the inner span slides
 * up from yPercent:110 with power4.out when it enters the viewport.
 *
 * Usage:
 *   const ref = useTextReveal<HTMLHeadingElement>({ stagger: 0.09 });
 *   <h1 ref={ref}>YOUR SKIN,<br/>DECODED.</h1>
 *
 * Lines split on <br/>. Pass { mode: "words" } for word-level splits
 * on paragraphs.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TextRevealOptions {
  stagger?: number;
  delay?: number;
  duration?: number;
  mode?: "lines" | "words";
  start?: string;
  once?: boolean;
}

function wrapLines(el: HTMLElement, mode: "lines" | "words") {
  // StrictMode double-invoke guard — never split twice
  if (el.dataset.split === "true") {
    return el.querySelectorAll<HTMLElement>(".reveal-inner");
  }
  el.dataset.split = "true";

  if (mode === "words") {
    const words = (el.textContent ?? "").trim().split(/\s+/);
    el.innerHTML = words
      .map(
        (w) =>
          `<span class="reveal-mask" style="display:inline-block;overflow:hidden;vertical-align:top;"><span class="reveal-inner" style="display:inline-block;will-change:transform;">${w}&nbsp;</span></span>`
      )
      .join("");
  } else {
    const lines = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = lines
      .map(
        (line) =>
          `<span class="reveal-mask" style="display:block;overflow:hidden;"><span class="reveal-inner" style="display:block;will-change:transform;">${line}</span></span>`
      )
      .join("");
  }
  return el.querySelectorAll<HTMLElement>(".reveal-inner");
}

export function useTextReveal<T extends HTMLElement = HTMLElement>({
  stagger = 0.08,
  delay = 0,
  duration = 1.1,
  mode = "lines",
  start = "top 85%",
  once = true,
}: TextRevealOptions = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const inners = wrapLines(el, mode);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        inners,
        { yPercent: 110, rotate: 2 },
        {
          yPercent: 0,
          rotate: 0,
          duration,
          delay,
          stagger,
          ease: "power4.out",
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: once ? "play none none none" : "play none none reverse",
          },
        }
      );
    }, el);

    return () => ctx.revert(); // kills tweens + ScrollTriggers scoped to el
  }, [stagger, delay, duration, mode, start, once]);

  return ref;
}
