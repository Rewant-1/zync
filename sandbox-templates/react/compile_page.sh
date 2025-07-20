#!/bin/bash
# This script runs during building the sandbox template
# and ensures the Vite app is running and accessible

set -e  # Exit on any error

# Function to ping the server
ping_server() {
    local counter=0
    local max_attempts=100
    
    echo "Checking if server is ready..." >> /compile_page.log
    
    while [ $counter -lt $max_attempts ]; do
        local response
        response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5173" 2>/dev/null || echo "000")
        
        if [ "$response" = "200" ]; then
            echo "Server started successfully!" >> /compile_page.log
            return 0
        fi
        
        if [ $((counter % 10)) -eq 0 ]; then
            echo "Waiting for server to start... (attempt $counter, response: $response)" >> /compile_page.log
        fi
        
        sleep 0.1
        counter=$((counter + 1))
    done
    
    echo "Error: Server failed to start after 10 seconds" >> /compile_page.log
    exit 1
}

# Initialize log file
echo "=== Compile Script Started ===" > /compile_page.log
echo "Current directory: $(pwd)" >> /compile_page.log
echo "PATH: $PATH" >> /compile_page.log

# Change to the correct working directory
cd /home/user
echo "Changed to /home/user" >> /compile_page.log

# Check for required files
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found" >> /compile_page.log
    ls -la /home/user >> /compile_page.log
    exit 1
fi

if [ ! -f "vite.config.ts" ]; then
    echo "Error: vite.config.ts not found" >> /compile_page.log
    ls -la /home/user >> /compile_page.log
    exit 1
fi

if [ ! -f "node_modules/.bin/vite" ]; then
    echo "Error: vite binary not found" >> /compile_page.log
    echo "Contents of node_modules/.bin:" >> /compile_page.log
    ls -la /home/user/node_modules/.bin/ >> /compile_page.log
    exit 1
fi

echo "All required files found" >> /compile_page.log

# Start Vite server
echo "Starting Vite server..." >> /compile_page.log
/home/user/node_modules/.bin/vite --config vite.config.ts --host 0.0.0.0 --port 5173 >> /compile_page.log 2>&1 &

# Wait for server to start
ping_server

echo "=== Compile Script Completed Successfully ===" >> /compile_page.log