"use client";

import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { UserControl } from "@/components/user-control";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export const Navbar = () => {
  const isScrolled = useScroll();
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent backdrop-blur-md",
        isScrolled &&
          "glass border-[rgba(186,85,255,0.12)] shadow-xl shadow-[#b96aff]/10"
      )}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo Section */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative">
              <Image
                src="/logo.png"
                alt="zync"
                width={32}
                height={32}
                className="rounded-full shadow-lg shadow-[#00fff0]/30 transition-all duration-300 group-hover:shadow-[#b96aff]/50 group-hover:scale-110"
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-[#b96aff]/20 to-[#00fff0]/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-all duration-300" />
            </div>
            <span className="text-xl font-bold text-[#00fff0] group-hover:text-white transition-colors duration-300">
              zync
            </span>
          </Link>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            <SignedOut>
              <div className="flex gap-2">
                <SignUpButton mode="modal">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[rgba(186,85,255,0.12)] text-[#b96aff] hover:bg-[#b96aff]/10 hover:text-[#b96aff] transition-all duration-300"
                  >
                    Sign Up
                  </Button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-[#b96aff] to-[#00fff0] text-black hover:from-[#00fff0] hover:to-[#b96aff] shadow-lg shadow-[#00fff0]/40 hover:shadow-[#b96aff]/60 transition-all duration-300 font-semibold"
                  >
                    Sign In
                  </Button>
                </SignInButton>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-4">
                <Link
                  href="/pricing"
                  className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:bg-[#1a1a1a] border border-transparent hover:border-[rgba(186,85,255,0.12)]"
                >
                  <div className="flex items-center gap-2 text-sm font-medium text-neutral-400 group-hover:text-[#b96aff] transition-colors">
                    <Sparkles className="w-4 h-4" />
                    <span>Pricing</span>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#b96aff]/10 to-[#00fff0]/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10" />
                </Link>
                <UserControl showName />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
