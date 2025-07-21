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
    question: "What if I need help or have issues?",
    answer: "We offer comprehensive support including documentation, community forums, and direct support channels. Pro and Enterprise users get priority support with faster response times."
  },
  
  {
    question: "I just want to try it out. Is there a free trial?",
    answer: "Yes! You are given 5 credits to try it out. You can explore all features without any commitment. No credit card required for the trial period."
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
    <section id="faq" className="relative py-24 overflow-hidden">
      {/* Final gradient transition */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(186,85,255,0.02),transparent_70%)]" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-heading">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-[#b96aff] to-[#00fff0] bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about zync.
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
              <Card className="border border-[rgba(185,106,255,0.15)] bg-card/80 backdrop-blur-sm hover:border-[rgba(185,106,255,0.3)] transition-all duration-300 hover:shadow-lg hover:shadow-[#b96aff]/10 group-hover:scale-105 relative overflow-hidden">
                <Collapsible 
                  open={openItems.includes(index)}
                  onOpenChange={() => toggleItem(index)}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-accent/10 transition-colors duration-200 p-6">
                      <CardTitle className="flex items-center justify-between text-left group">
                        <span className="text-lg font-semibold pr-8 font-heading group-hover:text-primary transition-colors">{faq.question}</span>
                        {openItems.includes(index) ? (
                          <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
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
      </div>
    </section>
  );
};
