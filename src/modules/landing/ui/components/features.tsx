"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Code2, 
  Users, 
  Shield, 
  Zap, 
  GitBranch, 
  Globe,
  Cpu,
  Sparkles
} from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "AI-Driven Code Generation",
    description: "Generate complete, production-ready applications from simple descriptions using advanced AI models.",
    gradient: "from-[#b96aff] to-[#00fff0]"
  },
  {
    icon: Users,
    title: "Real-Time Collaboration",
    description: "Work together with your team in real-time, sharing ideas and building applications collaboratively.",
    gradient: "from-[#fff] to-[#b96aff]"
  },
  {
    icon: Shield,
    title: "Type-Safe Environments",
    description: "Built-in TypeScript support ensures type safety and reduces runtime errors in your applications.",
    gradient: "from-[#00fff0] to-[#b96aff]"
  },
  {
    icon: Zap,
    title: "Sandboxed Execution",
    description: "Secure, isolated environments for testing and running your applications without security concerns.",
    gradient: "from-[#b96aff] to-[#00fff0]"
  },
  {
    icon: GitBranch,
    title: "Version Control",
    description: "Integrated version control system to track changes and collaborate on different versions of your project.",
    gradient: "from-pink-500 to-rose-500"
  },
  {
    icon: Globe,
    title: "Instant Deployment",
    description: "Deploy your applications instantly with one click to multiple cloud platforms and CDNs.",
    gradient: "from-indigo-500 to-blue-500"
  },
  {
    icon: Cpu,
    title: "Optimized Performance",
    description: "Automatically optimized code generation with performance best practices built-in from the start.",
    gradient: "from-[#fff] to-[#b96aff]"
  },
  {
    icon: Sparkles,
    title: "Smart Templates",
    description: "Pre-built templates and components library to accelerate your development process.",
    gradient: "from-[#00fff0] to-[#b96aff]"
  }
];

export const Features = () => {
  return (
    <section id="features" className="section-bg py-24">
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
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Build Faster
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Powerful features designed to streamline your development workflow and accelerate your time to market.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.04 }}
                className="group"
              >
                <Card className="h-full border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 bg-white/90 dark:bg-background/90 backdrop-blur-md group-hover:border-2 group-hover:border-violet-400 dark:group-hover:border-violet-700 group-hover:scale-105 group-hover:bg-white/95 dark:group-hover:bg-background/95 relative overflow-hidden">
                  {/* Animated glowing border */}
                  <div className="absolute -inset-1 rounded-2xl pointer-events-none group-hover:opacity-100 opacity-0 transition-all duration-300 bg-gradient-to-r from-blue-500/30 via-violet-500/30 to-purple-500/30 blur-lg" />
                  <CardHeader className="text-center pb-4">
                    <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-r ${feature.gradient} p-3 mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/10`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg font-semibold group-hover:text-foreground transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-center text-muted-foreground leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Feature Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <Card className="bg-gradient-to-r from-blue-50 via-violet-50 to-purple-50 dark:from-blue-950/30 dark:via-violet-950/30 dark:to-purple-950/30 border border-violet-200/50 dark:border-violet-800/50 shadow-xl">
            <CardContent className="p-12 text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                From Idea to Production in{" "}
                <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  Minutes
                </span>
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Skip the boilerplate and focus on what matters. Our AI understands your requirements 
                and generates clean, maintainable code that follows industry best practices.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
