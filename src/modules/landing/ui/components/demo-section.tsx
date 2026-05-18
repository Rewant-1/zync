"use client";

import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { MessageSquare, Bot, FileCode, Eye, ChevronRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";

// The animated demo workflow
const DEMO_STEPS = [
  {
    type: "user" as const,
    text: "Build me a task manager with drag and drop, dark theme, and categories",
    delay: 0,
  },
  {
    type: "thinking" as const,
    text: "",
    delay: 3200,
  },
  {
    type: "files" as const,
    text: "",
    files: ["src/App.tsx", "src/components/TaskBoard.tsx", "src/components/TaskCard.tsx", "src/lib/data.ts"],
    delay: 5000,
  },
  {
    type: "code" as const,
    text: "",
    code: `export const TaskBoard = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [draggedTask, setDraggedTask] = useState(null);

  return (
    <div className="grid grid-cols-3 gap-4">
      {columns.map(col => (
        <Column key={col.id} tasks={...} />
      ))}
    </div>
  );
};`,
    delay: 7000,
  },
  {
    type: "preview" as const,
    text: "",
    delay: 10000,
  },
];

// Typing animation for user message
function TypingText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        clearInterval(interval);
        onComplete?.();
      }
    }, 35);
    return () => clearInterval(interval);
  }, [text, onComplete]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && (
        <span className="animate-blink text-[#ffc107]">|</span>
      )}
    </span>
  );
}

// Thinking dots animation
function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      {[0, 1, 2].map((i) => (
        <m.div
          key={i}
          className="w-2 h-2 rounded-full bg-[#00fff0]/60"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
      <span className="text-sm text-neutral-500 ml-2">Analyzing & generating...</span>
    </div>
  );
}

export const DemoSection = () => {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasPlayed = useRef(false);

  // Intersection observer to start animation when in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPlayed.current) {
          setIsInView(true);
          hasPlayed.current = true;
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Trigger steps sequentially when in view
  useEffect(() => {
    if (!isInView) return;

    const timeouts: NodeJS.Timeout[] = [];
    DEMO_STEPS.forEach((step, i) => {
      const t = setTimeout(() => {
        setVisibleSteps((prev) => [...prev, i]);
      }, step.delay);
      timeouts.push(t);
    });

    // Loop: reset after full cycle
    const resetTimeout = setTimeout(() => {
      setVisibleSteps([]);
      hasPlayed.current = false;
      setTimeout(() => {
        hasPlayed.current = true;
        setIsInView(true);
      }, 500);
    }, 14000);
    timeouts.push(resetTimeout);

    return () => timeouts.forEach(clearTimeout);
  }, [isInView]);

  return (
    <LazyMotion features={domAnimation}>
      <section ref={sectionRef} className="relative py-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,255,240,0.04),transparent_60%)]" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              See Zync{" "}
              <span className="bg-gradient-to-r from-[#ffc107] to-[#00fff0] bg-clip-text text-transparent">
                in Action
              </span>
            </h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Describe what you want. Watch it come to life.
            </p>
          </m.div>

          {/* Demo Container */}
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-6"
          >
            {/* Left: Chat Interface */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c14]/80 backdrop-blur-xl overflow-hidden">
              {/* Window Chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <span className="text-xs text-neutral-500 ml-2 font-mono">zync — new project</span>
              </div>

              {/* Messages */}
              <div className="p-5 space-y-4 min-h-[380px]">
                <AnimatePresence mode="popLayout">
                  {/* User Message */}
                  {visibleSteps.includes(0) && (
                    <m.div
                      key="user-msg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ffc107]/20 to-[#ffc107]/5 border border-[#ffc107]/20 flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-4 h-4 text-[#ffc107]" />
                      </div>
                      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl rounded-tl-sm px-4 py-3 text-sm text-neutral-200 max-w-[85%]">
                        <TypingText text={DEMO_STEPS[0].text} />
                      </div>
                    </m.div>
                  )}

                  {/* AI Thinking */}
                  {visibleSteps.includes(1) && !visibleSteps.includes(2) && (
                    <m.div
                      key="thinking"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00fff0]/20 to-[#00fff0]/5 border border-[#00fff0]/20 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-[#00fff0]" />
                      </div>
                      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl rounded-tl-sm px-4 py-3">
                        <ThinkingDots />
                      </div>
                    </m.div>
                  )}

                  {/* Files Created */}
                  {visibleSteps.includes(2) && (
                    <m.div
                      key="files"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00fff0]/20 to-[#00fff0]/5 border border-[#00fff0]/20 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-[#00fff0]" />
                      </div>
                      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                        <p className="text-sm text-neutral-300 mb-3">Creating your task manager...</p>
                        <div className="space-y-1.5">
                          {DEMO_STEPS[2].files?.map((file, i) => (
                            <m.div
                              key={file}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.15 }}
                              className="flex items-center gap-2 text-xs"
                            >
                              <FileCode className="w-3.5 h-3.5 text-[#ffc107]" />
                              <span className="font-mono text-neutral-400">{file}</span>
                              <m.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.15 + 0.3 }}
                                className="text-green-400/80"
                              >
                                ✓
                              </m.span>
                            </m.div>
                          ))}
                        </div>
                      </div>
                    </m.div>
                  )}

                  {/* Preview Ready */}
                  {visibleSteps.includes(4) && (
                    <m.div
                      key="preview-msg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00fff0]/20 to-[#00fff0]/5 border border-[#00fff0]/20 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-[#00fff0]" />
                      </div>
                      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                        <p className="text-sm text-neutral-200">
                          Your task manager is ready! It has drag-and-drop columns, categories, and a dark theme. 
                          <span className="text-[#00fff0]"> Preview is live →</span>
                        </p>
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right: Code Preview */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c14]/80 backdrop-blur-xl overflow-hidden">
              {/* Window Chrome */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  </div>
                  <span className="text-xs text-neutral-500 ml-2 font-mono">TaskBoard.tsx</span>
                </div>
                {visibleSteps.includes(4) && (
                  <m.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-500/10 border border-green-500/20"
                  >
                    <Eye className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400 font-medium">Live</span>
                  </m.div>
                )}
              </div>

              {/* Code Content */}
              <div className="p-5 min-h-[380px] flex items-start">
                <AnimatePresence mode="wait">
                  {!visibleSteps.includes(3) ? (
                    <m.div
                      key="waiting"
                      className="flex items-center justify-center w-full h-full min-h-[300px]"
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-3">
                          <FileCode className="w-5 h-5 text-neutral-600" />
                        </div>
                        <p className="text-sm text-neutral-600">Waiting for generation...</p>
                      </div>
                    </m.div>
                  ) : (
                    <m.div
                      key="code"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="w-full"
                    >
                      <pre className="text-xs md:text-sm font-mono leading-relaxed">
                        {DEMO_STEPS[3].code?.split("\n").map((line, i) => (
                          <m.div
                            key={i}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="flex"
                          >
                            <span className="text-neutral-600 select-none w-8 text-right mr-4 flex-shrink-0">
                              {i + 1}
                            </span>
                            <span className="text-neutral-300">
                              {colorizeCode(line)}
                            </span>
                          </m.div>
                        ))}
                      </pre>

                      {/* Preview Overlay */}
                      {visibleSteps.includes(4) && (
                        <m.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="mt-6 rounded-xl border border-[#00fff0]/20 bg-[#00fff0]/[0.03] p-4"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Eye className="w-4 h-4 text-[#00fff0]" />
                            <span className="text-sm font-medium text-[#00fff0]">Live Preview</span>
                          </div>
                          {/* Mini task board preview */}
                          <div className="grid grid-cols-3 gap-2">
                            {["To Do", "In Progress", "Done"].map((col, i) => (
                              <div key={col} className="rounded-lg bg-white/[0.03] border border-white/[0.04] p-2">
                                <div className="text-[10px] font-semibold text-neutral-400 mb-1.5">{col}</div>
                                {Array.from({ length: 3 - i }).map((_, j) => (
                                  <m.div
                                    key={j}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 + (i * 3 + j) * 0.1 }}
                                    className="h-5 rounded bg-white/[0.04] border border-white/[0.04] mb-1"
                                  />
                                ))}
                              </div>
                            ))}
                          </div>
                        </m.div>
                      )}
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </m.div>

          {/* Bottom CTA */}
          <m.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <p className="text-sm text-neutral-500 flex items-center justify-center gap-2">
              <ChevronRight className="w-4 h-4 text-[#ffc107]" />
              No signup required to explore. Free forever for 5 generations/month.
            </p>
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
};

// Simple syntax coloring for the code preview
function colorizeCode(line: string): React.ReactNode {
  // Keywords
  const keywords = ["export", "const", "return", "import", "from"];
  const hooks = ["useState", "useEffect"];
  
  let result = line;
  
  // Very simple approach - just return colored spans for known patterns
  if (line.trim().startsWith("//")) {
    return <span className="text-neutral-600">{line}</span>;
  }
  
  const parts: React.ReactNode[] = [];
  let remaining = line;
  let key = 0;

  // Match keywords
  for (const kw of [...keywords, ...hooks]) {
    const idx = remaining.indexOf(kw);
    if (idx !== -1) {
      if (idx > 0) parts.push(<span key={key++}>{remaining.slice(0, idx)}</span>);
      parts.push(
        <span key={key++} className={hooks.includes(kw) ? "text-[#00fff0]" : "text-[#ffc107]"}>
          {kw}
        </span>
      );
      remaining = remaining.slice(idx + kw.length);
    }
  }
  
  if (parts.length > 0) {
    parts.push(<span key={key++}>{remaining}</span>);
    return <>{parts}</>;
  }
  
  return result;
}

export default DemoSection;
