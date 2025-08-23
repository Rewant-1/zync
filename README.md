# Zync - AI-Powered Code Generation Platform

A modern, production-ready web application built with Next.js 15, featuring AI-powered code generation, real-time collaboration, and advanced performance optimizations.

## 🚀 Features

- **AI Code Generation**: Intelligent multi-model code generation with automatic fallback & retry (rate‑limit/backoff aware)
- **Real-time Execution**: Secure code execution environment with E2B integration
- **Modern UI/UX**: Beautiful, responsive interface built with Radix UI and Tailwind CSS
- **Type Safety**: Full TypeScript support with strict type checking
- **Database Integration**: Prisma ORM with PostgreSQL for robust data management
- **Authentication**: Secure user authentication with Clerk
- **Performance Optimized**: Advanced webpack configuration and code splitting

## 🛠 Tech Stack

### Core Technologies

- **Framework**: Next.js 15.3.4 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.x
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **Code Execution**: E2B Sandbox Environment

### UI Components

- **Component Library**: Radix UI primitives
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Notifications**: Sonner (toast notifications)
- **Date Handling**: date-fns

### Development & Build Tools

- **Bundler**: Webpack with advanced optimizations
- **Linting**: ESLint with Next.js configuration
- **Code Formatting**: Prettier (via ESLint)
- **Type Checking**: TypeScript compiler
- **Package Manager**: npm

## 🤖 AI Code Generation Engine

The core generation workflow is orchestrated by an Inngest function `code-agent/run` implemented in `src/inngest/functions.ts`.

### Model Fallback & Retry

The engine tries a prioritized list of models until one successfully produces files:

1. A custom `models` array provided in the event payload (highest precedence)
2. `MODEL_CANDIDATES` environment variable (comma‑separated)
3. Built-in defaults: `anthropic/claude-3.5-sonnet`, `google/gemini-2.0-flash`, `openai/gpt-4o-mini`

Per model, it will retry up to `modelRetries` (event payload) or `MODEL_RETRIES` (env) times using exponential backoff (starting 500ms, capped at 4s) when encountering rate limits (HTTP 429 / rate limit phrases). The first model attempt that creates one or more files is accepted and short‑circuits the rest.

### Import Safety & Enforcement

- The agent is instructed to use **only relative imports**.
- Using `@/` alias requires it to also generate the necessary alias config (`tsconfig.json` paths + `vite.config.*` or equivalent). If missing, a warning is logged.
- After each `createFiles` tool execution, a static scan detects unresolved relative imports (handles extensions `.ts`, `.tsx`, `.js`, `.jsx`, plus `index.*` fallbacks) and logs warnings before continuing.

### Sandbox Execution

Generated files are written into an E2B sandbox and a dev server is started:

```bash
npm run dev -- --host 0.0.0.0 --port 5173
```
The sandbox host is then exposed and saved with the generated fragment, enabling immediate preview.

### Post Processing
Gemini (flash) models summarize the generated code, produce a concise human response, and generate a short title.

### Event Payload Shape

```ts
{
   value: string;        // user prompt / brief
   projectId: string;    // associated project
   models?: string[];    // optional ordered override list
   modelRetries?: number;// optional per‑model retry count
}
```

### Environment Variables (AI Engine)

| Variable | Purpose |
|----------|---------|
| `OPENROUTER_API_KEY` | Required for OpenRouter model access |
| `MODEL_CANDIDATES` | Comma list fallback models if event omits `models` |
| `MODEL_RETRIES` | Default per‑model retry attempts (overridden by event) |

Add these (plus existing ones) to `.env` as needed:

```env
OPENROUTER_API_KEY=sk-...
MODEL_CANDIDATES=anthropic/claude-3.5-sonnet,google/gemini-2.0-flash,openai/gpt-4o-mini
MODEL_RETRIES=2
```

### Overriding Models Programmatically

When dispatching the Inngest event you can override the model order & retries:
```ts
await inngest.send({
   name: "code-agent/run",
   data: {
      value: userPrompt,
      projectId,
      models: [
         "deepseek/deepseek-chat-v3-0324:free",
        "google/gemini-2.0-flash-exp:free",
        "qwen/qwen3-coder:free",
        "z-ai/glm-4.5-air:free"
      ],
      modelRetries: 1,
   }
});
```

## 📦 Performance Optimizations

### Bundle Optimization

- **Code Splitting**: Strategic component lazy loading
- **Webpack Configuration**: Custom chunk splitting with priority-based caching
- **Tree Shaking**: Optimized imports for reduced bundle size
- **Dynamic Imports**: Non-critical components loaded on demand

### Build Performance

- **Filesystem Caching**: Enabled for faster rebuilds
- **Incremental Builds**: Smart build optimization
- **Bundle Analysis**: Integrated webpack bundle analyzer
- **CSS Optimization**: Tailwind purging with precise content paths

### Runtime Performance

- **React Optimizations**: Optimized useEffect dependencies
- **Image Optimization**: Next.js Image component integration
- **Font Optimization**: Web font loading strategies
- **Compression**: Gzip compression enabled

## 🏗 Architecture

### Project Structure

```txt
src/
├── app/                    # Next.js App Router pages
├── components/             # Reusable UI components
│   ├── ui/                # Radix UI components
│   └── ...                # Custom components
├── modules/               # Feature-based modules
│   ├── projects/          # Project management
│   ├── messages/          # Message handling
│   └── usage/             # Usage tracking
├── lib/                   # Utility libraries
├── hooks/                 # Custom React hooks
├── trpc/                  # tRPC configuration
└── inngest/               # Background job processing
```

### Database Schema

- **Users**: User profiles and authentication data
- **Projects**: Project metadata and configurations
- **Messages**: Communication and chat history
- **Usage**: Resource usage tracking

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Rewant-1/zync.git
   cd zync
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

   Configure your environment variables:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/zync"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_key"
   CLERK_SECRET_KEY="your_clerk_secret"
   E2B_API_KEY="your_e2b_api_key"
   ```

4. **Database Setup**

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start Development Server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint code checking

## 🔧 Configuration

### Next.js Configuration

- **App Router**: Modern routing with server components
- **Image Optimization**: Automatic image optimization
- **Compression**: Gzip compression enabled
- **Security Headers**: CSP and security headers configured
- **Bundle Analysis**: Webpack bundle analyzer integration

### Prisma Configuration

- **Auto-generation**: Prisma client auto-generated on install
- **Type Safety**: Full TypeScript integration
- **Migration System**: Database schema versioning

### Tailwind Configuration

- **JIT Mode**: Just-in-time compilation
- **Dark Mode**: Class-based dark mode support
- **Custom Theme**: Extended color palette and design tokens
- **Responsive Design**: Mobile-first responsive utilities

## 🛡 Security Features

- **Content Security Policy**: Strict CSP headers
- **XSS Protection**: Built-in XSS prevention
- **CSRF Protection**: Cross-site request forgery protection
- **Secure Headers**: Comprehensive security header configuration
- **Environment Variables**: Secure environment variable handling

## 📊 Monitoring & Analytics

- **Error Tracking**: Built-in error boundary components
- **Performance Monitoring**: Web Vitals tracking
- **Usage Analytics**: User behavior and feature usage tracking
- **Build Analytics**: Bundle size and performance metrics

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

1. Build the application: `npm run build`
2. Start the production server: `npm run start`
3. Ensure PostgreSQL database is accessible
4. Configure environment variables on hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request


## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Vercel** - Hosting and deployment platform
- **Radix UI** - Unstyled, accessible UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Prisma** - Next-generation ORM
- **Clerk** - User authentication and management

---

**Built with ❤️ by [Rewant-1](https://github.com/Rewant-1)**
