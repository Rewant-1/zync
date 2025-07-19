#!/bin/bash

# ===================================================================
# HYPER-OPTIMIZED Vite + React Server Script
# Short, fast, bulletproof - Dockerfile does the heavy lifting!
# ===================================================================

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# Config
MAX_RETRIES=5
VITE_PID=""
WATCHER_PID=""

# Logging
log() { echo -e "${CYAN}[$(date +'%H:%M:%S')]${NC} $1"; }
success() { echo -e "${GREEN}✅${NC} $1"; }
error() { echo -e "${RED}❌${NC} $1"; }
warning() { echo -e "${YELLOW}⚠️${NC} $1"; }

# Banner
banner() {
    echo -e "${PURPLE}${BOLD}"
    echo "    ⚡ ZERO-CONFIG VITE + REACT SANDBOX ⚡"
    echo -e "${NC}${CYAN}    🚀 Everything Pre-installed • AI Ready${NC}"
    echo "════════════════════════════════════════════════"
}

# Setup files that Dockerfile couldn't create with heredoc
setup_config_files() {
    log "Setting up configuration files..."
    
    # Tailwind config
    cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class"],
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
    extend: {
      colors: {
        border: "hsl(var(--border))", input: "hsl(var(--input))", ring: "hsl(var(--ring))",
        background: "hsl(var(--background))", foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" }
      },
      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } }
      },
      animation: { "accordion-down": "accordion-down 0.2s ease-out", "accordion-up": "accordion-up 0.2s ease-out" }
    }
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms"), require("@tailwindcss/container-queries"), require("@tailwindcss/aspect-ratio")]
}
EOF

    # PostCSS config
    cat > postcss.config.js << 'EOF'
export default {
  plugins: { tailwindcss: {}, autoprefixer: {} }
}
EOF

    # Shadcn CSS
    cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%; --foreground: 222.2 84% 4.9%; --card: 0 0% 100%; --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%; --popover-foreground: 222.2 84% 4.9%; --primary: 222.2 47.4% 11.2%; --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%; --secondary-foreground: 222.2 47.4% 11.2%; --muted: 210 40% 96%; --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%; --accent-foreground: 222.2 47.4% 11.2%; --destructive: 0 84.2% 60.2%; --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%; --input: 214.3 31.8% 91.4%; --ring: 222.2 84% 4.9%; --radius: 0.5rem;
  }
  .dark {
    --background: 222.2 84% 4.9%; --foreground: 210 40% 98%; --card: 222.2 84% 4.9%; --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%; --popover-foreground: 210 40% 98%; --primary: 210 40% 98%; --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%; --secondary-foreground: 210 40% 98%; --muted: 217.2 32.6% 17.5%; --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%; --accent-foreground: 210 40% 98%; --destructive: 0 62.8% 30.6%; --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%; --input: 217.2 32.6% 17.5%; --ring: 212.7 26.8% 83.9%;
  }
  * { @apply border-border; }
  body { @apply bg-background text-foreground; }
}
EOF

    # Utils
    cat > src/lib/utils.ts << 'EOF'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }
EOF

    success "Configuration files created"
}

# Create essential UI components
create_components() {
    log "Creating essential shadcn components..."
    
    # Button
    cat > src/components/ui/button.tsx << 'EOF'
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: { default: "h-10 px-4 py-2", sm: "h-9 rounded-md px-3", lg: "h-11 rounded-md px-8", icon: "h-10 w-10" },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
Button.displayName = "Button"
export { Button, buttonVariants }
EOF

    # Card
    cat > src/components/ui/card.tsx << 'EOF'
import * as React from "react"
import { cn } from "../../lib/utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  )
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
EOF

    # Input & Label
    cat > src/components/ui/input.tsx << 'EOF'
import * as React from "react"
import { cn } from "../../lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)}
        ref={ref} {...props}
      />
    )
  }
)
Input.displayName = "Input"
export { Input }
EOF

    cat > src/components/ui/label.tsx << 'EOF'
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70")

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
))
Label.displayName = LabelPrimitive.Root.displayName
export { Label }
EOF

    success "Components created"
}

# Create beautiful demo App
create_demo_app() {
    log "Creating demo app..."
    
    cat > src/App.tsx << 'EOF'
import { useState } from 'react'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Input } from './components/ui/input'
import { Label } from './components/ui/label'
import { Heart, Code2, Zap, Palette } from 'lucide-react'
import viteLogo from '/vite.svg'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-8 mb-8">
            <img src={viteLogo} className="h-20 w-20 animate-spin" alt="Vite logo" />
            <img src={reactLogo} className="h-20 w-20 animate-pulse" alt="React logo" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Zero-Config Sandbox
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Complete Vite + React + TypeScript + Tailwind + Shadcn/ui setup. Everything pre-installed and ready for AI code generation!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-2 hover:border-blue-300 transition-colors">
            <CardHeader className="text-center">
              <Zap className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
              <CardTitle className="text-lg">Lightning Fast</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Vite's instant HMR for blazing fast development</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-green-300 transition-colors">
            <CardHeader className="text-center">
              <Code2 className="h-8 w-8 mx-auto text-green-500 mb-2" />
              <CardTitle className="text-lg">TypeScript</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Full type safety with auto-syntax fixing</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-purple-300 transition-colors">
            <CardHeader className="text-center">
              <Palette className="h-8 w-8 mx-auto text-purple-500 mb-2" />
              <CardTitle className="text-lg">Modern UI</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Tailwind + Radix UI + Shadcn components</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-red-300 transition-colors">
            <CardHeader className="text-center">
              <Heart className="h-8 w-8 mx-auto text-red-500 mb-2" />
              <CardTitle className="text-lg">Zero Config</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Everything pre-installed and configured</p>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Demo</CardTitle>
              <CardDescription>Test the components and functionality</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="text-3xl font-mono font-bold">Count: {count}</div>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => setCount(count - 1)} variant="outline">Decrease</Button>
                  <Button onClick={() => setCount(count + 1)}>Increase</Button>
                  <Button onClick={() => setCount(0)} variant="destructive">Reset</Button>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" placeholder="Enter your name..." value={name} onChange={(e) => setName(e.target.value)} />
                {name && <p className="text-sm text-green-600">Hello, {name}! 👋</p>}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ready to Build!</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>🎯 <strong>Edit src/App.tsx</strong> to start building your app</p>
                <p>🎨 <strong>Use components</strong> from src/components/ui/</p>
                <p>⚡ <strong>Hot reload</strong> updates instantly</p>
                <p>🔧 <strong>TypeScript errors</strong> are auto-fixed</p>
                <p>✨ <strong>Perfect for AI</strong> code generation!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default App
EOF

    success "Demo app created"
}

# Clear port and start server
clear_port() {
    log "Clearing port 5173..."
    local pids=$(lsof -ti:5173 2>/dev/null || true)
    if [[ -n "$pids" ]]; then
        echo "$pids" | xargs kill -9 2>/dev/null || true
        sleep 1
    fi
    success "Port cleared"
}

# Start Vite server with retries
start_server() {
    log "Starting Vite server..."
    
    for i in $(seq 1 $MAX_RETRIES); do
        clear_port
        
        npm run dev -- --host 0.0.0.0 --port 5173 --no-open &
        VITE_PID=$!
        
        # Wait for server to start
        for j in $(seq 1 15); do
            if curl -s -f http://localhost:5173/ >/dev/null 2>&1; then
                success "Server started successfully!"
                return 0
            fi
            sleep 1
        done
        
        warning "Server start attempt $i failed, retrying..."
        kill $VITE_PID 2>/dev/null || true
    done
    
    error "Failed to start server after $MAX_RETRIES attempts"
    exit 1
}

# Start file watcher
start_watcher() {
    if command -v watch-typescript &>/dev/null; then
        watch-typescript &
        WATCHER_PID=$!
        log "File watcher started (PID: $WATCHER_PID)"
    fi
}

# Display info
show_info() {
    echo "════════════════════════════════════════════════"
    success "🚀 SANDBOX READY!"
    echo ""
    echo -e "${CYAN}📍 Server:${NC} http://localhost:5173"
    echo -e "${CYAN}🎯 Stack:${NC} Vite + React + TypeScript + Tailwind + Shadcn/ui"
    echo -e "${CYAN}📦 Components:${NC} All pre-installed and ready"
    echo -e "${CYAN}🔧 Auto-fix:${NC} TypeScript syntax errors automatically corrected"
    echo -e "${CYAN}✨ Status:${NC} Ready for AI code generation!"
    echo "════════════════════════════════════════════════"
}

# Cleanup
cleanup() {
    log "Cleaning up..."
    [[ -n "$VITE_PID" ]] && kill $VITE_PID 2>/dev/null || true
    [[ -n "$WATCHER_PID" ]] && kill $WATCHER_PID 2>/dev/null || true
    clear_port
}

trap cleanup EXIT INT TERM

# Main execution
main() {
    banner
    setup_config_files
    create_components
    create_demo_app
    command -v fix-typescript &>/dev/null && fix-typescript
    start_watcher
    start_server
    show_info
    
    # Keep alive
    log "Server running. Press Ctrl+C to stop."
    wait
}

main "$@"