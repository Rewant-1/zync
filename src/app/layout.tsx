import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/client";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zync-ashen.vercel.app/"),
  title: "zync - Build Web Apps with AI",
  description:
    "Transform your ideas into fully functional web applications with AI-driven code generation and sandboxed execution environments.",
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
  },
  openGraph: {
    title: "zync - Build Web Apps with AI",
    description:
      "Transform your ideas into fully functional web applications with AI-driven code generation and sandboxed execution environments.",
    type: "website",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#b96aff",
          colorBackground: "#0a0a0a",
          colorInputBackground: "#1a1a1a",
          colorInputText: "#ffffff",
          colorText: "#ffffff",
          colorTextSecondary: "#a1a1aa",
          colorSuccess: "#00fff0",
          borderRadius: "0.75rem",
          fontFamily: "var(--font-inter)",
        },
        elements: {
          card: {
            backgroundColor: "#0a0a0a",
            border: "1px solid rgba(186, 85, 255, 0.12)",
            borderRadius: "1rem",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
          },
          headerTitle: {
            color: "#ffffff",
            fontSize: "1.5rem",
            fontWeight: "600",
          },
          headerSubtitle: {
            color: "#a1a1aa",
          },
          formButtonPrimary: {
            background: "linear-gradient(135deg, #b96aff 0%, #00fff0 100%)",
            color: "#000000",
            fontWeight: "600",
            borderRadius: "0.5rem",
            "&:hover": {
              background: "linear-gradient(135deg, #00fff0 0%, #b96aff 100%)",
            },
          },
          formFieldInput: {
            backgroundColor: "#1a1a1a",
            border: "1px solid rgba(186, 85, 255, 0.12)",
            borderRadius: "0.5rem",
            color: "#ffffff",
            "&:focus": {
              borderColor: "#b96aff",
              boxShadow: "0 0 0 3px rgba(185, 106, 255, 0.1)",
            },
          },
          formFieldLabel: {
            color: "#ffffff",
            fontWeight: "500",
          },
          socialButtonsBlockButton: {
            border: "1px solid rgba(186, 85, 255, 0.12)",
            backgroundColor: "#1a1a1a",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "#2a2a2a",
            },
          },
          footerActionLink: {
            color: "#b96aff",
            "&:hover": {
              color: "#00fff0",
            },
          },
        },
      }}
    >
      <TRPCReactProvider>
        <html lang="en" suppressHydrationWarning>
          <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
              rel="preconnect"
              href="https://fonts.gstatic.com"
              crossOrigin="anonymous"
            />
          </head>
          <body className={`${inter.variable} antialiased`}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster />
              {children}
            </ThemeProvider>
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
