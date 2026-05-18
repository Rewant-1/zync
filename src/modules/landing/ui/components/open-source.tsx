"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import Link from "next/link";
import { GitFork, Star, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

export const OpenSource = () => {
  return (
    <LazyMotion features={domAnimation}>
      <section className="relative py-12">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-8 md:p-10 relative overflow-hidden">
            {/* Subtle gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#ffc107]/[0.02] to-[#00fff0]/[0.02]" />

            <div className="relative z-10">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white">
                  Fully{" "}
                  <span className="bg-gradient-to-r from-[#ffc107] to-[#00fff0] bg-clip-text text-transparent">
                    Open Source
                  </span>
                </h3>
                <p className="text-sm text-neutral-400 max-w-lg mx-auto">
                  Clone the repo, add your API keys, customize the prompts. Make it yours.
                </p>
              </div>

              {/* Steps */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {[
                  {
                    step: "1",
                    title: "Clone",
                    code: "git clone <your-fork> && cd zync",
                  },
                  {
                    step: "2",
                    title: "Configure",
                    code: "cp .env.example .env\n# Add your API keys",
                  },
                  {
                    step: "3",
                    title: "Run",
                    code: "npm install && npm run dev",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded-md bg-gradient-to-r from-[#ffc107] to-[#00fff0] flex items-center justify-center text-[10px] font-bold text-black">
                        {item.step}
                      </div>
                      <span className="text-sm font-medium text-white">{item.title}</span>
                    </div>
                    <pre className="text-xs text-neutral-500 font-mono overflow-auto whitespace-pre-wrap">
                      {item.code}
                    </pre>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-white/[0.06] text-white hover:bg-white/[0.1] border border-white/[0.06] rounded-xl px-6 font-medium"
                >
                  <Link
                    href="https://github.com/Rewant-1/zync"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GitFork className="mr-2 w-4 h-4" />
                    Fork Repository
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="bg-white/[0.06] text-white hover:bg-white/[0.1] border border-white/[0.06] rounded-xl px-6 font-medium"
                >
                  <Link
                    href="https://github.com/Rewant-1/zync"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Star className="mr-2 w-4 h-4" />
                    Star on GitHub
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </m.div>
      </section>
    </LazyMotion>
  );
};

export default OpenSource;
