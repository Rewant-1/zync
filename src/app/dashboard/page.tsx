"use client";

import { useState } from "react";
import { ProjectForm } from "@/modules/home/ui/components/project-form";
import { ProjectsList } from "@/modules/home/ui/components/projects-list";
import { CreatorMode } from "@/modules/home/ui/components/creator-mode";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Zap, Palette } from "lucide-react";

const DashboardPage = () => {
  const [mode, setMode] = useState<"quick" | "creator">("quick");

  return (
    <div className="flex flex-col max-w-6xl mx-auto w-full">
      
      <section className="space-y-8 py-16">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-[#00fff0]">zync</span>
          </div>
          
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white">
              Build Something{" "}
              <span className="text-[#b96aff]">Amazing</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto">
              Create apps and websites by chatting with AI. Turn your ideas into reality.
            </p>
          </div>

          <div className="flex items-center p-1.5 bg-[rgba(185,106,255,0.05)] border border-[rgba(185,106,255,0.2)] rounded-full max-w-md mx-auto">
            <Button
              variant="ghost"
              className={cn(
                "flex-1 rounded-full px-6 py-2 text-sm font-medium transition-all duration-300",
                mode === "quick"
                  ? "bg-[#00fff0] text-black hover:bg-[#00fff0]/90 shadow-lg shadow-[#00fff0]/20"
                  : "text-neutral-400 hover:text-white hover:bg-[rgba(185,106,255,0.1)]"
              )}
              onClick={() => setMode("quick")}
            >
              <Zap className="w-4 h-4 mr-2" />
              Quick Mode
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "flex-1 rounded-full px-6 py-2 text-sm font-medium transition-all duration-300",
                mode === "creator"
                  ? "bg-[#b96aff] text-white hover:bg-[#b96aff]/90 shadow-lg shadow-[#b96aff]/20"
                  : "text-neutral-400 hover:text-white hover:bg-[rgba(185,106,255,0.1)]"
              )}
              onClick={() => setMode("creator")}
            >
              <Palette className="w-4 h-4 mr-2" />
              Creator Mode
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto w-full">
          {mode === "quick" ? <ProjectForm /> : <CreatorMode />}
        </div>
      </section>

      <div className="pb-16">
        <ProjectsList />
      </div>
    </div>
  );
};

export default DashboardPage;
