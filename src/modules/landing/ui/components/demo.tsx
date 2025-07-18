"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Monitor, Smartphone, Code } from "lucide-react";

export const Demo = () => {
  return (
    <section id="demo" className="section-bg py-24">
      <div className="absolute inset-0 bg-black/80" />
      <div className="section-overlay">
        <div className="neon-blob-1" />
        <div className="neon-blob-2" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            See{" "}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              zync
            </span>{" "}
            in Action
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Watch how developers are building complete applications in minutes, not hours.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative max-w-5xl mx-auto mb-16"
        >
          <Card className="overflow-hidden border-0 shadow-2xl glass">
            <CardContent className="p-0">
              <div className="relative aspect-video flex items-center justify-center shadow-2xl">
                {/* Video placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#232323] to-[#0a0a0a]" />
                <div className="relative z-10 text-center text-white">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="mb-6"
                  >
                    <Button
                      size="lg"
                      className="w-20 h-20 rounded-full bg-[#00fff0] text-black shadow-xl shadow-[#00fff0]/40 border-2 border-transparent hover:border-[#b96aff] hover:shadow-2xl hover:shadow-[#b96aff]/60 transition-all duration-300 animate-glow"
                    >
                      <Play className="w-8 h-8 text-black ml-1 drop-shadow-lg" />
                    </Button>
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-2 text-[#00fff0]">Build a Todo App in 2 Minutes</h3>
                  <p className="text-white/80">From prompt to deployed application</p>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-4 left-4 w-3 h-3 bg-[#b96aff] rounded-full" />
                <div className="absolute top-4 left-12 w-3 h-3 bg-[#00fff0] rounded-full" />
                <div className="absolute top-4 left-20 w-3 h-3 bg-[#fff] rounded-full" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Demo Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Monitor,
              stat: "10x Faster",
              description: "Development Speed",
              gradient: "from-[#b96aff] to-[#00fff0]"
            },
            {
              icon: Code,
              stat: "99% Less",
              description: "Boilerplate Code",
              gradient: "from-[#fff] to-[#b96aff]"
            },
            {
              icon: Smartphone,
              stat: "100% Responsive",
              description: "Mobile-First Design",
              gradient: "from-[#00fff0] to-[#b96aff]"
            }
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.stat}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center border-0 shadow-2xl hover:shadow-3xl transition-shadow duration-300 glass group-hover:scale-105 relative overflow-hidden">
                  {/* Animated glowing border */}
                  <div className="absolute -inset-1 rounded-2xl pointer-events-none group-hover:opacity-100 opacity-0 transition-all duration-300 bg-gradient-to-r from-[#b96aff]/30 via-[#00fff0]/30 to-[#fff]/30 blur-lg" />
                  <CardContent className="pt-8 pb-6">
                    <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-r ${item.gradient} p-3 mb-4 shadow-lg shadow-[#b96aff]/10`}>
                      <Icon className="w-6 h-6 text-black" />
                    </div>
                    <h3 className="text-3xl font-bold mb-2 text-[#b96aff]">{item.stat}</h3>
                    <p className="text-neutral-400">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Interactive Demo Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-50/80 via-violet-50/80 to-purple-50/80 dark:from-blue-950/40 dark:via-violet-950/40 dark:to-purple-950/40 rounded-2xl p-8 border border-violet-200/50 dark:border-violet-800/50 shadow-xl"
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8">Try It Yourself</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h4 className="text-lg font-semibold mb-4">Just describe what you want:</h4>
                <div className="bg-background rounded-lg p-4 border-2 border-dashed border-border">
                  <p className="text-muted-foreground italic">
                    &ldquo;Build a modern e-commerce website with product listings, shopping cart, 
                    and checkout process using React and TypeScript&rdquo;
                  </p>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Get a complete application:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    React + TypeScript setup
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Responsive design with Tailwind CSS
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Database schema and API routes
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Authentication and payments
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
