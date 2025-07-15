"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "How does zync generate code?",
    answer: "zync uses advanced AI models trained on millions of code repositories and best practices. When you describe your application, our AI understands the requirements and generates clean, production-ready code following industry standards and your specified tech stack."
  },
  {
    question: "Can I customize the generated code?",
    answer: "Absolutely! All generated code is fully editable and customizable. You have complete control over the codebase and can modify, extend, or refactor it as needed. The AI serves as a starting point to accelerate your development process."
  },
  {
    question: "What technologies does zync support?",
    answer: "zync supports popular modern technologies including React, Next.js, Vue, Angular, Node.js, Python, TypeScript, JavaScript, and many more. We regularly update our AI models to support the latest frameworks and libraries."
  },
  {
    question: "Is my code and data secure?",
    answer: "Security is our top priority. All code is stored in encrypted repositories, and we use industry-standard security practices. Your code remains private and is never used to train our AI models without explicit permission."
  },
  {
    question: "How does real-time collaboration work?",
    answer: "Our collaboration features allow multiple team members to work on the same project simultaneously. Changes are synchronized in real-time, and you can see who's working on what. It's like Google Docs for code development."
  },
  {
    question: "Can I deploy my applications directly from zync?",
    answer: "Yes! zync integrates with popular deployment platforms like Vercel, Netlify, AWS, and more. You can deploy your applications with a single click directly from the platform."
  },
  {
    question: "What if I need help or have issues?",
    answer: "We offer comprehensive support including documentation, community forums, and direct support channels. Pro and Enterprise users get priority support with faster response times."
  },
  {
    question: "Can I migrate existing projects to zync?",
    answer: "Yes, you can import existing projects into zync. Our platform can analyze your existing codebase and help you extend or refactor it using AI assistance while maintaining your current structure and patterns."
  },
  {
    question: "Is there a free trial for paid plans?",
    answer: "Yes! All paid plans come with a 14-day free trial. You can explore all features without any commitment. No credit card required for the trial period."
  }
];

export const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section id="faq" className="section-bg py-24 overflow-hidden">
      <div className="absolute inset-0 bg-black/80" />
      <div className="section-overlay">
        <div className="neon-blob-1" />
        <div className="neon-blob-2" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about zync. Can&apos;t find the answer you&apos;re looking for? 
            Feel free to reach out to our support team.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
            >
              <Card className="border-0 shadow-2xl hover:shadow-3xl transition-shadow duration-300 glass group-hover:scale-105 relative overflow-hidden">
                {/* Animated glowing border */}
                <div className="absolute -inset-1 rounded-2xl pointer-events-none group-hover:opacity-100 opacity-0 transition-all duration-300 bg-gradient-to-r from-[#b96aff]/30 via-[#00fff0]/30 to-[#fff]/30 blur-lg" />
                <Collapsible 
                  open={openItems.includes(index)}
                  onOpenChange={() => toggleItem(index)}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors duration-200 p-6">
                      <CardTitle className="flex items-center justify-between text-left">
                        <span className="text-lg font-semibold pr-8">{faq.question}</span>
                        {openItems.includes(index) ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        )}
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 pb-6 px-6">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950/20 dark:to-violet-950/20 border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
              <p className="text-muted-foreground mb-6">
                Our team is here to help. Get in touch and we&apos;ll get back to you as soon as possible.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:support@zync.dev" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg hover:from-blue-700 hover:to-violet-700 transition-all duration-300 font-medium"
                >
                  Contact Support
                </a>
                <a 
                  href="#" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-300 font-medium"
                >
                  Join Community
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
