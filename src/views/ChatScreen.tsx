import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Text, TouchableOpacity, I18nManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Volume2, VolumeX, Globe, Sparkles, Plus, Bot } from 'lucide-react-native';
import { ChatMessage } from '../components/Chat/ChatMessage';
import { ChatInput } from '../components/Chat/ChatInput';
import { TypingIndicator } from '../components/Chat/TypingIndicator';
import { WelcomeView, WelcomeSummary } from '../components/Chat/WelcomeView';
import { useChatViewModel } from '../viewmodels/useChatViewModel';
import { useSpeech } from '../hooks/useSpeech';
import { useLocale } from '../contexts/LocaleContext';
import { mockAccounts } from '../data/accounts';
import { mockBills } from '../data/bills';
import { mockCards } from '../data/cards';
import { mockSpendingBreakdown } from '../data/spending';

export function ChatScreen() {
    const { locale, setLocale, isRTL, t } = useLocale();
    const { messages, isLoading, isTranscribing, sendMessage, handlers, isRecording, startRecording, stopRecording, resetChat } = useChatViewModel({ locale });
    const flatListRef = useRef<FlatList>(null);
    const { speak, stop, toggle, isSpeaking, isLoading: isLoadingSpeech, currentMessageId } = useSpeech({ language: locale });
    const [autoSpeak, setAutoSpeak] = React.useState(true);
    const lastMessageIdRef = useRef<string | null>(null);
    const prevLocaleRef = useRef(locale);
    const speechTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Compute welcome summary from mock data
    const welcomeSummary = useMemo<WelcomeSummary>(() => {
        const totalBalance = mockAccounts.reduce((sum, acc) => sum + acc.balance, 0);
        const monthlySpending = mockSpendingBreakdown.reduce((sum, item) => sum + item.amount, 0);
        const pendingBills = mockBills.filter(b => b.status === 'pending' || b.status === 'overdue');
        const pendingBillsAmount = pendingBills.reduce((sum, b) => sum + b.amount, 0);
        const activeCards = mockCards.filter(c => c.status === 'active').length;

        return {
            totalBalance,
            monthlySpending,
            pendingBills: { count: pendingBills.length, amount: pendingBillsAmount },
            activeCards,
        };
    }, []);

    // Helper to cancel any pending speech timeout
    const cancelPendingSpeech = useCallback(() => {
        if (speechTimeoutRef.current) {
            clearTimeout(speechTimeoutRef.current);
            speechTimeoutRef.current = null;
        }
    }, []);

    // Helper to stop all speech (current + pending)
    const stopAllSpeech = useCallback(() => {
        cancelPendingSpeech();
        stop();
    }, [cancelPendingSpeech, stop]);

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
            stopAllSpeech(); // Stop all speech (current + pending)
            lastMessageIdRef.current = null; // Reset so welcome message can be spoken
        }
    }, [locale, stopAllSpeech]);

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

            // Cancel any pending speech first
            cancelPendingSpeech();

            // Stop current speech before scheduling new one
            stop();

            // Small delay to ensure the message is rendered
            speechTimeoutRef.current = setTimeout(() => {
                speechTimeoutRef.current = null;
                speak(lastMessage.content, lastMessage.id);
            }, 500);
        }
    }, [messages, autoSpeak, speak, stop, cancelPendingSpeech]);

    // Stop speech when user starts recording
    useEffect(() => {
        if (isRecording) {
            stopAllSpeech();
        }
    }, [isRecording, stopAllSpeech]);

    const handleSpeechToggle = useCallback((text: string, messageId: string) => {
        // If this message is currently speaking/loading, stop it
        if (currentMessageId === messageId && (isSpeaking || isLoadingSpeech)) {
            stopAllSpeech();
        } else {
            // Stop any other speech and speak this message
            stopAllSpeech();
            speak(text, messageId);
        }
    }, [currentMessageId, isSpeaking, isLoadingSpeech, stopAllSpeech, speak]);

    const toggleAutoSpeak = () => {
        if (autoSpeak && (isSpeaking || isLoadingSpeech)) {
            stopAllSpeech();
        }
        setAutoSpeak(!autoSpeak);
    };

    const toggleLanguage = () => {
        const newLocale = locale === 'en' ? 'ar' : 'en';
        setLocale(newLocale);
    };

    const handleNewSession = () => {
        stopAllSpeech();
        resetChat();
    };

    const handleSend = (text: string) => {
        stopAllSpeech(); // Stop all speech (current + pending) when user sends a message
        sendMessage(text);
    };

    // Determine effective layout direction (XOR logic)
    const isLayoutRTL = isRTL ? !I18nManager.isRTL : I18nManager.isRTL;

    // Check if we should show welcome view
    const showWelcome = messages.length === 0 && !isLoading;

    // Dynamic styles based on RTL
    const dynamicStyles = {
        header: [
            styles.header,
            isLayoutRTL && styles.headerRTL,
        ],
        headerTitle: [
            styles.headerTitle,
            isRTL && styles.headerTitleRTL, // Title font style depends on language
        ],
        listContent: [
            styles.listContent,
        ],
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
            {/* Header */}
            <View style={dynamicStyles.header}>
                {/* Left section: Bot avatar + Title */}
                <View style={[styles.headerLeftSection, isLayoutRTL && styles.headerLeftSectionRTL]}>
                    <View style={styles.botAvatar}>
                        <Bot size={18} color="#4F008D" />
                    </View>
                    <View style={[styles.titleRow, isLayoutRTL && styles.titleRowRTL]}>
                        <Text style={dynamicStyles.headerTitle}>{t('chat.title')}</Text>
                        <Sparkles size={14} color="#4F008D" style={styles.titleIcon} />
                    </View>
                </View>

                {/* Right section: Controls */}
                <View style={[styles.headerRightSection, isLayoutRTL && styles.headerRightSectionRTL]}>
                    {/* New Session */}
                    <TouchableOpacity
                        style={styles.headerIconButton}
                        onPress={handleNewSession}
                    >
                        <Plus size={20} color="#111827" />
                    </TouchableOpacity>

                    {/* Auto-speak toggle */}
                    <TouchableOpacity
                        style={[styles.headerIconButton, autoSpeak && styles.autoSpeakButtonActive]}
                        onPress={toggleAutoSpeak}
                    >
                        {autoSpeak ? (
                            <Volume2 size={20} color="#4F008D" />
                        ) : (
                            <VolumeX size={20} color="#9CA3AF" />
                        )}
                    </TouchableOpacity>

                    {/* Language toggle */}
                    <TouchableOpacity
                        style={[styles.headerIconButton, isLayoutRTL && styles.headerButtonRTL]}
                        onPress={toggleLanguage}
                    >
                        <Globe size={18} color="#4F008D" />
                        <Text style={styles.languageText}>{locale === 'en' ? 'AR' : 'EN'}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardView}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                {showWelcome ? (
                    <WelcomeView
                        summary={welcomeSummary}
                        locale={locale}
                        isRTL={isRTL}
                        onQuickAction={handleSend}
                    />
                ) : (
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
                )}

                <ChatInput
                    onSend={handleSend}
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
        backgroundColor: '#FAFAFA',
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
    headerLeftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerLeftSectionRTL: {
        flexDirection: 'row-reverse',
    },
    botAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(79, 0, 141, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    titleRowRTL: {
        flexDirection: 'row-reverse',
    },
    headerTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111',
    },
    headerTitleRTL: {
        // Arabic font styling if needed
    },
    titleIcon: {
        marginTop: 1,
    },
    textRTL: {
        textAlign: 'right',
    },
    headerRightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    headerRightSectionRTL: {
        flexDirection: 'row-reverse',
    },
    headerIconButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 20,
        gap: 3,
    },
    headerButtonRTL: {
        flexDirection: 'row-reverse',
    },
    autoSpeakButtonActive: {
        backgroundColor: 'rgba(79, 0, 141, 0.1)',
    },
    languageText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#4F008D',
    },
    keyboardView: {
        flex: 1,
    },
    listContent: {
        padding: 16,
        paddingBottom: 20,
    },
});
