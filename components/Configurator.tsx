"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, isValidEmail } from "@/lib/utils";
import { LogoMark } from "@/components/Logo";
import {
  SKIN_TYPES,
  CONCERNS,
  INFUSIONS,
  type RitualConfiguration,
} from "@/types/waitlist";

/**
 * The Interactive Configuration Experience.
 * A multi-step diagnostic that generates a real-time product variation
 * as the user adjusts chips and sliders. Peach linear progress bar,
 * pill chips, premium sliders, live reactive preview card.
 */

const STEPS = ["Skin Baseline", "Concerns", "Infusions", "Calibrate", "Reserve"] as const;

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
};

function Chip({
  label,
  active,
  onToggle,
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className={cn("chip", active && "chip-active")}
    >
      {active && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M2 6.5 4.8 9 10 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {label}
    </button>
  );
}

function Slider({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: [string, string];
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="vial-label">{label}</span>
        <span className="rounded-full bg-secondary-container px-2.5 py-0.5 font-label text-label-sm text-secondary-on-container">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="lumin-slider"
        style={{ "--fill": `${value}%` } as React.CSSProperties}
        aria-label={label}
      />
      <div className="mt-1.5 flex justify-between font-label text-[10px] tracking-[0.06em] text-outline">
        <span>{hint[0]}</span>
        <span>{hint[1]}</span>
      </div>
    </div>
  );
}

/** Deterministic formula derivation — the "real-time product variation". */
function deriveFormula(cfg: RitualConfiguration) {
  const prefix =
    cfg.hydration >= 66 ? "Deep-Dew" : cfg.hydration >= 33 ? "Silk" : "Feather";
  const core =
    cfg.radiance >= 66 ? "Lumen" : cfg.radiance >= 33 ? "Glow" : "Calm";
  const suffix = cfg.skinType ? cfg.skinType.slice(0, 3).toUpperCase() : "BAL";
  const number = 10 + cfg.concerns.length * 7 + cfg.infusions.length * 3;

  const match = Math.min(
    99,
    52 +
      (cfg.skinType ? 12 : 0) +
      cfg.concerns.length * 4 +
      cfg.infusions.length * 5 +
      Math.round(Math.abs(cfg.hydration - 50) / 12)
  );

  return {
    name: `${prefix} ${core} ${suffix}-${number}`,
    match,
    texture:
      cfg.hydration >= 66 ? "Rich cream" : cfg.hydration >= 33 ? "Gel-cream" : "Water essence",
    finish: cfg.radiance >= 50 ? "Luminous finish" : "Soft-matte finish",
  };
}

export function Configurator() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [cfg, setCfg] = useState<RitualConfiguration>({
    skinType: "",
    concerns: [],
    infusions: [],
    hydration: 50,
    radiance: 50,
    toneDepth: 50,
  });

  const formula = useMemo(() => deriveFormula(cfg), [cfg]);
  const progress = ((step + 1) / STEPS.length) * 100;

  const canAdvance =
    step === 0
      ? cfg.skinType !== ""
      : step === 1
        ? cfg.concerns.length > 0
        : step === 4
          ? isValidEmail(email)
          : true;

  function go(next: number) {
    setDir(next > step ? 1 : -1);
    setStep(Math.max(0, Math.min(STEPS.length - 1, next)));
  }

  function toggle(list: string[], item: string, max = 6): string[] {
    return list.includes(item)
      ? list.filter((x) => x !== item)
      : list.length >= max
        ? list
        : [...list, item];
  }

  async function reserve() {
    setError(null);
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, configuration: cfg }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }
      window.location.assign(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <section id="configure" className="mx-auto max-w-6xl px-4 py-section-gap md:px-8">
      <p className="vial-label text-primary">DIAGNOSTIC CONFIGURATOR</p>
      <h2 className="mt-3 max-w-xl font-headline text-headline-lg-m font-bold md:text-headline-lg">
        Calibrate your ritual <span className="text-primary">in real time.</span>
      </h2>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* ── Left: diagnostic steps ─────────────────────────────── */}
        <div className="card-mint rounded-lg p-6 md:p-8">
          {/* Peach linear progress bar */}
          <div className="mb-2 flex items-center justify-between">
            <span className="vial-label">
              STEP {step + 1} / {STEPS.length} — {STEPS[step]}
            </span>
            <span className="font-label text-label-sm text-secondary-on-container">
              {Math.round(progress)}%
            </span>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-surface-container-high"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <motion.div
              className="h-full rounded-full bg-secondary-container"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <div className="relative mt-8 min-h-[300px]">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={step}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {step === 0 && (
                  <>
                    <h3 className="font-headline text-headline-md">
                      How does your skin behave most days?
                    </h3>
                    <div className="mt-5 flex flex-wrap gap-2.5">
                      {SKIN_TYPES.map((t) => (
                        <Chip
                          key={t}
                          label={t}
                          active={cfg.skinType === t}
                          onToggle={() => setCfg({ ...cfg, skinType: t })}
                        />
                      ))}
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <h3 className="font-headline text-headline-md">
                      What should we prioritize? <span className="text-outline text-body-md">(pick up to 3)</span>
                    </h3>
                    <div className="mt-5 flex flex-wrap gap-2.5">
                      {CONCERNS.map((c) => (
                        <Chip
                          key={c}
                          label={c}
                          active={cfg.concerns.includes(c)}
                          onToggle={() =>
                            setCfg({ ...cfg, concerns: toggle(cfg.concerns, c, 3) })
                          }
                        />
                      ))}
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <h3 className="font-headline text-headline-md">
                      Choose your whole-food infusions
                    </h3>
                    <p className="mt-2 text-body-md text-on-surface-variant">
                      Food-derived actives, stabilized to clinical concentrations.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2.5">
                      {INFUSIONS.map((f) => (
                        <Chip
                          key={f}
                          label={f}
                          active={cfg.infusions.includes(f)}
                          onToggle={() =>
                            setCfg({ ...cfg, infusions: toggle(cfg.infusions, f, 4) })
                          }
                        />
                      ))}
                    </div>
                  </>
                )}

                {step === 3 && (
                  <div className="space-y-8">
                    <h3 className="font-headline text-headline-md">Fine-tune the formula</h3>
                    <Slider
                      label="HYDRATION LOAD"
                      hint={["FEATHER-LIGHT", "DEEP DEW"]}
                      value={cfg.hydration}
                      onChange={(v) => setCfg({ ...cfg, hydration: v })}
                    />
                    <Slider
                      label="RADIANCE INTENSITY"
                      hint={["SOFT MATTE", "FULL LUMEN"]}
                      value={cfg.radiance}
                      onChange={(v) => setCfg({ ...cfg, radiance: v })}
                    />
                    <Slider
                      label="SKIN TONE CALIBRATION"
                      hint={["FAIR", "DEEP"]}
                      value={cfg.toneDepth}
                      onChange={(v) => setCfg({ ...cfg, toneDepth: v })}
                    />
                  </div>
                )}

                {step === 4 && (
                  <>
                    <h3 className="font-headline text-headline-md">
                      Reserve <span className="text-primary">{formula.name}</span>
                    </h3>
                    <p className="mt-2 text-body-md text-on-surface-variant">
                      A fully-refundable <strong>$1.00</strong> deposit locks your
                      formula and your place in line. Checkout is handled securely
                      by Stripe.
                    </p>
                    <div className="mt-6 space-y-3">
                      <label htmlFor="waitlist-email" className="vial-label block">
                        EMAIL ADDRESS
                      </label>
                      <input
                        id="waitlist-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="lumin-input"
                      />
                      {error && (
                        <p role="alert" className="rounded bg-error-container px-4 py-2.5 text-sm text-error-on-container">
                          {error}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Step controls */}
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => go(step - 1)}
              disabled={step === 0 || submitting}
              className="btn-ghost !px-5 !py-2.5 text-sm disabled:opacity-0"
            >
              Back
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => go(step + 1)}
                disabled={!canAdvance}
                className="btn-primary !px-6 !py-2.5 text-sm"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={reserve}
                disabled={!canAdvance || submitting}
                className="btn-primary !px-6 !py-2.5 text-sm"
              >
                {submitting ? "Opening secure checkout…" : "Reserve for $1.00"}
              </button>
            )}
          </div>
        </div>

        {/* ── Right: live reactive preview card ──────────────────── */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <motion.div
            layout
            className="card-mint relative overflow-hidden rounded-lg p-6"
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <span className="vial-label">CUSTOM SERUM · LIVE PREVIEW</span>
              <span className="flex items-center gap-1.5 rounded-full bg-secondary-container px-2.5 py-1 font-label text-[10px] tracking-[0.08em] text-secondary-on-container">
                <span className="inline-block h-1.5 w-1.5 animate-sparkle rounded-full bg-primary" />
                REACTIVE
              </span>
            </div>

            {/* Vial visualization — reacts to sliders */}
            <div className="mt-6 flex items-end justify-center">
              <div className="relative h-44 w-24 overflow-hidden rounded-[2.75rem] border-2 border-primary/20 bg-white shadow-ambient">
                <motion.div
                  className="absolute inset-x-0 bottom-0"
                  animate={{
                    height: `${28 + cfg.hydration * 0.6}%`,
                    backgroundColor: `hsl(${175 - cfg.radiance * 0.35}, ${
                      42 + cfg.radiance * 0.3
                    }%, ${68 - cfg.toneDepth * 0.18}%)`,
                  }}
                  transition={{ type: "spring", stiffness: 80, damping: 18 }}
                />
                <div className="absolute inset-x-3 top-3 h-4 rounded-full bg-surface-container-low" />
                <LogoMark className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 opacity-80" />
              </div>
            </div>

            <motion.h3
              key={formula.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center font-headline text-headline-md text-on-surface"
            >
              {formula.name}
            </motion.h3>
            <p className="mt-1 text-center text-sm text-on-surface-variant">
              {formula.texture} · {formula.finish}
            </p>

            <div className="mt-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="vial-label">FORMULA MATCH</span>
                <span className="font-headline text-body-md font-bold text-primary">
                  {formula.match}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
                <motion.div
                  className="h-full rounded-full bg-secondary-container"
                  animate={{ width: `${formula.match}%` }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {(cfg.infusions.length ? cfg.infusions : ["Select infusions…"]).map((f) => (
                <span
                  key={f}
                  className="rounded-full bg-surface-container px-3 py-1 font-label text-[10px] tracking-[0.06em] text-on-surface-variant"
                >
                  {f.toUpperCase()}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
