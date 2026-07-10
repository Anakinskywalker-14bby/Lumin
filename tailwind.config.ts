import type { Config } from "tailwindcss";

/**
 * Lumin — "Clinical Radiance System"
 * Tokens sourced 1:1 from the brand design specification.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#f8fafb",
          dim: "#d8dadb",
          bright: "#f8fafb",
          "container-lowest": "#ffffff",
          "container-low": "#f2f4f5",
          container: "#eceeef",
          "container-high": "#e6e8e9",
          "container-highest": "#e1e3e4",
          variant: "#e1e3e4",
        },
        "on-surface": { DEFAULT: "#191c1d", variant: "#3f4948" },
        primary: {
          DEFAULT: "#016464",
          container: "#2d7d7d",
          "on-container": "#dafffe",
          fixed: "#a4f0ef",
          "fixed-dim": "#88d3d3",
          inverse: "#88d3d3",
        },
        "on-primary": "#ffffff",
        secondary: {
          DEFAULT: "#725a47",
          container: "#fbd9c1",
          "on-container": "#765e4b",
          fixed: "#fddcc4",
          "fixed-dim": "#e0c1a9",
        },
        "on-secondary": "#ffffff",
        tertiary: {
          DEFAULT: "#4c5c5c",
          container: "#647574",
          "on-container": "#e9fbfa",
          fixed: "#d4e6e5",
          "fixed-dim": "#b8cac9",
        },
        "on-tertiary": "#ffffff",
        error: { DEFAULT: "#ba1a1a", container: "#ffdad6", "on-container": "#93000a" },
        "on-error": "#ffffff",
        outline: { DEFAULT: "#6f7979", variant: "#bec9c8" },
        "icy-mint": "#e9fbfa",
      },
      fontFamily: {
        headline: ["var(--font-manrope)", "system-ui", "sans-serif"],
        body: ["var(--font-hanken)", "system-ui", "sans-serif"],
        label: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "headline-lg": ["40px", { lineHeight: "48px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg-m": ["32px", { lineHeight: "38px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px" }],
        "body-md": ["16px", { lineHeight: "24px" }],
        "label-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "600" }],
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
      },
      boxShadow: {
        // Ambient shadows tinted with Primary Teal — soft, large radius, low opacity
        ambient: "0 8px 20px rgba(1, 100, 100, 0.04), 0 2px 8px rgba(1, 100, 100, 0.03)",
        "ambient-lg": "0 16px 40px rgba(1, 100, 100, 0.07), 0 4px 12px rgba(1, 100, 100, 0.04)",
        glow: "0 0 24px rgba(136, 211, 211, 0.35)",
      },
      backgroundImage: {
        // White → Icy Mint card gradient
        "card-mint": "linear-gradient(145deg, #ffffff 0%, #e9fbfa 100%)",
        "hero-radial":
          "radial-gradient(60% 60% at 70% 20%, rgba(164,240,239,0.35) 0%, rgba(248,250,251,0) 70%), radial-gradient(45% 45% at 15% 80%, rgba(251,217,193,0.30) 0%, rgba(248,250,251,0) 70%)",
      },
      spacing: {
        gutter: "24px",
        "section-gap": "80px",
      },
      keyframes: {
        "drift-slow": {
          "0%, 100%": { transform: "translate(0px, 0px)" },
          "33%": { transform: "translate(8px, -12px)" },
          "66%": { transform: "translate(-6px, 8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        sparkle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.75)" },
        },
      },
      animation: {
        "drift-slow": "drift-slow 9s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        sparkle: "sparkle 2.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
