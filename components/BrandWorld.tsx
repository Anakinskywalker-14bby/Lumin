"use client";

import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

/**
 * The Gamified Brand World.
 * An explorable field of drifting "benefit bubbles" — interactive UI
 * nodes users hover and click to discover core brand tenets. The whole
 * field subtly parallaxes with the cursor; every position/duration is
 * deterministic (no render-time randomness → hydration-safe).
 */

interface Tenet {
  id: string;
  label: string;
  title: string;
  body: string;
  stat: string;
  statLabel: string;
  // Deterministic layout (percentages of the field)
  x: number;
  y: number;
  size: number; // px
  driftDur: number; // s
  depth: number; // parallax factor
  peach?: boolean;
}

const TENETS: Tenet[] = [
  {
    id: "signal",
    label: "ANALYSIS",
    title: "14 dermal signals, one selfie",
    body: "Our vision models read hydration, elasticity, redness, texture, and 10 more signals from a single photo — validated against dermatologist grading.",
    stat: "94%",
    statLabel: "GRADING CONCORDANCE",
    x: 8,
    y: 16,
    size: 168,
    driftDur: 11,
    depth: 22,
  },
  {
    id: "food",
    label: "FORMULATION",
    title: "Whole-food infusions",
    body: "Actives sourced from real food — sea buckthorn, matcha catechins, oat beta-glucan — stabilized to clinical concentrations. Nothing your skin can't recognize.",
    stat: "26",
    statLabel: "FOOD-DERIVED ACTIVES",
    x: 42,
    y: 6,
    size: 148,
    driftDur: 9,
    depth: 34,
    peach: true,
  },
  {
    id: "adapt",
    label: "ADAPTIVE",
    title: "A ritual that learns",
    body: "Every rescan retunes your formula. Seasons change, stress changes, your skin changes — Lumin recalibrates weekly instead of guessing once.",
    stat: "7d",
    statLabel: "RECALIBRATION CYCLE",
    x: 72,
    y: 18,
    size: 182,
    driftDur: 13,
    depth: 18,
  },
  {
    id: "clinical",
    label: "EVIDENCE",
    title: "Clinic-grade, spa-calm",
    body: "Built with board-certified dermatologists. Every recommendation carries its evidence trail — study, dosage, expected timeline. Precision shouldn't feel cold.",
    stat: "31",
    statLabel: "PEER-REVIEWED SOURCES",
    x: 16,
    y: 58,
    size: 156,
    driftDur: 10,
    depth: 28,
    peach: true,
  },
  {
    id: "privacy",
    label: "TRUST",
    title: "Your face stays yours",
    body: "Scans are processed and discarded — never used to train models, never sold. Row-level security guards every profile field in our database.",
    stat: "0",
    statLabel: "IMAGES RETAINED",
    x: 48,
    y: 52,
    size: 140,
    driftDur: 12,
    depth: 40,
  },
  {
    id: "glow",
    label: "GAMIFIED",
    title: "Progress you can play",
    body: "Glow Score, streaks, and weekly quests turn consistency into a game. Skincare works when you show up — we make showing up the fun part.",
    stat: "87",
    statLabel: "AVG. GLOW SCORE",
    x: 76,
    y: 60,
    size: 164,
    driftDur: 8,
    depth: 24,
    peach: true,
  },
];

function Bubble({
  tenet,
  active,
  onSelect,
  mx,
  my,
}: {
  tenet: Tenet;
  active: boolean;
  onSelect: () => void;
  mx: ReturnType<typeof useSpring>;
  my: ReturnType<typeof useSpring>;
}) {
  const px = useTransform(mx, [-0.5, 0.5], [-tenet.depth, tenet.depth]);
  const py = useTransform(my, [-0.5, 0.5], [-tenet.depth * 0.7, tenet.depth * 0.7]);

  return (
    <motion.div
      style={{ left: `${tenet.x}%`, top: `${tenet.y}%`, x: px, y: py }}
      className="absolute"
    >
      <motion.button
        type="button"
        onClick={onSelect}
        animate={{
          y: [0, -14, 6, 0],
          x: [0, 8, -6, 0],
        }}
        transition={{ duration: tenet.driftDur, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.94 }}
        aria-expanded={active}
        className={`group flex flex-col items-center justify-center rounded-full border
          text-center transition-shadow duration-300 focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
          ${
            active
              ? "border-primary bg-primary text-on-primary shadow-glow"
              : tenet.peach
                ? "border-secondary-container bg-secondary-container/50 backdrop-blur-md hover:shadow-ambient-lg"
                : "border-primary/15 bg-white/60 backdrop-blur-md hover:shadow-ambient-lg"
          }`}
        style={{ width: tenet.size, height: tenet.size }}
      >
        <span
          className={`vial-label ${active ? "!text-primary-on-container" : "text-primary"}`}
        >
          {tenet.label}
        </span>
        <span
          className={`mt-1 max-w-[80%] font-headline text-sm font-semibold leading-snug ${
            active ? "text-on-primary" : "text-on-surface"
          }`}
        >
          {tenet.title}
        </span>
        <span
          className={`mt-2 font-label text-[10px] tracking-[0.08em] ${
            active ? "text-primary-fixed" : "text-outline group-hover:text-primary"
          }`}
        >
          {active ? "SELECTED" : "TAP TO DISCOVER"}
        </span>
      </motion.button>
    </motion.div>
  );
}

export function BrandWorld() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const fieldRef = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 60, damping: 20 });
  const my = useSpring(rawY, { stiffness: 60, damping: 20 });

  const active = TENETS.find((t) => t.id === activeId) ?? null;

  function handleMouse(e: React.MouseEvent) {
    const rect = fieldRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <section id="world" className="relative mx-auto max-w-6xl px-4 py-section-gap md:px-8">
      <p className="vial-label text-primary">THE LUMIN BRAND WORLD</p>
      <h2 className="mt-3 max-w-xl font-headline text-headline-lg-m font-bold md:text-headline-lg">
        Don&apos;t scroll it. <span className="text-primary">Explore it.</span>
      </h2>
      <p className="mt-4 max-w-lg text-body-md text-on-surface-variant">
        Six tenets drift below — hover to draw them close, tap to open one.
        This is how Lumin thinks.
      </p>

      <div
        ref={fieldRef}
        onMouseMove={handleMouse}
        className="relative mt-10 h-[520px] overflow-hidden rounded-xl border border-primary/10 bg-card-mint shadow-ambient"
      >
        {/* faint grid texture */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(1,100,100,0.10) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {TENETS.map((t) => (
          <Bubble
            key={t.id}
            tenet={t}
            active={activeId === t.id}
            onSelect={() => setActiveId(activeId === t.id ? null : t.id)}
            mx={mx}
            my={my}
          />
        ))}

        {/* Detail panel */}
        <AnimatePresence>
          {active && (
            <motion.aside
              key={active.id}
              initial={{ opacity: 0, y: 32, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="glass absolute inset-x-4 bottom-4 z-10 rounded-lg !border
                !border-primary/15 p-6 shadow-ambient-lg md:inset-x-auto md:right-6 md:w-[380px]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="vial-label text-primary">{active.label}</p>
                  <h3 className="mt-1 font-headline text-headline-md text-on-surface">
                    {active.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveId(null)}
                  aria-label="Close detail"
                  className="rounded-full bg-surface-container p-2 text-on-surface-variant
                    transition-transform hover:bg-surface-container-high active:scale-90"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2 2l10 10M12 2 2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <p className="mt-3 text-body-md text-on-surface-variant">{active.body}</p>
              <div className="mt-4 flex items-center gap-3 rounded-lg bg-secondary-container/50 px-4 py-3">
                <span className="font-headline text-[28px] font-bold text-primary">
                  {active.stat}
                </span>
                <span className="vial-label !text-secondary-on-container">
                  {active.statLabel}
                </span>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
