import type { Metadata } from "next";
import { Pricing as LandingPricing } from "@/modules/landing/ui/components/pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Compare zync plans and choose what fits your usage.",
  alternates: {
    canonical: "/pricing",
  },
};

const Page = () => {
  return <LandingPricing />;
};

export default Page;
