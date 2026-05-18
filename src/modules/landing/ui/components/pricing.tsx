"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, X, Zap, Crown, Flame } from "lucide-react";
import { SignUpButton, SignedOut, SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import { forwardRef } from "react";

// ForwardRef wrapper that strips Clerk's `asChild` prop before it hits the DOM
const AuthButton = forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<"button"> & { asChild?: boolean }>(
  ({ asChild, children, className, ...props }, ref) => (
    <button ref={ref} className={className} {...props}>{children}</button>
  )
);
AuthButton.displayName = "AuthButton";

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
  },
];

const springTransition = {
  type: "spring" as const,
  stiffness: 40,
  damping: 20,
};

export const Pricing = () => {
  return (
    <LazyMotion features={domAnimation}>
      <section id="pricing" className="relative py-32 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.015),transparent_70%)]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={springTransition}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-5">
              Simple, transparent <span className="text-white/40">pricing.</span>
            </h2>
            <p className="text-lg text-neutral-400 font-light max-w-2xl mx-auto tracking-wide">
              Start free. Scale gracefully.
            </p>
          </m.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              const isPopular = plan.popular;
              return (
                <m.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ ...springTransition, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  className={`relative flex flex-col ${isPopular ? "md:-mt-6 md:mb-[-24px]" : ""}`}
                >
                  {/* Popular badge */}
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                      <div className="px-4 py-1.5 rounded-full bg-white text-[10px] uppercase tracking-widest font-semibold text-black shadow-lg">
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div
                    className={`h-full flex flex-col rounded-3xl border backdrop-blur-sm p-8 transition-all duration-500 ${
                      isPopular
                        ? "border-white/[0.08] bg-[#080808] shadow-[0_0_40px_-10px_rgba(255,255,255,0.05)]"
                        : "border-white/[0.03] bg-[#050505] hover:border-white/[0.06] hover:bg-[#080808]"
                    }`}
                  >
                    {/* Header */}
                    <div className="pb-6 border-b border-white/[0.03] mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center">
                          <Icon className="w-4 h-4 text-white/70" />
                        </div>
                        <span className="text-lg font-medium text-white/90 tracking-tight">{plan.name}</span>
                      </div>
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-4xl font-semibold text-white tracking-tight">{plan.price}</span>
                        <span className="text-neutral-500 font-light text-sm">/{plan.period}</span>
                      </div>
                      <p className="text-sm text-neutral-400 font-light mt-4 leading-relaxed">{plan.description}</p>
                    </div>

                    {/* Features */}
                    <div className="space-y-4 flex-grow mb-8">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-white/70 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-neutral-300 font-light tracking-wide">{feature}</span>
                        </div>
                      ))}
                      {plan.limitations.map((limitation, i) => (
                        <div key={i} className="flex items-start gap-3 opacity-40">
                          <X className="w-4 h-4 text-neutral-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-neutral-500 font-light tracking-wide">{limitation}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-auto">
                      <SignedOut>
                        <SignUpButton mode="modal">
                          <AuthButton
                            className={cn(buttonVariants({ size: "default" }), `inner-shimmer w-full h-12 text-sm font-semibold rounded-2xl transition-all duration-500 group relative overflow-hidden ${
                              isPopular
                                ? "bg-transparent text-white border border-white/[0.1] hover:border-white/[0.2] hover:bg-white/[0.02]"
                                : "bg-white/[0.03] text-white hover:bg-white/[0.08] border border-white/[0.05]"
                            }`)}
                          >
                            <span className="relative z-10">{plan.cta}</span>
                          </AuthButton>
                        </SignUpButton>
                      </SignedOut>
                      <SignedIn>
                        <Link
                          href="/dashboard"
                          className={cn(buttonVariants({ size: "default" }), `inner-shimmer w-full h-12 text-sm font-semibold rounded-2xl transition-all duration-500 group relative overflow-hidden ${
                            isPopular
                                ? "bg-transparent text-white border border-white/[0.1] hover:border-white/[0.2] hover:bg-white/[0.02]"
                              : "bg-white/[0.03] text-white hover:bg-white/[0.08] border border-white/[0.05]"
                          }`)}
                        >
                          <span className="relative z-10">Go to Dashboard</span>
                        </Link>
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
