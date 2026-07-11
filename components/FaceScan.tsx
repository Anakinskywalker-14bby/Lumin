"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";

/**
 * THE SCAN — opening sequence.
 * A holographic face suspended in the dark. Scrolling pushes the camera
 * deeper; each depth reveals an everyday concern — pores, fine lines,
 * spots, small breakouts. Hovering a region pulls it into focus early.
 * Every coordinate is deterministic → hydration-safe.
 */

interface Stage {
  id: string;
  index: string;
  label: string;
  line: string;
  focus: [number, number]; // SVG coords of the focal point
}

const STAGES: Stage[] = [
  {
    id: "pores",
    index: "01",
    label: "PORES",
    line: "Up close, every face has texture.",
    focus: [145, 288],
  },
  {
    id: "lines",
    index: "02",
    label: "FINE LINES",
    line: "The first stories skin tells.",
    focus: [200, 150],
  },
  {
    id: "spots",
    index: "03",
    label: "DARK SPOTS",
    line: "Where the sun left its mark.",
    focus: [255, 265],
  },
  {
    id: "breakouts",
    index: "04",
    label: "BREAKOUTS",
    line: "Small. Uninvited. Universal.",
    focus: [198, 356],
  },
];

const HEAD_PATH =
  "M200,62 C268,62 308,122 308,202 C308,282 278,350 240,394 C226,410 211,424 200,427 C189,424 174,410 160,394 C122,350 92,282 92,202 C92,122 132,62 200,62 Z";

/** mirror an x coordinate across the face's center line */
const mx = (x: number) => 400 - x;

const PORE_DOTS: Array<[number, number]> = [
  [134, 278], [146, 284], [139, 295], [150, 272], [128, 288], [144, 304], [155, 292],
];

const SPOTS: Array<[number, number, number, number]> = [
  [252, 262, 5, 3.5],
  [266, 274, 4, 3],
  [243, 250, 3, 2.4],
  [128, 180, 3.4, 2.6],
];

const BREAKOUTS: Array<[number, number, number]> = [
  [188, 352, 2.6], [206, 358, 2], [196, 368, 2.4], [214, 348, 1.8], [170, 338, 2],
];

function Marks({ stage, active }: { stage: string; active: boolean }) {
  const common = {
    initial: false as const,
    animate: { opacity: active ? 1 : 0.1 },
    transition: { duration: 0.5 },
  };

  if (stage === "pores")
    return (
      <motion.g {...common}>
        {PORE_DOTS.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={1.7} fill="#fbd9c1" />
            <circle cx={mx(x)} cy={y} r={1.7} fill="#fbd9c1" opacity={0.85} />
          </g>
        ))}
      </motion.g>
    );

  if (stage === "lines")
    return (
      <motion.g {...common} stroke="#fbd9c1" strokeWidth={1.1} fill="none" strokeLinecap="round">
        <path d="M160,140 Q200,132 240,140" />
        <path d="M164,152 Q200,145 236,152" opacity={0.8} />
        <path d="M170,164 Q200,158 230,164" opacity={0.6} />
        <path d="M118,208 l-13,-6 M117,215 l-14,0 M118,222 l-13,6" opacity={0.9} />
        <path d="M282,208 l13,-6 M283,215 l14,0 M282,222 l13,6" opacity={0.9} />
      </motion.g>
    );

  if (stage === "spots")
    return (
      <motion.g {...common}>
        {SPOTS.map(([x, y, rx, ry], i) => (
          <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#fbd9c1" opacity={0.9 - i * 0.12} />
        ))}
      </motion.g>
    );

  return (
    <motion.g {...common}>
      {BREAKOUTS.map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill="#fbd9c1" />
          <circle cx={x} cy={y} r={r + 2.5} fill="none" stroke="#fbd9c1" strokeWidth={0.5} opacity={0.5} />
        </g>
      ))}
    </motion.g>
  );
}

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

  // Camera: push in, then drift between regions
  const scale = useTransform(
    scrollYProgress,
    [0, 0.1, 0.32, 0.54, 0.76, 0.95],
    [1, 1.6, 2.3, 2.35, 2.4, 2.45]
  );
  const x = useTransform(
    scrollYProgress,
    [0, 0.1, 0.32, 0.54, 0.76, 0.95],
    ["0%", "0%", "16%", "0%", "-15%", "0%"]
  );
  const y = useTransform(
    scrollYProgress,
    [0, 0.1, 0.32, 0.54, 0.76, 0.95],
    ["0%", "-4%", "-14%", "22%", "-8%", "-34%"]
  );
  const promptOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);
  const faceOpacity = useTransform(scrollYProgress, [0, 0.04, 0.96, 1], [0.9, 1, 1, 0.25]);

  return (
    <section ref={trackRef} className="relative h-[520vh]" aria-label="Face scan sequence">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Letterbox */}
        <div className="letterbox top-0 h-10 md:h-14 flex items-end justify-between px-5 pb-1.5 md:px-8">
          <span className="hud">LUMIN · SCAN SEQUENCE</span>
          <span className="hud hidden md:block">SURFACE PASS — 001</span>
        </div>
        <div className="letterbox bottom-0 h-10 md:h-14 flex items-start justify-between px-5 pt-1.5 md:px-8">
          <span className="hud">{stage ? `REGION ${stage.index} / 04` : "STANDBY"}</span>
          <span className="hud-signal">{stage ? stage.label : "AWAITING INPUT"}</span>
        </div>

        {/* The face */}
        <motion.div
          style={{ scale, x, y, opacity: faceOpacity }}
          className="absolute inset-0 flex items-center justify-center will-change-transform"
        >
          <div className="relative h-[78vh] max-h-[720px] aspect-[4/5]">
            {/* scanline sweep */}
            <div className="absolute inset-x-[8%] top-0 h-full overflow-hidden opacity-60">
              <div className="animate-scanline h-[2px] w-full bg-gradient-to-r from-transparent via-signal/70 to-transparent" />
            </div>

            <svg viewBox="0 0 400 500" className="h-full w-full" role="img" aria-label="Holographic face">
              <defs>
                <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="2.6" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <radialGradient id="haze" cx="50%" cy="45%" r="60%">
                  <stop offset="0%" stopColor="#8ff5f0" stopOpacity="0.07" />
                  <stop offset="100%" stopColor="#8ff5f0" stopOpacity="0" />
                </radialGradient>
              </defs>

              <ellipse cx="200" cy="235" rx="170" ry="210" fill="url(#haze)" />

              {/* Contour shells */}
              <g stroke="#8ff5f0" fill="none" filter="url(#glow)">
                <path d={HEAD_PATH} strokeWidth="1.6" opacity="0.9" />
                <g transform="translate(200 244) scale(0.9) translate(-200 -244)">
                  <path d={HEAD_PATH} strokeWidth="0.8" opacity="0.30" />
                </g>
                <g transform="translate(200 244) scale(0.8) translate(-200 -244)">
                  <path d={HEAD_PATH} strokeWidth="0.7" opacity="0.18" />
                </g>
                <g transform="translate(200 244) scale(0.7) translate(-200 -244)">
                  <path d={HEAD_PATH} strokeWidth="0.6" opacity="0.10" />
                </g>
              </g>

              {/* Guides */}
              <g stroke="#8ff5f0" strokeWidth="0.5" strokeDasharray="2 7" opacity="0.16">
                <line x1="200" y1="66" x2="200" y2="424" />
                <line x1="96" y1="212" x2="304" y2="212" />
                <line x1="102" y1="276" x2="298" y2="276" />
                <line x1="120" y1="320" x2="280" y2="320" />
              </g>

              {/* Features */}
              <g stroke="#8ff5f0" fill="none" strokeWidth="1.5" strokeLinecap="round" filter="url(#glow)" opacity="0.92">
                <path d="M128,190 Q158,177 186,187" />
                <path d="M272,190 Q242,177 214,187" />
                <path d="M132,212 Q158,199 182,212 Q158,223 132,212 Z" />
                <path d="M268,212 Q242,199 218,212 Q242,223 268,212 Z" />
                <circle cx="157" cy="211" r="5.4" strokeWidth="1.2" />
                <circle cx="243" cy="211" r="5.4" strokeWidth="1.2" />
                <path d="M200,214 L200,264" strokeWidth="1" opacity="0.7" />
                <path d="M186,272 Q193,281 200,277 Q207,281 214,272" strokeWidth="1.2" />
                <path d="M168,318 Q200,305 232,318" />
                <path d="M168,318 Q200,337 232,318" />
                <path d="M174,318 Q200,325 226,318" strokeWidth="0.9" opacity="0.7" />
                <path d="M180,362 Q200,371 220,362" strokeWidth="0.8" opacity="0.4" />
              </g>

              {/* Concern marks */}
              <Marks stage="pores" active={activeStage === 0} />
              <Marks stage="lines" active={activeStage === 1} />
              <Marks stage="spots" active={activeStage === 2} />
              <Marks stage="breakouts" active={activeStage === 3} />

              {/* Focus reticle on the active region */}
              {stage && (
                <g>
                  <circle
                    cx={stage.focus[0]}
                    cy={stage.focus[1]}
                    r="26"
                    fill="none"
                    stroke="#fbd9c1"
                    strokeWidth="0.8"
                    opacity="0.85"
                    strokeDasharray="6 5"
                  />
                  <circle
                    cx={stage.focus[0]}
                    cy={stage.focus[1]}
                    r="34"
                    fill="none"
                    stroke="#fbd9c1"
                    strokeWidth="0.5"
                    opacity="0.4"
                    className="animate-pulse-ring"
                    style={{ transformOrigin: `${stage.focus[0]}px ${stage.focus[1]}px` }}
                  />
                </g>
              )}

              {/* Hover regions (invisible hit areas) */}
              {STAGES.map((s, i) => (
                <circle
                  key={s.id}
                  cx={s.focus[0]}
                  cy={s.focus[1]}
                  r="42"
                  fill="transparent"
                  className="cursor-crosshair"
                  style={{ pointerEvents: "all" }}
                  onMouseEnter={() => setHoverStage(i)}
                  onMouseLeave={() => setHoverStage(null)}
                />
              ))}
            </svg>
          </div>
        </motion.div>

        {/* Vignette over everything */}
        <div className="vignette pointer-events-none absolute inset-0 z-10" />

        {/* Stage caption */}
        <div className="pointer-events-none absolute inset-x-0 bottom-20 z-30 flex justify-center md:bottom-24">
          <AnimatePresence mode="wait">
            {stage && (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <p className="hud-signal mb-2">
                  {stage.index} — {stage.label}
                </p>
                <p className="font-headline text-xl font-semibold text-frost md:text-2xl">
                  {stage.line}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Opening prompt */}
        <motion.div
          style={{ opacity: promptOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-20 z-30 flex flex-col items-center gap-3 md:bottom-24"
        >
          <p className="font-headline text-2xl font-semibold text-frost md:text-3xl">
            Every face tells a story.
          </p>
          <p className="hud">SCROLL TO SCAN</p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="h-8 w-[1px] bg-gradient-to-b from-signal to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}
