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
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export const LandingNavbar = () => {
  return (
    <>
      <motion.nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 glass border border-[rgba(251,191,36,0.12)] shadow-lg backdrop-blur-xl rounded-2xl w-[90%] max-w-2xl">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between items-center h-12">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Image
                  src="/logo.png"
                  alt="zync"
                  width={32}
                  height={32}
                  className="rounded-full shadow-lg shadow-[#00fff0]/30 transition-all duration-300 group-hover:shadow-[#ffc107]/50 group-hover:scale-110"
                />
                <div className="absolute -inset-1 bg-gradient-to-r from-[#ffc107]/20 to-[#00fff0]/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-all duration-300" />
              </div>
              <span className="text-xl font-bold text-[#00fff0] group-hover:text-white transition-colors duration-300">
                zync
              </span>
            </Link>

            <div className="flex items-center gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative group px-3 py-1.5 rounded-lg transition-all duration-300 hover:bg-[#1a1a1a] border border-transparent hover:border-[rgba(251,191,36,0.12)]"
                >
                  <span className="text-sm font-medium text-neutral-400 group-hover:text-[#ffc107] transition-colors">
                    {link.label}
                  </span>
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#ffc107]/10 to-[#00fff0]/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10" />
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <ClerkLoading>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled
                  className="text-neutral-400 text-xs px-3 py-1"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  disabled
                  className="bg-neutral-800 text-black font-semibold px-3 py-1 rounded-lg text-xs"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Get Started
                </Button>
              </ClerkLoading>
              <ClerkLoaded>
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-neutral-400 hover:text-white hover:bg-[#1a1a1a] transition-all duration-300 border border-transparent hover:border-[rgba(251,191,36,0.12)] text-xs px-3 py-1"
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-[#ffc107] to-[#00fff0] text-black hover:from-[#00fff0] hover:to-[#ffc107] shadow-lg shadow-[#ffc107]/40 hover:shadow-[#00fff0]/60 transition-all duration-300 font-semibold px-3 py-1 rounded-lg text-xs"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Get Started
                    </Button>
                  </SignUpButton>
                </SignedOut>
              </ClerkLoaded>
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  );
};
