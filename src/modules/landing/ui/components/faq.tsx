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

export const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <LazyMotion features={domAnimation}>
      <section id="faq" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black/90" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#ffc107] to-[#00fff0] bg-clip-text text-transparent">
                FAQ
              </span>
            </h2>
            <p className="text-lg text-neutral-400">
              Common questions about Zync.
            </p>
          </m.div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <m.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                viewport={{ once: true }}
              >
                <Collapsible
                  open={openItems.includes(index)}
                  onOpenChange={() => toggleItem(index)}
                >
                  <CollapsibleTrigger asChild>
                    <button className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300 p-5 text-left group">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-medium text-white pr-4 group-hover:text-[#ffc107] transition-colors">
                          {faq.question}
                        </span>
                        <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0 group-hover:border-[#ffc107]/20 transition-colors">
                          {openItems.includes(index) ? (
                            <Minus className="w-3.5 h-3.5 text-[#ffc107]" />
                          ) : (
                            <Plus className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#ffc107] transition-colors" />
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
                        className="px-5 pb-5 -mt-1"
                      >
                        <p className="text-sm text-neutral-400 leading-relaxed pt-3 border-t border-white/[0.04]">
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
