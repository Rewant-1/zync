# ===================================================================
# COMPLETE A-Z VITE + REACT + TYPESCRIPT SANDBOX 
# EVERYTHING pre-installed - Zero config needed!
# ===================================================================

FROM node:21-slim

# Environment variables
ENV NODE_ENV=development
ENV VITE_HOST=0.0.0.0
ENV VITE_PORT=5173
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    inotify-tools \
    procps \
    nano \
    lsof \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && npm config set fund false \
    && npm config set update-notifier false

# Set workspace
WORKDIR /home/user/workspace

# Create Vite + React + TypeScript project
RUN npx --yes create-vite@latest . --template react-ts

# Install ALL core dependencies
RUN npm install

# Install COMPLETE modern UI ecosystem - BRUTE FORCE everything!
RUN npm install \
    clsx \
    tailwind-merge \
    class-variance-authority \
    @radix-ui/react-dialog \
    @radix-ui/react-slot \
    @radix-ui/react-separator \
    @radix-ui/react-dropdown-menu \
    @radix-ui/react-tabs \
    @radix-ui/react-accordion \
    @radix-ui/react-alert-dialog \
    @radix-ui/react-avatar \
    @radix-ui/react-checkbox \
    @radix-ui/react-collapsible \
    @radix-ui/react-context-menu \
    @radix-ui/react-hover-card \
    @radix-ui/react-label \
    @radix-ui/react-menubar \
    @radix-ui/react-navigation-menu \
    @radix-ui/react-popover \
    @radix-ui/react-progress \
    @radix-ui/react-radio-group \
    @radix-ui/react-scroll-area \
    @radix-ui/react-select \
    @radix-ui/react-sheet \
    @radix-ui/react-switch \
    @radix-ui/react-table \
    @radix-ui/react-textarea \
    @radix-ui/react-toast \
    @radix-ui/react-toggle \
    @radix-ui/react-tooltip \
    @radix-ui/react-slider \
    @radix-ui/react-calendar \
    @radix-ui/react-form \
    @radix-ui/react-input \
    @radix-ui/react-card \
    @radix-ui/react-button \
    lucide-react \
    framer-motion \
    react-beautiful-dnd \
    @types/react-beautiful-dnd \
    react-hook-form \
    @hookform/resolvers \
    zod \
    date-fns \
    recharts \
    cmdk \
    sonner \
    vaul \
    react-day-picker \
    react-resizable-panels

# Install complete Tailwind CSS ecosystem
RUN npm install -D \
    tailwindcss@latest \
    postcss@latest \
    autoprefixer@latest \
    @tailwindcss/typography \
    @tailwindcss/forms \
    @tailwindcss/container-queries \
    @tailwindcss/aspect-ratio

# Initialize Tailwind
RUN npx tailwindcss init -p

# Create directories
RUN mkdir -p src/lib src/components/ui

# Create TypeScript syntax fixer utility
RUN echo '#!/bin/bash' > /usr/local/bin/fix-typescript && \
    echo 'find ./src -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | while read file; do' >> /usr/local/bin/fix-typescript && \
    echo '  sed -i "s/React\\.SetStateAction<{\\([^}]*\\)}>/React.SetStateAction<\\1>/g" "$file" 2>/dev/null || true' >> /usr/local/bin/fix-typescript && \
    echo '  sed -i "s/: {{ \\([^}]*\\) }}/: { \\1 }/g" "$file" 2>/dev/null || true' >> /usr/local/bin/fix-typescript && \
    echo '  sed -i "s/useState<{{ \\([^}]*\\) }}>/useState<{ \\1 }>/g" "$file" 2>/dev/null || true' >> /usr/local/bin/fix-typescript && \
    echo 'done' >> /usr/local/bin/fix-typescript && \
    echo 'echo "TypeScript syntax fixed!"' >> /usr/local/bin/fix-typescript && \
    chmod +x /usr/local/bin/fix-typescript

# File watcher for auto-fixing
RUN echo '#!/bin/bash' > /usr/local/bin/watch-typescript && \
    echo 'if command -v inotifywait &> /dev/null; then' >> /usr/local/bin/watch-typescript && \
    echo '  inotifywait -m -r --format "%w%f" -e modify,create src/ 2>/dev/null | while read file; do' >> /usr/local/bin/watch-typescript && \
    echo '    if [[ "$file" =~ \\.(ts|tsx|js|jsx)$ ]]; then' >> /usr/local/bin/watch-typescript && \
    echo '      fix-typescript' >> /usr/local/bin/watch-typescript && \
    echo '    fi' >> /usr/local/bin/watch-typescript && \
    echo '  done' >> /usr/local/bin/watch-typescript && \
    echo 'else' >> /usr/local/bin/watch-typescript && \
    echo '  echo "File watching not available"' >> /usr/local/bin/watch-typescript && \
    echo 'fi' >> /usr/local/bin/watch-typescript && \
    chmod +x /usr/local/bin/watch-typescript

# Expose port
EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5173/ || exit 1

# Start the compile script
CMD ["bash", "./compile_page.sh"]
