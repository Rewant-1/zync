"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";

const testimonials = [
  {
    name: "Alex",
    role: "Frontend Engineer",
    content: "The multi-model fallback is incredible. I've never seen a generation fail.",
    initials: "AL",
  },
  {
    name: "Sarah",
    role: "Product Designer",
    content: "Finally, an AI builder that actually understands dark mode and padding.",
    initials: "SA",
  },
  {
    name: "Michael",
    role: "Startup Founder",
    content: "Built our entire MVP dashboard in 45 minutes. The code quality is insane.",
    initials: "MI",
  },
  {
    name: "Elena",
    role: "Fullstack Developer",
    content: "The fact that it uses proper Shadcn UI components is a game changer for me.",
    initials: "EL",
  },
  {
    name: "David",
    role: "Indie Hacker",
    content: "No more wrestling with dependencies. The E2B sandbox just works instantly.",
    initials: "DA",
  },
  {
    name: "Jessica",
    role: "UX Researcher",
    content: "The conversation memory lets me tweak designs perfectly without starting over.",
    initials: "JE",
  },
  {
    name: "Ryan",
    role: "Tech Lead",
    content: "Clean code, proper file structure. It writes code like a senior engineer.",
    initials: "RY",
  },
  {
    name: "Emma",
    role: "React Developer",
    content: "I use Zync to prototype components before I put them in our main codebase.",
    initials: "EM",
  },
];

const springTransition = {
  type: "spring" as const,
  stiffness: 40,
  damping: 20,
};

export const Testimonials = () => {
  // Split into two rows for the marquee
  const row1 = testimonials.slice(0, 4);
  const row2 = testimonials.slice(4, 8);

  const TestimonialCard = ({ item }: { item: typeof testimonials[0] }) => (
    <div className="flex-shrink-0 w-[300px] md:w-[350px] mx-3 rounded-2xl border border-white/[0.03] bg-[#050505] p-6 hover:bg-[#080808] transition-colors duration-500">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-xs font-medium text-white/70">
          {item.initials}
        </div>
        <div>
          <h4 className="text-sm font-medium text-white/90">{item.name}</h4>
          <p className="text-xs text-neutral-500 font-light">{item.role}</p>
        </div>
      </div>
      <p className="text-sm text-neutral-400 font-light leading-relaxed">
        &quot;{item.content}&quot;
      </p>
    </div>
  );

  return (
    <LazyMotion features={domAnimation}>
      <section className="relative py-32 overflow-hidden bg-black">
        <div className="relative z-10 max-w-7xl mx-auto">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={springTransition}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16 px-4"
          >
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-5">
              Loved by <span className="text-white/40">Builders</span>
            </h2>
            <p className="text-lg text-neutral-400 font-light tracking-wide">
              Join thousands of developers shipping faster.
            </p>
          </m.div>

          <m.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative flex flex-col gap-6"
          >
            {/* Fade Edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

            {/* Row 1 */}
            <div className="flex overflow-hidden">
              <div className="flex animate-marquee hover:[animation-play-state:paused]">
                {[...row1, ...row1, ...row1].map((item, i) => (
                  <TestimonialCard key={`r1-${i}`} item={item} />
                ))}
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex overflow-hidden">
              <div className="flex animate-marquee-reverse hover:[animation-play-state:paused]">
                {[...row2, ...row2, ...row2].map((item, i) => (
                  <TestimonialCard key={`r2-${i}`} item={item} />
                ))}
              </div>
            </div>
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
};
