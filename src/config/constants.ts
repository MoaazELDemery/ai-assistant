export const ENV = {
    // API Configuration
    N8N_WEBHOOK_URL: process.env.EXPO_PUBLIC_N8N_WEBHOOK_URL,

    // API Callback URL - n8n uses this to fetch exchange rates, accounts, etc.
    API_CALLBACK_URL: process.env.EXPO_PUBLIC_API_CALLBACK_URL,
    // OpenAI API Key
    OPENAI_API_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY,

    // STT Provider
    STT_PROVIDER: (process.env.EXPO_PUBLIC_STT_PROVIDER as 'openai' | 'self-hosted'),
    STT_SELF_HOSTED_URL: process.env.EXPO_PUBLIC_STT_SELF_HOSTED_URL,

    // TTS Provider
    TTS_PROVIDER: (process.env.EXPO_PUBLIC_TTS_PROVIDER as 'resemble' | 'openai'),
    RESEMBLE_API_TOKEN: process.env.EXPO_PUBLIC_RESEMBLE_API_TOKEN,
    RESEMBLE_VOICE_UUID_AR: process.env.EXPO_PUBLIC_RESEMBLE_VOICE_UUID_AR,
    RESEMBLE_VOICE_UUID_EN: process.env.EXPO_PUBLIC_RESEMBLE_VOICE_UUID_EN,
};