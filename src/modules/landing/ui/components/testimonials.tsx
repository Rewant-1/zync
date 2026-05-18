"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import OpenSource from "@/modules/landing/ui/components/open-source";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior Frontend Developer",
    company: "TechCorp",
    rating: 5,
    quote:
      "zync transformed our prototyping workflow. What took days of boilerplate now takes minutes. The generated code actually follows React best practices.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    name: "Marcus Rodriguez",
    role: "Startup Founder",
    company: "InnovateLab",
    rating: 5,
    quote:
      "As a non-technical founder, I built and validated my MVP in a weekend. The live sandbox preview meant I could iterate in real-time without any setup.",
    gradient: "from-cyan-400 to-teal-500",
  },
  {
    name: "Emily Wang",
    role: "Full Stack Developer",
    company: "DevStudio",
    rating: 5,
    quote:
      "The multi-model fallback is a game-changer. I've never had a failed generation — if one model is busy, it just switches seamlessly.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    name: "David Thompson",
    role: "Engineering Manager",
    company: "ScaleUp Inc",
    rating: 5,
    quote:
      "The import validation system catches issues before they hit the sandbox. It's like having a senior dev checking every generated file.",
    gradient: "from-emerald-400 to-green-500",
  },
  {
    name: "Lisa Park",
    role: "Product Manager",
    company: "NextGen Solutions",
    rating: 5,
    quote:
      "We use zync for rapid proof-of-concepts. Stakeholders can see a working prototype the same day we discuss a feature — that's powerful.",
    gradient: "from-rose-400 to-pink-500",
  },
  {
    name: "Alex Kumar",
    role: "Independent Developer",
    company: "Freelance",
    rating: 5,
    quote:
      "Open source, no vendor lock-in, and I can customize the prompts. This is what AI dev tools should be — transparent and extensible.",
    gradient: "from-blue-400 to-indigo-500",
  },
];

// Split into two rows for marquee
const row1 = testimonials.slice(0, 3);
const row2 = testimonials.slice(3, 6);

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div className="flex-shrink-0 w-[350px] rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-6 mx-3 hover:border-white/[0.12] transition-all duration-300">
      {/* Rating */}
      <div className="flex items-center gap-0.5 mb-4">
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-[#ffc107] text-[#ffc107]" />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-sm text-neutral-300 mb-5 leading-relaxed min-h-[80px]">
        &ldquo;{t.quote}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3">
        <Avatar className="w-9 h-9 ring-2 ring-white/[0.06]">
          <AvatarFallback className={`bg-gradient-to-br ${t.gradient} text-white text-xs font-semibold`}>
            {t.name.split(" ").map((n) => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="text-sm font-medium text-white">{t.name}</div>
          <div className="text-xs text-neutral-500">
            {t.role} · {t.company}
          </div>
        </div>
      </div>
    </div>
  );
}

export const Testimonials = () => {
  return (
    <LazyMotion features={domAnimation}>
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.05),transparent_50%)]" />

        <div className="relative z-10">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-14 px-4"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Loved by{" "}
              <span className="bg-gradient-to-r from-[#ffc107] to-[#00fff0] bg-clip-text text-transparent">
                Builders
              </span>
            </h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Join developers who ship faster with Zync.
            </p>
          </m.div>

          {/* Marquee Row 1 */}
          <div className="relative mb-4">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10" />
            <div className="flex animate-marquee">
              {[...row1, ...row1, ...row1, ...row1].map((t, i) => (
                <TestimonialCard key={`r1-${i}`} t={t} />
              ))}
            </div>
          </div>

          {/* Marquee Row 2 (reverse) */}
          <div className="relative mb-16">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10" />
            <div className="flex animate-marquee-reverse">
              {[...row2, ...row2, ...row2, ...row2].map((t, i) => (
                <TestimonialCard key={`r2-${i}`} t={t} />
              ))}
            </div>
          </div>

          {/* Open Source Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <OpenSource />
          </div>
        </div>
      </section>
    </LazyMotion>
  );
};
