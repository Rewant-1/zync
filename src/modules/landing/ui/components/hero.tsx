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

import { motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import { SignUpButton, SignedOut, SignedIn, ClerkLoading } from "@clerk/nextjs";
import { useRef, useEffect, useState } from "react";

export const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [showGrid, setShowGrid] = useState(false);

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

  // Defer ChromeGrid mounting until idle to avoid competing with critical paint
  useEffect(() => {
    const schedule = (cb: () => void) => {
      const w = window as unknown as {
        requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
        cancelIdleCallback?: (id: number) => void;
      };
      if (typeof w.requestIdleCallback === "function") {
        const id = w.requestIdleCallback(cb, { timeout: 500 });
        return () => {
          if (typeof w.cancelIdleCallback === "function") w.cancelIdleCallback(id);
        };
      }
      const id = setTimeout(cb, 150);
      return () => clearTimeout(id);
    };
    const cancel = schedule(() => setShowGrid(true));
    return () => {
      if (typeof cancel === "function") cancel();
    };
  }, []);

  const float1 = {
    x: useTransform(mouseX, [-1, 1], [-30, 30]),
    y: useTransform(mouseY, [-1, 1], [-20, 20]),
  };
  const float2 = {
    x: useTransform(mouseX, [-1, 1], [20, -20]),
    y: useTransform(mouseY, [-1, 1], [30, -30]),
  };
  const float3 = {
    x: useTransform(mouseX, [-1, 1], [10, -10]),
    y: useTransform(mouseY, [-1, 1], [-15, 15]),
  };
  const float4 = {
    x: useTransform(mouseX, [-1, 1], [-15, 15]),
    y: useTransform(mouseY, [-1, 1], [10, -10]),
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0">
        {showGrid ? <ChromeGrid /> : <div className="w-full h-full bg-black" />}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-black/40 backdrop-blur-sm border border-[#ffc107]/20 mb-3 shadow-2xl"
          >
            <Sparkles className="w-5 h-5 text-[#ffc107]" />
            <span className="text-base font-semibold text-white">
              AI-Powered Web Development
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-white">
            Build{" "}
            <span className="text-[#ffc107] drop-shadow-md">Web Apps</span>
            <br />
            Just by <span className="text-[#00fff0]">Describing Them</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your ideas into fully functional web apps on the go with
            AI-driven code generation and sandboxed execution environments.
          </p>

          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {/* Fast fallback while Clerk loads auth state */}
            <ClerkLoading>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-[#ffc107] to-[#00fff0] text-black px-10 py-6 text-lg font-semibold hover:from-[#00fff0] hover:to-[#ffc107] shadow-lg shadow-[#ffc107]/40 hover:shadow-[#00fff0]/60 transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00fff0] focus:ring-offset-2"
              >
                <Link href="/sign-up">Start Building Free</Link>
              </Button>
            </ClerkLoading>
            <SignedOut>
              <SignUpButton mode="modal">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#ffc107] to-[#00fff0] text-black px-10 py-6 text-lg font-semibold hover:from-[#00fff0] hover:to-[#ffc107] shadow-lg shadow-[#ffc107]/40 hover:shadow-[#00fff0]/60 transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00fff0] focus:ring-offset-2"
                >
                  Start Building Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-[#ffc107] to-[#00fff0] text-black px-10 py-6 text-lg font-semibold hover:from-[#00fff0] hover:to-[#ffc107] shadow-lg shadow-[#ffc107]/40 hover:shadow-[#00fff0]/60 transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00fff0] focus:ring-offset-2"
              >
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </SignedIn>

            <Button
              variant="outline"
              size="lg"
              className="px-10 py-6 text-lg font-semibold border-2 border-[#ffc107]/20 hover:bg-[#ffc107]/10 hover:border-[#ffc107]/40 transition-all duration-300 animate-shimmer text-white rounded-xl group"
              asChild
            >
              <Link
                href="https://github.com/Rewant-1/zync"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Star className="mr-2 w-5 h-5 group-hover:fill-[#ffc107] transition-colors duration-300" />
                Star us on GitHub
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 flex flex-col items-center gap-4"
          >
            <p className="text-sm text-gray-400">
              Trusted by developers worldwide
            </p>
            <div className="flex items-center gap-8 opacity-80">
              <div className="text-2xl font-bold text-[#ffc107]">Next.js</div>
              <div className="text-2xl font-bold text-[#00fff0]">React</div>
              <div className="text-2xl font-bold text-[#ffc107]">
                TypeScript
              </div>
              <div className="text-2xl font-bold text-[#00fff0]">Tailwind</div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        style={float1}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute top-1/4 left-1/4 w-8 h-8 bg-gradient-to-r from-[#ffc107] to-[#00fff0] rounded-full animate-pulse shadow-2xl blur-[2px] opacity-60"
      />
      <motion.div
        style={float2}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1.7 }}
        className="absolute top-1/3 right-1/4 w-6 h-6 bg-gradient-to-r from-[#00fff0] to-[#ffc107] rounded-full animate-pulse shadow-2xl blur-[2px] opacity-60"
      />
      <motion.div
        style={float3}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1.9 }}
        className="absolute bottom-1/3 left-1/3 w-10 h-10 bg-gradient-to-r from-[#fff] to-[#ffc107] rounded-full animate-pulse shadow-2xl blur-[2px] opacity-60"
      />
      <motion.div
        style={float4}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 2.1 }}
        className="absolute top-2/3 right-1/3 w-5 h-5 bg-gradient-to-r from-[#ffc107] to-[#fff] rounded-full animate-pulse shadow-2xl blur-[2px] opacity-60"
      />
    </section>
  );
};
