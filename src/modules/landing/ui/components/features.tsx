"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import {
  Workflow,
  ShieldCheck,
  Container,
  Gauge,
  Wand2,
  Layers,
} from "lucide-react";

const features = [
  {
    icon: Workflow,
    title: "Multi-Model Fallback",
    description:
      "Automatic model switching with exponential backoff. If one model rate-limits, Zync seamlessly tries the next — no failed generations.",
    gradient: "from-[#ffc107] to-[#ffdb4d]",
    span: "md:col-span-2",
  },
  {
    icon: ShieldCheck,
    title: "Type-Safe Stack",
    description:
      "TypeScript + tRPC end-to-end. Every API call is type-checked at compile time — zero runtime surprises.",
    gradient: "from-[#00fff0] to-[#00ccbe]",
    span: "",
  },
  {
    icon: Container,
    title: "Sandboxed Execution",
    description:
      "Every app runs in an isolated E2B container with its own Vite dev server. No conflicts, no security risks.",
    gradient: "from-[#00fff0] to-[#ffc107]",
    span: "",
  },
  {
    icon: Gauge,
    title: "Built for Speed",
    description:
      "0.6s FCP, near-zero CLS. Code-split bundles, optimized package imports, and filesystem caching keep everything snappy.",
    gradient: "from-[#ffc107] to-[#00fff0]",
    span: "md:col-span-2",
  },
  {
    icon: Wand2,
    title: "Smart Prompts",
    description:
      "Engineered system prompts ensure generated code uses only available packages, validates imports, and follows React best practices.",
    gradient: "from-[#ffdb4d] to-[#00fff0]",
    span: "",
  },
  {
    icon: Layers,
    title: "Conversation Memory",
    description:
      "Context-aware generation using your last 4 messages. Iterate and refine — Zync remembers what you built.",
    gradient: "from-[#00fff0] to-[#ffc107]",
    span: "",
  },
];

export const Features = () => {
  return (
    <LazyMotion features={domAnimation}>
      <section id="features" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,193,7,0.04),transparent_70%)]" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Why{" "}
              <span className="bg-gradient-to-r from-[#ffc107] to-[#00fff0] bg-clip-text text-transparent">
                Zync
              </span>
            </h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Not another AI wrapper. Real engineering under the hood.
            </p>
          </m.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <m.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.06, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className={`group ${feature.span}`}
                >
                  <div className="h-full rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-6 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04] relative overflow-hidden">
                    {/* Hover gradient */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#ffc107]/[0.03] to-[#00fff0]/[0.03]" />
                    
                    <div className="relative z-10">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-r ${feature.gradient} p-2.5 mb-4 group-hover:scale-105 transition-transform duration-300 shadow-lg`}
                      >
                        <Icon className="w-5 h-5 text-black" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-neutral-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </m.div>
              );
            })}
          </div>
        </div>
      </section>
    </LazyMotion>
  );
};
