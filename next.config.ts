import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove "Powered by Next.js" header for cleaner responses
  poweredByHeader: false,
  
  /**
   * Security Headers
   * 
   * Implements comprehensive security policies while allowing
   * necessary integrations for Zync's functionality.
   */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Prevent clickjacking attacks
          },
          {
            key: 'Content-Security-Policy',
            // Allow E2B sandboxes and Inngest while blocking other iframes
            value: "frame-src 'self' *.e2b.app *.inngest.com challenges.cloudflare.com *.challenges.cloudflare.com; frame-ancestors 'self';",
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // Prevent MIME type sniffing
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin', // Control referrer information
          },
        ],
      },
    ];
  },

  /**
   * URL Redirects
   * 
   * Handle common requests and provide better UX
   */
  async redirects() {
    return [
      {
        source: '/favicon.ico',
        destination: '/logo.png', // Use Zync logo as favicon
        permanent: true,
      },
    ];
  },
  
  /**
   * Image Optimization
   * 
   * Configure Next.js Image component for optimal loading
   */
  images: {
    formats: ['image/webp', 'image/avif'], // Modern formats for better compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Responsive breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Icon and thumbnail sizes
  },
  
  // Enable gzip compression for better performance
  compress: true,

  /**
   * Webpack Configuration
   * 
   * Custom build optimizations for better performance and caching
   */
  webpack: (config, { isServer }) => {
    // Enable filesystem caching for faster rebuilds
    config.cache = {
      type: 'filesystem',
      buildDependencies: {
        config: [require.resolve('./next.config.ts')],
      },
      maxAge: 1000 * 60 * 60 * 24 * 7, // Cache for 1 week
    };

    // Client-side bundle optimization
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          // Separate vendor libraries for better caching
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          // Common code across pages
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
          },
        },
      };
    }

    return config;
  },
  
  /**
   * Experimental Features
   * 
   * Enable Next.js optimizations for better performance
   */
  experimental: {
    optimizeCss: true, // Optimize CSS delivery
    // Package import optimizations to reduce bundle size
    optimizePackageImports: [
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-collapsible',
      '@radix-ui/react-context-menu',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-label',
      '@radix-ui/react-popover',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slot',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toggle',
      '@radix-ui/react-toggle-group',
      '@radix-ui/react-tooltip',
      'framer-motion',
      'lucide-react',
    ],
  },
};

export default nextConfig;