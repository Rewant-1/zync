"use client";

import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { MessageSquare, Bot, Code, Play } from "lucide-react";
import { useEffect, useState, useRef } from "react";

// Apple-style sleek presentation workflow
const DEMO_STEPS = [
  {
    type: "user" as const,
    text: "Build a sleek, dark-mode task board with drag-and-drop functionality.",
    delay: 0,
  },
  {
    type: "thinking" as const,
    text: "",
    delay: 3500,
  },
  {
    type: "code" as const,
    text: "",
    code: `import { useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

export default function Board() {
  const [columns, setColumns] = useState(initialData);

  const onDragEnd = (result) => {
    // Elegant drag handling logic
    const { destination, source } = result;
    if (!destination) return;
    
    // Smooth state transition
    setColumns(prev => updateColumns(prev, result));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white/90 p-8">
      <DragDropContext onDragEnd={onDragEnd}>
        {/* Render columns gracefully */}
      </DragDropContext>
    </div>
  );
}`,
    delay: 7000,
  },
  {
    type: "preview" as const,
    text: "",
    delay: 12000,
  },
];

const springTransition = {
  type: "spring" as const,
  stiffness: 40,
  damping: 20,
};

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
    }, 40);
    return () => clearInterval(interval);
  }, [text, onComplete]);

  return (
    <span className="font-light tracking-wide text-white/90">
      {displayed}
      {displayed.length < text.length && (
        <span className="inline-block w-1.5 h-4 ml-0.5 align-middle bg-white/70 animate-pulse" />
      )}
    </span>
  );
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-2 py-1">
      {[0, 1, 2].map((i) => (
        <m.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-white/50"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
        />
      ))}
      <span className="text-xs text-neutral-500 ml-3 font-medium uppercase tracking-widest">Synthesizing</span>
    </div>
  );
}

export const DemoSection = () => {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [isInView]);

  useEffect(() => {
    if (!isInView) return;

    const timeouts: NodeJS.Timeout[] = [];
    DEMO_STEPS.forEach((step, i) => {
      const t = setTimeout(() => {
        setVisibleSteps((prev) => [...prev, i]);
      }, step.delay);
      timeouts.push(t);
    });

    const resetTimeout = setTimeout(() => {
      setVisibleSteps([]);
      setIsInView(false);
      setTimeout(() => setIsInView(true), 1000);
    }, 18000);
    timeouts.push(resetTimeout);

    return () => timeouts.forEach(clearTimeout);
  }, [isInView]);

  return (
    <LazyMotion features={domAnimation}>
      <section ref={sectionRef} className="relative py-32 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.02),transparent_70%)]" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Minimal Header */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={springTransition}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-5">
              The workflow, perfected.
            </h2>
            <p className="text-lg text-neutral-400 font-light max-w-xl mx-auto tracking-wide">
              Intelligence embedded at every step. From intent to deployment in seconds.
            </p>
          </m.div>

          {/* Apple-style Presentation Window */}
          <m.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ ...springTransition, delay: 0.2 }}
            className="rounded-[2rem] border border-white/[0.04] bg-[#050505] shadow-[0_0_80px_-20px_rgba(255,255,255,0.05)] overflow-hidden flex flex-col lg:flex-row"
          >
            {/* Left side: Context/Chat */}
            <div className="w-full lg:w-5/12 border-b lg:border-b-0 lg:border-r border-white/[0.04] bg-[#080808] p-8 md:p-10 flex flex-col">
              <div className="flex gap-2 mb-12">
                <div className="w-3 h-3 rounded-full bg-white/[0.1]" />
                <div className="w-3 h-3 rounded-full bg-white/[0.1]" />
                <div className="w-3 h-3 rounded-full bg-white/[0.1]" />
              </div>

              <div className="space-y-8 flex-1">
                <AnimatePresence mode="popLayout">
                  {visibleSteps.includes(0) && (
                    <m.div
                      key="prompt"
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, filter: "blur(4px)" }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-2 text-neutral-500">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="text-xs uppercase tracking-widest font-medium">Instruction</span>
                      </div>
                      <div className="text-lg leading-relaxed">
                        <TypingText text={DEMO_STEPS[0].text} />
                      </div>
                    </m.div>
                  )}

                  {visibleSteps.includes(1) && !visibleSteps.includes(2) && (
                    <m.div
                      key="thinking"
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                      className="pt-6 border-t border-white/[0.02]"
                    >
                      <ThinkingDots />
                    </m.div>
                  )}

                  {visibleSteps.includes(2) && (
                    <m.div
                      key="result"
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="pt-6 border-t border-white/[0.02]"
                    >
                      <div className="flex items-center gap-2 text-white/50 mb-3">
                        <Bot className="w-3.5 h-3.5" />
                        <span className="text-xs uppercase tracking-widest font-medium">Zync Engine</span>
                      </div>
                      <p className="text-sm text-neutral-300 font-light leading-relaxed">
                        Architecture generated. Sandboxed environment initialized. Live preview is now streaming.
                      </p>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right side: Editor & Preview */}
            <div className="w-full lg:w-7/12 bg-black relative min-h-[400px] flex flex-col">
              {/* Tabs */}
              <div className="flex items-center gap-6 px-8 py-4 border-b border-white/[0.02]">
                <div className="flex items-center gap-2">
                  <Code className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="text-xs text-neutral-400 font-medium tracking-wider">Board.tsx</span>
                </div>
                <div className={`flex items-center gap-2 transition-opacity duration-1000 ${visibleSteps.includes(3) ? 'opacity-100' : 'opacity-0'}`}>
                  <Play className="w-3 h-3 text-white/70" />
                  <span className="text-xs text-white/70 font-medium tracking-wider">Preview</span>
                </div>
              </div>

              {/* Code Surface */}
              <div className="p-8 flex-1 relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {visibleSteps.includes(2) && !visibleSteps.includes(3) && (
                    <m.div
                      key="code"
                      initial={{ opacity: 0, filter: "blur(4px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="absolute inset-8"
                    >
                      <pre className="text-[11px] md:text-xs font-mono leading-loose text-neutral-400">
                        {DEMO_STEPS[2].code?.split("\n").map((line, i) => (
                          <m.div
                            key={i}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 + 0.2, duration: 0.5 }}
                          >
                            <span className="opacity-30 mr-6 select-none w-4 inline-block text-right">{i + 1}</span>
                            <span>{colorizeMinimal(line)}</span>
                          </m.div>
                        ))}
                      </pre>
                    </m.div>
                  )}

                  {visibleSteps.includes(3) && (
                    <m.div
                      key="preview"
                      initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-8 rounded-xl border border-white/[0.05] bg-[#080808] flex items-center justify-center overflow-hidden"
                    >
                      {/* Elegant Mini UI Preview */}
                      <div className="w-full max-w-sm px-6">
                        <div className="grid grid-cols-3 gap-4">
                          {["To Do", "In Progress", "Done"].map((col, i) => (
                            <div key={col} className="space-y-3">
                              <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-medium">{col}</div>
                              {Array.from({ length: 3 - i }).map((_, j) => (
                                <m.div
                                  key={j}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.8 + (i * 2 + j) * 0.1, duration: 0.8 }}
                                  className="h-16 rounded-lg bg-white/[0.03] border border-white/[0.02] shadow-sm flex flex-col justify-between p-3"
                                >
                                  <div className="w-3/4 h-1.5 rounded-full bg-white/[0.1]" />
                                  <div className="flex justify-between items-center">
                                    <div className="w-1/3 h-1.5 rounded-full bg-white/[0.05]" />
                                    <div className="w-4 h-4 rounded-full bg-white/[0.08]" />
                                  </div>
                                </m.div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
};

// Minimal monochrome syntax coloring
function colorizeMinimal(line: string): React.ReactNode {
  const keywords = ["export", "default", "function", "return", "import", "from", "const", "if"];
  const variables = ["useState", "DragDropContext", "Droppable", "Board", "onDragEnd"];
  
  let result = line;
  if (line.trim().startsWith("//")) {
    return <span className="text-white/30 italic">{line}</span>;
  }
  
  const parts: React.ReactNode[] = [];
  let remaining = line;
  let key = 0;

  for (const kw of [...keywords, ...variables]) {
    const idx = remaining.indexOf(kw);
    if (idx !== -1) {
      if (idx > 0) parts.push(<span key={key++}>{remaining.slice(0, idx)}</span>);
      parts.push(
        <span key={key++} className={keywords.includes(kw) ? "text-white/80" : "text-white/60"}>
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
