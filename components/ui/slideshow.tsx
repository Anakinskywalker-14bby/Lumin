"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Cinematic opening slideshow — the prologue.
 * Pure auto-advancing full-bleed imagery with masked line reveals.
 * No arrows, no counter, no scroll cue — just the film.
 */

const slides = [
  {
    img: "https://cdn.cosmos.so/8b0252bd-cb64-45f4-aef8-672c7f628f76?format=jpeg",
    text: ["EVERY FACE", "TELLS A STORY"],
  },
  {
    img: "https://cdn.cosmos.so/7b3f4c48-ec63-4bac-b472-910c037a0eb4?format=jpeg",
    text: ["MOST OF IT", "GOES UNSEEN"],
  },
  {
    img: "https://cdn.cosmos.so/444502b9-4cb9-4f14-a068-f0213df08729?format=jpeg",
    text: ["UNTIL YOU", "LOOK CLOSER"],
  },
  {
    img: "https://cdn.cosmos.so/ef511e17-a35b-42e6-9122-2754bbd2ad7e?format=jpeg",
    text: ["LIGHT REVEALS", "WHAT MIRRORS MISS"],
  },
  {
    img: "https://cdn.cosmos.so/cf68a397-080a-437a-994e-69dedd9e6e06?format=jpeg",
    text: ["THIS IS WHERE", "IT BEGINS"],
  },
];

const AUTO_ADVANCE_MS = 4200;

export default function Slideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setCurrent((prev) => (prev + 1) % slides.length),
      AUTO_ADVANCE_MS
    );
    return () => clearInterval(t);
  }, []);

  return (
    <section
      className="relative h-screen w-full overflow-hidden bg-night"
      aria-label="Opening slideshow"
    >
      {slides.map((slide, i) => (
        <motion.div
          key={i}
          initial={false}
          animate={{ opacity: i === current ? 1 : 0, scale: i === current ? 1 : 1.07 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${slide.img})` }}
          aria-hidden={i !== current}
        />
      ))}

      <div className="absolute inset-0 bg-night/50" />
      <div className="vignette absolute inset-0" />

      {/* Masked line reveals */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.h1
            key={current}
            exit={{ opacity: 0, y: -24, transition: { duration: 0.45 } }}
            className="display-xl text-center text-[11vw] md:text-[6.5vw]"
          >
            {slides[current].text.map((line, j) => (
              <span key={j} className="block overflow-hidden">
                <motion.span
                  initial={{ y: "115%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.85,
                    delay: 0.12 + j * 0.14,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="block"
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </motion.h1>
        </AnimatePresence>
      </div>

      {/* Letterbox frame */}
      <div className="letterbox top-0 h-10 md:h-14 flex items-end justify-between px-5 pb-1.5 md:px-8">
        <span className="hud">LUMIN</span>
        <span className="hud hidden md:block">PROLOGUE</span>
      </div>
      <div className="letterbox bottom-0 h-10 md:h-14" />
    </section>
  );
}
