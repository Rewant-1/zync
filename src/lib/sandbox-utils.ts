/**
 * Utility functions for handling sandbox embedding issues
 */

export function getIframeSandboxAttributes() {
  // More permissive attributes for deployed environments
  const baseAttributes = "allow-scripts allow-same-origin allow-forms";
  const extendedAttributes = "allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation";
  
  return `${baseAttributes} ${extendedAttributes}`;
}

export function shouldShowIframeWarning() {
  // Check if we're in production and likely to have iframe issues
  return typeof window !== 'undefined' && window.location.hostname !== 'localhost';
}

export function getAlternativeDisplayMessage() {
  return {
    title: "Preview Not Available",
    description: "The sandbox preview cannot be embedded due to security restrictions in deployment. This is normal behavior for many hosting platforms.",
    action: "Open in New Tab to view your application"
  };
}

export function fixMixedContentUrl(url: string): string {
  if (typeof window === 'undefined') return url;
  
  // If the current page is HTTPS, ensure sandbox URL is also HTTPS
  if (window.location.protocol === 'https:' && url.startsWith('http:')) {
    console.log('Converting HTTP sandbox URL to HTTPS to prevent mixed content issues');
    return url.replace('http:', 'https:');
  }
  
  return url;
}

export function detectMixedContentIssue(sandboxUrl: string): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check if we have a mixed content situation
  const pageIsHttps = window.location.protocol === 'https:';
  const sandboxIsHttp = sandboxUrl.startsWith('http:');
  
  return pageIsHttps && sandboxIsHttp;
}
