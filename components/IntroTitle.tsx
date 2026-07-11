"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * INTRODUCING LUMIN — the title card.
 * Bold, cinematic, earned: it only arrives after the scan.
 */
export function IntroTitle() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0.1, 0.35, 0.7, 0.95], [0, 1, 1, 0]);
  const tracking = useTransform(scrollYProgress, [0.1, 0.45], [0.5, 0.02]);
  const letterSpacing = useTransform(tracking, (v) => `${v}em`);
  const glowScale = useTransform(scrollYProgress, [0.15, 0.5], [0.6, 1.15]);

  return (
    <section ref={ref} className="relative flex h-[160vh] items-center justify-center overflow-hidden">
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center">
        {/* light bloom behind the word */}
        <motion.div
          style={{ scale: glowScale, opacity }}
          className="pointer-events-none absolute h-[42vh] w-[80vw] rounded-full bg-signal/[0.05] blur-[110px]"
        />

        <motion.p style={{ opacity }} className="hud mb-6 md:mb-8">
          INTRODUCING
        </motion.p>

        <motion.h2
          style={{ opacity, letterSpacing }}
          className="select-none text-center font-headline text-[19vw] font-extrabold leading-none text-frost md:text-[15vw]"
        >
          LUMIN
        </motion.h2>

        <motion.div style={{ opacity }} className="mt-8 flex items-center gap-4 md:mt-10">
          <span className="h-[1px] w-12 bg-signal/40" />
          <p className="hud-signal">SEE YOUR SKIN LIKE NEVER BEFORE</p>
          <span className="h-[1px] w-12 bg-signal/40" />
        </motion.div>
      </div>
    </section>
  );
}
