import { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage, Account } from '../types';
import { ChatService } from '../services/ChatService';
import { VoiceService } from '../services/VoiceService';
import { Audio } from 'expo-av';
import { Locale } from '../contexts/LocaleContext';
import { AppResetManager, CleanupPriority } from '../services/AppResetManager';

interface UseChatViewModelOptions {
    locale?: Locale;
}

// Instance counter for unique IDs
let instanceCounter = 0;

function getWelcomeMessage(locale: Locale): ChatMessage {
    const content = locale === 'ar'
        ? "مرحباً! أنا مساعد بنك STC الذكي. يمكنني مساعدتك في:\n\n- عرض أرصدة الحسابات\n- إجراء التحويلات\n- إدارة المستفيدين\n- التحقق من أسعار الصرف\n\nكيف يمكنني مساعدتك اليوم؟"
        : "Hello! I'm your STC Bank AI Assistant. I can help you with:\n\n- View account balances\n- Make transfers\n- Manage beneficiaries\n- Check exchange rates\n\nHow can I assist you today?";

    return {
        id: 'welcome',
        role: 'assistant',
        content,
        timestamp: new Date().toISOString(),
    };
}

export function useChatViewModel(options: UseChatViewModelOptions = {}) {
    const { locale = 'en' } = options;

    const [messages, setMessages] = useState<ChatMessage[]>([getWelcomeMessage(locale)]);
    const [isLoading, setIsLoading] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [sessionId, setSessionId] = useState(() => `session-${Date.now()}`);
    const prevLocaleRef = useRef(locale);
    const instanceIdRef = useRef(`chat-${++instanceCounter}`);
    const isDisposedRef = useRef(false);

    // Recording state
    const recordingRef = useRef<Audio.Recording | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const isStartingRef = useRef(false);

    /**
     * Dispose all recording resources
     */
    const disposeRecording = useCallback(async () => {
        console.log(`[useChatViewModel:${instanceIdRef.current}] Disposing recording resources...`);

        if (recordingRef.current) {
            try {
                await recordingRef.current.stopAndUnloadAsync().catch(() => { });
            } catch (error) {
                console.warn('Error disposing recording:', error);
            } finally {
                recordingRef.current = null;
            }
        }

        setIsRecording(false);
        isStartingRef.current = false;

        console.log(`[useChatViewModel:${instanceIdRef.current}] Recording resources disposed`);
    }, []);

    /**
     * Full cleanup for this view model
     */
    const cleanup = useCallback(async () => {
        console.log(`[useChatViewModel:${instanceIdRef.current}] Full cleanup...`);

        isDisposedRef.current = true;
        await disposeRecording();

        // Reset all state
        setMessages([]);
        setIsLoading(false);
        setIsTranscribing(false);

        console.log(`[useChatViewModel:${instanceIdRef.current}] Cleanup complete`);
    }, [disposeRecording]);

    // Register cleanup with AppResetManager
    useEffect(() => {
        const cleanupId = `chat-recording-${instanceIdRef.current}`;

        const unregister = AppResetManager.registerCleanup(
            cleanupId,
            cleanup,
            CleanupPriority.RECORDING
        );

        // Reset disposed state on mount
        isDisposedRef.current = false;

        return () => {
            unregister();
            cleanup();
        };
    }, [cleanup]);

    // Reset chat when locale changes
    useEffect(() => {
        if (prevLocaleRef.current !== locale) {
            console.log(`[useChatViewModel:${instanceIdRef.current}] Locale changed, resetting chat`);
            prevLocaleRef.current = locale;

            // Stop any ongoing recording first
            disposeRecording();

            // Reset messages with new welcome message
            setMessages([getWelcomeMessage(locale)]);
            setSessionId(`session-${Date.now()}`);

            // Reset disposed flag for new locale
            isDisposedRef.current = false;
        }
    }, [locale, disposeRecording]);

    const sendMessage = useCallback(async (content: string) => {
        // Don't send if disposed
        if (isDisposedRef.current) {
            console.log(`[useChatViewModel:${instanceIdRef.current}] Cannot send - instance disposed`);
            return;
        }

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content,
            timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);

        try {
            const response = await ChatService.sendMessage(content, sessionId, locale);

            // Check if disposed while waiting for response
            if (isDisposedRef.current) {
                console.log(`[useChatViewModel:${instanceIdRef.current}] Response received but instance disposed`);
                return;
            }

            const botMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.message || response.response || "I'm not sure how to respond to that.",
                timestamp: new Date().toISOString(),
                ui: response.ui,
                accounts: response.accounts,
                beneficiaries: response.beneficiaries,
                transferPreview: response.ui?.transferPreview || response.transferPreview,
                // Additional data fields
                cards: response.cards,
                bills: response.bills,
                spendingBreakdown: response.spendingBreakdown,
                subscriptions: response.subscriptions,
                spendingInsights: response.spendingInsights,
                recommendations: response.recommendations,
                recommendationsIntro: response.recommendationsIntro,
                recommendationsIntroAr: response.recommendationsIntroAr,
            };

            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error('Chat error:', error);

            if (!isDisposedRef.current) {
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    role: 'assistant',
                    content: locale === 'ar'
                        ? "عذراً، أواجه مشكلة في الاتصال حالياً. يرجى المحاولة مرة أخرى لاحقاً."
                        : "Sorry, I'm having trouble connecting right now. Please try again later.",
                    timestamp: new Date().toISOString(),
                }]);
            }
        } finally {
            if (!isDisposedRef.current) {
                setIsLoading(false);
            }
        }
    }, [sessionId, locale]);

    // Action handlers
    const handleAction = useCallback((action: string) => {
        sendMessage(action);
    }, [sendMessage]);

    const handleAccountSelect = useCallback((account: Account) => {
        sendMessage(account.name);
    }, [sendMessage]);

    const startRecording = useCallback(async () => {
        if (isDisposedRef.current) {
            console.log(`[useChatViewModel:${instanceIdRef.current}] Cannot start recording - instance disposed`);
            return;
        }

        if (isStartingRef.current || recordingRef.current) return;
        isStartingRef.current = true;

        try {
            const permission = await Audio.requestPermissionsAsync();
            if (permission.status !== 'granted') {
                isStartingRef.current = false;
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            // Check if disposed while setting up
            if (isDisposedRef.current) {
                await recording.stopAndUnloadAsync().catch(() => { });
                return;
            }

            recordingRef.current = recording;
            setIsRecording(true);
        } catch (err) {
            console.error('Failed to start recording:', err);
        } finally {
            isStartingRef.current = false;
        }
    }, []);

    const stopRecording = useCallback(async () => {
        if (!recordingRef.current) return;

        try {
            const recording = recordingRef.current;
            recordingRef.current = null;
            setIsRecording(false);

            await recording.stopAndUnloadAsync();
            await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

            const uri = recording.getURI();

            if (uri && !isDisposedRef.current) {
                // Small delay to ensure file is fully written
                await new Promise(resolve => setTimeout(resolve, 100));

                setIsTranscribing(true);
                try {
                    let text: string | null = null;
                    let retries = 2;

                    while (retries > 0 && !text) {
                        try {
                            text = await VoiceService.speechToText(uri);
                        } catch (sttError: any) {
                            retries--;
                            if (retries > 0) {
                                await new Promise(resolve => setTimeout(resolve, 150));
                            } else {
                                throw sttError;
                            }
                        }
                    }

                    if (text && !isDisposedRef.current) {
                        await sendMessage(text);
                    }
                } catch (error) {
                    console.error('Voice processing error:', error);
                } finally {
                    if (!isDisposedRef.current) {
                        setIsTranscribing(false);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to stop recording:', error);
            recordingRef.current = null;
            setIsRecording(false);
        }
    }, [sendMessage]);

    return {
        messages,
        isLoading,
        isTranscribing,
        sendMessage,
        isRecording,
        startRecording,
        stopRecording,
        handlers: {
            onAction: handleAction,
            onAccountSelect: handleAccountSelect,
            onBeneficiarySelect: (b: any) => sendMessage(`${b.name}`),
            onTransferConfirm: () => sendMessage("Confirm the transfer"),
            onTransferEdit: () => sendMessage("I want to edit the transfer details"),
            onTransferCancel: () => sendMessage("Cancel the transfer"),
            // Card handlers
            onCardSelect: (card: any) => sendMessage(`Manage my ${card.name}`),
            onCardActionConfirm: () => sendMessage("Confirm the card action"),
            onCardActionCancel: () => sendMessage("Cancel the card action"),
            // Bill handlers
            onBillSelect: (bill: any) => sendMessage(`Pay my ${bill.providerName} bill`),
            onBillPaymentConfirm: () => sendMessage("Confirm the bill payment"),
            onBillPaymentCancel: () => sendMessage("Cancel the bill payment"),
            // Recommendation handlers
            onRecommendationApply: (rec: any) => {
                const title = locale === 'ar' ? rec.titleAr : rec.title;
                sendMessage(`I want to apply for ${title}`);
            },
            onRecommendationDetails: (rec: any) => {
                const title = locale === 'ar' ? rec.titleAr : rec.title;
                sendMessage(`Tell me more about ${title}`);
            },
        }
    };
}
