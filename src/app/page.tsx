import { Hero } from "@/modules/landing/ui/components/hero";
import { Features } from "@/modules/landing/ui/components/features";
import { Demo } from "@/modules/landing/ui/components/demo";
import { Testimonials } from "@/modules/landing/ui/components/testimonials";
import { Pricing } from "@/modules/landing/ui/components/pricing";
import { FAQ } from "@/modules/landing/ui/components/faq";
import { Footer } from "@/modules/landing/ui/components/footer";
import { LandingNavbar } from "@/modules/landing/ui/components/landing-navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <main className="relative">
        <Hero />
        <Features />
        <Demo />
        <Testimonials />
        <Pricing />
        <FAQ />
        <Footer />
      </main>
    </div>
  );
}
