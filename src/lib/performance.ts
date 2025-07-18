// Performance optimization utilities
import { lazy, Suspense } from 'react';

// Lazy load heavy components
export const LazyChrome = lazy(() => import('@/components/ui/chrome-grid').then(module => ({
  default: module.ChromeGrid
})));

export const LazyFramerMotion = lazy(() => import('framer-motion').then(module => ({
  default: module.motion
})));

// Suspense wrappers for lazy components
export const ChromeGridSuspense = ({ children, ...props }: any) => (
  <Suspense fallback={<div className="min-h-screen bg-black" />}>
    <LazyChrome {...props} />
    {children}
  </Suspense>
);

// Preload critical resources
export const preloadCriticalResources = () => {
  // Preload fonts
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.href = '/fonts/geist-sans.woff2';
  fontLink.as = 'font';
  fontLink.type = 'font/woff2';
  fontLink.crossOrigin = 'anonymous';
  document.head.appendChild(fontLink);

  // Preload critical images
  const logoImg = new Image();
  logoImg.src = '/logo.png';
};

// Optimize images
export const optimizeImage = (src: string, width?: number, height?: number) => {
  const params = new URLSearchParams();
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  params.append('q', '75'); // Quality
  params.append('f', 'webp'); // Format
  
  return `/_next/image?url=${encodeURIComponent(src)}&${params.toString()}`;
};

// Debounce utility for performance
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle utility for performance
export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
