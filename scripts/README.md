# AI Assistant SDK - Server Setup

This folder contains all the server-side components needed to run the AI Assistant SDK.

## Prerequisites

1. **Python 3.10+** - For the MLX-Whisper STT server
2. **Node.js 18+** - For the API server
3. **ngrok** - For exposing local servers (free account works)
4. **ffmpeg** - For audio conversion (`brew install ffmpeg`)

## Quick Start

### Option 1: Use the startup script (Recommended)

```bash
cd scripts
./start-all.sh
```

This will:
1. Start the MLX-Whisper STT server (port 8000)
2. Start the Mock API server (port 3000)
3. Start ngrok tunnel
4. Update your `.env` file with the ngrok URL
5. Start Expo dev server

For TestFlight testing (without Expo):
```bash
./start-all.sh --no-expo
```

### Option 2: Manual startup

1. **Start STT Server** (Terminal 1):
```bash
cd scripts
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn mlx-whisper
python3 mlx-whisper-server.py
```

2. **Start API Server** (Terminal 2):
```bash
cd scripts
node api-server.js
```

3. **Start ngrok** (Terminal 3):
```bash
ngrok http 3000
```

4. **Update .env** with the ngrok URL:
```bash
# In example/.env
EXPO_PUBLIC_API_CALLBACK_URL=https://YOUR-NGROK-URL.ngrok-free.dev
EXPO_PUBLIC_STT_SELF_HOSTED_URL=https://YOUR-NGROK-URL.ngrok-free.dev
EXPO_PUBLIC_STT_PROVIDER=self-hosted
```

5. **Start Expo** (Terminal 4):
```bash
cd example
npx expo start --clear
```

## For TestFlight Builds

When using a TestFlight build:

1. Run the servers using:
```bash
./start-all.sh --no-expo
```

2. Make sure the ngrok URL in your TestFlight build matches the current ngrok URL
   - If using a free ngrok account, the URL changes each restart
   - Consider upgrading to a paid ngrok plan for a stable subdomain

3. Keep the servers running while testing

## Server Endpoints

### API Server (port 3000)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/accounts` | GET | User bank accounts |
| `/api/beneficiaries` | GET/POST | Payment beneficiaries |
| `/api/products` | GET | Bank products catalog |
| `/api/exchange-rates` | GET | Currency exchange rates |
| `/api/spending/breakdown` | GET | Spending analytics |
| `/api/user/profile` | GET | User profile data |
| `/v1/audio/transcriptions` | POST | Proxied to STT server |
| `/health` | GET | Health check |

### STT Server (port 8000)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/audio/transcriptions` | POST | Speech-to-text (OpenAI compatible) |
| `/health` | GET | Health check |

## Troubleshooting

### "Network request failed" errors
- Make sure ngrok is running and the URL in `.env` is correct
- Restart the Expo app after changing `.env`

### STT not working
- Check if MLX-Whisper server is running: `curl http://localhost:8000/health`
- Make sure ffmpeg is installed: `brew install ffmpeg`

### API returning 404
- Make sure the API server is running: `curl http://localhost:3000/health`
- Check the ngrok URL is pointing to port 3000

## Log Files

When using `start-all.sh`, logs are saved to:
- STT Server: `/tmp/stt-server.log`
- API Server: `/tmp/api-server.log`
- ngrok: `/tmp/ngrok.log`
- Expo: `/tmp/expo.log`

View logs with:
```bash
tail -f /tmp/stt-server.log
tail -f /tmp/api-server.log
```

## Stop All Services

```bash
./stop-all.sh
```
