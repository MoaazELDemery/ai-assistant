# AI Assistant SDK for React Native

A fully embeddable AI chat interface with voice support (TTS/STT), RTL/Arabic support, and customizable styling.

## Development Workflow

Follow these steps to run the project locally and test the SDK using the included example app.

### 1. Install Dependencies

First, install dependencies for the root SDK project:
```bash
npm install
```

Then, install dependencies for the example application:
```bash
cd example
npm install
```

### 2. Configure Environment

Before running the app, you need to configure the API keys. Open `src/config/constants.ts` and update the `ENV` object with your credentials:

- **N8N_WEBHOOK_URL**: Your n8n webhook URL for chat.
- **OPENAI_API_KEY**: Your OpenAI API key.
- **RESEMBLE_API_TOKEN**: Your Resemble.ai token (if using Resemble for TTS).
- **Others**: Update provider settings as needed.

### 3. Run the Example App

Navigate to the example directory (if not already there).

**Option 1: Using NPM Scripts (Recommended)**

**Running on Android:**
```bash
npm run android
```

**Running on iOS:**
```bash
npm run ios
```

**Starting the Metro Bundler only:**
```bash
npm start
```

**Option 2: Using Expo CLI Directly**

If you prefer using `npx` directly or need to debug:

```bash
# Run on Android
npx expo run:android

# Run on iOS
npx expo run:ios

# Start Metro Bundler
npx expo start
```

> **Note:** If you want to install the Expo CLI globally (optional), you can run:
> ```bash
> npm install -g expo-cli
> ```


## Installation

```bash
npm install ai-assistant
```

### Peer Dependencies

Ensure you have the following dependencies installed in your host app:

```bash
npx expo install expo-av expo-file-system react-native-safe-area-context @react-native-async-storage/async-storage lucide-react-native
```

## Quick Start

### 1. Configure your API keys

Edit `src/config/constants.ts` in the SDK with your credentials:

```typescript
export const ENV = {
    // n8n Webhook URL
    N8N_WEBHOOK_URL: 'http://your-n8n-server/webhook/chat',
    
    // API Callback URL (for n8n to fetch data)
    API_CALLBACK_URL: 'https://your-api.com',
    
    // OpenAI API Key
    OPENAI_API_KEY: 'sk-your-openai-key',
    
    // STT Provider: 'openai' or 'self-hosted'
    STT_PROVIDER: 'openai',
    STT_SELF_HOSTED_URL: 'http://your-whisper-server:8000',
    
    // TTS Provider: 'resemble' or 'openai'
    TTS_PROVIDER: 'resemble',
    RESEMBLE_API_TOKEN: 'your-resemble-token',
    RESEMBLE_VOICE_UUID_AR: 'arabic-voice-uuid',
    RESEMBLE_VOICE_UUID_EN: 'english-voice-uuid',
};
```

### 2. Import and use

```tsx
import { AiAssistantChat } from 'ai-assistant';

export default function App() {
  return <AiAssistantChat />;
}
```

**That's it!** The SDK will automatically use the configured environment.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `locale` | 'en' \| 'ar' | 'en' | Initial language |
| `style` | ViewStyle | - | Container style |

## Features

- ✅ **Voice Input/Output** - STT and TTS with OpenAI or Resemble.ai
- ✅ **RTL/Arabic Support** - Full RTL layout and Arabic translations
- ✅ **Language Switching** - Dynamic EN/AR toggle in header
- ✅ **Auto-speak** - Automatic TTS for assistant messages (toggleable)
- ✅ **Exchange Rates** - Local mock data fallback
- ✅ **Account/Beneficiary Selection** - Interactive UI blocks
- ✅ **Transfer Preview** - Detailed transfer confirmation UI
- ✅ **Typing Indicator** - Animated loading state
- ✅ **Disabled State** - Input disabled during loading/transcribing

## Advanced Usage

### Starting with Arabic

```tsx
<AiAssistantChat locale="ar" />
```

### Using ChatScreen directly (without wrapper)

```tsx
import { LocaleProvider, ChatScreen } from 'ai-assistant';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {
  return (
    <LocaleProvider>
      <SafeAreaProvider>
        <ChatScreen />
      </SafeAreaProvider>
    </LocaleProvider>
  );
}
```

### Accessing services directly

```tsx
import { ChatService, VoiceService } from 'ai-assistant';

// Send message
const response = await ChatService.sendMessage('Hello', sessionId, 'en');

// Text to speech
const audioUri = await VoiceService.textToSpeech('Hello world', 'en');

// Speech to text
const text = await VoiceService.speechToText(audioUri);
```

## License

MIT
