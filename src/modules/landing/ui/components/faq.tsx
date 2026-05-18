"use client";

import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "How does Zync generate code?",
    answer:
      "Zync uses a multi-model AI orchestration system. Your prompt is sent to the best available AI model (with automatic fallback to 6+ models). The AI generates complete React + TypeScript + Tailwind applications with proper file structure, imports, and styling — all validated before execution.",
  },
  {
    question: "Can I customize the generated code?",
    answer:
      "Absolutely. All generated code is visible in the file explorer and fully editable. You can also iterate by describing changes in the chat — Zync remembers your last 4 messages for context-aware refinement.",
  },
  {
    question: "What technologies are used in generated apps?",
    answer:
      "Generated apps use React 18, TypeScript, Vite, Tailwind CSS, and Shadcn UI components. The sandbox comes pre-installed with Radix UI primitives, Lucide icons, and common utilities. No extra npm installs needed.",
  },
  {
    question: "Is my code and data secure?",
    answer:
      "Yes. Each generation runs in an isolated E2B sandbox container that's destroyed after 30 minutes. Your code is stored in your project database, protected by Clerk authentication. We use strict CSP headers and session-based access control.",
  },
  {
    question: "What if a model is rate-limited?",
    answer:
      "Zync has a built-in fallback chain with exponential backoff. If one model hits rate limits or fails, it automatically switches to the next model in the chain — typically within milliseconds. You'll almost never see a failed generation.",
  },
  {
    question: "Is there a free tier?",
    answer:
      "Yes — 5 generations per month, no credit card required. That's enough to build 5 complete React applications. Credits reset on a 30-day rolling window.",
  },
];

const springTransition = {
  type: "spring" as const,
  stiffness: 40,
  damping: 20,
};

export const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <LazyMotion features={domAnimation}>
      <section id="faq" className="relative py-32 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.02),transparent_70%)]" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={springTransition}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-5">
              Common <span className="text-white/40">Questions</span>
            </h2>
            <p className="text-lg text-neutral-400 font-light tracking-wide">
              Everything you need to know about Zync.
            </p>
          </m.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <m.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ ...springTransition, delay: index * 0.05 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <Collapsible
                  open={openItems.includes(index)}
                  onOpenChange={() => toggleItem(index)}
                >
                  <CollapsibleTrigger asChild>
                    <button className="w-full rounded-2xl border border-white/[0.03] bg-[#050505] hover:bg-[#080808] hover:border-white/[0.08] transition-all duration-500 p-6 text-left group">
                      <div className="flex items-center justify-between">
                        <span className="text-base md:text-lg font-medium text-white/90 pr-4 group-hover:text-white transition-colors tracking-tight">
                          {faq.question}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center flex-shrink-0 group-hover:bg-white/[0.08] transition-all duration-500">
                          {openItems.includes(index) ? (
                            <Minus className="w-4 h-4 text-white/70" />
                          ) : (
                            <Plus className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
                          )}
                        </div>
                      </div>
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <AnimatePresence>
                      <m.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="px-6 pb-6 -mt-2 bg-[#050505] rounded-b-2xl border-x border-b border-white/[0.03]"
                      >
                        <p className="text-sm md:text-base text-neutral-400 font-light leading-relaxed pt-4 border-t border-white/[0.03]">
                          {faq.answer}
                        </p>
                      </m.div>
                    </AnimatePresence>
                  </CollapsibleContent>
                </Collapsible>
              </m.div>
            ))}
          </div>
        </div>
      </section>
    </LazyMotion>
  );
};
