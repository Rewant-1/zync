# Sandbox Iframe Embedding Issues and Solutions

## Problem Description

When deploying your app, you may encounter issues where the sandbox preview doesn't display in the iframe but works when opened in a separate window. This is commonly caused by **Mixed Content Issues** where your HTTPS deployed app tries to load HTTP sandbox content.

## Root Causes

1. **Mixed Content (Primary Issue)**: HTTPS pages cannot load HTTP iframes - browsers block this for security
2. **X-Frame-Options Headers**: E2B sandboxes may set restrictive frame options
3. **Content Security Policy (CSP)**: Deployment platforms often have strict CSP rules
4. **Cross-Origin Restrictions**: CORS policies preventing iframe embedding

## Solutions Implemented

### 1. Mixed Content Fix (Primary Solution)
- **Automatic HTTPS conversion**: Production environments now force HTTPS sandbox URLs
- **Detection**: Component detects mixed content issues and shows appropriate warnings
- **Logging**: Console logs help debug protocol mismatches

### 2. Enhanced Iframe Configuration
- Added comprehensive sandbox attributes
- Implemented proper error handling
- Added loading states and fallback UI

### 3. Server Configuration Updates
- Updated Vite config in sandbox template to allow embedding
- Added CSP headers to Next.js config
- Configured proper frame-src policies

### 4. User Experience Improvements
- Loading spinner while iframe loads
- Mixed content specific error messaging
- Fallback option to open in new tab
- Automatic detection of iframe loading issues

## Testing

### Local Development
- Iframe should load normally
- No warnings or errors expected

### Production Deployment
- Iframe may show loading state longer
- Warning message may appear after 8 seconds
- Fallback "Open in New Tab" should always work

## Troubleshooting

If you continue to experience issues:

1. Check browser console for CSP violations
2. Verify E2B sandbox URLs are accessible
3. Test in different browsers
4. Consider domain-specific CSP configurations

## Alternative Solutions

If iframe embedding continues to fail:

1. **Proxy Approach**: Route sandbox requests through your domain
2. **Direct Integration**: Embed E2B SDK directly in your app
3. **Screenshot Preview**: Show static previews with links to live sandboxes

## Additional E2B Configuration Recommendations

If you continue to experience mixed content issues:

1. **Check E2B Sandbox Settings**: Ensure your E2B sandboxes are configured to use HTTPS
2. **Environment Variables**: Set production environment variables to force HTTPS
3. **Domain Configuration**: Consider using custom domains with SSL for your sandboxes

```typescript
// Example: Force HTTPS in production
const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
const sandboxUrl = `${protocol}://${host}`;
```

## Configuration Files Modified

- `src/modules/projects/ui/components/fragment-web.tsx` - Enhanced iframe component with mixed content handling
- `src/inngest/functions.ts` - Force HTTPS URLs in production
- `src/lib/sandbox-utils.ts` - Mixed content detection utilities
- `sandbox-templates/react/e2b.Dockerfile` - Updated Vite config
- `next.config.ts` - Added CSP headers
