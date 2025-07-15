"use client";

import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { SignUpButton, SignedOut, SignedIn } from "@clerk/nextjs";
import { useRef, useEffect } from "react";

export const Hero = () => {
  // Parallax effect for floating elements
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      mouseX.set((e.clientX - left - width / 2) / width);
      mouseY.set((e.clientY - top - height / 2) / height);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Floating element transforms
  const float1 = {
    x: useTransform(mouseX, [ -1, 1 ], [ -30, 30 ]),
    y: useTransform(mouseY, [ -1, 1 ], [ -20, 20 ]),
  };
  const float2 = {
    x: useTransform(mouseX, [ -1, 1 ], [ 20, -20 ]),
    y: useTransform(mouseY, [ -1, 1 ], [ 30, -30 ]),
  };
  const float3 = {
    x: useTransform(mouseX, [ -1, 1 ], [ 10, -10 ]),
    y: useTransform(mouseY, [ -1, 1 ], [ -15, 15 ]),
  };
  const float4 = {
    x: useTransform(mouseX, [ -1, 1 ], [ -15, 15 ]),
    y: useTransform(mouseY, [ -1, 1 ], [ 10, -10 ]),
  };

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-[#0a0a0a]">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-black/80" />
      <div className="absolute inset-0 pointer-events-none">
        {/* Glassy neon overlays */}
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[40vw] rounded-full bg-gradient-to-br from-[#b96aff]/20 via-[#00fff0]/20 to-[#fff]/10 blur-3xl opacity-60" />
        <div className="absolute right-0 bottom-0 w-1/3 h-1/3 bg-gradient-to-tr from-[#b96aff]/20 to-transparent blur-2xl opacity-40" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Enhanced Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#1a1a1a] via-[#232323] to-[#1a1a1a] border border-[rgba(186,85,255,0.12)] mb-8 shadow-2xl animate-pulse hover:scale-105 hover:shadow-[#b96aff]/30 transition-all duration-300 cursor-pointer glass"
            whileHover={{ scale: 1.08 }}
          >
            <Sparkles className="w-5 h-5 text-[#b96aff] animate-pulse" />
            <span className="text-base font-semibold bg-gradient-to-r from-[#b96aff] via-[#00fff0] to-[#fff] bg-clip-text text-transparent animate-gradient">
              AI-Powered Web Development ✨
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 drop-shadow-lg"
          >
            Build{" "}
            <span className="bg-gradient-to-r from-[#b96aff] via-[#00fff0] to-[#fff] bg-clip-text text-transparent animate-gradient drop-shadow-md">
              Web Apps
            </span>
            <br />
            Just by{" "}
            <span className="bg-gradient-to-r from-[#00fff0] via-[#b96aff] to-[#fff] bg-clip-text text-transparent animate-gradient">
              Describing Them
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-xl md:text-2xl text-neutral-400 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Transform your ideas into fully functional web applications with AI-driven code generation, 
            real-time collaboration, and sandboxed execution environments.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <SignedOut>
              <SignUpButton mode="modal">
                <Button 
                  size="lg" 
                  className="bg-[#00fff0] text-black px-10 py-6 text-lg font-semibold group shadow-xl shadow-[#00fff0]/40 border-2 border-transparent hover:border-[#b96aff] hover:shadow-2xl hover:shadow-[#b96aff]/60 transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00fff0] focus:ring-offset-2 animate-glow"
                >
                  Start Building Free ✨
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Button asChild size="lg" className="bg-[#00fff0] text-black px-10 py-6 text-lg font-semibold group shadow-xl shadow-[#00fff0]/40 border-2 border-transparent hover:border-[#b96aff] hover:shadow-2xl hover:shadow-[#b96aff]/60 transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00fff0] focus:ring-offset-2 animate-glow">
                <Link href="/dashboard">
                  Go to Dashboard 🚀
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </SignedIn>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="px-10 py-6 text-lg font-semibold border-2 border-[rgba(186,85,255,0.12)] hover:bg-gradient-to-r hover:from-[#1a1a1a] hover:to-[#232323] hover:border-[rgba(186,85,255,0.32)] transition-all duration-300 animate-shimmer glass text-white"
              asChild
            >
              <Link href="#demo">
                Watch Demo 🎬
              </Link>
            </Button>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-16 flex flex-col items-center gap-4"
          >
            <p className="text-sm text-neutral-500">Trusted by developers worldwide</p>
            <div className="flex items-center gap-8 opacity-80">
              {/* Add company logos here */}
              <div className="text-2xl font-bold bg-gradient-to-r from-[#b96aff] via-[#00fff0] to-[#fff] bg-clip-text text-transparent animate-gradient">Next.js</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-[#b96aff] via-[#00fff0] to-[#fff] bg-clip-text text-transparent animate-gradient">React</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-[#b96aff] via-[#00fff0] to-[#fff] bg-clip-text text-transparent animate-gradient">TypeScript</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-[#b96aff] via-[#00fff0] to-[#fff] bg-clip-text text-transparent animate-gradient">Tailwind</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced Floating Elements with Parallax - neon glass orbs */}
      <motion.div
        style={float1}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute top-1/4 left-1/4 w-8 h-8 bg-gradient-to-r from-[#b96aff] to-[#00fff0] rounded-full animate-pulse shadow-2xl blur-[2px] glass"
      />
      <motion.div
        style={float2}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1.7 }}
        className="absolute top-1/3 right-1/4 w-6 h-6 bg-gradient-to-r from-[#00fff0] to-[#b96aff] rounded-full animate-pulse shadow-2xl blur-[2px] glass"
      />
      <motion.div
        style={float3}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1.9 }}
        className="absolute bottom-1/3 left-1/3 w-10 h-10 bg-gradient-to-r from-[#fff] to-[#b96aff] rounded-full animate-pulse shadow-2xl blur-[2px] glass"
      />
      <motion.div
        style={float4}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 2.1 }}
        className="absolute top-2/3 right-1/3 w-5 h-5 bg-gradient-to-r from-[#b96aff] to-[#fff] rounded-full animate-pulse shadow-2xl blur-[2px] glass"
      />
    </section>
  );
};

// Add shimmer animation to globals.css if not present
