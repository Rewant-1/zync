// Landing page component, redirects authenticated users to dashboard
import { Hero } from "@/modules/landing/ui/components/hero";
import { Features } from "@/modules/landing/ui/components/features";
import { Testimonials } from "@/modules/landing/ui/components/testimonials";
import { Pricing } from "@/modules/landing/ui/components/pricing";
import { FAQ } from "@/modules/landing/ui/components/faq";
import { Footer } from "@/modules/landing/ui/components/footer";
import { LandingNavbar } from "@/modules/landing/ui/components/landing-navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  // Renders the landing page with various sections
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <main className="relative">
        <Hero />
        <Features />
        <Testimonials />
        <Pricing />
        <FAQ />
        <Footer />
      </main>
    </div>
  );
}
