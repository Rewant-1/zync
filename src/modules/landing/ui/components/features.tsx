"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Code2, Shield, Zap, Cpu, Sparkles, Palette } from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "AI-Driven Code Generation",
    description:
      "Generate complete, production-ready applications from simple descriptions using advanced AI models.",
    gradient: "from-[#ffc107] to-[#00fff0]",
  },
  {
    icon: Shield,
    title: "Type-Safe Environments",
    description:
      "Built-in TypeScript support ensures type safety and reduces runtime errors in your applications.",
    gradient: "from-[#00fff0] to-[#ffc107]",
  },
  {
    icon: Zap,
    title: "Sandboxed Execution",
    description:
      "Secure, isolated environments for testing and running your applications without security concerns.",
    gradient: "from-[#ffc107] to-[#00fff0]",
  },
  {
    icon: Cpu,
    title: "Optimized Performance",
    description:
      "Automatically optimized code generation with performance best practices built-in from the start.",
    gradient: "from-[#ffffff] to-[#ffc107]",
  },
  {
    icon: Sparkles,
    title: "Smart Templates",
    description:
      "Pre-built templates and components library to accelerate your development process.",
    gradient: "from-[#00fff0] to-[#ffc107]",
  },
  {
    icon: Palette,
    title: "Creator Mode",
    description:
      "A guided, multi‑step builder to choose app type, tech stack, theme, and AI‑enhance your brief before generation.",
    gradient: "from-[#ffc107] to-[#00fff0]",
  },
];

export const Features = () => {
  return (
    <section id="features" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/70" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,193,7,0.05),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,255,240,0.03),transparent_60%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-[#ffc107] to-[#00fff0] bg-clip-text text-transparent">
              Build Faster
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Powerful features designed to streamline your development workflow
            and accelerate your time to market.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                viewport={{ once: true }}
                className="group transition-transform duration-500 will-change-transform hover:-translate-y-1 hover:scale-[1.05]"
              >
                <Card className="h-full border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 bg-white/90 dark:bg-background/90 backdrop-blur-md group-hover:border-2 group-hover:border-amber-400/70 group-hover:bg-white/95 dark:group-hover:bg-background/95 relative overflow-hidden">
                  <div className="absolute -inset-1 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-cyan-400/20 via-amber-300/30 to-cyan-400/20 blur-lg" />
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-r ${feature.gradient} p-3 mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-cyan-500/20`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg font-semibold group-hover:text-foreground transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-center text-muted-foreground leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
