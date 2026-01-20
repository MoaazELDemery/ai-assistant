export const ENV = {
    // API Configuration
    N8N_WEBHOOK_URL: process.env.EXPO_PUBLIC_N8N_WEBHOOK_URL || 'http://159.89.8.87:5678/webhook/stc-chat',

    // API Callback URL - n8n uses this to fetch exchange rates, accounts, etc.
    API_CALLBACK_URL: process.env.EXPO_PUBLIC_API_CALLBACK_URL || 'https://tagmemic-unendable-dante.ngrok-free.dev',
    // OpenAI API Key
    OPENAI_API_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY || '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',

    // STT Provider
    STT_PROVIDER: (process.env.EXPO_PUBLIC_STT_PROVIDER as 'openai' | 'self-hosted') || 'self-hosted',
    STT_SELF_HOSTED_URL: process.env.EXPO_PUBLIC_STT_SELF_HOSTED_URL || 'https://tagmemic-unendable-dante.ngrok-free.dev',

    // TTS Provider
    TTS_PROVIDER: (process.env.EXPO_PUBLIC_TTS_PROVIDER as 'resemble' | 'openai') || 'resemble',
    RESEMBLE_API_TOKEN: process.env.EXPO_PUBLIC_RESEMBLE_API_TOKEN || 're6X9CqKgCn0W83eC6L8FAtt',
    RESEMBLE_VOICE_UUID_AR: process.env.EXPO_PUBLIC_RESEMBLE_VOICE_UUID_AR || 'fb2d2858',
    RESEMBLE_VOICE_UUID_EN: process.env.EXPO_PUBLIC_RESEMBLE_VOICE_UUID_EN || 'fb2d2858',
};