import React from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ChatScreen } from './views/ChatScreen';
import { LocaleProvider, Locale } from './contexts/LocaleContext';

export interface AiAssistantChatProps {
    /** Initial locale/language */
    locale?: Locale;
    /** Container style */
    style?: StyleProp<ViewStyle>;
}

/**
 * Main AI Assistant Chat Component
 * 
 * Simply import and render this component to add the AI chat interface.
 * Make sure to configure your API keys in src/config/constants.ts
 * 
 * Usage:
 * ```tsx
 * import { AiAssistantChat } from 'ai-assistant';
 * 
 * export default function App() {
 *   return <AiAssistantChat />;
 * }
 * ```
 */
export function AiAssistantChat({ locale = 'en', style }: AiAssistantChatProps = {}) {
    return (
        <LocaleProvider initialLocale={locale}>
            <SafeAreaProvider>
                <View style={[styles.container, style]}>
                    <ChatScreen />
                </View>
            </SafeAreaProvider>
        </LocaleProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default AiAssistantChat;
