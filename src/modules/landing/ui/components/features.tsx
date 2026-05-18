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
      "Automatic model switching with exponential backoff. If one model rate-limits, Zync seamlessly tries the next — zero failed generations.",
    gradient: "from-neutral-100 to-neutral-400",
    span: "md:col-span-2",
  },
  {
    icon: ShieldCheck,
    title: "Type-Safe Stack",
    description:
      "TypeScript + tRPC end-to-end. Every API call is statically checked — no runtime surprises.",
    gradient: "from-zinc-200 to-zinc-500",
    span: "",
  },
  {
    icon: Container,
    title: "Sandboxed Execution",
    description:
      "Every app runs in an isolated E2B container with its own Vite dev server. Secure and scalable.",
    gradient: "from-slate-200 to-slate-500",
    span: "",
  },
  {
    icon: Gauge,
    title: "Engineered for Speed",
    description:
      "0.6s FCP, near-zero CLS. Code-split bundles and optimized package imports keep everything snappy.",
    gradient: "from-gray-100 to-gray-400",
    span: "md:col-span-2",
  },
  {
    icon: Wand2,
    title: "Smart Context",
    description:
      "System prompts ensure generated code uses only available packages and follows React best practices.",
    gradient: "from-stone-200 to-stone-500",
    span: "",
  },
  {
    icon: Layers,
    title: "Infinite Memory",
    description:
      "Context-aware generation using your conversation history. Iterate and refine effortlessly.",
    gradient: "from-neutral-200 to-neutral-500",
    span: "",
  },
];

const springTransition = {
  type: "spring" as const,
  stiffness: 40,
  damping: 20,
};

export const Features = () => {
  return (
    <LazyMotion features={domAnimation}>
      <section id="features" className="relative py-48 overflow-hidden bg-black section-bg">
        <div className="absolute inset-0 section-overlay" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={springTransition}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-32"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-6">
              Engineering <span className="text-white/40">Excellence</span>
            </h2>
            <p className="text-xl text-neutral-400 font-light max-w-2xl mx-auto tracking-wide">
              Real engineering under the hood. Not just another wrapper.
            </p>
          </m.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <m.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ ...springTransition, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  className={`group ${feature.span}`}
                >
                  <div className="h-full rounded-3xl cyclic-border p-10 transition-all duration-500 hover:-translate-y-2 relative">
                    {/* Minimal hover gradient */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-white/[0.03] to-transparent rounded-[inherit] z-[-1]" />
                    
                    <div className="relative z-10">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-8 text-black group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(255,255,255,0.15)]`}
                      >
                        <Icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-2xl font-medium text-white/90 mb-4 tracking-tight group-hover:text-white transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-base text-neutral-500 font-light leading-relaxed group-hover:text-neutral-400 transition-colors duration-300">
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
