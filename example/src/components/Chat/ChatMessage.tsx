import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Bot, User, Volume2, VolumeX } from 'lucide-react-native';
import { ChatMessage as ChatMessageType, Account, Beneficiary, Card, Bill, SpendingBreakdown, Subscription, Recommendation } from '../../types';
import { SimpleMarkdownRenderer } from './SimpleMarkdownRenderer';
import { Locale } from '../../contexts/LocaleContext';

interface ChatMessageProps {
    message: ChatMessageType;
    accounts?: Account[];
    beneficiaries?: Beneficiary[];
    cards?: Card[];
    bills?: Bill[];
    spendingBreakdown?: SpendingBreakdown[];
    subscriptions?: Subscription[];
    locale?: Locale;
    onAction?: (action: string) => void;
    onAccountSelect?: (account: Account) => void;
    onBeneficiarySelect?: (beneficiary: Beneficiary) => void;
    onCardSelect?: (card: Card) => void;
    onBillSelect?: (bill: Bill) => void;
    onTransferConfirm?: () => void;
    onTransferEdit?: () => void;
    onTransferCancel?: () => void;
    onCardActionConfirm?: () => void;
    onCardActionCancel?: () => void;
    onBillPaymentConfirm?: () => void;
    onBillPaymentCancel?: () => void;
    // Recommendation handlers
    onRecommendationApply?: (recommendation: Recommendation) => void;
    onRecommendationDetails?: (recommendation: Recommendation) => void;
    // Speech props
    onSpeechToggle?: (text: string, messageId: string) => void;
    isSpeaking?: boolean;
    isLoadingSpeech?: boolean;
    currentSpeakingMessageId?: string | null;
    // RTL prop
    isRTL?: boolean;
}

export function ChatMessage({
    message,
    accounts: fallbackAccounts = [],
    beneficiaries: fallbackBeneficiaries = [],
    cards: fallbackCards = [],
    bills: fallbackBills = [],
    spendingBreakdown: fallbackSpendingBreakdown = [],
    subscriptions: fallbackSubscriptions = [],
    onAction,
    onAccountSelect,
    onBeneficiarySelect,
    onCardSelect,
    onBillSelect,
    onTransferConfirm,
    onTransferEdit,
    onTransferCancel,
    onCardActionConfirm,
    onCardActionCancel,
    onBillPaymentConfirm,
    onBillPaymentCancel,
    onRecommendationApply,
    onRecommendationDetails,
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

    // Use structured UI data from message
    const ui = message.ui;

    // Get accounts/beneficiaries based on UI flags
    const shouldShowAccounts = ui?.showAccounts && message.accounts?.length;
    const shouldShowBeneficiaries = ui?.showBeneficiaries && message.beneficiaries?.length;
    const shouldShowCards = ui?.showCards && message.cards?.length;
    const shouldShowBills = ui?.showBills && message.bills?.length;
    const shouldShowSpendingBreakdown = ui?.showSpendingBreakdown && message.spendingBreakdown?.length;
    const shouldShowSubscriptions = ui?.showSubscriptions && message.subscriptions?.length;

    const accounts = shouldShowAccounts ? message.accounts! : [];
    const beneficiaries = shouldShowBeneficiaries ? message.beneficiaries! : [];
    // Use message data first, then fall back to props
    const cards = shouldShowCards ? message.cards! : (ui?.showCards ? fallbackCards : []);
    const bills = shouldShowBills ? message.bills! : (ui?.showBills ? fallbackBills : []);
    const spendingBreakdown = shouldShowSpendingBreakdown ? message.spendingBreakdown! : (ui?.showSpendingBreakdown ? fallbackSpendingBreakdown : []);
    const subscriptions = shouldShowSubscriptions ? message.subscriptions! : (ui?.showSubscriptions ? fallbackSubscriptions : []);

    // Get transfer preview and success from UI or legacy field
    const transferPreview = ui?.transferPreview || message.transferPreview;
    const transferSuccess = ui?.transferSuccess;

    // Get card-related UI data
    const cardPreview = ui?.cardPreview;
    const cardActionSuccess = ui?.cardActionSuccess;

    // Get spending insights from message or UI (handle both array and object formats)
    const rawSpendingInsights = message.spendingInsights || ui?.spendingInsights;
    const spendingInsights = Array.isArray(rawSpendingInsights)
        ? rawSpendingInsights
        : (rawSpendingInsights as any)?.insights;

    // Get bill payment UI data
    const billPaymentPreview = ui?.billPaymentPreview;
    const billPaymentSuccess = ui?.billPaymentSuccess;

    // Get ticket created data
    const ticketCreated = ui?.ticketCreated;

    // Get recommendations from message
    const recommendations = message.recommendations || [];
    const recommendationsIntro = message.recommendationsIntro;
    const recommendationsIntroAr = message.recommendationsIntroAr;

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
                    <Bot size={16} color="#4F008D" />
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
                            transferSuccess={transferSuccess || undefined}
                            accounts={accounts}
                            beneficiaries={beneficiaries}
                            cards={cards}
                            cardPreview={cardPreview || undefined}
                            cardActionSuccess={cardActionSuccess || undefined}
                            spendingBreakdown={spendingBreakdown}
                            spendingInsights={spendingInsights || undefined}
                            subscriptions={subscriptions}
                            bills={bills}
                            billPaymentPreview={billPaymentPreview || undefined}
                            billPaymentSuccess={billPaymentSuccess || undefined}
                            ticketCreated={ticketCreated || undefined}
                            recommendations={recommendations}
                            recommendationsIntro={recommendationsIntro}
                            recommendationsIntroAr={recommendationsIntroAr}
                            locale={locale}
                            onAction={onAction}
                            onAccountSelect={onAccountSelect}
                            onBeneficiarySelect={onBeneficiarySelect}
                            onCardSelect={onCardSelect}
                            onBillSelect={onBillSelect}
                            onTransferConfirm={onTransferConfirm}
                            onTransferEdit={onTransferEdit}
                            onTransferCancel={onTransferCancel}
                            onCardActionConfirm={onCardActionConfirm}
                            onCardActionCancel={onCardActionCancel}
                            onBillPaymentConfirm={onBillPaymentConfirm}
                            onBillPaymentCancel={onBillPaymentCancel}
                            onRecommendationApply={onRecommendationApply}
                            onRecommendationDetails={onRecommendationDetails}
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
                                        <ActivityIndicator size="small" color="#4F008D" />
                                        <Text style={[styles.speechButtonText, styles.speechButtonTextActive]}>
                                            {t.loading}
                                        </Text>
                                    </>
                                ) : isThisMessageSpeaking ? (
                                    <>
                                        <VolumeX size={14} color="#4F008D" />
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
        backgroundColor: '#4F008D',
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
        backgroundColor: '#4F008D',
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
        backgroundColor: 'rgba(79, 0, 141, 0.1)',
    },
    speechButtonText: {
        fontSize: 12,
        color: '#6B7280',
    },
    speechButtonTextActive: {
        color: '#4F008D',
    },
});
