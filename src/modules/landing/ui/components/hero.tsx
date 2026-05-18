"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
const ChromeGrid = dynamic(
  () => import("@/components/ui/chrome-grid").then((mod) => mod.ChromeGrid),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.06),transparent_70%)]" />
    ),
  }
);

import { LazyMotion, domAnimation, m, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight, Star, Terminal, Layers, Braces, Rocket } from "lucide-react";
import Link from "next/link";
import { SignUpButton, SignedOut, SignedIn, ClerkLoading } from "@clerk/nextjs";
import { useRef, useEffect, useState, useCallback } from "react";

// Words to cycle through in the typewriter effect
const TYPED_WORDS = ["Web Apps", "Dashboards", "Landing Pages", "E-Commerce", "Portfolios"];

// Floating code snippet cards for parallax effect
const CODE_SNIPPETS = [
  { code: "<Button />", icon: Braces, pos: "top-[22%] left-[12%]", delay: 1.5 },
  { code: "npm run dev", icon: Terminal, pos: "top-[30%] right-[14%]", delay: 1.8 },
  { code: "export default", icon: Layers, pos: "bottom-[28%] left-[18%]", delay: 2.0 },
  { code: "deploy →", icon: Rocket, pos: "top-[60%] right-[16%]", delay: 2.2 },
];

export const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [showGrid, setShowGrid] = useState(false);

  // Typewriter state
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayText, setDisplayText] = useState("");

  // Typewriter effect
  useEffect(() => {
    const currentWord = TYPED_WORDS[wordIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentWord.slice(0, charIndex + 1));
        setCharIndex(prev => prev + 1);
        
        if (charIndex + 1 === currentWord.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayText(currentWord.slice(0, charIndex - 1));
        setCharIndex(prev => prev - 1);
        
        if (charIndex - 1 === 0) {
          setIsDeleting(false);
          setWordIndex(prev => (prev + 1) % TYPED_WORDS.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - left - width / 2) / width);
    mouseY.set((e.clientY - top - height / 2) / height);
  }, [mouseX, mouseY]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    const schedule = (cb: () => void) => {
      const w = window as unknown as {
        requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
        cancelIdleCallback?: (id: number) => void;
      };
      if (typeof w.requestIdleCallback === "function") {
        const id = w.requestIdleCallback(cb, { timeout: 500 });
        return () => { if (typeof w.cancelIdleCallback === "function") w.cancelIdleCallback(id); };
      }
      const id = setTimeout(cb, 150);
      return () => clearTimeout(id);
    };
    const cancel = schedule(() => setShowGrid(true));
    return () => { if (typeof cancel === "function") cancel(); };
  }, []);

  // Parallax transforms for floating elements
  const floats = [
    { x: useTransform(mouseX, [-1, 1], [-30, 30]), y: useTransform(mouseY, [-1, 1], [-20, 20]) },
    { x: useTransform(mouseX, [-1, 1], [20, -20]), y: useTransform(mouseY, [-1, 1], [30, -30]) },
    { x: useTransform(mouseX, [-1, 1], [10, -10]), y: useTransform(mouseY, [-1, 1], [-15, 15]) },
    { x: useTransform(mouseX, [-1, 1], [-15, 15]), y: useTransform(mouseY, [-1, 1], [10, -10]) },
  ];

  return (
    <LazyMotion features={domAnimation}>
      <section
        ref={ref}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* 3D Background */}
        <div className="absolute inset-0">
          {showGrid ? <ChromeGrid /> : <div className="w-full h-full bg-black" />}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            
            {/* Badge */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] mb-6"
            >
              <div className="w-2 h-2 rounded-full bg-[#00fff0] animate-pulse" />
              <span className="text-sm font-medium text-neutral-300 tracking-wide">
                Open Source AI Builder
              </span>
            </m.div>

            {/* Heading with typewriter */}
            <m.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-white"
            >
              Describe it. <br className="hidden sm:block" />
              Build{" "}
              <span className="relative inline-block min-w-[200px] md:min-w-[300px]">
                <span className="bg-gradient-to-r from-[#ffc107] via-[#ffdb4d] to-[#00fff0] bg-clip-text text-transparent">
                  {displayText}
                </span>
                <span className="text-[#00fff0] animate-blink ml-0.5">|</span>
              </span>
            </m.h1>

            {/* Subtitle */}
            <m.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Turn plain English into production-ready React apps with live 
              sandboxed previews. Powered by multi-model AI fallback.
            </m.p>

            {/* CTA Buttons */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <ClerkLoading>
                <Button
                  asChild
                  size="lg"
                  className="px-8 py-6 text-base font-semibold bg-gradient-to-r from-[#ffc107] to-[#00fff0] text-black hover:from-[#00fff0] hover:to-[#ffc107] shadow-lg shadow-[#ffc107]/30 hover:shadow-[#00fff0]/40 transition-all duration-300 rounded-xl"
                >
                  <Link href="/sign-up">
                    Start Building Free
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </ClerkLoading>
              <SignedOut>
                <SignUpButton mode="modal">
                  <Button
                    size="lg"
                    className="px-8 py-6 text-base font-semibold bg-gradient-to-r from-[#ffc107] to-[#00fff0] text-black hover:from-[#00fff0] hover:to-[#ffc107] shadow-lg shadow-[#ffc107]/30 hover:shadow-[#00fff0]/40 transition-all duration-300 rounded-xl"
                  >
                    Start Building Free
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Button
                  asChild
                  size="lg"
                  className="px-8 py-6 text-base font-semibold bg-gradient-to-r from-[#ffc107] to-[#00fff0] text-black hover:from-[#00fff0] hover:to-[#ffc107] shadow-lg shadow-[#ffc107]/30 hover:shadow-[#00fff0]/40 transition-all duration-300 rounded-xl"
                >
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </SignedIn>

              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-base font-semibold border border-white/10 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300 text-white rounded-xl"
                asChild
              >
                <Link
                  href="https://github.com/Rewant-1/zync"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Star className="mr-2 w-4 h-4 group-hover:fill-[#ffc107] transition-colors duration-300" />
                  Star on GitHub
                </Link>
              </Button>
            </m.div>

            {/* Stats */}
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mt-16 flex items-center justify-center gap-8 md:gap-12"
            >
              {[
                { value: "Free", label: "& Open Source" },
                { value: "6+", label: "AI Models" },
                { value: "∞", label: "Possibilities" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#ffc107] to-[#00fff0] bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-neutral-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </m.div>
          </div>
        </div>

        {/* Floating code snippet cards */}
        {CODE_SNIPPETS.map((snippet, i) => {
          const Icon = snippet.icon;
          return (
            <m.div
              key={i}
              style={floats[i]}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: snippet.delay }}
              className={`absolute ${snippet.pos} hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl glass-subtle animate-float`}
              style-delay={`${i * 0.5}s`}
            >
              <Icon className="w-3.5 h-3.5 text-[#00fff0]" />
              <span className="text-xs font-mono text-neutral-400">{snippet.code}</span>
            </m.div>
          );
        })}
      </section>
    </LazyMotion>
  );
};
