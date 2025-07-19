#!/bin/bash
# This script runs during building the sandbox template
# and ensures the Vite app is (1) running and (2) the `/` page is compiled

function ping_server() {
    counter=0
    response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5173")
    while [[ ${response} -ne 200 ]]; do
        let counter++
        if (( counter % 10 == 0 )); then
            echo "Waiting for server to start... (attempt $counter)" >> /compile_page.log
            sleep 0.1
        fi
        response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5173")
        if [[ $counter -ge 100 ]]; then
            echo "Error: Server failed to start after 10 seconds" >> /compile_page.log
            exit 1
        fi
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
    echo "Error: vite binary not found" >> /compile_page.log
    exit 1
fi

# Start Vite with explicit path to ensure availability
cd /home/user
echo "Starting Vite server..." >> /compile_page.log
/home/user/node_modules/.bin/vite --config vite.config.ts &

# Wait for server to start
ping_server