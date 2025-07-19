# Use a Debian-based Node.js image
FROM node:21-slim

# Install curl for server health checks
RUN apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy and make the compile script executable
COPY compile_page.sh /compile_page.sh
RUN chmod +x /compile_page.sh

# Set working directory for the React app
WORKDIR /home/user/vite-app

# Create a React + Vite project with TypeScript (pinned version for stability)
RUN npx --yes create-vite@5.2.0 . --template react-ts

# Install dependencies, including vite explicitly and common utility packages
RUN npm install vite@5.2.0 --save-dev
RUN npm install clsx tailwind-merge class-variance-authority

# Install Shadcn UI dependencies
RUN npm install @radix-ui/react-dialog @radix-ui/react-slot @radix-ui/react-separator @radix-ui/react-label @radix-ui/react-select @radix-ui/react-checkbox @radix-ui/react-switch @radix-ui/react-tooltip @radix-ui/react-dropdown-menu @radix-ui/react-tabs class-variance-authority lucide-react

# Install and configure Tailwind CSS with pinned versions
RUN npm install -D tailwindcss@3.4.1 postcss@8.4.35 autoprefixer@10.4.17

# Create Tailwind config file with proper content paths and color variables
RUN echo "/** @type {import('tailwindcss').Config} */\nexport default {\n  content: [\n    \"./index.html\",\n    \"./src/**/*.{js,ts,jsx,tsx}\",\n  ],\n  theme: {\n    extend: {\n      colors: {\n        border: \"hsl(var(--border))\",\n        input: \"hsl(var(--input))\",\n        ring: \"hsl(var(--ring))\",\n        background: \"hsl(var(--background))\",\n        foreground: \"hsl(var(--foreground))\",\n        primary: {\n          DEFAULT: \"hsl(var(--primary))\",\n          foreground: \"hsl(var(--primary-foreground))\",\n        },\n        secondary: {\n          DEFAULT: \"hsl(var(--secondary))\",\n          foreground: \"hsl(var(--secondary-foreground))\",\n        },\n        destructive: {\n          DEFAULT: \"hsl(var(--destructive))\",\n          foreground: \"hsl(var(--destructive-foreground))\",\n        },\n        muted: {\n          DEFAULT: \"hsl(var(--muted))\",\n          foreground: \"hsl(var(--muted-foreground))\",\n        },\n        accent: {\n          DEFAULT: \"hsl(var(--accent))\",\n          foreground: \"hsl(var(--accent-foreground))\",\n        },\n        popover: {\n          DEFAULT: \"hsl(var(--popover))\",\n          foreground: \"hsl(var(--popover-foreground))\",\n        },\n        card: {\n          DEFAULT: \"hsl(var(--card))\",\n          foreground: \"hsl(var(--card-foreground))\",\n        },\n      },\n      borderRadius: {\n        lg: \"var(--radius)\",\n        md: \"calc(var(--radius) - 2px)\",\n        sm: \"calc(var(--radius) - 4px)\",\n      },\n    },\n  },\n  plugins: [],\n}" > tailwind.config.js

# Create PostCSS config file with correct PostCSS plugin
RUN echo "export default {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n}" > postcss.config.js

# Update src/index.css with Tailwind directives and CSS variables
RUN echo "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n@layer base {\n  :root {\n    --background: 0 0% 100%;\n    --foreground: 222.2 84% 4.9%;\n    --card: 0 0% 100%;\n    --card-foreground: 222.2 84% 4.9%;\n    --popover: 0 0% 100%;\n    --popover-foreground: 222.2 84% 4.9%;\n    --primary: 222.2 47.4% 11.2%;\n    --primary-foreground: 210 40% 98%;\n    --secondary: 210 40% 96%;\n    --secondary-foreground: 222.2 84% 4.9%;\n    --muted: 210 40% 96%;\n    --muted-foreground: 215.4 16.3% 46.9%;\n    --accent: 210 40% 96%;\n    --accent-foreground: 222.2 84% 4.9%;\n    --destructive: 0 84.2% 60.2%;\n    --destructive-foreground: 210 40% 98%;\n    --border: 214.3 31.8% 91.4%;\n    --input: 214.3 31.8% 91.4%;\n    --ring: 222.2 84% 4.9%;\n    --radius: 0.5rem;\n  }\n}" > src/index.css

# Create a simple test App.tsx to verify basic functionality
RUN echo "import './App.css'\n\nfunction App() {\n  return (\n    <div className=\"min-h-screen bg-background p-8\">\n      <h1 className=\"text-2xl font-bold\">Sandbox Ready</h1>\n    </div>\n  )\n}\n\nexport default App" > src/App.tsx

# Create common UI component directories and files
RUN mkdir -p src/components/ui src/lib

# Create basic dialog component (commonly used by models)
RUN echo "import * as React from 'react'\nimport * as DialogPrimitive from '@radix-ui/react-dialog'\nimport { X } from 'lucide-react'\nimport { cn } from '@/lib/utils'\n\nconst Dialog = DialogPrimitive.Root\nconst DialogTrigger = DialogPrimitive.Trigger\nconst DialogPortal = DialogPrimitive.Portal\nconst DialogClose = DialogPrimitive.Close\n\nconst DialogOverlay = React.forwardRef<\n  React.ElementRef<typeof DialogPrimitive.Overlay>,\n  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>\n>(({ className, ...props }, ref) => (\n  <DialogPrimitive.Overlay\n    ref={ref}\n    className={cn(\n      'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',\n      className\n    )}\n    {...props}\n  />\n))\n\nconst DialogContent = React.forwardRef<\n  React.ElementRef<typeof DialogPrimitive.Content>,\n  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>\n>(({ className, children, ...props }, ref) => (\n  <DialogPortal>\n    <DialogOverlay />\n    <DialogPrimitive.Content\n      ref={ref}\n      className={cn(\n        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',\n        className\n      )}\n      {...props}\n    >\n      {children}\n      <DialogPrimitive.Close className=\"absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground\">\n        <X className=\"h-4 w-4\" />\n        <span className=\"sr-only\">Close</span>\n      </DialogPrimitive.Close>\n    </DialogPrimitive.Content>\n  </DialogPortal>\n))\n\nexport { Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger, DialogContent }" > src/components/ui/dialog.tsx

# Create utils function (commonly needed)
RUN echo "import { type ClassValue, clsx } from 'clsx'\nimport { twMerge } from 'tailwind-merge'\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs))\n}" > src/lib/utils.ts

# Create basic button component
RUN echo "import * as React from 'react'\nimport { Slot } from '@radix-ui/react-slot'\nimport { cva, type VariantProps } from 'class-variance-authority'\nimport { cn } from '@/lib/utils'\n\nconst buttonVariants = cva(\n  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',\n  {\n    variants: {\n      variant: {\n        default: 'bg-primary text-primary-foreground hover:bg-primary/90',\n        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',\n        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',\n        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',\n        ghost: 'hover:bg-accent hover:text-accent-foreground',\n        link: 'text-primary underline-offset-4 hover:underline',\n      },\n      size: {\n        default: 'h-10 px-4 py-2',\n        sm: 'h-9 rounded-md px-3',\n        lg: 'h-11 rounded-md px-8',\n        icon: 'h-10 w-10',\n      },\n    },\n    defaultVariants: {\n      variant: 'default',\n      size: 'default',\n    },\n  }\n)\n\nexport interface ButtonProps\n  extends React.ButtonHTMLAttributes<HTMLButtonElement>,\n    VariantProps<typeof buttonVariants> {\n  asChild?: boolean\n}\n\nconst Button = React.forwardRef<HTMLButtonElement, ButtonProps>(\n  ({ className, variant, size, asChild = false, ...props }, ref) => {\n    const Comp = asChild ? Slot : 'button'\n    return (\n      <Comp\n        className={cn(buttonVariants({ variant, size, className }))}\n        ref={ref}\n        {...props}\n      />\n    )\n  }\n)\nButton.displayName = 'Button'\n\nexport { Button, buttonVariants }" > src/components/ui/button.tsx

# Create basic card component
RUN echo "import * as React from 'react'\nimport { cn } from '@/lib/utils'\n\nconst Card = React.forwardRef<\n  HTMLDivElement,\n  React.HTMLAttributes<HTMLDivElement>\n>(({ className, ...props }, ref) => (\n  <div\n    ref={ref}\n    className={cn(\n      'rounded-lg border bg-card text-card-foreground shadow-sm',\n      className\n    )}\n    {...props}\n  />\n))\n\nconst CardHeader = React.forwardRef<\n  HTMLDivElement,\n  React.HTMLAttributes<HTMLDivElement>\n>(({ className, ...props }, ref) => (\n  <div\n    ref={ref}\n    className={cn('flex flex-col space-y-1.5 p-6', className)}\n    {...props}\n  />\n))\n\nconst CardTitle = React.forwardRef<\n  HTMLParagraphElement,\n  React.HTMLAttributes<HTMLHeadingElement>\n>(({ className, ...props }, ref) => (\n  <h3\n    ref={ref}\n    className={cn(\n      'text-2xl font-semibold leading-none tracking-tight',\n      className\n    )}\n    {...props}\n  />\n))\n\nconst CardDescription = React.forwardRef<\n  HTMLParagraphElement,\n  React.HTMLAttributes<HTMLParagraphElement>\n>(({ className, ...props }, ref) => (\n  <p\n    ref={ref}\n    className={cn('text-sm text-muted-foreground', className)}\n    {...props}\n  />\n))\n\nconst CardContent = React.forwardRef<\n  HTMLDivElement,\n  React.HTMLAttributes<HTMLDivElement>\n>(({ className, ...props }, ref) => (\n  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />\n))\n\nconst CardFooter = React.forwardRef<\n  HTMLDivElement,\n  React.HTMLAttributes<HTMLDivElement>\n>(({ className, ...props }, ref) => (\n  <div\n    ref={ref}\n    className={cn('flex items-center p-6 pt-0', className)}\n    {...props}\n  />\n))\n\nexport { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }" > src/components/ui/card.tsx

# Create basic input component
RUN echo "import * as React from 'react'\nimport { cn } from '@/lib/utils'\n\nexport interface InputProps\n  extends React.InputHTMLAttributes<HTMLInputElement> {}\n\nconst Input = React.forwardRef<HTMLInputElement, InputProps>(\n  ({ className, type, ...props }, ref) => {\n    return (\n      <input\n        type={type}\n        className={cn(\n          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',\n          className\n        )}\n        ref={ref}\n        {...props}\n      />\n    )\n  }\n)\nInput.displayName = 'Input'\n\nexport { Input }" > src/components/ui/input.tsx

# Create label component
RUN echo "import * as React from 'react'\nimport * as LabelPrimitive from '@radix-ui/react-label'\nimport { cva, type VariantProps } from 'class-variance-authority'\nimport { cn } from '@/lib/utils'\n\nconst labelVariants = cva(\n  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'\n)\n\nconst Label = React.forwardRef<\n  React.ElementRef<typeof LabelPrimitive.Root>,\n  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &\n    VariantProps<typeof labelVariants>\n>(({ className, ...props }, ref) => (\n  <LabelPrimitive.Root\n    ref={ref}\n    className={cn(labelVariants(), className)}\n    {...props}\n  />\n))\nLabel.displayName = LabelPrimitive.Root.displayName\n\nexport { Label }" > src/components/ui/label.tsx

# Create separator component
RUN echo "import * as React from 'react'\nimport * as SeparatorPrimitive from '@radix-ui/react-separator'\nimport { cn } from '@/lib/utils'\n\nconst Separator = React.forwardRef<\n  React.ElementRef<typeof SeparatorPrimitive.Root>,\n  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>\n>((\n  { className, orientation = 'horizontal', decorative = true, ...props },\n  ref\n) => (\n  <SeparatorPrimitive.Root\n    ref={ref}\n    decorative={decorative}\n    orientation={orientation}\n    className={cn(\n      'shrink-0 bg-border',\n      orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',\n      className\n    )}\n    {...props}\n  />\n))\nSeparator.displayName = SeparatorPrimitive.Root.displayName\n\nexport { Separator }" > src/components/ui/separator.tsx

# Create checkbox component
RUN echo "import * as React from 'react'\nimport * as CheckboxPrimitive from '@radix-ui/react-checkbox'\nimport { Check } from 'lucide-react'\nimport { cn } from '@/lib/utils'\n\nconst Checkbox = React.forwardRef<\n  React.ElementRef<typeof CheckboxPrimitive.Root>,\n  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>\n>(({ className, ...props }, ref) => (\n  <CheckboxPrimitive.Root\n    ref={ref}\n    className={cn(\n      'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',\n      className\n    )}\n    {...props}\n  >\n    <CheckboxPrimitive.Indicator\n      className={cn('flex items-center justify-center text-current')}\n    >\n      <Check className=\"h-4 w-4\" />\n    </CheckboxPrimitive.Indicator>\n  </CheckboxPrimitive.Root>\n))\nCheckbox.displayName = CheckboxPrimitive.Root.displayName\n\nexport { Checkbox }" > src/components/ui/checkbox.tsx

# Create switch component
RUN echo "import * as React from 'react'\nimport * as SwitchPrimitive from '@radix-ui/react-switch'\nimport { cn } from '@/lib/utils'\n\nconst Switch = React.forwardRef<\n  React.ElementRef<typeof SwitchPrimitive.Root>,\n  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>\n>(({ className, ...props }, ref) => (\n  <SwitchPrimitive.Root\n    className={cn(\n      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',\n      className\n    )}\n    {...props}\n    ref={ref}\n  >\n    <SwitchPrimitive.Thumb\n      className={cn(\n        'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'\n      )}\n    />\n  </SwitchPrimitive.Root>\n))\nSwitch.displayName = SwitchPrimitive.Root.displayName\n\nexport { Switch }" > src/components/ui/switch.tsx

# Create vite.config.ts with proper server configuration and CSS processing
RUN echo "import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\nimport path from 'path'\n\nexport default defineConfig({\n  plugins: [react()],\n  css: {\n    postcss: './postcss.config.js',\n  },\n  server: {\n    host: '0.0.0.0',\n    port: 5173,\n    allowedHosts: ['*.e2b.app', '*.inngest.com']\n  },\n  resolve: {\n    alias: {\n      '@': path.resolve(__dirname, './src')\n    }\n  }\n})" > vite.config.ts

# Update tsconfig.json to include baseUrl and paths with comment removal
RUN node -e "const fs = require('fs'); const tsconfigPath = 'tsconfig.json'; let tsconfig = { compilerOptions: {} }; if (fs.existsSync(tsconfigPath)) { let content = fs.readFileSync(tsconfigPath, 'utf8'); content = content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//gm, ''); try { tsconfig = JSON.parse(content); } catch (e) { console.error('Invalid JSON in tsconfig.json, using default'); } } tsconfig.compilerOptions.baseUrl = '.'; tsconfig.compilerOptions.paths = { '@/*': ['./src/*'] }; fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));"

# Ensure src directory exists for dynamic code
RUN mkdir -p /home/user/src

# Move the app to the home directory efficiently
RUN cp -r /home/user/vite-app/. /home/user/ && rm -rf /home/user/vite-app

# Expose port
EXPOSE 5173

# Healthcheck to verify Vite server
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:5173 || exit 1

# Start the compile script
CMD ["bash", "/compile_page.sh"]
