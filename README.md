# AI Assistant SDK for React Native

A fully embeddable AI chat interface with voice support (TTS/STT), RTL/Arabic support, and customizable styling.

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
