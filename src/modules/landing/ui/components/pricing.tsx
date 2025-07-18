"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Star } from "lucide-react";
import { SignUpButton, SignedOut, SignedIn } from "@clerk/nextjs";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started and small projects",
    features: [
      "3 projects per month",
      "Basic AI code generation",
      "Community support",
      "Public repositories only",
      "Standard templates"
    ],
    limitations: [
      "No real-time collaboration",
      "Limited customization",
      "Basic deployment options"
    ],
    cta: "Get Started Free",
    popular: false,
    gradient: "from-gray-400 to-gray-600"
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For professional developers and growing teams",
    features: [
      "Unlimited projects",
      "Advanced AI code generation",
      "Real-time collaboration",
      "Private repositories",
      "Premium templates",
      "Custom components library",
      "Priority support",
      "Advanced deployment options",
      "Team management (up to 5 members)"
    ],
    limitations: [],
    cta: "Start Pro Trial",
    popular: true,
    gradient: "from-blue-500 to-violet-500"
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "For large teams and organizations",
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "Enterprise security & compliance",
      "Custom AI model training",
      "On-premise deployment",
      "24/7 dedicated support",
      "Custom integrations",
      "SLA guarantees",
      "Training & onboarding"
    ],
    limitations: [],
    cta: "Contact Sales",
    popular: false,
    gradient: "from-violet-500 to-purple-500"
  }
];

export const Pricing = () => {
  return (
    <section id="pricing" className="relative py-24 overflow-hidden">
      {/* Continuing the gradient transition */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(186,85,255,0.03),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,255,240,0.02),transparent_60%)]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Simple,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Transparent
            </span>{" "}
            Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the perfect plan for your needs. Start free and scale as you grow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.04 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-[#b96aff] to-[#00fff0] text-black px-4 py-1 shadow-lg animate-pulse">
                    <Star className="w-3 h-3 mr-1 animate-pulse text-[#b96aff]" />
                    Most Popular ⭐
                  </Badge>
                </div>
              )}
              <Card className={`h-full ${plan.popular ? 'border-4 border-[#b96aff] shadow-2xl shadow-[#00fff0]/20 scale-105 animate-glow' : 'border border-[#232323] shadow-xl'} hover:shadow-2xl transition-all duration-300 glass relative overflow-hidden`}>
                {/* Animated glowing border for popular plan */}
                {plan.popular && <div className="absolute -inset-1 rounded-2xl pointer-events-none opacity-80 bg-gradient-to-r from-[#b96aff]/30 via-[#00fff0]/30 to-[#fff]/30 blur-lg animate-glow" />}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-muted-foreground">/{plan.period}</span>}
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center flex-shrink-0`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    
                    {/* Limitations */}
                    {plan.limitations.map((limitation, i) => (
                      <div key={i} className="flex items-center gap-3 opacity-60">
                        <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                          <X className="w-3 h-3 text-gray-500" />
                        </div>
                        <span className="text-sm">{limitation}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* CTA Button */}
                  <div className="pt-6">
                    {plan.name === "Enterprise" ? (
                      <Button 
                        variant="outline" 
                        className="w-full py-6 text-lg font-medium"
                      >
                        {plan.cta}
                      </Button>
                    ) : (
                      <>
                        <SignedOut>
                          <SignUpButton mode="modal">
                            <Button 
                              className={`w-full py-6 text-lg font-medium ${
                                plan.popular 
                                  ? `bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white` 
                                  : ''
                              }`}
                              variant={plan.popular ? "default" : "outline"}
                            >
                              {plan.cta}
                            </Button>
                          </SignUpButton>
                        </SignedOut>
                        <SignedIn>
                          <Button 
                            asChild
                            className={`w-full py-6 text-lg font-medium ${
                              plan.popular 
                                ? `bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white` 
                                : ''
                            }`}
                            variant={plan.popular ? "default" : "outline"}
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
          ))}
        </div>

        {/* Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          
        </motion.div>
      </div>
    </section>
  );
};
