"use client";

import { motion } from "framer-motion";
import { LogoMark } from "@/components/Logo";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 * i, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-radial pt-[152px] pb-24 md:pb-section-gap">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="vial-label mb-5 flex items-center gap-2 text-primary"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary-container ring-4 ring-secondary-container/40" />
          AI SKIN INTELLIGENCE · CLINICAL GRADE
        </motion.p>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="max-w-3xl font-headline text-headline-lg-m font-bold md:text-[56px] md:leading-[64px] md:tracking-[-0.02em]"
        >
          Your skin, decoded by light.
          <span className="text-primary"> One selfie. </span>
          A complete clinical picture.
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-6 max-w-xl text-body-lg text-on-surface-variant"
        >
          Lumin reads 14 dermal signals from a single photo and builds a
          whole-food-infused ritual calibrated to your skin — tranquil
          precision, without the clinic.
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a href="#configure" className="btn-primary">
            Build your ritual
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10m0 0L9 4m4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href="#world" className="btn-ghost">
            Explore the brand world
          </a>
        </motion.div>

        {/* Floating hero card — frosted, drifting */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute right-[4%] top-[140px] hidden w-[300px] select-none lg:block"
        >
          <div className="card-mint animate-drift-slow rounded-lg p-6 !shadow-ambient-lg">
            <p className="vial-label text-primary">SKIN HEALTH SCORE</p>
            <div className="mt-3 flex items-end gap-2">
              <span className="font-headline text-[52px] font-bold leading-none text-primary">
                87
              </span>
              <span className="mb-1 rounded-full bg-secondary-container px-2.5 py-0.5 font-label text-label-sm text-secondary-on-container">
                +6 THIS WEEK
              </span>
            </div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
              <div className="h-full w-[87%] rounded-full bg-secondary-container" />
            </div>
            <div className="mt-5 flex items-center gap-2 text-on-surface-variant">
              <LogoMark className="h-6 w-6" />
              <p className="font-body text-sm">Hydration up, redness settling.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
