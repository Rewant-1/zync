// Root layout component for the application
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/client";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";

// Load Inter font with optimal display strategy
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
  // Main layout wrapping the app with authentication, theme, and tRPC providers
  return (
    <ClerkProvider
      appearance={{
        // Custom dark theme that matches Zync's cyber aesthetic
        variables: {
          colorPrimary: "#ffc107",           // Amber primary
          colorBackground: "#0a0a0a",       // Deep black background
          colorInputBackground: "#1a1a1a",  // Dark input fields
          colorInputText: "#ffffff",        // White text
          colorText: "#ffffff",             // Primary text color
          colorTextSecondary: "#a1a1aa",    // Muted gray text
          colorSuccess: "#00fff0",          // Cyan success color
          borderRadius: "0.75rem",          // Rounded corners
          fontFamily: "var(--font-inter)",  // Match app font
        },
        elements: {
          // Auth modal styling to match app design
          card: {
            backgroundColor: "#0a0a0a",
            border: "1px solid rgba(255, 193, 7, 0.12)",
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
          // Gradient button effect
          formButtonPrimary: {
            background: "linear-gradient(135deg, #ffc107 0%, #00fff0 100%)",
            color: "#000000",
            fontWeight: "600",
            borderRadius: "0.5rem",
            "&:hover": {
              background: "linear-gradient(135deg, #00fff0 0%, #ffc107 100%)",
            },
          },
          formFieldInput: {
            backgroundColor: "#1a1a1a",
            border: "1px solid rgba(255, 193, 7, 0.12)",
            borderRadius: "0.5rem",
            color: "#ffffff",
            "&:focus": {
              borderColor: "#ffc107",
              boxShadow: "0 0 0 3px rgba(255, 193, 7, 0.12)",
            },
          },
          formFieldLabel: {
            color: "#ffffff",
            fontWeight: "500",
          },
          socialButtonsBlockButton: {
            border: "1px solid rgba(255, 193, 7, 0.12)",
            backgroundColor: "#1a1a1a",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "#2a2a2a",
            },
          },
          footerActionLink: {
            color: "#ffc107",
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
            {/* Preload fonts for better performance */}
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
              {/* Global toast notifications */}
              <Toaster />
              {children}
            </ThemeProvider>
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
