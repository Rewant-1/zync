export function getIframeSandboxAttributes() {
  // Core security permissions
  const baseAttributes = "allow-scripts allow-same-origin allow-forms";
  
  // Extended permissions for full app functionality
  const extendedAttributes =
    "allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation";

  return `${baseAttributes} ${extendedAttributes}`;
}

export function shouldShowIframeWarning() {
  return (
    typeof window !== "undefined" && window.location.hostname !== "localhost"
  );
}

export function getAlternativeDisplayMessage() {
  return {
    title: "Preview Not Available",
    description:
      "The sandbox preview cannot be embedded due to security restrictions in deployment. This is normal behavior for many hosting platforms.",
    action: "Open in New Tab to view your application",
  };
}

export function fixMixedContentUrl(url: string): string {
  if (typeof window === "undefined") return url;

  // Convert HTTP to HTTPS if parent page is secure
  if (window.location.protocol === "https:" && url.startsWith("http:")) {
    return url.replace("http:", "https:");
  }

  return url;
}

export function detectMixedContentIssue(sandboxUrl: string): boolean {
  if (typeof window === "undefined") return false;

  const pageIsHttps = window.location.protocol === "https:";
  const sandboxIsHttp = sandboxUrl.startsWith("http:");

  return pageIsHttps && sandboxIsHttp;
}
