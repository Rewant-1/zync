"use client";

import dynamic from "next/dynamic";

const ChromeGridDynamic = dynamic(
  () => import("@/components/ui/chrome-grid").then((mod) => ({ default: mod.ChromeGrid })),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-8 md:grid-cols-12 lg:grid-cols-16 gap-2 p-4 h-full">
            {Array.from({ length: 128 }).map((_, i) => (
              <div key={i} className="bg-gray-700/30 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    ),
  }
);

export { ChromeGridDynamic as ChromeGrid };
