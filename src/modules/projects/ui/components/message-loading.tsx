"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const LOADING_MESSAGES = [
  "Thinking...",
  "Loading...",
  "Generating ...",
  "Analyzing your request...",
  "Crafting a response...",
  "Fetching data...",
  "Building website...",
  "Optimizing layouts...",
  "Final touches...",
] as const;

const ShimmerMessages = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(
        (prevIndex) => (prevIndex + 1) % LOADING_MESSAGES.length
      );
  }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 min-h-6">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={currentMessageIndex}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="text-muted-foreground text-base"
        >
          {LOADING_MESSAGES[currentMessageIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export const MessageLoading = () => {
  return (
    <div className="flex flex-col group pb-4 px-2">
      <div className="flex items-center gap-2 pl-2 mb-2">
        <Image
          src="/logo.png"
          alt="zync"
          width={18}
          height={18}
          className="shrink-0"
        />
        <span className="text-sm font-medium">zync</span>
      </div>
      <div className="pl-8.5 flex flex-col gap-y-4">
        <ShimmerMessages />
      </div>
    </div>
  );
};
