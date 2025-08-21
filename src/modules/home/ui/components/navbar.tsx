"use client";

import Link from "next/link";
import Image from "next/image";
import { SignedIn } from "@clerk/nextjs";
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
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 border border-transparent backdrop-blur-xl rounded-2xl w-[90%] max-w-2xl glass",
        isScrolled && "border-[rgba(251,191,36,0.12)] shadow-xl shadow-[#fbbf24]/10"
      )}
    >
      <div className="px-4 sm:px-6">
        <div className="flex justify-between items-center h-12">
          
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative">
              <Image
                src="/logo.png"
                alt="zync"
                width={32}
                height={32}
                className="rounded-full shadow-lg shadow-[#00fff0]/30 transition-all duration-300 group-hover:shadow-[#fbbf24]/50 group-hover:scale-110"
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-[#fbbf24]/20 to-[#00fff0]/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-all duration-300" />
            </div>
            <span className="text-xl font-bold text-[#00fff0] group-hover:text-white transition-colors duration-300">
              zync
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <SignedIn>
              <div className="flex items-center gap-4">
                <Link
                  href="/pricing"
                  className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:bg-[#1a1a1a] border border-transparent hover:border-[rgba(251,191,36,0.12)]"
                >
                  <div className="flex items-center gap-2 text-sm font-medium text-neutral-400 group-hover:text-[#fbbf24] transition-colors">
                    <Sparkles className="w-4 h-4" />
                    <span>Pricing</span>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#fbbf24]/10 to-[#00fff0]/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10" />
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
