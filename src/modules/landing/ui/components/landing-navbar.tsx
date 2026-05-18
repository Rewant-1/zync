"use client";

import Link from "next/link";
import Image from "next/image";
import {
  SignedOut,
  SignInButton,
  SignUpButton,
  ClerkLoading,
  ClerkLoaded,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export const LandingNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for background opacity
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <m.nav
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 rounded-2xl w-[92%] max-w-2xl transition-all duration-300 ${
          scrolled
            ? "bg-black/80 backdrop-blur-xl border border-white/[0.08] shadow-lg shadow-black/20"
            : "bg-black/40 backdrop-blur-md border border-white/[0.05]"
        }`}
      >
        <div className="px-4 sm:px-5">
          <div className="flex justify-between items-center h-12">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/logo.png"
                alt="zync"
                width={28}
                height={28}
                className="rounded-full transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-lg font-bold text-white">
                zync
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden sm:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 rounded-lg text-sm text-neutral-400 hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Auth */}
            <div className="hidden sm:flex items-center gap-2">
              <ClerkLoading>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled
                  className="text-neutral-500 text-xs px-3 h-8"
                >
                  Sign In
                </Button>
              </ClerkLoading>
              <ClerkLoaded>
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-neutral-400 hover:text-white text-xs px-3 h-8"
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-[#ffc107] to-[#00fff0] text-black hover:from-[#00fff0] hover:to-[#ffc107] font-semibold px-4 h-8 rounded-lg text-xs shadow-sm"
                    >
                      Get Started
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </SignUpButton>
                </SignedOut>
              </ClerkLoaded>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="sm:hidden w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <m.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="sm:hidden border-t border-white/[0.06] overflow-hidden"
            >
              <div className="px-4 py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-3 py-2 rounded-lg text-sm text-neutral-400 hover:text-white hover:bg-white/[0.04] transition-all duration-200"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-2 border-t border-white/[0.06] flex gap-2">
                  <ClerkLoaded>
                    <SignedOut>
                      <SignInButton mode="modal">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 text-neutral-400 text-xs h-9"
                        >
                          Sign In
                        </Button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <Button
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-[#ffc107] to-[#00fff0] text-black font-semibold text-xs h-9 rounded-lg"
                        >
                          Get Started
                        </Button>
                      </SignUpButton>
                    </SignedOut>
                  </ClerkLoaded>
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </m.nav>
    </LazyMotion>
  );
};
