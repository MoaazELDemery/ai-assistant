import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Bot, User, Volume2, VolumeX } from 'lucide-react-native';
import { ChatMessage as ChatMessageType } from '../../types';
import { SimpleMarkdownRenderer } from './SimpleMarkdownRenderer';
import { Locale } from '../../contexts/LocaleContext';

interface ChatMessageProps {
    message: ChatMessageType;
    onAction?: (action: string) => void;
    // Handler props...
    onAccountSelect?: (account: any) => void;
    onBeneficiarySelect?: (beneficiary: any) => void;
    onTransferConfirm?: () => void;
    onTransferEdit?: () => void;
    onTransferCancel?: () => void;
    // Speech props
    onSpeechToggle?: (text: string, messageId: string) => void;
    isSpeaking?: boolean;
    isLoadingSpeech?: boolean;
    currentSpeakingMessageId?: string | null;
    // Locale props
    locale?: Locale;
    isRTL?: boolean;
}

export function ChatMessage({
    message,
    onAccountSelect,
    onBeneficiarySelect,
    onTransferConfirm,
    onTransferEdit,
    onTransferCancel,
    onSpeechToggle,
    isSpeaking,
    isLoadingSpeech,
    currentSpeakingMessageId,
    locale = 'en',
    isRTL = false,
}: ChatMessageProps) {
    const isUser = message.role === 'user';
    const isThisMessageSpeaking = currentSpeakingMessageId === message.id;
    const isThisMessageLoading = isLoadingSpeech && isThisMessageSpeaking;

    // Extract UI data
    const accounts = message.ui?.showAccounts && message.accounts ? message.accounts : [];
    const beneficiaries = message.ui?.showBeneficiaries && message.beneficiaries ? message.beneficiaries : [];
    const transferPreview = message.ui?.transferPreview || message.transferPreview;

    const handleSpeechPress = () => {
        if (onSpeechToggle) {
            onSpeechToggle(message.content, message.id);
        }
    };

    // Localized strings
    const t = {
        listen: locale === 'ar' ? 'استمع' : 'Listen',
        stop: locale === 'ar' ? 'إيقاف' : 'Stop',
        loading: locale === 'ar' ? 'جاري التحميل...' : 'Loading...',
    };

    // Dynamic styles based on RTL and user/bot
    const containerStyle = [
        styles.container,
        isUser
            ? (isRTL ? styles.userContainerRTL : styles.userContainer)
            : (isRTL ? styles.botContainerRTL : styles.botContainer)
    ];

    const userBubbleStyle = [
        styles.userBubble,
        isRTL ? styles.userBubbleRTL : null,
    ];

    const speechButtonStyle = [
        styles.speechButton,
        isRTL && styles.speechButtonRTL,
        (isThisMessageSpeaking || isThisMessageLoading) && styles.speechButtonActive,
    ];

    return (
        <View style={containerStyle}>
            <View style={[styles.avatar, isUser ? styles.userAvatar : styles.botAvatar]}>
                {isUser ? (
                    <User size={16} color="#fff" />
                ) : (
                    <Bot size={16} color="#4F46E5" />
                )}
            </View>

            <View style={[styles.contentContainer, isUser && styles.userContentContainer]}>
                {isUser ? (
                    <View style={userBubbleStyle}>
                        <Text style={[styles.userText, isRTL && styles.textRTL]}>
                            {message.content}
                        </Text>
                    </View>
                ) : (
                    <>
                        <SimpleMarkdownRenderer
                            content={message.content}
                            transferPreview={transferPreview || undefined}
                            accounts={accounts}
                            beneficiaries={beneficiaries}
                            onAccountSelect={onAccountSelect}
                            onBeneficiarySelect={onBeneficiarySelect}
                            onTransferConfirm={onTransferConfirm}
                            onTransferEdit={onTransferEdit}
                            onTransferCancel={onTransferCancel}
                            locale={locale}
                        />

                        {/* Speech toggle button for assistant messages */}
                        {onSpeechToggle && (
                            <TouchableOpacity
                                style={speechButtonStyle}
                                onPress={handleSpeechPress}
                                disabled={isLoadingSpeech && !isThisMessageSpeaking}
                            >
                                {isThisMessageLoading ? (
                                    <>
                                        <ActivityIndicator size="small" color="#4F46E5" />
                                        <Text style={[styles.speechButtonText, styles.speechButtonTextActive]}>
                                            {t.loading}
                                        </Text>
                                    </>
                                ) : isThisMessageSpeaking ? (
                                    <>
                                        <VolumeX size={14} color="#4F46E5" />
                                        <Text style={[styles.speechButtonText, styles.speechButtonTextActive]}>
                                            {t.stop}
                                        </Text>
                                    </>
                                ) : (
                                    <>
                                        <Volume2 size={14} color="#6B7280" />
                                        <Text style={styles.speechButtonText}>{t.listen}</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        )}
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 12,
    },
    userContainer: {
        flexDirection: 'row-reverse',
    },
    userContainerRTL: {
        flexDirection: 'row',
    },
    botContainer: {
        flexDirection: 'row',
    },
    botContainerRTL: {
        flexDirection: 'row-reverse',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    userAvatar: {
        backgroundColor: '#4F46E5',
    },
    botAvatar: {
        backgroundColor: '#EEF2FF',
    },
    contentContainer: {
        flex: 1,
        maxWidth: '85%',
    },
    userContentContainer: {
        flex: 0,
        flexShrink: 1,
    },
    userBubble: {
        backgroundColor: '#4F46E5',
        padding: 12,
        borderRadius: 16,
        borderTopRightRadius: 2,
        alignSelf: 'flex-start',
    },
    userBubbleRTL: {
        borderTopRightRadius: 16,
        borderTopLeftRadius: 2,
    },
    userText: {
        color: '#fff',
        fontSize: 15,
    },
    textRTL: {
        textAlign: 'right',
        writingDirection: 'rtl',
    },
    speechButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    speechButtonRTL: {
        flexDirection: 'row-reverse',
        alignSelf: 'flex-end',
    },
    speechButtonActive: {
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
    },
    speechButtonText: {
        fontSize: 12,
        color: '#6B7280',
    },
    speechButtonTextActive: {
        color: '#4F46E5',
    },
});
