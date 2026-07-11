"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";

export function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 1 }}
      className="fixed inset-x-0 top-10 z-50 md:top-14"
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <Link href="/" aria-label="Lumin home">
          <Logo />
        </Link>
        <a
          href="#waitlist"
          className="btn-void !px-5 !py-2.5 !text-[13px] backdrop-blur-sm"
        >
          Join the waitlist
        </a>
      </nav>
    </motion.header>
  );
}
