import { cn } from "@/lib/utils";

/**
 * Lumin — "Cosmic Capsule" mark.
 * A sleek geometric capsule split symmetrically, its halves floating
 * slightly apart, with two minimalist starburst sparkles emerging
 * from the division line and a fine orbit ring around the gap.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-9 w-9", className)}
      aria-hidden="true"
    >
      {/* Left capsule half — solid teal, drifting up-left */}
      <path
        d="M14 24 h13 v16 H14 a8 8 0 0 1 -8 -8 a8 8 0 0 1 8 -8 Z"
        fill="#016464"
        transform="translate(-1.5,-1.5)"
      />
      {/* Right capsule half — warm peach, drifting down-right */}
      <path
        d="M37 24 h13 a8 8 0 0 1 8 8 a8 8 0 0 1 -8 8 H37 Z"
        fill="#fbd9c1"
        transform="translate(1.5,1.5)"
      />
      {/* Orbit ring around the split */}
      <ellipse
        cx="32"
        cy="32"
        rx="21"
        ry="9"
        stroke="#88d3d3"
        strokeWidth="1.4"
        strokeDasharray="3 4"
        transform="rotate(-18 32 32)"
      />
      {/* Orbit dot */}
      <circle cx="49" cy="24.5" r="2" fill="#016464" />
      {/* Starburst sparkle — upper, 4-point */}
      <path
        d="M32 10 l1.7 4.8 L38.5 16.5 l-4.8 1.7 L32 23 l-1.7 -4.8 L25.5 16.5 l4.8 -1.7 Z"
        fill="#016464"
        className="animate-sparkle"
      />
      {/* Starburst sparkle — lower, smaller */}
      <path
        d="M32 45 l1.1 3.2 L36.3 49.3 l-3.2 1.1 L32 53.5 l-1.1 -3.1 L27.7 49.3 l3.2 -1.1 Z"
        fill="#725a47"
        className="animate-sparkle"
        style={{ animationDelay: "1.1s" }}
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="font-headline text-[22px] font-bold tracking-tight text-on-surface">
        lumin
        <span className="text-primary">.</span>
      </span>
    </span>
  );
}
