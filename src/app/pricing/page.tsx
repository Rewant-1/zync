"use client";
import { PricingTable } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useCurrentTheme } from "@/hooks/use-current-theme";
import { motion } from "framer-motion";

const Page = () => {
  const currentTheme = useCurrentTheme();

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/70" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(186,85,255,0.03),transparent_70%)]" />

      <div className="relative z-0 flex flex-col max-w-7xl mx-auto w-full px-4">
        <section className="space-y-16 pt-[12vh] pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Choose Your{" "}
              <span className="bg-gradient-to-r from-[#ffc107] to-[#00fff0] bg-clip-text text-transparent">
                Plan
              </span>
            </h1>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Simple pricing, powerful features. Start free or upgrade anytime.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative z-0"
          >
            <div className="relative">
              <PricingTable
                appearance={{
                  baseTheme: currentTheme === "dark" ? dark : undefined,
                  elements: {
                    pricingTableContainer:
                      "grid! grid-cols-1! md:grid-cols-3! gap-8! max-w-6xl! mx-auto! relative!",
                    pricingTableCard:
                      "border-[rgba(255,193,7,0.12)]! shadow-2xl! rounded-2xl! bg-[#1a1a1a]/90! backdrop-blur-md! hover:shadow-[#ffc107]/20! transition-all duration-300! hover:scale-102! relative! overflow-visible! min-h-[600px]! flex! flex-col! z-0!",
                    pricingTableHeader:
                      "text-white! bg-transparent! p-6! border-b! border-[rgba(186,85,255,0.12)]! flex-shrink-0!",
                    pricingTableHeaderTitle: "text-xl! font-bold! text-white!",
                    pricingTableHeaderDescription: "text-neutral-400! mt-2!",
                    pricingTablePrice: "text-[#00fff0]! font-bold! text-3xl!",
                    pricingTablePriceUnit: "text-neutral-400! text-lg!",
                    pricingTableButton:
                      "bg-gradient-to-r from-[#ffc107] to-[#00fff0]! hover:from-[#00fff0] hover:to-[#ffc107]! text-black! font-semibold! shadow-lg! shadow-[#00fff0]/40! hover:shadow-[#ffc107]/60! transition-all duration-300! rounded-lg! border-0! py-3! px-6! w-full! mt-auto! relative! z-auto!",
                    pricingTableFeature:
                      "text-neutral-300! bg-transparent! py-2! flex! items-center! gap-2!",
                    pricingTableFeatureIcon: "text-[#00fff0]! w-4! h-4!",
                    pricingTableFeatureText: "text-neutral-300!",
                    pricingTableContent:
                      "bg-transparent! p-6! flex-grow! flex! flex-col!",
                    pricingTableBody: "bg-transparent! space-y-2! flex-grow!",
                    pricingTableCardContent:
                      "bg-transparent! flex! flex-col! h-full!",
                  },
                }}
              />
            </div>

            <div className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full pointer-events-none z-0">
              <div className="absolute top-0 left-1/3 w-1/3 h-full">
                <div className="absolute -inset-1 border-2 border-[#00fff0] rounded-2xl animate-pulse" />
                <div className="absolute -inset-2 bg-gradient-to-r from-[#00fff0]/10 via-[#00fff0]/5 to-[#00fff0]/10 rounded-2xl blur-md" />
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Page;
