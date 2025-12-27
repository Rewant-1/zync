import type { ReactNode } from "react";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "sonner";

export default function ProjectsLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <TRPCReactProvider>
      <Toaster />
      {children}
    </TRPCReactProvider>
  );
}
