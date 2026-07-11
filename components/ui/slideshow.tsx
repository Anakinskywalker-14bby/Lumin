"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Cinematic opening slideshow (components/ui — shadcn-style location).
 * Full-bleed imagery, two-line title cards, arrow navigation, counter,
 * gentle auto-advance. Adapted to Tailwind + the Lumin "Nolan cut".
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

const AUTO_ADVANCE_MS = 5000;

export default function Slideshow() {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(
    () => setCurrent((prev) => (prev + 1) % slides.length),
    []
  );
  const prevSlide = useCallback(
    () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length),
    []
  );

  useEffect(() => {
    const t = setInterval(nextSlide, AUTO_ADVANCE_MS);
    return () => clearInterval(t);
  }, [current, nextSlide]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-night" aria-label="Opening slideshow">
      {/* Slides */}
      {slides.map((slide, i) => (
        <motion.div
          key={i}
          initial={false}
          animate={{ opacity: i === current ? 1 : 0, scale: i === current ? 1 : 1.06 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${slide.img})` }}
          aria-hidden={i !== current}
        />
      ))}

      {/* Cinematic wash + vignette */}
      <div className="absolute inset-0 bg-night/45" />
      <div className="vignette absolute inset-0" />

      {/* Title card */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.h1
            key={current}
            initial={{ opacity: 0, y: 26, letterSpacing: "0.35em" }}
            animate={{ opacity: 1, y: 0, letterSpacing: "0.12em" }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-center font-headline text-3xl font-extrabold uppercase leading-tight text-frost md:text-6xl"
          >
            {slides[current].text.map((t, j) => (
              <span key={j} className="block">
                {t}
              </span>
            ))}
          </motion.h1>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-frost/20
          bg-night/40 p-3.5 text-frost backdrop-blur-sm transition-all hover:border-signal/60
          hover:text-signal active:scale-90 md:left-8"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M11.5 3 5.5 9l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-frost/20
          bg-night/40 p-3.5 text-frost backdrop-blur-sm transition-all hover:border-signal/60
          hover:text-signal active:scale-90 md:right-8"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M6.5 3l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Counter */}
      <div className="hud absolute bottom-16 right-5 z-20 md:bottom-20 md:right-8">
        0{current + 1} / 0{slides.length}
      </div>

      {/* Scroll cue */}
      <div className="absolute inset-x-0 bottom-14 z-20 flex flex-col items-center gap-2 md:bottom-16">
        <span className="hud">SCROLL</span>
        <motion.span
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="h-7 w-[1px] bg-gradient-to-b from-signal to-transparent"
        />
      </div>

      {/* Letterbox edges */}
      <div className="letterbox top-0 h-10 md:h-14 flex items-end justify-between px-5 pb-1.5 md:px-8">
        <span className="hud">LUMIN</span>
        <span className="hud hidden md:block">A CLOSER LOOK — PROLOGUE</span>
      </div>
      <div className="letterbox bottom-0 h-10 md:h-14" />
    </section>
  );
}
