"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, X, Zap, Crown, Flame } from "lucide-react";
import { SignUpButton, SignedOut, SignedIn } from "@clerk/nextjs";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    icon: Zap,
    price: "$0",
    period: "forever",
    description: "Perfect for trying Zync and small experiments",
    features: [
      "5 monthly credits",
      "Basic AI code generation",
      "Credits refresh monthly",
    ],
    limitations: [
      "Less powerful models",
      "No theme support",
      "Sandbox expires after 30 min",
    ],
    cta: "Get Started Free",
    popular: false,
    accent: "from-neutral-500 to-neutral-400",
  },
  {
    name: "Pay Per Use",
    icon: Flame,
    price: "$2",
    period: "per project",
    description: "Pay once for a project or hackathon",
    features: [
      "20 credits / project",
      "More powerful models",
      "Best for one-time projects",
      "Everything in Free",
    ],
    limitations: [],
    cta: "Start Now",
    popular: true,
    accent: "from-[#00fff0] to-[#ffc107]",
  },
  {
    name: "Pro",
    icon: Crown,
    price: "$8",
    period: "per month",
    description: "For power users and teams",
    features: [
      "100 credits / month",
      "The most powerful AI models",
      "Extended sandbox time",
      "Priority support",
      "Best for high volume",
      "Everything in Pay Per Use",
    ],
    limitations: [],
    cta: "Go Pro",
    popular: false,
    accent: "from-[#ffc107] to-[#ffdb4d]",
  },
];

export const Pricing = () => {
  return (
    <LazyMotion features={domAnimation}>
      <section id="pricing" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,240,0.03),transparent_70%)]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Simple{" "}
              <span className="bg-gradient-to-r from-[#ffc107] to-[#00fff0] bg-clip-text text-transparent">
                Pricing
              </span>
            </h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Start free. Scale when you need to.
            </p>
          </m.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              const isPopular = plan.popular;
              return (
                <m.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className={`relative flex flex-col ${isPopular ? "md:-mt-4 md:mb-[-16px]" : ""}`}
                >
                  {/* Popular badge */}
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                      <div className="px-4 py-1 rounded-full bg-gradient-to-r from-[#00fff0] to-[#ffc107] text-xs font-bold text-black">
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div
                    className={`h-full flex flex-col rounded-2xl border backdrop-blur-sm p-6 transition-all duration-300 ${
                      isPopular
                        ? "border-[#00fff0]/30 bg-white/[0.04] animate-pulse-border"
                        : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]"
                    }`}
                  >
                    {/* Header */}
                    <div className="pb-5 border-b border-white/[0.06] mb-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${plan.accent} p-1.5`}>
                          <Icon className="w-5 h-5 text-black" />
                        </div>
                        <span className="text-lg font-bold text-white">{plan.name}</span>
                      </div>
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-4xl font-bold text-white">{plan.price}</span>
                        <span className="text-neutral-500 text-sm">/{plan.period}</span>
                      </div>
                      <p className="text-sm text-neutral-500">{plan.description}</p>
                    </div>

                    {/* Features */}
                    <div className="space-y-2.5 flex-grow">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-[#00fff0] flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-neutral-300">{feature}</span>
                        </div>
                      ))}
                      {plan.limitations.map((limitation, i) => (
                        <div key={i} className="flex items-start gap-2.5 opacity-50">
                          <X className="w-4 h-4 text-neutral-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-neutral-400">{limitation}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="pt-6 mt-auto">
                      <SignedOut>
                        <SignUpButton mode="modal">
                          <Button
                            className={`w-full py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                              isPopular
                                ? "bg-gradient-to-r from-[#00fff0] to-[#ffc107] text-black hover:from-[#ffc107] hover:to-[#00fff0] shadow-lg shadow-[#00fff0]/20"
                                : "bg-white/[0.06] text-white hover:bg-white/[0.1] border border-white/[0.06]"
                            }`}
                          >
                            {plan.cta}
                          </Button>
                        </SignUpButton>
                      </SignedOut>
                      <SignedIn>
                        <Button
                          asChild
                          className={`w-full py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                            isPopular
                              ? "bg-gradient-to-r from-[#00fff0] to-[#ffc107] text-black hover:from-[#ffc107] hover:to-[#00fff0] shadow-lg shadow-[#00fff0]/20"
                              : "bg-white/[0.06] text-white hover:bg-white/[0.1] border border-white/[0.06]"
                          }`}
                        >
                          <Link href="/dashboard">Go to Dashboard</Link>
                        </Button>
                      </SignedIn>
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
