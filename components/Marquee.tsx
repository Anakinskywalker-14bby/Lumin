"use client";

/**
 * Marquee — infinite horizontal text loop.
 * Duplicated track translates -50% via a GPU-composited CSS keyframe
 * (defined in globals.css as .marquee-track / marquee-scroll).
 */

import { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  speed?: number;    // seconds per loop
  reverse?: boolean;
  className?: string;
}

export function Marquee({
  children,
  speed = 24,
  reverse = false,
  className = "",
}: MarqueeProps) {
  const items = Array.from({ length: 4 }, (_, i) => (
    <span key={i} className="mx-6 inline-block">
      {children}
    </span>
  ));

  return (
    <div
      className={`relative w-full overflow-hidden whitespace-nowrap ${className}`}
      aria-hidden="true"
    >
      <div
        className="marquee-track inline-block"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {items}
        {items /* duplicate track = seamless -50% loop */}
      </div>
    </div>
  );
}
