# Zync - AI-Powered Code Generation Platform

Zync is a sophisticated web application that enables users to generate complete, functional web applications through natural language prompts. Built with modern technologies, it leverages AI agents and sandboxed environments to create production-ready code from simple descriptions.

## Features

### Core Functionality

- **AI-Powered Code Generation**: Uses Google's Gemini 2.0 Flash model to generate complete applications
- **Interactive Chat Interface**: Real-time messaging system for iterative development
- **Live Preview**: Instant preview of generated applications in sandboxed environments
- **Project Templates**: Pre-built templates for common application types (Netflix clone, Admin dashboard, Kanban board, etc.)
- **File Explorer**: Browse and examine generated code with syntax highlighting
- **User Authentication**: Secure authentication via Clerk

### Technical Features

- **Sandboxed Execution**: Safe code execution using E2B Code Interpreter
- **Real-time Updates**: Live reloading and hot module replacement
- **Type Safety**: Full TypeScript implementation throughout the stack
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Dark/Light Mode**: Theme switching with next-themes

## Technology Stack

### Frontend

- **Next.js 15.3.4** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Shadcn/UI** - Modern component library built on Radix UI
- **Lucide React** - Beautiful, customizable icons

### Backend & Database

- **tRPC** - End-to-end typesafe APIs
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Primary database
- **Clerk** - Authentication and user management

### AI & Processing

- **Inngest** - Durable workflow orchestration
- **@inngest/agent-kit** - AI agent framework
- **Google Gemini 2.0 Flash** - Large language model
- **E2B Code Interpreter** - Sandboxed code execution environment

### Development Tools

- **Prism.js** - Syntax highlighting
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **ESLint** - Code linting
- **React Query/TanStack Query** - Server state management

## Project Structure

```
zync/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (home)/            # Home page with project templates
│   │   ├── projects/[id]/     # Dynamic project pages
│   │   └── api/               # API routes (tRPC, Inngest)
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Shadcn/UI components
│   │   └── code-view/        # Code syntax highlighting
│   ├── modules/              # Feature-based modules
│   │   ├── home/             # Home page functionality
│   │   ├── messages/         # Chat/messaging system
│   │   └── projects/         # Project management
│   ├── trpc/                 # tRPC configuration and routers
│   ├── inngest/              # Background job processing
│   └── lib/                  # Utility functions and database
├── prisma/                   # Database schema and migrations
└── public/                   # Static assets
```

## Key Features Deep Dive

### AI Agent System

- **Multi-tool Agent**: Equipped with terminal access, file operations, and code generation
- **Intelligent Routing**: Smart agent selection based on task requirements
- **Error Handling**: Robust error recovery and user feedback
- **Task Summarization**: Automatic generation of task summaries

### Sandboxed Environment

- **Secure Execution**: All code runs in isolated E2B sandboxes
- **Live URLs**: Each project gets a unique, accessible URL
- **File Management**: Full file system access within sandbox boundaries
- **Package Management**: Automatic dependency installation

### Real-time Collaboration

- **Live Updates**: Real-time message updates with automatic polling
- **Fragment Management**: Track and switch between different code iterations
- **Progress Tracking**: Visual feedback during code generation

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Clerk account for authentication
- E2B account for sandboxed execution
- Google AI API key for Gemini

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zync
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   DATABASE_URL="postgresql://..."
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
   CLERK_SECRET_KEY="sk_..."
   E2B_API_KEY="..."
   GOOGLE_AI_API_KEY="..."
   INNGEST_EVENT_KEY="..."
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Visit the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Architecture Highlights

### Type-Safe API Layer

- **tRPC Integration**: End-to-end type safety from client to server
- **Zod Validation**: Runtime type checking and validation
- **Prisma Types**: Auto-generated database types

### Modular Design

- **Feature Modules**: Organized by business domain
- **Separation of Concerns**: Clear boundaries between UI, logic, and data
- **Reusable Components**: Shared UI components across features

### Performance Optimizations

- **Server Components**: Leverage React Server Components for better performance
- **Streaming**: Progressive loading with Suspense boundaries
- **Caching**: Intelligent query caching with React Query

## Development

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Custom rules for code consistency
- **Prettier**: Automated code formatting
- **Husky**: Pre-commit hooks for quality gates

### Testing Strategy

- **Type Safety**: Compile-time error prevention
- **Schema Validation**: Runtime validation with Zod
- **Error Boundaries**: Graceful error handling

## Scalability Features

- **Database Optimization**: Efficient queries with Prisma
- **Background Processing**: Async job handling with Inngest
- **Edge Runtime**: Optimized for edge deployment
- **Component Architecture**: Scalable, maintainable component structure

## Deployment

The application is designed for deployment on Vercel with the following considerations:

- **Environment Variables**: Configure all required environment variables
- **Database**: Use a managed PostgreSQL service (e.g., Supabase, Railway)
- **Edge Functions**: Leverage Vercel's edge runtime for optimal performance
- **Static Assets**: Optimized asset delivery via Vercel's CDN

---

**Built with ❤️ using modern web technologies for myself so that I have full customizations.**
