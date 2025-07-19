#!/bin/bash
# This script runs during building the sandbox template
# and ensures the Vite app is (1) running and (2) the `/` page is compiled

function ping_server() {
    local timeout=10          # seconds
    local interval=0.1
    local start_time=$(date +%s)

    while true; do
        local response
        response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5173")
        if [[ $response -eq 200 ]]; then
            echo "Server started successfully!" >> /compile_page.log
            return 0
        fi
        if (( $(date +%s) - start_time >= timeout )); then
            echo "Error: Server failed to start after ${timeout}s" >> /compile_page.log
            exit 1
        fi
        sleep "$interval"
    done
}
    done
    echo "Server started successfully!" >> /compile_page.log
}

# Debug: Log current directory, files, and PATH
echo "Current directory: $(pwd)" > /compile_page.log
echo "Listing files: $(ls -la)" >> /compile_page.log
echo "PATH: $PATH" >> /compile_page.log
if [ -f "/home/user/vite.config.ts" ]; then
    echo "vite.config.ts found" >> /compile_page.log
else
    echo "Error: vite.config.ts not found" >> /compile_page.log
    exit 1
fi
if [ -f "/home/user/node_modules/.bin/vite" ]; then
    echo "vite binary found" >> /compile_page.log
else
cd "$PROJECT_DIR"
echo "Starting Vite server..." >> /compile_page.log
"${PROJECT_DIR}/node_modules/.bin/vite" --config vite.config.ts >> /compile_page.log 2>&1 &
VITE_PID=$!
trap 'kill $VITE_PID >/dev/null 2>&1' EXIT
# Start Vite with explicit path to ensure availability
cd /home/user
echo "Starting Vite server..." >> /compile_page.log
/home/user/node_modules/.bin/vite --config vite.config.ts &

# Wait for server to start
ping_server