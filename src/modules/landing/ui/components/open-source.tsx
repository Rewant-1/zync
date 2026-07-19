"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import Link from "next/link";
import { GitFork, Star, Terminal } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const springTransition = {
  type: "spring" as const,
  stiffness: 40,
  damping: 20,
};

export const OpenSource = () => {
  return (
    <LazyMotion features={domAnimation}>
      <section className="relative py-20 bg-black">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={springTransition}
          className="max-w-4xl mx-auto px-4 sm:px-6"
        >
          <div className="rounded-[2.5rem] border border-white/[0.04] bg-[#050505] p-10 md:p-16 relative overflow-hidden">
            {/* Ultra-subtle glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.02),transparent_70%)]" />

            <div className="relative z-10">
              <div className="text-center mb-12">
                <h3 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4 text-white">
                  Built in the <span className="text-white/40">Open</span>
                </h3>
                <p className="text-lg text-neutral-400 font-light max-w-xl mx-auto tracking-wide">
                  Clone the repository, configure your API keys, and host it yourself. It's that simple.
                </p>
              </div>

              {/* Minimal Steps */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {[
                  {
                    step: "01",
                    title: "Clone",
                    code: "git clone <repo> && cd zync",
                  },
                  {
                    step: "02",
                    title: "Configure",
                    code: "cp .env.example .env",
                  },
                  {
                    step: "03",
                    title: "Launch",
                    code: "npm install && npm run dev",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="rounded-2xl bg-white/[0.02] border border-white/[0.04] p-6 hover:bg-white/[0.03] transition-colors duration-500"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] uppercase tracking-widest font-semibold text-neutral-600">
                        {item.step}
                      </span>
                      <span className="text-sm font-medium text-white/90">{item.title}</span>
                    </div>
                    <div className="bg-black/50 rounded-xl p-3 border border-white/[0.02]">
                      <pre className="text-xs text-neutral-500 font-mono overflow-auto whitespace-pre-wrap">
                        {item.code}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>

              {/* Premium CTAs */}
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="https://github.com/Rewant-1/zync"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ size: "lg" }), "group relative overflow-hidden px-6 py-3 h-12 text-base font-semibold bg-transparent text-white border border-white/[0.1] hover:border-white/[0.2] transition-all duration-500 rounded-xl hover:bg-white/[0.02]")}
                >
                  <div className="absolute inset-0 animate-shimmer" />
                  <span className="relative z-10 flex items-center">
                    <GitFork className="mr-2 w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    Fork Repository
                  </span>
                </Link>
                <Link
                  href="https://github.com/Rewant-1/zync"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ size: "lg" }), "bg-transparent border border-white/[0.1] hover:border-white/[0.2] hover:bg-white/[0.03] text-neutral-300 hover:text-white transition-all duration-500 rounded-xl px-6 h-12 font-medium")}
                >
                  <Star className="mr-2 w-4 h-4 opacity-70" />
                  Star on GitHub
                </Link>
              </div>
            </div>
          </div>
        </m.div>
      </section>
    </LazyMotion>
  );
};

export default OpenSource;
