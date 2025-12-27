import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://zync-ashen.vercel.app"
  );

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", baseUrl).toString(),
  };
}
