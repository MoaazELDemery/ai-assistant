import React, { useRef, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Text, TouchableOpacity, I18nManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Volume2, VolumeX, Globe } from 'lucide-react-native';
import { ChatMessage } from '../components/Chat/ChatMessage';
import { ChatInput } from '../components/Chat/ChatInput';
import { TypingIndicator } from '../components/Chat/TypingIndicator';
import { useChatViewModel } from '../viewmodels/useChatViewModel';
import { useSpeech } from '../hooks/useSpeech';
import { useLocale } from '../contexts/LocaleContext';

export function ChatScreen() {
    const { locale, setLocale, isRTL, t } = useLocale();
    const { messages, isLoading, isTranscribing, sendMessage, handlers, isRecording, startRecording, stopRecording } = useChatViewModel({ locale });
    const flatListRef = useRef<FlatList>(null);
    const { speak, stop, toggle, isSpeaking, isLoading: isLoadingSpeech, currentMessageId } = useSpeech({ language: locale });
    const [autoSpeak, setAutoSpeak] = React.useState(true);
    const lastMessageIdRef = useRef<string | null>(null);
    const prevLocaleRef = useRef(locale);

    useEffect(() => {
        // Scroll to bottom on new messages or when typing indicator appears
        if (messages.length > 0 || isLoading) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 200);
        }
    }, [messages, isLoading]);

    // Stop speech when locale changes
    useEffect(() => {
        if (prevLocaleRef.current !== locale) {
            prevLocaleRef.current = locale;
            stop(); // Stop any ongoing speech
            lastMessageIdRef.current = null; // Reset so welcome message can be spoken
        }
    }, [locale, stop]);

    // Auto-speak new assistant messages
    useEffect(() => {
        if (!autoSpeak) return;
        if (messages.length === 0) return;

        const lastMessage = messages[messages.length - 1];

        // Only speak if it's a new assistant message
        if (
            lastMessage.role === 'assistant' &&
            lastMessage.id !== lastMessageIdRef.current
        ) {
            lastMessageIdRef.current = lastMessage.id;
            // Small delay to ensure the message is rendered
            setTimeout(() => {
                speak(lastMessage.content, lastMessage.id);
            }, 500);
        }
    }, [messages, autoSpeak, speak]);

    // Stop speech when user starts recording
    useEffect(() => {
        if (isRecording) {
            stop();
        }
    }, [isRecording, stop]);

    const handleSpeechToggle = useCallback((text: string, messageId: string) => {
        // If this message is currently speaking/loading, stop it
        if (currentMessageId === messageId && (isSpeaking || isLoadingSpeech)) {
            stop();
        } else {
            // Otherwise, speak this message
            speak(text, messageId);
        }
    }, [currentMessageId, isSpeaking, isLoadingSpeech, stop, speak]);

    const toggleAutoSpeak = () => {
        if (autoSpeak && isSpeaking) {
            stop();
        }
        setAutoSpeak(!autoSpeak);
    };

    const toggleLanguage = () => {
        const newLocale = locale === 'en' ? 'ar' : 'en';
        setLocale(newLocale);
    };

    // Dynamic styles based on RTL
    const dynamicStyles = {
        header: [
            styles.header,
            isRTL && styles.headerRTL,
        ],
        headerTitle: [
            styles.headerTitle,
            isRTL && styles.headerTitleRTL,
        ],
        listContent: [
            styles.listContent,
        ],
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
            {/* Header */}
            <View style={dynamicStyles.header}>
                {/* Language toggle - left side */}
                <TouchableOpacity
                    style={[styles.headerButton, isRTL && styles.headerButtonRTL]}
                    onPress={toggleLanguage}
                >
                    <Globe size={20} color="#4F46E5" />
                    <Text style={styles.languageText}>{locale === 'en' ? 'AR' : 'EN'}</Text>
                </TouchableOpacity>

                <Text style={dynamicStyles.headerTitle}>{t('chat.title')}</Text>

                {/* Auto-speak toggle - right side */}
                <TouchableOpacity
                    style={[styles.headerButton, styles.autoSpeakButton, autoSpeak && styles.autoSpeakButtonActive]}
                    onPress={toggleAutoSpeak}
                >
                    {autoSpeak ? (
                        <Volume2 size={20} color="#4F46E5" />
                    ) : (
                        <VolumeX size={20} color="#9CA3AF" />
                    )}
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardView}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ChatMessage
                            message={item}
                            {...handlers}
                            onSpeechToggle={handleSpeechToggle}
                            isSpeaking={isSpeaking}
                            isLoadingSpeech={isLoadingSpeech}
                            currentSpeakingMessageId={currentMessageId}
                            locale={locale}
                            isRTL={isRTL}
                        />
                    )}
                    contentContainerStyle={dynamicStyles.listContent}
                    keyboardShouldPersistTaps="handled"
                    ListFooterComponent={<TypingIndicator isVisible={isLoading} />}
                />

                <ChatInput
                    onSend={(text) => {
                        stop(); // Stop any ongoing speech when user sends a message
                        sendMessage(text);
                    }}
                    isLoading={isLoading}
                    isTranscribing={isTranscribing}
                    isRecording={isRecording}
                    onStartRecording={startRecording}
                    onStopRecording={stopRecording}
                    locale={locale}
                    isRTL={isRTL}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
    },
    headerRTL: {
        flexDirection: 'row-reverse',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#111',
        textAlign: 'center',
    },
    headerTitleRTL: {
        // Arabic font styling if needed
    },
    headerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 20,
        gap: 4,
    },
    headerButtonRTL: {
        flexDirection: 'row-reverse',
    },
    autoSpeakButton: {
    },
    autoSpeakButtonActive: {
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
    },
    languageText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4F46E5',
    },
    keyboardView: {
        flex: 1,
    },
    listContent: {
        padding: 16,
        paddingBottom: 20,
    },
});
