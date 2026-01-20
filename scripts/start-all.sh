#!/bin/bash
#
# AI Assistant SDK - Start All Services
# 
# This script starts all required services for the AI Assistant SDK:
# 1. MLX-Whisper STT Server (port 8000)
# 2. Mock API Server (port 3000)
# 3. ngrok tunnel (exposes port 3000)
# 4. Expo dev server (optional, for development)
#
# Usage:
#   ./start-all.sh          # Start all services
#   ./start-all.sh --no-expo # Start without Expo (for TestFlight testing)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
EXAMPLE_DIR="$PROJECT_DIR/example"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║       AI Assistant SDK - Starting Services                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Parse arguments
START_EXPO=true
if [[ "$1" == "--no-expo" ]]; then
    START_EXPO=false
    echo -e "${YELLOW}Expo dev server will NOT be started (--no-expo flag)${NC}"
fi

# Kill any existing processes
echo -e "${YELLOW}Cleaning up existing processes...${NC}"
pkill -f "python3 mlx-whisper-server.py" 2>/dev/null || true
pkill -f "node api-server.js" 2>/dev/null || true
pkill -f "ngrok http" 2>/dev/null || true
pkill -f "expo start" 2>/dev/null || true
sleep 2

# 1. Start MLX-Whisper STT Server
echo -e "${GREEN}[1/4] Starting MLX-Whisper STT Server (port 8000)...${NC}"
cd "$SCRIPT_DIR"
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi
source venv/bin/activate
nohup python3 mlx-whisper-server.py > /tmp/stt-server.log 2>&1 &
STT_PID=$!
sleep 3

# Check if STT server is running
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo -e "${GREEN}   ✓ STT Server running on http://localhost:8000${NC}"
else
    echo -e "${RED}   ✗ STT Server failed to start. Check /tmp/stt-server.log${NC}"
fi

# 2. Start Mock API Server (includes STT proxy)
echo -e "${GREEN}[2/4] Starting Mock API Server (port 3000)...${NC}"
cd "$SCRIPT_DIR"
nohup node api-server.js > /tmp/api-server.log 2>&1 &
API_PID=$!
sleep 2

# Check if API server is running
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo -e "${GREEN}   ✓ API Server running on http://localhost:3000${NC}"
else
    echo -e "${RED}   ✗ API Server failed to start. Check /tmp/api-server.log${NC}"
fi

# 3. Start ngrok tunnel
echo -e "${GREEN}[3/4] Starting ngrok tunnel...${NC}"
nohup ngrok http 3000 --log=stdout > /tmp/ngrok.log 2>&1 &
NGROK_PID=$!
sleep 3

# Get ngrok URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); t=d.get('tunnels',[]); print(t[0]['public_url'] if t else '')" 2>/dev/null || echo "")

if [ -n "$NGROK_URL" ]; then
    echo -e "${GREEN}   ✓ ngrok running: ${BLUE}$NGROK_URL${NC}"
    
    # Update .env file with ngrok URL
    if [ -f "$EXAMPLE_DIR/.env" ]; then
        echo -e "${YELLOW}   Updating .env with ngrok URL...${NC}"
        sed -i '' "s|EXPO_PUBLIC_API_CALLBACK_URL=.*|EXPO_PUBLIC_API_CALLBACK_URL=$NGROK_URL|" "$EXAMPLE_DIR/.env"
        sed -i '' "s|EXPO_PUBLIC_STT_SELF_HOSTED_URL=.*|EXPO_PUBLIC_STT_SELF_HOSTED_URL=$NGROK_URL|" "$EXAMPLE_DIR/.env"
        sed -i '' "s|NGROK_URL=.*|NGROK_URL=$NGROK_URL|" "$EXAMPLE_DIR/.env"
        echo -e "${GREEN}   ✓ .env updated${NC}"
    fi
else
    echo -e "${RED}   ✗ ngrok failed to start. Check /tmp/ngrok.log${NC}"
fi

# 4. Start Expo dev server (optional)
if [ "$START_EXPO" = true ]; then
    echo -e "${GREEN}[4/4] Starting Expo dev server...${NC}"
    cd "$EXAMPLE_DIR"
    nohup npx expo start --clear > /tmp/expo.log 2>&1 &
    EXPO_PID=$!
    sleep 5
    echo -e "${GREEN}   ✓ Expo dev server starting... Check /tmp/expo.log${NC}"
else
    echo -e "${YELLOW}[4/4] Skipping Expo dev server (using TestFlight build)${NC}"
fi

# Summary
echo ""
echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    ALL SERVICES STARTED                    ║"
echo "╠════════════════════════════════════════════════════════════╣"
echo "║  STT Server:    http://localhost:8000                      ║"
echo "║  API Server:    http://localhost:3000                      ║"
if [ -n "$NGROK_URL" ]; then
echo "║  ngrok URL:     $NGROK_URL"
fi
echo "╠════════════════════════════════════════════════════════════╣"
echo "║  Logs:                                                     ║"
echo "║   - STT:   tail -f /tmp/stt-server.log                     ║"
echo "║   - API:   tail -f /tmp/api-server.log                     ║"
echo "║   - ngrok: tail -f /tmp/ngrok.log                          ║"
if [ "$START_EXPO" = true ]; then
echo "║   - Expo:  tail -f /tmp/expo.log                           ║"
fi
echo "╠════════════════════════════════════════════════════════════╣"
echo "║  To stop all services:  ./stop-all.sh                      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Keep script running to show logs
if [ "$START_EXPO" = true ]; then
    echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
    tail -f /tmp/stt-server.log /tmp/api-server.log &
    wait
fi
