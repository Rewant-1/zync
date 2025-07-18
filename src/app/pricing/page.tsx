"use client";
import Image from "next/image";
import { PricingTable } from "@clerk/nextjs";
import {dark} from "@clerk/themes";
import { useCurrentTheme } from "@/hooks/use-current-theme";
import { motion } from "framer-motion";
import { Sparkles, Star, Zap } from "lucide-react";

const Page= () => { 
    const currentTheme = useCurrentTheme();
  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-black/80" />
      <div className="absolute inset-0 pointer-events-none">
        {/* Glassy neon overlays */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[30vw] rounded-full bg-gradient-to-br from-[#b96aff]/20 via-[#00fff0]/15 to-[#fff]/10 blur-3xl opacity-60" />
        <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[20vw] rounded-full bg-gradient-to-tl from-[#00fff0]/15 via-[#b96aff]/10 to-[#fff]/8 blur-2xl opacity-50" />
        <div className="absolute top-1/2 left-1/4 w-[20vw] h-[15vw] rounded-full bg-gradient-to-br from-[#fff]/10 via-[#b96aff]/8 to-[#00fff0]/12 blur-xl opacity-40" />
      </div>
      
      <div className="relative z-10 flex flex-col max-w-4xl mx-auto w-full px-4">
        <section className="space-y-12 pt-[8vh] pb-16">
          {/* Enhanced Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center space-y-8"
          >
            {/* Logo with glow effect */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-[#b96aff]/20 via-[#00fff0]/20 to-[#fff]/20 rounded-full blur-xl opacity-80" />
              <Image
                src="/logo.png"
                alt="zync"
                width={80}
                height={80}
                className="relative rounded-full shadow-2xl shadow-[#00fff0]/30" 
              />
            </motion.div>
            
            {/* Enhanced Title */}
            <div className="text-center space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#1a1a1a] via-[#232323] to-[#1a1a1a] border border-[rgba(186,85,255,0.12)] mb-4 shadow-xl animate-pulse hover:scale-105 transition-all duration-300 cursor-pointer glass"
              >
                <Star className="w-4 h-4 text-[#b96aff]" />
                <span className="text-sm font-medium text-[#00fff0]">
                  Simple & Transparent Pricing
                </span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg"
              >
                Choose Your{" "}
                <span className="text-[#b96aff]">
                  Perfect
                </span>{" "}
                Plan
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed"
              >
                Start building amazing web applications today. Scale as you grow with flexible pricing designed for developers.
              </motion.p>
            </div>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="flex flex-wrap justify-center gap-4 text-sm text-neutral-400"
            >
              <div className="flex items-center gap-2 glass px-4 py-2 rounded-full border border-[rgba(186,85,255,0.12)]">
                <Zap className="w-4 h-4 text-[#00fff0]" />
                <span>No Setup Fees</span>
              </div>
              <div className="flex items-center gap-2 glass px-4 py-2 rounded-full border border-[rgba(186,85,255,0.12)]">
                <Sparkles className="w-4 h-4 text-[#b96aff]" />
                <span>Cancel Anytime</span>
              </div>
              <div className="flex items-center gap-2 glass px-4 py-2 rounded-full border border-[rgba(186,85,255,0.12)]">
                <Star className="w-4 h-4 text-[#00fff0]" />
                <span>14-Day Free Trial</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Pricing Table Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="relative"
          >
            {/* Glowing container */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#b96aff]/20 via-[#00fff0]/20 to-[#b96aff]/20 rounded-2xl blur-lg opacity-60" />
            <div className="relative glass rounded-2xl p-8 border border-[rgba(186,85,255,0.12)] shadow-2xl">
              <PricingTable
                appearance={{
                  baseTheme: currentTheme === "dark" ? dark : undefined,
                  elements: {
                    pricingTableCard: "border-[rgba(186,85,255,0.12)]! shadow-2xl! rounded-xl! bg-[#1a1a1a]/90! backdrop-blur-md! hover:shadow-[#b96aff]/20! transition-all duration-300! hover:scale-105!",
                    pricingTableHeader: "text-white! bg-transparent!",
                    pricingTablePrice: "text-[#00fff0]! font-bold!",
                    pricingTableButton: "bg-gradient-to-r from-[#b96aff] to-[#00fff0]! hover:from-[#00fff0] hover:to-[#b96aff]! text-black! font-semibold! shadow-lg! shadow-[#00fff0]/40! hover:shadow-[#b96aff]/60! transition-all duration-300! rounded-lg! border-0!",
                    pricingTableFeature: "text-neutral-300! bg-transparent!",
                    pricingTableFeatureIcon: "text-[#00fff0]!",
                    pricingTableContent: "bg-transparent!",
                    pricingTableBody: "bg-transparent!",
                    pricingTableCardContent: "bg-transparent!",
                  }
                }} 
              />
            </div>
          </motion.div>

          {/* Additional Trust Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="text-center space-y-6 pt-8"
          >
            <p className="text-sm text-neutral-500">Trusted by developers worldwide</p>
            <div className="flex justify-center items-center gap-8 opacity-60">
              <div className="text-lg font-semibold text-[#b96aff]">Next.js</div>
              <div className="text-lg font-semibold text-[#00fff0]">React</div>
              <div className="text-lg font-semibold text-[#b96aff]">TypeScript</div>
              <div className="text-lg font-semibold text-[#00fff0]">Tailwind CSS</div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
export default Page;