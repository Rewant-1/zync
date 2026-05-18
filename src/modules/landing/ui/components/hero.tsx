"use client";

import dynamic from "next/dynamic";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
const ChromeGrid = dynamic(
  () => import("@/components/ui/chrome-grid").then((mod) => mod.ChromeGrid),
  {
    ssr: false,
    loading: () => <div className="w-full h-full bg-black" />,
  }
);

import { LazyMotion, domAnimation, m } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { SignUpButton, SignedOut, SignedIn, ClerkLoading } from "@clerk/nextjs";
import { forwardRef } from "react";

// ForwardRef wrapper that strips Clerk's `asChild` prop before it hits the DOM
const AuthButton = forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<"button"> & { asChild?: boolean }>(
  ({ asChild, children, className, ...props }, ref) => (
    <button ref={ref} className={className} {...props}>{children}</button>
  )
);
AuthButton.displayName = "AuthButton";

export const Hero = () => {
  // Ultra-smooth spring transition for staggered reveals
  const springTransition = {
    type: "spring" as const,
    stiffness: 40,
    damping: 20,
    mass: 1,
  };

  return (
    <LazyMotion features={domAnimation}>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black selection:bg-white/20 selection:text-white">
        {/* Sleek Chrome Grid Background */}
        <div className="absolute inset-0 z-0">
          <ChromeGrid />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <div className="max-w-4xl mx-auto">
            
            {/* Premium Badge */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...springTransition, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.02] backdrop-blur-md border border-white/[0.06] mb-8 hover:bg-white/[0.04] transition-colors duration-500 cursor-default"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#00fff0] animate-pulse" />
              <span className="text-sm font-medium text-neutral-300 tracking-wide">
                AI Product Builder
              </span>
            </m.div>

            {/* Massive Typography Headline */}
            <m.h1
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...springTransition, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 text-white leading-[1.1]"
            >
              <span className="block text-white/90">Think it.</span>
              <span className="block bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent pb-2">
                Build it instantly.
              </span>
            </m.h1>

            {/* Subtitle */}
            <m.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...springTransition, delay: 0.3 }}
              className="text-lg md:text-xl text-neutral-400/80 mb-12 max-w-2xl mx-auto leading-relaxed font-light tracking-wide"
            >
              A premium, sandboxed environment that transforms plain text into production-ready React applications with zero friction.
            </m.p>

            {/* Sleek CTA Buttons */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...springTransition, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-5 justify-center items-center"
            >
              <ClerkLoading>
                <Link
                  href="/sign-up"
                  className={cn(buttonVariants({ size: "lg" }), "group relative overflow-hidden px-8 py-6 h-auto text-base font-semibold bg-transparent text-white border border-white/[0.1] hover:border-white/[0.2] transition-all duration-500 rounded-2xl w-full sm:w-auto hover:bg-white/[0.02]")}
                >
                  <div className="absolute inset-0 animate-shimmer" />
                  <span className="relative z-10 flex items-center">
                    Start Building
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </ClerkLoading>
              <SignedOut>
                <SignUpButton mode="modal" asChild>
                  <AuthButton
                    className={cn(buttonVariants({ size: "lg" }), "group relative overflow-hidden px-8 py-6 h-auto text-base font-semibold bg-transparent text-white border border-white/[0.1] hover:border-white/[0.2] transition-all duration-500 rounded-2xl w-full sm:w-auto hover:bg-white/[0.02]")}
                  >
                    <div className="absolute inset-0 animate-shimmer" />
                    <span className="relative z-10 flex items-center">
                      Start Building
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </AuthButton>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard"
                  className={cn(buttonVariants({ size: "lg" }), "group relative overflow-hidden px-8 py-6 h-auto text-base font-semibold bg-transparent text-white border border-white/[0.1] hover:border-white/[0.2] transition-all duration-500 rounded-2xl w-full sm:w-auto hover:bg-white/[0.02]")}
                >
                  <div className="absolute inset-0 animate-shimmer" />
                  <span className="relative z-10 flex items-center">
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </SignedIn>

              <Link
                href="https://github.com/Rewant-1/zync"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "px-8 py-6 h-auto text-base font-medium bg-transparent border border-white/[0.1] hover:border-white/[0.2] hover:bg-white/[0.03] text-neutral-300 hover:text-white transition-all duration-500 rounded-2xl w-full sm:w-auto")}
              >
                <Star className="mr-2 w-4 h-4 opacity-70" />
                Star on GitHub
              </Link>
            </m.div>

            {/* Premium Minimal Stats */}
            <m.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ ...springTransition, delay: 0.6 }}
              className="mt-20 flex items-center justify-center gap-10 md:gap-16 pt-10 border-t border-white/[0.04]"
            >
              {[
                { value: "100%", label: "Open Source" },
                { value: "6+", label: "Verified AI Models" },
                { value: "Zero", label: "Setup Required" },
              ].map((stat, i) => (
                <div key={i} className="text-center group cursor-default">
                  <div className="text-xl md:text-2xl font-semibold text-white/90 group-hover:text-white transition-colors duration-500 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-neutral-500 mt-1.5 font-medium tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </m.div>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
};
