"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { Magnetic } from "@/components/Magnetic";

export function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 1 }}
      className="fixed inset-x-0 top-10 z-50 md:top-14"
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <Magnetic strength={0.25}>
          <Link href="/" aria-label="Lumin home" data-cursor="pointer">
            <Logo />
          </Link>
        </Magnetic>
        <Magnetic strength={0.4}>
          <a
            href="#waitlist"
            data-cursor="pointer"
            className="btn-void !px-5 !py-2.5 !text-[13px] backdrop-blur-sm"
          >
            Join the waitlist
          </a>
        </Magnetic>
      </nav>
    </motion.header>
  );
}
