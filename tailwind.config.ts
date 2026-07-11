import type { Config } from "tailwindcss";

/**
 * Lumin — "Nolan cut". Deep-black cinema, one teal signal, one warm ember.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: { DEFAULT: "#04070a", 2: "#0a1114", 3: "#101a1e" },
        signal: { DEFAULT: "#8ff5f0", dim: "#2e6a68", deep: "#016464" },
        ember: "#fbd9c1",
        fog: "#9db4b6",
        frost: "#edf4f4",
      },
      fontFamily: {
        headline: ["var(--font-manrope)", "system-ui", "sans-serif"],
        body: ["var(--font-hanken)", "system-ui", "sans-serif"],
        label: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        beam: "0 0 44px rgba(143, 245, 240, 0.25)",
        "beam-lg": "0 0 90px rgba(143, 245, 240, 0.18)",
      },
      keyframes: {
        sparkle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.35", transform: "scale(0.7)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.9" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        scanline: {
          "0%": { transform: "translateY(-8%)" },
          "100%": { transform: "translateY(108%)" },
        },
      },
      animation: {
        sparkle: "sparkle 2.4s ease-in-out infinite",
        "pulse-ring": "pulse-ring 1.8s cubic-bezier(0.2,0.6,0.4,1) infinite",
        scanline: "scanline 5.5s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
