"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  MapPin,
  ArrowRight
} from "lucide-react";

const footerSections = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "Demo", href: "#demo" },
      { name: "Updates", href: "#" },
    ]
  },
  {
    title: "Developers",
    links: [
      { name: "Documentation", href: "#" },
      { name: "API Reference", href: "#" },
      { name: "Examples", href: "#" },
      { name: "Community", href: "#" },
    ]
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Press", href: "#" },
    ]
  },
  {
    title: "Support",
    links: [
      { name: "Help Center", href: "#" },
      { name: "Contact", href: "#" },
      { name: "Status", href: "#" },
      { name: "FAQ", href: "#faq" },
    ]
  }
];

const socialLinks = [
  { name: "GitHub", icon: Github, href: "#", color: "hover:text-gray-900 dark:hover:text-gray-100" },
  { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-blue-500" },
  { name: "LinkedIn", icon: Linkedin, href: "#", color: "hover:text-blue-600" },
  { name: "Email", icon: Mail, href: "mailto:hello@zync.dev", color: "hover:text-red-500" },
];

export const Footer = () => {
  return (
    <footer className="section-bg border-t overflow-hidden">
      <div className="absolute inset-0 bg-black/80" />
      <div className="section-overlay">
        <div className="neon-blob-1" />
        <div className="neon-blob-2" />
      </div>
      {/* Newsletter Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="glass"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Stay Updated with{" "}
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                zync
              </span>
            </h3>
            <p className="text-muted-foreground mb-8">
              Get the latest updates, features, and developer resources delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-[#b96aff] bg-black text-white focus:outline-none focus:ring-2 focus:ring-[#00fff0]"
              />
              <Button className="bg-[#00fff0] text-black px-6 group shadow-lg shadow-[#00fff0]/40 border-2 border-transparent hover:border-[#b96aff] hover:shadow-xl hover:shadow-[#b96aff]/60 transition-all duration-300 rounded-lg animate-glow">
                Subscribe
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform text-black" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Footer */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="zync" width={32} height={32} />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                zync
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-xs leading-relaxed">
              Build web applications faster than ever with AI-powered code generation and intelligent development tools.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <MapPin className="w-4 h-4" />
              San Francisco, CA
            </div>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`text-muted-foreground ${social.color} transition-colors duration-300`}
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Links Sections */}
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold text-foreground mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <Separator className="my-12 bg-gradient-to-r from-[#b96aff]/30 via-[#00fff0]/30 to-[#fff]/30 h-1 rounded-full" />

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
            <span>© 2025 zync. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <Link href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  className={`text-[#b96aff] hover:text-[#00fff0] transition-colors duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.7)]`}
                  aria-label={social.name}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
