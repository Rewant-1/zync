"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { SignUpButton, SignedOut, SignedIn } from "@clerk/nextjs";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started and small projects",
    features: [
      "5 monthly credits",
      "Basic AI code generation with simple models",
      "Credits refresh monthly",
    ],
    limitations: [
      "Less powerful models",
      "No theme support",
      "Project's sandbox expires after half an hour",
    ],
    cta: "Get Started Free",
    popular: false,
    gradient: "from-gray-400 to-gray-600",
  },
  {
    name: "Pay Per Use",
    price: "$2",
    period: "per project",
    description: "Pay once only for a small project or hackathon ",
    features: [
      "20 credits / project",
      "More powerful models",
      "Best for one time projects",
      "Everything in free plan",
    ],
    limitations: [],
    cta: "START NOW",
    popular: true,
    gradient: "from-cyan-400 to-amber-400",
  },
  {
    name: "Pro",
    price: "8",
    period: "per month",
    description: "Our best plan YET!",
    features: [
      "100 credits / month",
      "The most powerful AI models",
      "Extended sandbox time limit",
      "Full support from our team",
      "Best for high volume users",

      "Everything in free and Pay Per Use plans",
    ],
    limitations: [],
    cta: "GO PRO !",
    popular: false,
    gradient: "from-amber-500 to-cyan-400",
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="relative py-24 overflow-hidden">
      {/* Background overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.03),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,255,240,0.02),transparent_60%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Simple,{" "}
            <span className="bg-gradient-to-r from-[#fbbf24] to-[#00fff0] bg-clip-text text-transparent">
              Transparent
            </span>{" "}
            Pricing
          </h2>
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
            Choose the perfect plan for your needs. Start free and scale as you
            grow.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 relative">
          {plans.map((plan, index) => {
            const isPopular = plan.popular;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`relative flex flex-col ${
                  isPopular ? "z-10" : "z-0"
                }`}
              >
                <Card
                  className={`h-full min-h-[600px] flex flex-col border-[rgba(251,191,36,0.12)] shadow-2xl rounded-2xl bg-[#1a1a1a]/90 backdrop-blur-md hover:shadow-[#fbbf24]/20 transition-all duration-300 relative overflow-visible ${
                    isPopular
                      ? "border-2 border-[#00fff0] shadow-[#00fff0]/20"
                      : ""
                  }`}
                >
                  {/* Blue outline glow for popular plan */}
                  {isPopular && (
                    <div className="absolute -inset-1 border-2 border-[#00fff0] rounded-2xl animate-pulse pointer-events-none" />
                  )}
                  {isPopular && (
                    <div className="absolute -inset-2 bg-gradient-to-r from-[#00fff0]/10 via-[#00fff0]/5 to-[#00fff0]/10 rounded-2xl blur-md pointer-events-none" />
                  )}

                  <CardHeader className="text-center pb-6 p-6 border-b border-[rgba(251,191,36,0.12)] flex-shrink-0">
                    <CardTitle className="text-xl font-bold text-white mb-2">
                      {plan.name}
                    </CardTitle>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-[#00fff0]">
                        {plan.price}
                      </span>
                      {plan.price !== "Custom" && (
                        <span className="text-neutral-400 text-lg">
                          /{plan.period}
                        </span>
                      )}
                    </div>
                    <p className="text-neutral-400 mt-2">{plan.description}</p>
                  </CardHeader>

                  <CardContent className="p-6 flex-grow flex flex-col">
                    {/* Features */}
                    <div className="space-y-2 flex-grow">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 py-2">
                          <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-[#00fff0]" />
                          </div>
                          <span className="text-sm text-neutral-300">
                            {feature}
                          </span>
                        </div>
                      ))}
                      {/* Limitations */}
                      {plan.limitations.map((limitation, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 py-2 opacity-60"
                        >
                          <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                            <X className="w-4 h-4 text-gray-500" />
                          </div>
                          <span className="text-sm text-neutral-300">
                            {limitation}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <div className="pt-6 mt-auto">
                      {plan.name === "Enterprise" ? (
                        <Button
                          variant="outline"
                          className="w-full py-3 px-6 text-lg font-semibold bg-gradient-to-r from-[#fbbf24] to-[#00fff0] hover:from-[#00fff0] hover:to-[#fbbf24] text-black shadow-lg shadow-[#00fff0]/40 hover:shadow-[#fbbf24]/60 transition-all duration-300 rounded-lg border-0"
                        >
                          {plan.cta}
                        </Button>
                      ) : (
                        <>
                          <SignedOut>
                            <SignUpButton mode="modal">
                              <Button className="w-full py-3 px-6 text-lg font-semibold bg-gradient-to-r from-[#fbbf24] to-[#00fff0] hover:from-[#00fff0] hover:to-[#fbbf24] text-black shadow-lg shadow-[#00fff0]/40 hover:shadow-[#fbbf24]/60 transition-all duration-300 rounded-lg border-0">
                                {plan.cta}
                              </Button>
                            </SignUpButton>
                          </SignedOut>
                          <SignedIn>
                            <Button
                              asChild
                              className="w-full py-3 px-6 text-lg font-semibold bg-gradient-to-r from-[#fbbf24] to-[#00fff0] hover:from-[#00fff0] hover:to-[#fbbf24] text-black shadow-lg shadow-[#00fff0]/40 hover:shadow-[#fbbf24]/60 transition-all duration-300 rounded-lg border-0"
                            >
                              <Link href="/dashboard">Go to Dashboard</Link>
                            </Button>
                          </SignedIn>
                        </>
                      )}
                    </div>
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
