"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * THE SCAN — photoreal cut.
 * A natural-light portrait, aligned right. Scrolling pushes the camera
 * into the face and pans between real, barely-noticeable imperfections —
 * fine lines, pores, freckled spots, small breakouts. Captions run down
 * the left. Hovering a region pulls it into focus early.
 *
 * Portrait: Unsplash (free commercial license, no attribution required).
 */

const PORTRAIT_URL =
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1400&q=85&fit=crop";

interface Stage {
  id: string;
  index: string;
  label: string;
  line: string;
  /** focus point, % of the portrait's width/height */
  fx: number;
  fy: number;
}

const STAGES: Stage[] = [
  {
    id: "lines",
    index: "01",
    label: "FINE LINES",
    line: "Faint traces across the brow — the first stories skin tells.",
    fx: 47,
    fy: 38,
  },
  {
    id: "pores",
    index: "02",
    label: "PORES",
    line: "Around the nose, the texture every face has up close.",
    fx: 49,
    fy: 58,
  },
  {
    id: "spots",
    index: "03",
    label: "SPOTS & FRECKLES",
    line: "Light marks the sun left behind, hiding in plain sight.",
    fx: 37,
    fy: 56,
  },
  {
    id: "breakouts",
    index: "04",
    label: "SMALL BREAKOUTS",
    line: "Small. Uninvited. Completely universal.",
    fx: 48,
    fy: 73,
  },
];

export function FaceScan() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollStage, setScrollStage] = useState(-1);
  const [hoverStage, setHoverStage] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setScrollStage(p < 0.1 ? -1 : p < 0.32 ? 0 : p < 0.54 ? 1 : p < 0.76 ? 2 : 3);
  });

  const activeStage = hoverStage ?? scrollStage;
  const stage = activeStage >= 0 ? STAGES[activeStage] : null;

  // Camera. translate = (50 - focus) * scale, so each region lands center-frame.
  const P = [0, 0.12, 0.32, 0.54, 0.76, 0.95];
  const scale = useTransform(scrollYProgress, P, [1, 1.2, 2.1, 2.25, 2.35, 2.4]);
  const x = useTransform(scrollYProgress, P, ["0%", "0%", "6.3%", "2.3%", "30.6%", "4.8%"]);
  const y = useTransform(scrollYProgress, P, ["0%", "0%", "25.2%", "-18%", "-14.1%", "-55.2%"]);
  const promptOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);
  const sectionOpacity = useTransform(scrollYProgress, [0.96, 1], [1, 0.2]);

  return (
    <section ref={trackRef} className="relative h-[520vh]" aria-label="Face scan sequence">
      <motion.div
        style={{ opacity: sectionOpacity }}
        className="sticky top-0 h-screen overflow-hidden bg-night"
      >
        {/* ── Portrait — aligned right ─────────────────────────────── */}
        <div className="absolute inset-y-0 right-0 w-full overflow-hidden md:w-[58vw]">
          <motion.div style={{ scale, x, y }} className="relative h-full w-full will-change-transform">
            <img
              src={PORTRAIT_URL}
              alt="Portrait of a young woman in natural light"
              className="h-full w-full object-cover"
              draggable={false}
            />

            {/* Reticles pinned to the skin — they travel with the zoom */}
            {STAGES.map((s, i) => {
              const active = activeStage === i;
              return (
                <div
                  key={s.id}
                  className="absolute"
                  style={{ left: `${s.fx}%`, top: `${s.fy}%`, transform: "translate(-50%, -50%)" }}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-500",
                      active
                        ? "border-signal opacity-100 shadow-[0_0_18px_rgba(143,245,240,0.5)]"
                        : "border-frost/40 opacity-30"
                    )}
                  >
                    <div
                      className={cn(
                        "h-1 w-1 rounded-full transition-colors duration-500",
                        active ? "bg-signal" : "bg-frost/50"
                      )}
                    />
                  </div>
                  {active && (
                    <div className="animate-pulse-ring absolute inset-0 rounded-full border border-signal/60" />
                  )}
                  {/* generous hover hit area */}
                  <button
                    type="button"
                    aria-label={`Focus on ${s.label.toLowerCase()}`}
                    className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 cursor-crosshair rounded-full"
                    onMouseEnter={() => setHoverStage(i)}
                    onMouseLeave={() => setHoverStage(null)}
                    onFocus={() => setHoverStage(i)}
                    onBlur={() => setHoverStage(null)}
                  />
                </div>
              );
            })}
          </motion.div>

          {/* Blend the portrait into the dark stage */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-night to-transparent md:w-56" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-night to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-night to-transparent" />

          {/* scanline sweep */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
            <div className="animate-scanline h-[2px] w-full bg-gradient-to-r from-transparent via-signal/60 to-transparent" />
          </div>
        </div>

        {/* ── Captions — left column ───────────────────────────────── */}
        <div className="absolute inset-y-0 left-0 z-30 hidden w-[42vw] flex-col justify-center gap-7 pl-10 pr-6 md:flex lg:pl-16">
          <p className="hud mb-2">EVERYDAY CONCERNS · IN FOCUS</p>
          {STAGES.map((s, i) => {
            const active = activeStage === i;
            return (
              <div key={s.id} className="flex items-start gap-4">
                <span
                  className={cn(
                    "font-label text-[11px] font-semibold tracking-[0.28em] transition-colors duration-400 mt-1",
                    active ? "text-signal" : "text-fog/40"
                  )}
                >
                  {s.index}
                </span>
                <div>
                  <p
                    className={cn(
                      "font-headline text-xl font-bold tracking-wide transition-all duration-400 lg:text-2xl",
                      active ? "text-frost" : "text-fog/40"
                    )}
                  >
                    {s.label}
                  </p>
                  <AnimatePresence>
                    {active && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mt-1.5 max-w-xs text-[15px] leading-relaxed text-fog"
                      >
                        {s.line}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <span
                  className={cn(
                    "mt-3 h-[1px] flex-1 origin-left transition-all duration-500",
                    active ? "bg-signal/50 scale-x-100" : "bg-frost/10 scale-x-50"
                  )}
                />
              </div>
            );
          })}
        </div>

        {/* Mobile caption — bottom left */}
        <div className="pointer-events-none absolute bottom-16 left-5 z-30 max-w-[70vw] md:hidden">
          <AnimatePresence mode="wait">
            {stage && (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
              >
                <p className="hud-signal mb-1">
                  {stage.index} — {stage.label}
                </p>
                <p className="font-headline text-lg font-semibold leading-snug text-frost">
                  {stage.line}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Opening prompt */}
        <motion.div
          style={{ opacity: promptOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-16 z-30 flex flex-col items-center gap-2.5 md:bottom-20"
        >
          <p className="hud">SCROLL TO SCAN</p>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="h-8 w-[1px] bg-gradient-to-b from-signal to-transparent"
          />
        </motion.div>

        {/* Letterbox */}
        <div className="letterbox top-0 h-10 md:h-14 flex items-end justify-between px-5 pb-1.5 md:px-8">
          <span className="hud">LUMIN · SCAN SEQUENCE</span>
          <span className="hud hidden md:block">SURFACE PASS — 001</span>
        </div>
        <div className="letterbox bottom-0 h-10 md:h-14 flex items-start justify-between px-5 pt-1.5 md:px-8">
          <span className="hud">{stage ? `REGION ${stage.index} / 04` : "STANDBY"}</span>
          <span className="hud-signal">{stage ? stage.label : "AWAITING INPUT"}</span>
        </div>

        {/* Vignette */}
        <div className="vignette pointer-events-none absolute inset-0 z-10" />
      </motion.div>
    </section>
  );
}
