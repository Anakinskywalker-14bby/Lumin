"use client";

/**
 * Lumin — neo-brutalist landing (ported from the Figma Make export
 * "Website Design with Animations").
 * Cream canvas, 3px ink borders, hard offset shadows, sticker chips.
 *
 * Port changes vs. the export:
 * - Vite image imports → repo assets served from GitHub raw
 * - Beta section: raw card-number inputs REMOVED (never collect card data
 *   directly — PCI). Email → existing /api/checkout → Stripe hosted
 *   checkout, $1.00 (matches the live backend).
 * - Encoding artifacts (mojibake emoji/dashes) fixed.
 * - "Compounded formulas" copy adjusted to the affiliate model.
 */

import { useState, useEffect, useRef } from "react";
import svgPaths from "@/lib/svg-design";
import { isValidEmail } from "@/lib/utils";

const ASSET = "https://raw.githubusercontent.com/Anakinskywalker-14bby/Lumin/main/public/design";
const imgHand = `${ASSET}/hand.png`;
const imgDropper = `${ASSET}/dropper.png`;
const imgGlassSkin = `${ASSET}/glass-skin.png`;
const imgNoGender = `${ASSET}/no-gender.png`;
const imgClarity = `${ASSET}/clarity.png`;
const imgCleanBS = `${ASSET}/clean-bs.png`;

// ─── Scroll fade-in hook ────────────────────────────────────────────
function useFadeIn(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// ─── Nav ────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-16 h-[72px] transition-all duration-300"
      style={{
        background: "#f9f9f7",
        borderBottom: "3px solid #1a1c1b",
        boxShadow: scrolled ? "0 4px 0 #1a1c1b" : "4px 4px 0 #1a1c1b",
      }}
    >
      <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 900, fontStyle: "italic", fontSize: 24, letterSpacing: -1.2, color: "#1a1c1b" }}>
        Lumin
      </div>
      <div className="hidden md:flex items-center gap-6">
        {["TECH", "COMMUNITY", "DOCS"].map((l) => (
          <span key={l} style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: "0.7px", color: "#1a1c1b", cursor: "pointer" }}>{l}</span>
        ))}
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: "0.7px", color: "#616207", textDecoration: "underline", cursor: "pointer" }}>BETA</span>
      </div>
      <a
        href="#beta"
        className="neo-shadow-sm neo-border px-7 py-2.5"
        style={{ background: "#e8e883", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: "0.7px", color: "#1a1c1b", cursor: "pointer" }}
      >
        SIGN UP
      </a>
    </nav>
  );
}

// ─── Hero ───────────────────────────────────────────────────────────
function HeroSection() {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  const mask = `radial-gradient(circle at ${cursor.x}px ${cursor.y}px, #000 80px, transparent 140px)`;

  return (
    <section
      className="relative overflow-hidden pt-[72px] min-h-screen flex flex-col"
      style={{ background: "#f9f9f7", borderBottom: "3px solid #1a1c1b" }}
      onPointerEnter={() => setHovering(true)}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setCursor({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      onPointerLeave={() => setHovering(false)}
    >
      {/* Dot grid base */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at center, rgba(26,28,27,0.12) 1.2px, transparent 1.4px)",
          backgroundSize: "20px 20px",
        }}
      />
      {/* Dot grid hover bloom */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-150"
        style={{
          backgroundImage: "radial-gradient(circle at center, rgba(26,28,27,0.28) 2.2px, transparent 2.4px)",
          backgroundSize: "20px 20px",
          opacity: hovering ? 1 : 0,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between px-6 md:px-16 py-16 flex-1 gap-12 max-w-[1280px] mx-auto w-full">
        {/* Left: text */}
        <div className="flex flex-col items-start gap-6 max-w-[620px]">
          <div className="sticker-float neo-shadow-sm neo-border px-5 py-2.5 self-start" style={{ background: "#beeaf8" }}>
            <span style={{ fontFamily: "'Epilogue', sans-serif", fontWeight: 400, fontSize: 22, color: "#1a1c1b" }}>Ouch!</span>
          </div>

          <div className="leading-none" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
            <p style={{ fontWeight: 900, fontSize: "clamp(48px, 6vw, 78px)", color: "#1a1c1b", letterSpacing: "-2.5px", lineHeight: 1.05, margin: 0 }}>
              Their replies are dry
            </p>
            <p style={{ fontWeight: 900, fontSize: "clamp(48px, 6vw, 78px)", letterSpacing: "-2.5px", lineHeight: 1.05, margin: 0 }}>
              <span style={{ color: "#cbcb6a" }}>but </span>
              <span style={{ fontFamily: "'Epilogue', sans-serif", fontWeight: 400, fontStyle: "italic", color: "#1a1c1b", textTransform: "lowercase" }}>your skin</span>
            </p>
            <p style={{ fontWeight: 900, fontSize: "clamp(48px, 6vw, 78px)", color: "#1a1c1b", letterSpacing: "-2.5px", lineHeight: 1.05, margin: 0 }}>
              doesn&apos;t have to be.
            </p>
          </div>

          <p style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 400, fontSize: 18, color: "#484739", lineHeight: 1.6 }}>
            Stop guessing. Start knowing. AI skin analysis for the modern age.
            Join the beta to get your personalized hydration protocol.
          </p>

          <div className="flex gap-4 flex-wrap">
            <a href="#beta" className="neo-shadow neo-border px-9 py-5" style={{ background: "#e8e883", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: "0.9px", color: "#1a1c1b", cursor: "pointer" }}>
              JOIN BETA
            </a>
            <a href="#solution" className="neo-shadow neo-border px-9 py-5" style={{ background: "#f9f9f7", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: "0.9px", color: "#1a1c1b", cursor: "pointer" }}>
              SEE HOW IT WORKS
            </a>
          </div>
        </div>

        {/* Right: image hero */}
        <div className="relative flex-shrink-0">
          <div className="neo-shadow neo-border overflow-hidden" style={{ width: "min(480px, 80vw)", aspectRatio: "3/4" }}>
            <img src={imgHand} alt="Skincare products on hand" className="w-full h-full object-cover" />
          </div>
          <div className="sticker-float-alt absolute -bottom-4 -right-6 neo-shadow-sm neo-border px-5 py-3" style={{ background: "#e8e883", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: "1.6px", color: "#1a1c1b" }}>
            HYDRATE NOW
          </div>
          <div className="absolute -top-4 -left-6 neo-shadow-sm neo-border px-4 py-2" style={{ background: "#beeaf8", fontFamily: "'Work Sans', sans-serif", fontWeight: 700, fontSize: 13, color: "#1a1c1b" }}>
            ✦ BETA OPEN
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Dropper Animation ──────────────────────────────────────────────
function DropperAnimation() {
  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ minHeight: 380 }}>
      <img src={imgDropper} alt="Dropper into bottle" className="w-full h-full object-cover absolute inset-0" />
      <div className="absolute inset-0" style={{ background: "rgba(249,249,247,0.15)" }} />

      <svg
        className="absolute pointer-events-none"
        style={{ top: "22%", left: "50%", transform: "translateX(-50%)", width: 32, height: 240, overflow: "visible" }}
        viewBox="0 0 32 240"
      >
        <ellipse cx="16" cy="8" rx="6" ry="8" fill="rgba(200, 220, 240, 0.85)" style={{ transformOrigin: "16px 8px", animation: "dropForm 3s ease-in-out infinite" }} />
        <ellipse cx="16" cy="8" rx="7" ry="9" fill="rgba(190, 215, 240, 0.9)" style={{ transformOrigin: "16px 8px", animation: "dropFall 3s ease-in 0.05s infinite" }} />
        <ellipse cx="16" cy="208" rx="10" ry="4" fill="none" stroke="rgba(190, 215, 240, 0.6)" strokeWidth="2" style={{ transformOrigin: "16px 208px", animation: "ripple 3s ease-out 1.5s infinite" }} />
        <ellipse cx="16" cy="208" rx="10" ry="4" fill="none" stroke="rgba(190, 215, 240, 0.4)" strokeWidth="1.5" style={{ transformOrigin: "16px 208px", animation: "ripple 3s ease-out 1.7s infinite" }} />
      </svg>
    </div>
  );
}

// ─── Glass Skin / Dropper Section ───────────────────────────────────
function DropperSection() {
  const { ref, visible } = useFadeIn();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative w-full overflow-hidden"
      style={{ borderBottom: "3px solid #1a1c1b", opacity: visible ? 1 : 0, transition: "opacity 0.8s ease, transform 0.8s ease", transform: visible ? "none" : "translateY(40px)" }}
    >
      <div className="flex flex-col lg:flex-row min-h-[640px]">
        {/* Left: Glass Skin image */}
        <div className="relative flex-1 overflow-hidden min-h-[420px]" style={{ borderRight: "3px solid #1a1c1b" }}>
          <img src={imgGlassSkin} alt="Glass Skin Facial" className="w-full h-full object-cover absolute inset-0" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(26,28,27,0.15) 0%, rgba(26,28,27,0.6) 100%)" }} />
          <div className="absolute bottom-12 left-10 right-10">
            <div className="neo-shadow-sm neo-border px-4 py-2 inline-block mb-4" style={{ background: "#e8e883", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "1.6px", color: "#1a1c1b" }}>
              THE GLOW-UP
            </div>
            <h2 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 900, fontSize: "clamp(42px, 5vw, 64px)", color: "#f9f9f7", letterSpacing: "-1.5px", lineHeight: 1.0, margin: 0 }}>
              Glass Skin<br />Is Real<br />
              <span style={{ fontFamily: "'Epilogue', sans-serif", fontWeight: 300, fontStyle: "italic" }}>Science.</span>
            </h2>
          </div>
          <div className="absolute top-8 right-8 sticker-float neo-shadow-sm neo-border px-4 py-2" style={{ background: "#ffdad6", transform: "rotate(-3deg)", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, color: "#93000a" }}>
            ✦ hydrating
          </div>
        </div>

        {/* Right: dropper animation + claim */}
        <div className="relative flex-1 flex flex-col" style={{ background: "#f9f9f7" }}>
          <div className="flex-1 relative overflow-hidden" style={{ minHeight: 320 }}>
            <DropperAnimation />
          </div>
          <div className="px-8 md:px-12 py-10" style={{ borderTop: "3px solid #1a1c1b" }}>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "1.6px", color: "#484739", marginBottom: 12 }}>THE TRUTH</p>
            <h3 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 900, fontSize: "clamp(28px, 3vw, 44px)", color: "#1a1c1b", letterSpacing: "-1px", lineHeight: 1.1, margin: "0 0 16px 0" }}>
              &quot;Clean&quot; Skincare<br />
              <span style={{ fontFamily: "'Epilogue', sans-serif", fontWeight: 400, fontStyle: "italic", color: "#cbcb6a" }}>is a buzzword.</span>
            </h3>
            <p style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 400, fontSize: 16, color: "#484739", lineHeight: 1.7, margin: "0 0 24px 0" }}>
              Your skin doesn&apos;t care about marketing. It responds to what
              actually fits it — the right products, from brands you already
              love, matched to what your skin is really doing.
            </p>
            <a href="#beta" className="neo-shadow-sm neo-border px-7 py-4 w-full inline-block text-center" style={{ background: "#e8e883", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: "0.9px", color: "#1a1c1b", cursor: "pointer" }}>
              GET YOUR ROUTINE →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Problem Section ────────────────────────────────────────────────
function ProblemSection() {
  const { ref, visible } = useFadeIn();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative w-full"
      style={{ background: "#f4f4f2", borderBottom: "3px solid #1a1c1b", opacity: visible ? 1 : 0, transition: "opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s", transform: visible ? "none" : "translateY(40px)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-16 py-24 flex flex-col lg:flex-row gap-16 items-center">
        <div className="flex-1 relative">
          <div style={{ position: "absolute", top: -28, left: -8 }}>
            <span style={{ background: "#ffdad6", display: "inline-block", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: "1px", color: "#93000a", padding: "10px 19px", border: "3px solid #1a1c1b", boxShadow: "4px 4px 0 #1a1c1b", transform: "rotate(-2deg)" }}>
              THE PROBLEM
            </span>
          </div>
          <h2 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 800, fontSize: "clamp(36px, 4vw, 52px)", color: "#1a1c1b", letterSpacing: "-1px", lineHeight: 1.15, marginTop: 48, marginBottom: 20 }}>
            The Skincare<br />Guessing Game<br />is Over.
          </h2>
          <p style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 400, fontSize: 18, color: "#484739", lineHeight: 1.7, marginBottom: 32 }}>
            Buying serums based on vibes? Stop it. Your skin is a complex
            ecosystem, not a mood board. Most routines fail because they chase
            trends instead of what your skin actually needs.
          </p>
          <div className="flex flex-col gap-4">
            {[
              "Wasting money on hype ingredients.",
              "Irritating your skin with contradictory products.",
              "Waiting months for results that never come.",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d={svgPaths.p28843fc0} fill="#BA1A1A" />
                </svg>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: "0.7px", color: "#1a1c1b" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* "Is it working?" card */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-[380px]">
            <div style={{ background: "#f9f9f7", border: "3px solid #1a1c1b", boxShadow: "8px 8px 0 #1a1c1b", padding: 36, transform: "rotate(1deg)" }}>
              <div className="neo-border" style={{ background: "#beeaf8", padding: "120px 20px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
                <p style={{ fontFamily: "'Epilogue', sans-serif", fontWeight: 400, fontSize: 34, color: "#1a1c1b", textAlign: "center", margin: 0 }}>&quot;Is it working?&quot;</p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "1px", color: "#1a1c1b", textAlign: "center", margin: 0 }}>(SPOILER: NO)</p>
              </div>
            </div>
            <div className="absolute neo-border neo-shadow-sm px-5 py-2.5" style={{ background: "#e8e883", top: -20, right: -20, transform: "rotate(10deg)", fontFamily: "'Work Sans', sans-serif", fontWeight: 700, fontSize: 16, color: "#1a1c1b" }}>
              ?!?
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Solution Bento ─────────────────────────────────────────────────
function SolutionSection() {
  const { ref, visible } = useFadeIn();

  return (
    <section
      id="solution"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative w-full"
      style={{ background: "#beeaf8", borderBottom: "3px solid #1a1c1b", opacity: visible ? 1 : 0, transition: "opacity 0.9s ease 0.15s, transform 0.9s ease 0.15s", transform: visible ? "none" : "translateY(40px)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-16 py-24">
        <div className="flex flex-col items-center gap-5 mb-16">
          <div className="neo-shadow-sm neo-border px-5 py-2.5" style={{ background: "#e8e883", transform: "rotate(2deg)", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: "1.4px", color: "#1a1c1b" }}>
            THE SOLUTION
          </div>
          <h2 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 800, fontSize: "clamp(36px, 4vw, 52px)", color: "#1a1c1b", letterSpacing: "-1px", textAlign: "center", margin: 0 }}>
            Lumin&apos;s AI Skin Analysis
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card 1 — Deep Scan */}
          <div className="lg:col-span-2 neo-shadow neo-border p-7 flex flex-col gap-4" style={{ background: "#f9f9f7" }}>
            <div className="flex items-center gap-2">
              <svg width="27" height="27" viewBox="0 0 27.09 27" fill="none">
                <path d={svgPaths.p18334868} fill="#1A1C1B" />
              </svg>
              <h3 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 800, fontSize: 32, color: "#1a1c1b", margin: 0 }}>Deep Scan Tech</h3>
            </div>
            <p style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 400, fontSize: 16, color: "#1a1c1b", lineHeight: 1.6, margin: 0 }}>
              One selfie. Lumin&apos;s AI reads your face and maps hydration,
              texture, and everyday concerns — instantly.
            </p>
            <div className="neo-border flex items-center justify-center" style={{ background: "#e8e8e6", height: 200 }}>
              <span style={{ fontFamily: "'Epilogue', sans-serif", fontWeight: 400, fontSize: 24, color: "#1a1c1b", opacity: 0.5 }}>Data Visualization</span>
            </div>
          </div>

          {/* Card 2 — Zero BS */}
          <div className="neo-shadow neo-border p-7 flex flex-col justify-between" style={{ background: "#e8e883" }}>
            <div className="flex flex-col gap-4">
              <h3 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 800, fontSize: 30, color: "#1a1c1b", margin: 0 }}>Zero BS Policy</h3>
              <p style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 700, fontSize: 16, color: "#1a1c1b", lineHeight: 1.6, margin: 0 }}>
                We tell you exactly what you need. Nothing more. Nothing less.
              </p>
            </div>
            <div className="flex justify-end pt-8">
              <svg width="55" height="52.5" viewBox="0 0 55 52.5" fill="none">
                <path d={svgPaths.pac72180} fill="#1A1C1B" />
              </svg>
            </div>
          </div>

          {/* Card 3 — Matches */}
          <div className="neo-shadow neo-border p-7 flex flex-col gap-4" style={{ background: "#f9f9f7" }}>
            <h3 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 800, fontSize: 30, color: "#1a1c1b", margin: 0 }}>Precision Matches</h3>
            <p style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 400, fontSize: 16, color: "#1a1c1b", lineHeight: 1.6, margin: 0 }}>
              Products picked from brands you already love, based on your exact scan.
            </p>
            <a href="#beta" className="neo-border mt-auto py-3 w-full inline-block text-center" style={{ background: "#beeaf8", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: "1px", color: "#1a1c1b", cursor: "pointer" }}>
              LEARN MORE
            </a>
          </div>

          {/* Card 4 — Continuous */}
          <div className="lg:col-span-2 neo-shadow neo-border p-7 flex flex-col md:flex-row items-center gap-8" style={{ background: "#f9f9f7" }}>
            <div className="flex flex-col gap-4 flex-1">
              <h3 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 800, fontSize: 30, color: "#1a1c1b", margin: 0 }}>Continuous Tracking</h3>
              <p style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 400, fontSize: 16, color: "#1a1c1b", lineHeight: 1.6, margin: 0 }}>
                Your skin changes with the seasons, stress, and sleep. Lumin
                tracks your progress and adjusts your routine dynamically.
              </p>
            </div>
            <div className="flex-shrink-0">
              <div style={{ transform: "rotate(-5deg)", background: "#e8e883", border: "3px solid #1a1c1b", borderRadius: "9999px", width: 128, height: 128, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15, color: "#1a1c1b", textAlign: "center", letterSpacing: "1px" }}>ALWAYS<br />ADAPTING</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Visual Gallery ─────────────────────────────────────────────────
function GallerySection() {
  const { ref, visible } = useFadeIn();

  const panels = [
    { img: imgNoGender, label: "UNIVERSAL", text: "Skincare has no gender.", color: "#f9f9f7" },
    { img: imgClarity, label: "CLARITY", text: "Clarity Is The New Glow", color: "#e8e883" },
    { img: imgCleanBS, label: "TRUTH", text: "Buzzwords are marketing. Your skin is real.", color: "#beeaf8" },
  ];

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      style={{ borderBottom: "3px solid #1a1c1b", opacity: visible ? 1 : 0, transition: "opacity 1s ease 0.2s", transform: visible ? "none" : "translateY(30px)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3" style={{ minHeight: 480 }}>
        {panels.map((p, i) => (
          <div
            key={i}
            className="relative overflow-hidden group min-h-[320px]"
            style={{ borderRight: i < 2 ? "3px solid #1a1c1b" : undefined, cursor: "pointer" }}
          >
            <img src={p.img} alt={p.text} className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-105" />
            <div
              className="absolute inset-0 flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-all duration-500"
              style={{ background: "rgba(26,28,27,0.35)" }}
            >
              <div className="neo-shadow-sm neo-border px-4 py-2 inline-block self-start mb-3" style={{ background: p.color, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "1.5px", color: "#1a1c1b" }}>
                {p.label}
              </div>
              <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 900, fontSize: 28, color: "#f9f9f7", margin: 0, textShadow: "2px 2px 0 rgba(0,0,0,0.3)" }}>{p.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Glow O'Clock Interactive Liquid ────────────────────────────────
function GlowOClockSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999, active: false });
  const rafRef = useRef<number>(0);
  const { ref: sectionRef, visible } = useFadeIn(0.1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const N = 24;
    const baseAngles = Array.from({ length: N }, (_, i) => (i / N) * Math.PI * 2);

    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const drawBlob = (pts: { x: number; y: number }[]) => {
      const n = pts.length;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const p0 = pts[(i - 1 + n) % n];
        const p1 = pts[i];
        const p2 = pts[(i + 1) % n];
        const p3 = pts[(i + 2) % n];
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        if (i === 0) ctx.moveTo(p1.x, p1.y);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
      }
      ctx.closePath();
    };

    const animate = () => {
      t += 0.006;
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;
      const baseR = Math.min(W, H) * 0.34;

      ctx.clearRect(0, 0, W, H);

      const pts = baseAngles.map((angle, i) => {
        const wave = Math.sin(t * 0.9 + i * 0.65) * 22 + Math.cos(t * 1.3 + i * 1.1) * 14;
        const r = baseR + wave;

        const px = cx + Math.cos(angle) * r;
        const py = cy + Math.sin(angle) * r;

        if (!mouse.current.active) return { x: px, y: py };

        const dx = mouse.current.x - cx;
        const dy = mouse.current.y - cy;
        const md = Math.sqrt(dx * dx + dy * dy);
        const dot = Math.cos(angle) * (dx / (md || 1)) + Math.sin(angle) * (dy / (md || 1));
        const inf = Math.max(0, dot) * Math.max(0, 1 - md / (baseR * 1.8)) * 90;

        const nr = r + inf;
        return { x: cx + Math.cos(angle) * nr, y: cy + Math.sin(angle) * nr };
      });

      ctx.save();
      ctx.shadowColor = "rgba(180, 165, 130, 0.5)";
      ctx.shadowBlur = 40;
      ctx.shadowOffsetX = 20;
      ctx.shadowOffsetY = 30;

      const grad = ctx.createRadialGradient(cx - baseR * 0.25, cy - baseR * 0.2, baseR * 0.05, cx, cy, baseR * 1.2);
      grad.addColorStop(0, "rgba(244, 239, 225, 0.97)");
      grad.addColorStop(0.5, "rgba(234, 228, 210, 0.95)");
      grad.addColorStop(1, "rgba(218, 210, 190, 0.93)");
      ctx.fillStyle = grad;
      drawBlob(pts);
      ctx.fill();
      ctx.restore();

      ctx.save();
      const hl = ctx.createRadialGradient(cx - baseR * 0.35, cy - baseR * 0.3, 0, cx - baseR * 0.3, cy - baseR * 0.25, baseR * 0.55);
      hl.addColorStop(0, "rgba(255,255,255,0.55)");
      hl.addColorStop(0.6, "rgba(255,255,255,0.12)");
      hl.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = hl;
      drawBlob(pts);
      ctx.fill();
      ctx.restore();

      ctx.save();
      const edge = ctx.createRadialGradient(cx, cy, baseR * 0.6, cx, cy, baseR * 1.1);
      edge.addColorStop(0, "rgba(255,255,255,0)");
      edge.addColorStop(1, "rgba(200,195,175,0.25)");
      ctx.fillStyle = edge;
      drawBlob(pts);
      ctx.fill();
      ctx.restore();

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="relative w-full overflow-hidden"
      style={{
        background: "#e8dfd0",
        borderBottom: "3px solid #1a1c1b",
        minHeight: 700,
        opacity: visible ? 1 : 0,
        transition: "opacity 1s ease 0.1s",
      }}
    >
      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">
        <div className="neo-shadow-sm neo-border px-6 py-2.5" style={{ background: "#f9f9f7", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "1.6px", color: "#484739" }}>
          ✦ INTERACTIVE
        </div>
        <p style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 400, fontSize: 14, color: "#484739", margin: 0 }}>
          move your cursor over the liquid
        </p>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-full absolute inset-0"
        style={{ minHeight: 700 }}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top, active: true };
        }}
        onMouseLeave={() => {
          mouse.current = { x: -9999, y: -9999, active: false };
        }}
        onTouchMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const t2 = e.touches[0];
          mouse.current = { x: t2.clientX - r.left, y: t2.clientY - r.top, active: true };
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
        <p style={{ fontFamily: "'Epilogue', sans-serif", fontWeight: 300, fontStyle: "italic", fontSize: "clamp(28px, 4vw, 56px)", color: "#1a1c1b", letterSpacing: "-1px", margin: 0, mixBlendMode: "multiply" }}>
          it&apos;s glow o&apos;clock
        </p>
      </div>

      <div className="absolute bottom-10 right-10 z-20">
        <div className="neo-shadow-sm neo-border px-5 py-3 sticker-float" style={{ background: "#e8e883", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, color: "#1a1c1b", transform: "rotate(3deg)" }}>
          ✨ glow activated
        </div>
      </div>
    </section>
  );
}

// ─── Beta Signup — wired to the REAL Stripe checkout ────────────────
function BetaSection() {
  const { ref, visible } = useFadeIn();
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
      id="beta"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative w-full"
      style={{ background: "#f9f9f7", borderBottom: "3px solid #1a1c1b", opacity: visible ? 1 : 0, transition: "opacity 0.9s ease 0.15s, transform 0.9s ease 0.15s", transform: visible ? "none" : "translateY(40px)" }}
    >
      <div className="max-w-[800px] mx-auto px-6 md:px-16 py-24">
        <div className="relative neo-shadow neo-border p-8 md:p-14" style={{ background: "#f9f9f7" }}>
          <div className="absolute neo-shadow-sm neo-border px-5 py-2.5" style={{ background: "#e8e883", top: -28, left: -16, transform: "rotate(-4deg)", fontFamily: "'Work Sans', sans-serif", fontWeight: 700, fontSize: 18, color: "#1a1c1b" }}>
            🔒 Limited Spots
          </div>

          <div className="flex flex-col gap-4 mb-10">
            <h2 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 800, fontSize: "clamp(28px, 3vw, 36px)", color: "#1a1c1b", textAlign: "center", margin: 0 }}>
              Secure Your Spot in the Beta
            </h2>
            <p style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 400, fontSize: 16, color: "#484739", textAlign: "center", lineHeight: 1.6, margin: 0 }}>
              A fully refundable $1 deposit ensures you&apos;re serious about
              fixing your skin. We only have capacity for 500 early adopters.
            </p>
          </div>

          <form onSubmit={reserve}>
            <div className="flex flex-col gap-2 mb-4">
              <label htmlFor="beta-email" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "1px", color: "#1a1c1b", textTransform: "uppercase" }}>Email Address</label>
              <input
                id="beta-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="neo-border px-5 py-5 w-full outline-none"
                style={{ background: "#f9f9f7", fontFamily: "'Work Sans', sans-serif", fontSize: 16, color: "#1a1c1b" }}
              />
            </div>

            <div className="neo-border p-5 mb-6" style={{ background: "#f4f4f2" }}>
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: "1px", color: "#1a1c1b", textTransform: "uppercase" }}>Beta Access Deposit</span>
                <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 800, fontSize: 18, color: "#1a1c1b" }}>$1.00</span>
              </div>
              <p style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 400, fontSize: 14, color: "#484739", margin: "12px 0 0 0" }}>
                Card details are entered on Stripe&apos;s secure checkout — we
                never see or store them.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="neo-shadow neo-border py-7 w-full mb-4"
              style={{ background: "#e8e883", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: "1px", color: "#1a1c1b", cursor: "pointer", textTransform: "uppercase", opacity: submitting ? 0.6 : 1 }}
            >
              {submitting ? "OPENING SECURE CHECKOUT…" : "PAY $1 & JOIN WAITLIST"}
            </button>
            {error && (
              <p role="alert" style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 700, fontSize: 14, color: "#ba1a1a", textAlign: "center", margin: "0 0 12px 0" }}>
                {error}
              </p>
            )}
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, color: "#484739", textAlign: "center", opacity: 0.7, margin: 0 }}>
              Secure payment via Stripe. Fully refundable.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ─────────────────────────────────────────────────────────
function NewFooter() {
  return (
    <footer className="flex flex-col md:flex-row gap-6 items-center justify-between px-6 md:px-16 py-12" style={{ background: "#beeaf8", borderTop: "3px solid #1a1c1b" }}>
      <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 900, fontSize: 30, color: "#001f27" }}>Lumin</span>
      <div className="flex gap-6">
        {["PRIVACY", "TERMS", "GITHUB", "DISCORD"].map((l) => (
          <span key={l} style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: "1.6px", color: "#001f27", cursor: "pointer" }}>{l}</span>
        ))}
      </div>
      <span style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "1.6px", color: "#001f27" }}>© 2026 LUMIN. BUILT FOR THE BOLD.</span>
    </footer>
  );
}

// ─── Root ───────────────────────────────────────────────────────────
export default function NewLanding() {
  return (
    <div style={{ background: "#f9f9f7" }}>
      <Nav />
      <HeroSection />
      <DropperSection />
      <ProblemSection />
      <SolutionSection />
      <GallerySection />
      <GlowOClockSection />
      <BetaSection />
      <NewFooter />
    </div>
  );
}
