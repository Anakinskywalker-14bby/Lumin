"use client";

/**
 * HeroSection — Lumin's cinematic opener.
 * 100vh, strict 12-column grid, void-black with signal/ember accents.
 * - Masked line-by-line headline reveal (useTextReveal + GSAP)
 * - Both scan subjects (public/models/subject-a.jpg + subject-b.jpg) in
 *   overlapping editorial frames — object-cover crops them to the tight
 *   portrait framing, and each layer parallaxes at a different Y speed
 * - Magnetic CTA (useMagnetic) with animated hover underline
 * - Bioluminescent scan-line sweep + instrument corner ticks
 * - Bottom infinite marquee
 */

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTextReveal } from "@/hooks/useTextReveal";
import { useMagnetic } from "@/hooks/useMagnetic";
import { Marquee } from "@/components/Marquee";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgARef = useRef<HTMLDivElement>(null); // back layer — slow
  const imgBRef = useRef<HTMLDivElement>(null); // front layer — fast
  const scanRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  const headlineRef = useTextReveal<HTMLHeadingElement>({
    stagger: 0.09,
    delay: 0.35,
    duration: 1.2,
  });
  const subRef = useTextReveal<HTMLParagraphElement>({
    mode: "words",
    stagger: 0.015,
    delay: 0.9,
    duration: 0.9,
  });
  const ctaRef = useMagnetic<HTMLAnchorElement>({ strength: 0.4, radius: 130 });

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (!reduced) {
        /* ---- Parallax: layers travel at different Y speeds ---- */
        gsap.to(imgARef.current, {
          yPercent: -14,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.to(imgBRef.current, {
          yPercent: -32, // faster layer → depth
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        /* ---- Intro: frames clip-reveal upward ---- */
        gsap.fromTo(
          [imgARef.current, imgBRef.current],
          { clipPath: "inset(100% 0% 0% 0%)", scale: 1.15 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            duration: 1.4,
            stagger: 0.15,
            delay: 0.5,
            ease: "power4.out",
          }
        );

        /* ---- Scan line sweeping the front portrait ---- */
        gsap.fromTo(
          scanRef.current,
          { top: "-4%" },
          {
            top: "104%",
            duration: 3.2,
            repeat: -1,
            repeatDelay: 1.4,
            ease: "power2.inOut",
          }
        );
      }

      if (metaRef.current) {
        gsap.fromTo(
          metaRef.current.children,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.08,
            delay: reduced ? 0 : 1.2,
            ease: "power3.out",
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative grid h-screen w-full grid-cols-12 grid-rows-[auto_1fr_auto] gap-x-4 overflow-hidden px-5 md:px-8"
      aria-label="Lumin — AI skin analysis"
    >
      {/* ================= TOP META ROW ================= */}
      <div
        ref={metaRef}
        className="col-span-12 row-start-1 flex items-center justify-between pt-20 md:pt-24"
      >
        <span className="hud">◉ Dermal-AI v2.4</span>
        <span className="hud hidden md:inline">4,096 data points / scan</span>
        <span className="hud-signal">● Live analysis</span>
      </div>

      {/* ================= HEADLINE — cols 1–8 ================= */}
      <div className="z-20 col-span-12 row-start-2 flex flex-col justify-center md:col-span-8">
        <h1
          ref={headlineRef}
          className="display-xl text-[16vw] md:text-[9.5vw]"
        >
          YOUR SKIN,
          <br />
          <span className="text-transparent [-webkit-text-stroke:2px_#f2f5f0]">
            DECODED
          </span>
          <br />
          BY LIGHT<span className="text-ember">.</span>
        </h1>

        <p
          ref={subRef}
          className="mt-8 max-w-md text-[15px] leading-relaxed text-fog md:text-base"
        >
          One scan. Lumin reads hydration, texture and barrier health from a
          single photo — then matches you with products from brands you
          already love.
        </p>

        {/* Magnetic CTA */}
        <div className="mt-10">
          <a
            ref={ctaRef}
            href="#waitlist"
            data-cursor="pointer"
            className="link-underline inline-flex items-center gap-4 border border-frost/25 px-8 py-4 font-label text-xs font-semibold uppercase tracking-[0.3em] text-frost transition-colors duration-300 hover:border-signal hover:text-signal"
          >
            Join the waitlist
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>

      {/* ================= PORTRAITS — cols 9–12 ================= */}
      <div className="relative col-span-4 col-start-9 row-start-2 hidden items-center md:flex">
        {/* Back frame — subject A, slow parallax */}
        <div
          ref={imgARef}
          data-cursor="scan"
          className="absolute right-[42%] top-[6%] aspect-[4/5] w-[66%] overflow-hidden"
        >
          <img
            src="https://raw.githubusercontent.com/Anakinskywalker-14bby/Lumin/main/public/models/subject-a.jpg"
            alt="Lumin scan subject 01"
            draggable={false}
            className="h-full w-full object-cover object-[47%_center] grayscale"
          />
          <div className="scan-grid pointer-events-none absolute inset-0 opacity-50" />
          <div className="pointer-events-none absolute inset-0 bg-ember/10 mix-blend-overlay" />
        </div>

        {/* Front frame — subject B, fast parallax, editorial offset */}
        <div
          ref={imgBRef}
          data-cursor="scan"
          className="absolute bottom-[4%] right-0 z-10 aspect-[4/5] w-[70%] overflow-hidden"
        >
          <img
            src="https://raw.githubusercontent.com/Anakinskywalker-14bby/Lumin/main/public/models/subject-b.jpg"
            alt="Lumin scan subject 02"
            draggable={false}
            className="h-full w-full object-cover object-[48%_center] grayscale"
          />
          <div className="scan-grid pointer-events-none absolute inset-0 opacity-50" />
          <div className="pointer-events-none absolute inset-0 bg-signal/10 mix-blend-overlay" />

          {/* Bioluminescent scan sweep */}
          <div
            ref={scanRef}
            className="pointer-events-none absolute left-0 h-[2px] w-full bg-gradient-to-r from-ember via-signal to-ember shadow-pulse"
          />

          {/* Instrument corner ticks */}
          <span className="absolute left-2 top-2 h-3 w-3 border-l-2 border-t-2 border-signal/80" />
          <span className="absolute bottom-2 right-2 h-3 w-3 border-b-2 border-r-2 border-signal/80" />
        </div>

        {/* Data readout */}
        <div className="hud absolute -bottom-2 right-0 !text-[9px]">
          fig. 01–02 — subjects awaiting scan
        </div>
      </div>

      {/* ================= BOTTOM MARQUEE ================= */}
      <div className="z-20 col-span-12 row-start-3 border-t border-frost/10 pb-4 pt-3">
        <Marquee
          speed={26}
          className="font-headline text-2xl font-extrabold uppercase tracking-tight text-frost/90 md:text-4xl"
        >
          Skin intelligence <span className="text-ember">✳</span> One scan{" "}
          <span className="text-signal">✳</span> 4,096 data points{" "}
          <span className="text-ember">✳</span> Zero guesswork{" "}
          <span className="text-signal">✳</span>
        </Marquee>
      </div>

      {/* Vignette to sit flush with the rest of the site */}
      <div className="vignette pointer-events-none absolute inset-0 z-10" />
    </section>
  );
}
