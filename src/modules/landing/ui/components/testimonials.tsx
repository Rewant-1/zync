"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior Frontend Developer",
    company: "TechCorp",
    avatar: "/api/placeholder/40/40",
    rating: 5,
    quote:
      "zync transformed our development process. What used to take weeks now takes hours. The AI-generated code is production-ready and follows our coding standards perfectly.",
  },
  {
    name: "Marcus Rodriguez",
    role: "Startup Founder",
    company: "InnovateLab",
    avatar: "/api/placeholder/40/40",
    rating: 5,
    quote:
      "As a non-technical founder, zync allowed me to prototype and validate ideas rapidly. I built my MVP in a weekend without writing a single line of code.",
  },
  {
    name: "Emily Wang",
    role: "Full Stack Developer",
    company: "DevStudio",
    avatar: "/api/placeholder/40/40",
    rating: 5,
    quote:
      "The real-time collaboration features are game-changing. Our distributed team can now work together seamlessly on complex projects.",
  },
  {
    name: "David Thompson",
    role: "Engineering Manager",
    company: "ScaleUp Inc",
    avatar: "/api/placeholder/40/40",
    rating: 5,
    quote:
      "zync's type-safe environments and automated testing caught issues that would have made it to production. It's like having a senior developer reviewing every line.",
  },
  {
    name: "Lisa Park",
    role: "Product Manager",
    company: "NextGen Solutions",
    avatar: "/api/placeholder/40/40",
    rating: 5,
    quote:
      "The speed at which we can iterate on product ideas is incredible. zync bridges the gap between product vision and technical implementation.",
  },
  {
    name: "Alex Kumar",
    role: "Independent Developer",
    company: "Freelance",
    avatar: "/api/placeholder/40/40",
    rating: 5,
    quote:
      "I can now take on projects that would have been impossible before. zync multiplies my productivity and lets me compete with larger development teams.",
  },
];

const useCases = [
  {
    title: "Rapid Prototyping",
    description: "Turn ideas into working prototypes in minutes",
    examples: ["Landing pages", "Admin dashboards", "Mobile apps"],
  },
  {
    title: "Production Applications",
    description: "Build scalable, production-ready applications",
    examples: ["E-commerce platforms", "SaaS products", "Enterprise tools"],
  },
  {
    title: "Learning & Education",
    description:
      "Perfect for students and developers learning new technologies",
    examples: ["Code examples", "Tutorial projects", "Skill building"],
  },
];

export const Testimonials = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Gradient transition from hero */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.08),transparent_50%)]" />

      {/* Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Loved by{" "}
            <span className="bg-gradient-to-r from-blue-600 to-amber-500 bg-clip-text text-transparent">
              Developers
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of developers who are building faster and smarter
            with zync.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.04 }}
            >
              <Card className="h-full border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 glass group-hover:scale-105 relative overflow-hidden">
                {/* Animated glowing border */}
                <div className="absolute -inset-1 rounded-2xl pointer-events-none group-hover:opacity-100 opacity-0 transition-all duration-300 bg-gradient-to-r from-[#ffc107]/30 via-[#00fff0]/30 to-[#fff]/30 blur-lg" />
                <CardContent className="p-6">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-amber-500 text-white">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-sm">
                        {testimonial.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Use Cases Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Perfect for Every Use Case
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you&apos;re prototyping, building production apps, or
            learning new technologies.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.05 }}
            >
              <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 group relative overflow-hidden">
                {/* Animated glowing border */}
                <div className="absolute -inset-1 rounded-2xl pointer-events-none group-hover:opacity-100 opacity-0 transition-all duration-300 bg-gradient-to-r from-[#ffc107]/30 via-[#00fff0]/30 to-[#fff]/30 blur-lg" />
                <CardContent className="p-8">
                  <h4 className="text-xl font-bold mb-3 group-hover:text-[#ffc107] transition-colors duration-300">
                    {useCase.title}
                  </h4>
                  <p className="text-muted-foreground mb-6 group-hover:text-neutral-400 transition-colors duration-300">
                    {useCase.description}
                  </p>
                  <div className="space-y-2">
                    {useCase.examples.map((example, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-center gap-2 text-sm group-hover:text-[#00fff0] transition-colors duration-300"
                      >
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-amber-500 rounded-full" />
                        {example}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
