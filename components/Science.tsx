"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    label: "01 · CAPTURE",
    title: "One selfie",
    body: "Upload or use your camera in the browser. Images are analyzed and discarded — never stored, never used for training.",
  },
  {
    label: "02 · ANALYZE",
    title: "14 dermal signals",
    body: "Enterprise-grade vision APIs return structured concern scores, overlays, and a composite skin health score in seconds.",
  },
  {
    label: "03 · FORMULATE",
    title: "Your ritual, compiled",
    body: "Concern scores map to whole-food actives at clinical concentrations — every choice carries its evidence trail.",
  },
  {
    label: "04 · ADAPT",
    title: "Weekly recalibration",
    body: "Rescan to retune. Your Glow Score, streaks, and quests keep the ritual alive between scans.",
  },
];

export function Science() {
  return (
    <section id="science" className="bg-surface-container-low py-section-gap">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <p className="vial-label text-primary">THE SCIENCE PIPELINE</p>
        <h2 className="mt-3 max-w-xl font-headline text-headline-lg-m font-bold md:text-headline-lg">
          Clinical rigor, <span className="text-primary">calm delivery.</span>
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <motion.article
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="card-mint rounded-lg p-6 transition-shadow hover:shadow-ambient-lg"
            >
              <p className="vial-label text-primary">{s.label}</p>
              <h3 className="mt-3 font-headline text-headline-md">{s.title}</h3>
              <p className="mt-2 text-body-md text-on-surface-variant">{s.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
