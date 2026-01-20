#!/bin/bash
#
# AI Assistant SDK - Stop All Services
#

echo "Stopping all AI Assistant services..."

pkill -f "python3 mlx-whisper-server.py" 2>/dev/null && echo "✓ Stopped STT Server" || echo "- STT Server not running"
pkill -f "node api-server.js" 2>/dev/null && echo "✓ Stopped API Server" || echo "- API Server not running"
pkill -f "node proxy-server.js" 2>/dev/null && echo "✓ Stopped Proxy Server" || echo "- Proxy Server not running"
pkill -f "ngrok http" 2>/dev/null && echo "✓ Stopped ngrok" || echo "- ngrok not running"
pkill -f "expo start" 2>/dev/null && echo "✓ Stopped Expo" || echo "- Expo not running"

echo ""
echo "All services stopped."
