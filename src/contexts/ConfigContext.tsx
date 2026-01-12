import React, { createContext, useContext, ReactNode } from 'react';
import { AiAssistantConfig } from '../AiAssistant.types';

interface ConfigContextType {
    config: AiAssistantConfig;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({
    config,
    children
}: {
    config: AiAssistantConfig;
    children: ReactNode
}) {
    return (
        <ConfigContext.Provider value={{ config }}>
            {children}
        </ConfigContext.Provider>
    );
}

export function useConfig(): AiAssistantConfig {
    const context = useContext(ConfigContext);
    if (context === undefined) {
        throw new Error('useConfig must be used within a ConfigProvider. Make sure to wrap your component with AiAssistantChat.');
    }
    return context.config;
}

// Helper to get config values with defaults
export function getConfigValue<K extends keyof AiAssistantConfig>(
    config: AiAssistantConfig,
    key: K,
    defaultValue?: AiAssistantConfig[K]
): AiAssistantConfig[K] {
    return config[key] ?? defaultValue as AiAssistantConfig[K];
}
