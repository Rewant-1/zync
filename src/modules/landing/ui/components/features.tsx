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
    gradient: "from-[#ffc107] to-[#ffdb4d]",
    span: "md:col-span-2",
  },
  {
    icon: ShieldCheck,
    title: "Type-Safe Stack",
    description:
      "TypeScript + tRPC end-to-end. Every API call is statically checked — no runtime surprises.",
    gradient: "from-[#00fff0] to-[#00ccbe]",
    span: "",
  },
  {
    icon: Container,
    title: "Sandboxed Execution",
    description:
      "Every app runs in an isolated E2B container with its own Vite dev server. Secure and scalable.",
    gradient: "from-[#00fff0] to-[#ffc107]",
    span: "",
  },
  {
    icon: Gauge,
    title: "Engineered for Speed",
    description:
      "0.6s FCP, near-zero CLS. Code-split bundles and optimized package imports keep everything snappy.",
    gradient: "from-[#ffc107] to-[#00fff0]",
    span: "md:col-span-2",
  },
  {
    icon: Wand2,
    title: "Smart Context",
    description:
      "System prompts ensure generated code uses only available packages and follows React best practices.",
    gradient: "from-[#ffdb4d] to-[#00fff0]",
    span: "",
  },
  {
    icon: Layers,
    title: "Infinite Memory",
    description:
      "Context-aware generation using your conversation history. Iterate and refine effortlessly.",
    gradient: "from-[#00fff0] to-[#ffc107]",
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
      <section id="features" className="relative py-32 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02),transparent_70%)]" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={springTransition}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-5">
              Engineering <span className="text-white/40">Excellence</span>
            </h2>
            <p className="text-lg text-neutral-400 font-light max-w-2xl mx-auto tracking-wide">
              Real engineering under the hood. Not just another wrapper.
            </p>
          </m.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <div className="h-full rounded-3xl border border-white/[0.03] bg-[#050505] p-8 transition-all duration-500 hover:border-white/[0.08] hover:bg-[#080808] relative overflow-hidden">
                    {/* Minimal hover gradient */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-white/[0.02] to-transparent" />
                    
                    <div className="relative z-10">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 text-black group-hover:scale-105 transition-transform duration-500 shadow-lg`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-medium text-white/90 mb-3 tracking-tight group-hover:text-white transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-neutral-500 font-light leading-relaxed group-hover:text-neutral-400 transition-colors duration-300">
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
