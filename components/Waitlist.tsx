"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { isValidEmail } from "@/lib/utils";
import { Magnetic } from "@/components/Magnetic";

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function reserve(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isValidEmail(email)) {
      setError("That email doesn't look right.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      let data: { url?: string; error?: string } = {};
      try {
        data = await res.json();
      } catch {
        throw new Error("The waitlist is warming up — try again in a minute.");
      }

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Something went wrong. Try again.");
      }
      window.location.assign(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <section
      id="waitlist"
      className="relative flex min-h-screen flex-col items-center justify-center px-5"
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-2xl text-center"
      >
        <div className="overflow-hidden">
          <motion.h2
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="display-xl text-[13vw] md:text-[5.5vw]"
          >
            JOIN THE WAITLIST.
          </motion.h2>
        </div>
        <p className="mt-5 text-lg text-fog md:text-xl">
          Get a facial scan by a powerful AI.
        </p>

        <form onSubmit={reserve} className="mx-auto mt-12 flex max-w-md flex-col gap-4">
          <input
            type="email"
            autoComplete="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-void"
            aria-label="Email address"
          />
          <Magnetic strength={0.3}>
            <button
              type="submit"
              disabled={submitting}
              data-cursor="pointer"
              className="btn-beam w-full"
            >
              {submitting ? "Opening secure checkout…" : "Reserve my spot — $1"}
            </button>
          </Magnetic>
          {error && (
            <p role="alert" className="text-sm text-ember/90">
              {error}
            </p>
          )}
        </form>

        <p className="hud mt-8 !tracking-[0.2em]">
          $1 RESERVATION · REFUNDABLE · STRIPE SECURED
        </p>
      </motion.div>
    </section>
  );
}
