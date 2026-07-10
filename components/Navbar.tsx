"use client";

import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "#world", label: "Brand World" },
  { href: "#configure", label: "Your Ritual" },
  { href: "#science", label: "The Science" },
];

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-shadow duration-300",
        scrolled ? "glass shadow-ambient" : "bg-transparent border-b border-transparent"
      )}
    >
      <nav className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 md:px-8">
        <Link href="/" aria-label="Lumin home">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="font-body text-body-md text-on-surface-variant transition-colors hover:text-primary"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a href="#configure" className="btn-primary !px-5 !py-2.5 text-sm">
          Join the waitlist
        </a>
      </nav>
    </motion.header>
  );
}
