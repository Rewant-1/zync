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
  {
    name: "GitHub",
    icon: Github,
    href: "https://github.com/Rewant-1",
  },
  {
    name: "Twitter",
    icon: Twitter,
    href: "https://x.com/bruteBraut",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    href: "https://www.linkedin.com/in/rewant-bhriguvanshi/",
  },
  {
    name: "Email",
    icon: Mail,
    href: "mailto:shalinirps2@ece.du.ac.in",
  },
];

export const Footer = () => {
  return (
    <LazyMotion features={domAnimation}>
      <footer className="relative border-t border-white/[0.06] overflow-hidden bg-black">
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Brand */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Image src="/logo.png" alt="zync" width={28} height={28} className="rounded-full" />
                <span className="text-lg font-bold text-white">zync</span>
              </Link>
              <p className="text-sm text-neutral-500 mb-6 max-w-xs leading-relaxed">
                Open source AI web app builder. Describe it, build it, ship it.
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
                      className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-neutral-500 hover:text-white hover:border-white/[0.12] hover:bg-white/[0.08] transition-all duration-300"
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
                transition={{ duration: 0.4, delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <h4 className="text-sm font-semibold text-neutral-300 mb-4 uppercase tracking-wider">
                  {section.title}
                </h4>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-neutral-500 hover:text-white transition-colors duration-300"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </m.div>
            ))}
          </div>

          <Separator className="my-10 bg-white/[0.06]" />

          <m.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <span className="text-xs text-neutral-600">
              © {new Date().getFullYear()} zync. Built by{" "}
              <a
                href="https://github.com/Rewant-1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                Rewant
              </a>
            </span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-neutral-600">All systems operational</span>
            </div>
          </m.div>
        </div>
      </footer>
    </LazyMotion>
  );
};
