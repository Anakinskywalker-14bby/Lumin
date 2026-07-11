import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-9 w-9", className)}
      aria-hidden="true"
    >
      <path
        d="M14 24 h13 v16 H14 a8 8 0 0 1 -8 -8 a8 8 0 0 1 8 -8 Z"
        fill="#d9ff3b"
        transform="translate(-1.5,-1.5)"
      />
      <path
        d="M37 24 h13 a8 8 0 0 1 8 8 a8 8 0 0 1 -8 8 H37 Z"
        fill="#ff9ee0"
        transform="translate(1.5,1.5)"
      />
      <ellipse
        cx="32"
        cy="32"
        rx="21"
        ry="9"
        stroke="#d9ff3b"
        strokeOpacity="0.55"
        strokeWidth="1.4"
        strokeDasharray="3 4"
        transform="rotate(-18 32 32)"
      />
      <circle cx="49" cy="24.5" r="2" fill="#d9ff3b" />
      <path
        d="M32 10 l1.7 4.8 L38.5 16.5 l-4.8 1.7 L32 23 l-1.7 -4.8 L25.5 16.5 l4.8 -1.7 Z"
        fill="#d9ff3b"
        className="animate-sparkle"
      />
      <path
        d="M32 45 l1.1 3.2 L36.3 49.3 l-3.2 1.1 L32 53.5 l-1.1 -3.1 L27.7 49.3 l3.2 -1.1 Z"
        fill="#ff9ee0"
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
      <span className="font-headline text-[22px] font-bold tracking-tight text-frost">
        lumin
        <span className="text-signal">.</span>
      </span>
    </span>
  );
}
