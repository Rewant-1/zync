"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { FileCode2, Star } from "lucide-react";

export const OpenSource = () => {
  return (
    <section className="relative py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h3 className="text-3xl md:text-4xl font-bold mb-3">
          Open{" "}
          <span className="bg-gradient-to-r from-[#ffc107] to-[#00fff0] bg-clip-text text-transparent">
            Source
          </span>
        </h3>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Clone the repo, drop your API keys into{" "}
          <code className="px-1 py-0.5 rounded bg-black/30">.env</code>, and
          customize{" "}
          <code className="px-1 py-0.5 rounded bg-black/30">
            src/prompts.ts
          </code>{" "}
          to make it yours.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="h-full border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 glass relative overflow-hidden">
          <div className="absolute -inset-1 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-r from-[#ffc107]/30 via-[#00fff0]/30 to-[#fff]/30 blur-lg" />
          <CardHeader className="relative text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-r from-[#ffc107] to-[#00fff0] p-3 mb-4 shadow-lg">
              <FileCode2 className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-xl">
              Your AI Website Builder, your way
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 rounded-lg bg-black/5 dark:bg-white/5">
                <div className="text-sm font-semibold mb-2 text-foreground">
                  1. Clone
                </div>
                <pre className="text-xs md:text-sm text-muted-foreground overflow-auto">
                  git clone &lt;your-fork&gt; && cd zync
                </pre>
              </div>
              <div className="p-4 rounded-lg bg-black/5 dark:bg-white/5">
                <div className="text-sm font-semibold mb-2 text-foreground">
                  2. Configure .env
                </div>
                <pre className="text-xs md:text-sm text-muted-foreground overflow-auto">
                  OPENAI_API_KEY=...
                  <br />
                  ANTHROPIC_API_KEY=...
                  <br />
                  E2B_API_KEY=...
                </pre>
              </div>
              <div className="p-4 rounded-lg bg-black/5 dark:bg-white/5">
                <div className="text-sm font-semibold mb-2 text-foreground">
                  3. Customize prompts
                </div>
                <pre className="text-xs md:text-sm text-muted-foreground overflow-auto">
                  {
                  }
                  <br />
                  {
                  }
                </pre>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <Link
                href="https://github.com/Rewant-1/zync"
                className="flex items-center gap-4 bg-gradient-to-r from-[#ffc107] to-[#00fff0] text-black hover:from-[#00fff0] hover:to-[#ffc107] shadow-lg px-6 py-3 rounded-lg transition-all duration-300"
              >
                <FileCode2 className="w-5 h-5" />
                <span>View Repository</span>
                <Star className="w-5 h-5" />
                <span>Star us on GitHub</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
};

export default OpenSource;
