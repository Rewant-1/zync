// Root layout component for the application
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
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
  title: {
    default: "zync - Build Web Apps with AI",
    template: "%s | zync",
  },
  description:
    "Transform your ideas into fully functional web applications with AI-driven code generation and sandboxed execution environments.",
  applicationName: "zync",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "zync - Build Web Apps with AI",
    description:
      "Transform your ideas into fully functional web applications with AI-driven code generation and sandboxed execution environments.",
    type: "website",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "zync - Build Web Apps with AI",
    description:
      "Transform your ideas into fully functional web applications with AI-driven code generation and sandboxed execution environments.",
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
        // Custom dark theme that matches Zync's premium minimalist aesthetic
        variables: {
          colorPrimary: "#ffffff",           // Pure white primary
          colorBackground: "#050505",       // Deep black background
          colorInputBackground: "#0a0a0a",  // Dark input fields
          colorInputText: "#ffffff",        // White text
          colorText: "#ffffff",             // Primary text color
          colorTextSecondary: "#a1a1aa",    // Muted gray text
          colorSuccess: "#ffffff",          // White success color
          borderRadius: "0.75rem",          // Rounded corners
          fontFamily: "var(--font-inter)",  // Match app font
        },
        elements: {
          // Auth modal styling to match app design
          card: {
            backgroundColor: "#050505",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "1rem",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
          },
          headerTitle: {
            color: "#ffffff",
            fontSize: "1.5rem",
            fontWeight: "600",
          },
          headerSubtitle: {
            color: "#a1a1aa",
          },
          // Solid white primary button
          formButtonPrimary: {
            backgroundColor: "#ffffff",
            color: "#000000",
            fontWeight: "600",
            borderRadius: "0.5rem",
            "&:hover": {
              backgroundColor: "#e5e5e5",
            },
          },
          formFieldInput: {
            backgroundColor: "#0a0a0a",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "0.5rem",
            color: "#ffffff",
            "&:focus": {
              borderColor: "#ffffff",
              boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.5)",
            },
          },
          formFieldLabel: {
            color: "#ffffff",
            fontWeight: "500",
          },
          socialButtonsBlockButton: {
            border: "1px solid rgba(255, 255, 255, 0.08)",
            backgroundColor: "#0a0a0a",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "#1a1a1a",
            },
          },
          footerActionLink: {
            color: "#ffffff",
            "&:hover": {
              color: "#a1a1aa",
            },
          },
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
