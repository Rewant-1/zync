"use client";

import dynamic from "next/dynamic";

const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => ({ default: mod.motion.div })),
  {
    ssr: false,
    loading: () => <div className="animate-pulse bg-muted/20 rounded" />,
  }
);

const MotionH1 = dynamic(
  () => import("framer-motion").then((mod) => ({ default: mod.motion.h1 })),
  {
    ssr: false,
    loading: () => <h1 className="animate-pulse bg-muted/20 rounded" />,
  }
);

const MotionP = dynamic(
  () => import("framer-motion").then((mod) => ({ default: mod.motion.p })),
  {
    ssr: false,
    loading: () => <p className="animate-pulse bg-muted/20 rounded" />,
  }
);

export { MotionDiv, MotionH1, MotionP };
