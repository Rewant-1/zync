import { Navbar } from "@/modules/home/ui/components/navbar";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "sonner";

interface Props {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  return (
    <TRPCReactProvider>
      <Toaster />
      <div className="flex flex-col min-h-screen max-h-screen bg-[#0a0a0a]">
        <Navbar />
        <div className="flex-1 flex flex-col px-4 pb-4 relative">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[30vw] rounded-full bg-gradient-to-br from-[#ffc107]/10 via-[#00fff0]/8 to-[#fff]/5 blur-3xl opacity-40" />
            <div className="absolute right-0 bottom-0 w-1/4 h-1/4 bg-gradient-to-tr from-[#00fff0]/8 to-[#ffc107]/6 rounded-full blur-2xl opacity-30" />
          </div>
          <div className="relative z-10">{children}</div>
        </div>
      </div>
    </TRPCReactProvider>
  );
};

export default DashboardLayout;
