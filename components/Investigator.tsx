"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * THE INVESTIGATOR — gamified scan.
 * The site doesn't point at anything. YOU run the lens over the subject's
 * skin. Hover the right region → the UI locks on with a tech blip and the
 * analysis reveals itself on the left. Three concerns per subject.
 * Coordinates are % of the ORIGINAL image (mapped via an aspect-true
 * wrapper so crops never break them).
 */

export interface Concern {
  id: string;
  label: string;
  analysis: string;
  x: number; // left %
  y: number; // top %
}

export interface Subject {
  index: string;
  img: string;
  aspect: string; // e.g. "2600/1418"
  concerns: Concern[];
}

/* Lock-on blip — pure WebAudio, no asset. Fails silently if blocked. */
function playBlip() {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(740, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1480, ctx.currentTime + 0.09);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.16);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.18);
    osc.onended = () => ctx.close();
  } catch {
    /* autoplay policy — stay silent */
  }
}

export function Investigator({ subject }: { subject: Subject }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [found, setFound] = useState<string[]>([]);
  const [locked, setLocked] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.12, 1.02]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);

  const complete = found.length === subject.concerns.length;

  function lockOn(c: Concern) {
    setLocked(c.id);
    if (!found.includes(c.id)) {
      playBlip();
      setFound((f) => [...f, c.id]);
    }
  }

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-night"
      aria-label={`Investigation — subject ${subject.index}`}
    >
      {/* ── Subject — aligned right ─────────────────────────────────── */}
      <div
        data-cursor="scan"
        className="absolute inset-y-0 right-0 w-full overflow-hidden md:w-[60vw]"
      >
        <motion.div
          style={{ scale: imgScale, y: imgY }}
          className="relative left-1/2 h-full -translate-x-1/2 will-change-transform"
        >
          {/* aspect-true wrapper → concern % coordinates stay exact */}
          <div
            className="relative h-full"
            style={{ aspectRatio: subject.aspect }}
          >
            <img
              src={subject.img}
              alt={`Scan subject ${subject.index}`}
              className="h-full w-full object-cover"
              draggable={false}
            />

            {/* tactical grid */}
            <div className="scan-grid pointer-events-none absolute inset-0 opacity-60" />

            {/* Concern hit-zones + lock-on reticles */}
            {subject.concerns.map((c) => {
              const isFound = found.includes(c.id);
              const isLocked = locked === c.id;
              return (
                <div
                  key={c.id}
                  className="absolute"
                  style={{
                    left: `${c.x}%`,
                    top: `${c.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {/* invisible hit area — the thing you have to FIND */}
                  <button
                    type="button"
                    aria-label={isFound ? c.label : "Unidentified region"}
                    onMouseEnter={() => lockOn(c)}
                    onMouseLeave={() => setLocked(null)}
                    onClick={() => lockOn(c)}
                    className="absolute left-1/2 top-1/2 z-10 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full md:h-32 md:w-32"
                  />

                  {/* lock-on bracket — only after discovery */}
                  <AnimatePresence>
                    {isFound && (
                      <motion.div
                        initial={{ scale: 2.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 18 }}
                        className="absolute h-16 w-16"
                        style={{ left: -32, top: -32 }}
                      >
                        {/* corner brackets */}
                        {[
                          "left-0 top-0 border-l-2 border-t-2",
                          "right-0 top-0 border-r-2 border-t-2",
                          "left-0 bottom-0 border-l-2 border-b-2",
                          "right-0 bottom-0 border-r-2 border-b-2",
                        ].map((pos) => (
                          <span
                            key={pos}
                            className={cn(
                              "absolute h-4 w-4 transition-colors duration-300",
                              pos,
                              isLocked ? "border-ember" : "border-signal/80"
                            )}
                          />
                        ))}
                        <span
                          className={cn(
                            "absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full",
                            isLocked ? "bg-ember shadow-pulse" : "bg-signal"
                          )}
                        />
                        {isLocked && (
                          <span className="animate-pulse-ring absolute inset-0 rounded-full border border-ember/70" />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* blend into the void */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-night to-transparent md:w-64" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-night to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-night to-transparent" />

        {/* passive scanline */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
          <div className="animate-scanline h-[2px] w-full bg-gradient-to-r from-transparent via-signal/60 to-transparent" />
        </div>
      </div>

      {/* ── Left: the investigation board ───────────────────────────── */}
      <div className="absolute inset-y-0 left-0 z-30 flex w-full flex-col justify-center px-6 md:w-[40vw] md:pl-12 lg:pl-16">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="hud"
        >
          INVESTIGATION · SUBJECT {subject.index}
        </motion.p>

        <div className="mt-3 overflow-hidden">
          <motion.h2
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="display-xl text-[13vw] md:text-[4.6vw]"
          >
            {complete ? "SCAN COMPLETE." : "YOUR TURN."}
          </motion.h2>
        </div>

        <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-fog">
          {complete
            ? "You needed a guide. Lumin sees all of it in one scan — instantly."
            : "Run your lens across the skin. Three everyday concerns are hiding in plain sight."}
        </p>

        {/* progress */}
        <div className="mt-8 flex items-center gap-3">
          {subject.concerns.map((c) => (
            <span
              key={c.id}
              className={cn(
                "h-1 w-12 rounded-full transition-all duration-500",
                found.includes(c.id) ? "bg-signal shadow-beam" : "bg-frost/10"
              )}
            />
          ))}
          <span className="hud ml-2">
            {found.length}/{subject.concerns.length} IDENTIFIED
          </span>
        </div>

        {/* findings */}
        <div className="mt-8 space-y-5">
          {subject.concerns.map((c, i) => {
            const isFound = found.includes(c.id);
            const isLocked = locked === c.id;
            return (
              <div key={c.id} className="flex items-start gap-4">
                <span
                  className={cn(
                    "hud mt-1.5 !text-[10px]",
                    isFound ? "!text-signal" : "!text-fog/30"
                  )}
                >
                  0{i + 1}
                </span>
                <div className="min-w-0">
                  {isFound ? (
                    <motion.div
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p
                        className={cn(
                          "font-headline text-xl font-extrabold uppercase tracking-wide lg:text-2xl",
                          isLocked ? "text-ember" : "text-frost"
                        )}
                      >
                        {c.label}
                      </p>
                      <p className="mt-1 max-w-xs text-sm leading-relaxed text-fog">
                        {c.analysis}
                      </p>
                      <p className="hud mt-1 !text-[9px] !text-signal/60">
                        LOCKED · X{c.x} Y{c.y}
                      </p>
                    </motion.div>
                  ) : (
                    <div className="select-none">
                      <p className="font-headline text-xl font-extrabold uppercase tracking-wide text-frost/15 blur-[5px] lg:text-2xl">
                        UNIDENTIFIED
                      </p>
                      <p className="hud mt-1 !text-[9px] !text-fog/30">
                        AWAITING DISCOVERY
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {complete && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="hud-signal mt-8"
          >
            ▸ CONTINUE SCROLLING
          </motion.p>
        )}
      </div>

      {/* letterbox frame — clean, no chatter */}
      <div className="letterbox top-0 h-10 md:h-14 flex items-end justify-between px-5 pb-1.5 md:px-8">
        <span className="hud">LUMIN · INVESTIGATION</span>
        <span className="hud hidden md:block">SUBJECT {subject.index} / 02</span>
      </div>
      <div className="letterbox bottom-0 h-10 md:h-14" />

      <div className="vignette pointer-events-none absolute inset-0 z-10" />
    </section>
  );
}

/* ── Subject data — coordinates are % of the ORIGINAL portraits ─────── */

export const WOMAN: Subject = {
  index: "01",
  img: "https://raw.githubusercontent.com/Anakinskywalker-14bby/Lumin/main/public/models/subject-a.jpg",
  aspect: "2600/1418",
  concerns: [
    {
      id: "blemishes",
      label: "Blemish Marks",
      analysis:
        "Small red spots and post-blemish marks along the lower cheek — the kind that linger after a breakout.",
      x: 60,
      y: 58,
    },
    {
      id: "freckles",
      label: "Freckles & Sun Spots",
      analysis:
        "A natural dusting across the bridge of the nose, drifting onto both cheeks. The sun keeps receipts.",
      x: 50,
      y: 50,
    },
    {
      id: "darkcircles",
      label: "Dark Circles",
      analysis:
        "Soft shadowing along the under-eye — thin skin where every late night shows first.",
      x: 44,
      y: 45,
    },
  ],
};

export const MAN: Subject = {
  index: "02",
  img: "https://raw.githubusercontent.com/Anakinskywalker-14bby/Lumin/main/public/models/subject-b.jpg",
  aspect: "2600/1418",
  concerns: [
    {
      id: "texture",
      label: "Textured Scars",
      analysis:
        "Shallow indents above the beard line — old breakouts that left their signature behind.",
      x: 41,
      y: 54,
    },
    {
      id: "forehead",
      label: "Forehead Lines",
      analysis:
        "Faint horizontal creases mid-forehead — one for every raised eyebrow.",
      x: 50,
      y: 32,
    },
    {
      id: "pores",
      label: "Visible Pores",
      analysis:
        "Denser texture across the nose and T-zone — classic combination-skin territory.",
      x: 50,
      y: 52,
    },
  ],
};
