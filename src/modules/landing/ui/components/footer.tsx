"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

const footerSections = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "GitHub", href: "https://github.com/Rewant-1/zync" },
      { name: "Documentation", href: "#" },
      { name: "API Reference", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
    ],
  },
];

const socialLinks = [
  { name: "GitHub", icon: Github, href: "https://github.com/Rewant-1" },
  { name: "Twitter", icon: Twitter, href: "https://x.com/bruteBraut" },
  { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/in/rewant-bhriguvanshi/" },
  { name: "Email", icon: Mail, href: "mailto:shalinirps2@ece.du.ac.in" },
];

const springTransition = {
  type: "spring" as const,
  stiffness: 40,
  damping: 20,
};

export const Footer = () => {
  return (
    <LazyMotion features={domAnimation}>
      <footer className="relative border-t border-white/[0.04] overflow-hidden bg-black">
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 md:pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={springTransition}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <Link href="/" className="flex items-center gap-3 mb-6 group">
                <Image src="/logo.png" alt="zync" width={24} height={24} className="rounded-full opacity-90 group-hover:opacity-100 transition-opacity" />
                <span className="text-xl font-medium text-white tracking-tight">zync.</span>
              </Link>
              <p className="text-sm text-neutral-500 font-light mb-8 max-w-xs leading-relaxed tracking-wide">
                A premium intelligence layer for web development. Open source and unapologetically fast.
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/[0.04] flex items-center justify-center text-neutral-500 hover:text-white hover:border-white/[0.1] hover:bg-white/[0.05] transition-all duration-500"
                      aria-label={social.name}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </m.div>

            {/* Links */}
            {footerSections.map((section, index) => (
              <m.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ ...springTransition, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="text-xs font-semibold text-white/90 mb-6 uppercase tracking-widest">
                  {section.title}
                </h4>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-neutral-500 font-light hover:text-white transition-colors duration-500 tracking-wide"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </m.div>
            ))}
          </div>

          <Separator className="my-16 bg-white/[0.04]" />

          <m.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-center gap-6"
          >
            <span className="text-xs text-neutral-600 font-light tracking-wide">
              © {new Date().getFullYear()} zync. Engineered by{" "}
              <a
                href="https://github.com/Rewant-1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white font-medium transition-colors duration-500"
              >
                Rewant
              </a>
            </span>
          </m.div>
        </div>
      </footer>
    </LazyMotion>
  );
};
