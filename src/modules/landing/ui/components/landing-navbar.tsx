"use client";

import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { UserControl } from "@/components/user-control";
import { motion } from "framer-motion";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#demo", label: "Demo" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export const LandingNavbar = () => {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-[rgba(186,85,255,0.12)] shadow-2xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo area */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/logo.png" alt="zync" width={40} height={40} className="rounded-full" />
            <span className="text-2xl font-extrabold bg-gradient-to-r from-[#b96aff] via-[#00fff0] to-[#fff] bg-clip-text text-transparent drop-shadow-md tracking-tight group-hover:tracking-widest transition-all duration-300 animate-gradient">
              zync
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-lg font-medium text-neutral-300 hover:text-white transition-colors px-2 py-1 group"
              >
                <span className="relative z-10 animate-gradient bg-gradient-to-r from-[#b96aff] via-[#00fff0] to-[#fff] bg-clip-text text-transparent group-hover:text-white">
                  {link.label}
                </span>
                <motion.span
                  layoutId="navbar-underline"
                  className="absolute left-0 right-0 -bottom-1 h-0.5 rounded bg-gradient-to-r from-[#b96aff] via-[#00fff0] to-[#fff] opacity-0 group-hover:opacity-100 transition-all duration-300"
                  whileHover={{ opacity: 1, scaleX: 1.1 }}
                />
              </Link>
            ))}
          </div>

          {/* Auth/CTA */}
          <div className="flex items-center gap-2">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm" className="hover:bg-gradient-to-r hover:from-[#1a1a1a] hover:to-[#232323] text-base font-semibold text-neutral-300 hover:text-white transition-all duration-200">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm" className="bg-[#00fff0] text-black font-semibold shadow-lg shadow-[#00fff0]/40 border-2 border-transparent hover:border-[#b96aff] hover:shadow-xl hover:shadow-[#b96aff]/60 transition-all duration-300 rounded-lg px-5 py-2 animate-glow">
                  Get Started ✨
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Button asChild size="sm" className="bg-gradient-to-r from-[#b96aff] via-[#00fff0] to-[#fff] text-black font-semibold shadow-lg shadow-[#b96aff]/25 hover:shadow-xl hover:shadow-[#00fff0]/30 transition-all duration-300 border-0 px-5 py-2 text-base animate-shimmer">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <UserControl />
            </SignedIn>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
