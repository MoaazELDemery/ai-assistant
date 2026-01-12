export const ENV = {
    // API Configuration
    N8N_WEBHOOK_URL: 'http://159.89.8.87:5678/webhook/stc-chat',

    // API Callback URL - n8n uses this to fetch exchange rates, accounts, etc.
    // This should point to the web POC server (either ngrok or local network IP)
    // If running web POC locally, use your machine's IP: http://192.168.1.x:3000
    // Or use ngrok: https://your-ngrok-url.ngrok-free.app
    API_CALLBACK_URL: 'https://a31ee44558e3.ngrok-free.app',

    // OpenAI API Key
    OPENAI_API_KEY: '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',

    // STT Provider
    STT_PROVIDER: 'openai', // 'openai' or 'self-hosted'
    // STT_SELF_HOSTED_URL is ignored when provider is openai
    STT_SELF_HOSTED_URL: 'http://192.168.1.12:8000',

    // TTS Provider
    TTS_PROVIDER: 'resemble', // 'resemble' or 'openai'
    RESEMBLE_API_TOKEN: 're6X9CqKgCn0W83eC6L8FAtt',
    RESEMBLE_VOICE_UUID_AR: 'fb2d2858',
    RESEMBLE_VOICE_UUID_EN: 'fb2d2858',
};

