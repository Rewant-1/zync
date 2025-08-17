import { LandingNavbar } from "@/modules/landing/ui/components/landing-navbar";

interface Props {
  children: React.ReactNode;
}

const LandingLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <main className="relative">{children}</main>
    </div>
  );
};

export default LandingLayout;
