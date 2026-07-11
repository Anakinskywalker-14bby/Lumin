"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Custom cursor — trionn/dgb-style.
 * A blend-mode dot + trailing ring. Expands over interactive elements
 * (data-cursor="pointer" or native links/buttons) and becomes a scanning
 * crosshair with a SCAN tag over investigation subjects (data-cursor="scan").
 * Renders only on precision pointers; native cursor is hidden via CSS.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<"default" | "pointer" | "scan">("default");

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const ringX = useSpring(mx, { stiffness: 320, damping: 28, mass: 0.6 });
  const ringY = useSpring(my, { stiffness: 320, damping: 28, mass: 0.6 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);

      const el = e.target as HTMLElement | null;
      const tagged = el?.closest?.("[data-cursor]") as HTMLElement | null;
      if (tagged?.dataset.cursor === "scan") setMode("scan");
      else if (tagged?.dataset.cursor === "pointer" || el?.closest?.("a,button,input,[role=button]"))
        setMode("pointer");
      else setMode("default");
    };

    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [mx, my]);

  if (!enabled) return null;

  const ringSize = mode === "scan" ? 76 : mode === "pointer" ? 56 : 34;

  return (
    <>
      {/* Dot — instant */}
      <motion.div
        aria-hidden
        style={{ x: mx, y: my }}
        className="pointer-events-none fixed left-0 top-0 z-[100] -translate-x-1/2 -translate-y-1/2"
      >
        <div
          className={`rounded-full bg-white mix-blend-difference transition-all duration-200 ${
            mode === "scan" ? "h-1 w-1" : "h-2 w-2"
          }`}
        />
      </motion.div>

      {/* Ring — trailing spring */}
      <motion.div
        aria-hidden
        style={{ x: ringX, y: ringY }}
        className="pointer-events-none fixed left-0 top-0 z-[99] -translate-x-1/2 -translate-y-1/2"
      >
        <div
          style={{ width: ringSize, height: ringSize }}
          className={`relative -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-300 ${
            mode === "scan"
              ? "border-signal/90"
              : "border-white/70 mix-blend-difference"
          }`}
        >
          {mode === "scan" && (
            <>
              {/* crosshair */}
              <span className="absolute left-1/2 top-[-7px] h-3 w-[1px] -translate-x-1/2 bg-signal" />
              <span className="absolute left-1/2 bottom-[-7px] h-3 w-[1px] -translate-x-1/2 bg-signal" />
              <span className="absolute top-1/2 left-[-7px] w-3 h-[1px] -translate-y-1/2 bg-signal" />
              <span className="absolute top-1/2 right-[-7px] w-3 h-[1px] -translate-y-1/2 bg-signal" />
              <span className="hud-signal absolute -bottom-6 left-1/2 -translate-x-1/2 !text-[9px]">
                SCAN
              </span>
            </>
          )}
        </div>
      </motion.div>
    </>
  );
}
