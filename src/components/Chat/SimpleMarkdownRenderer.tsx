import React from 'react';
import { View, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';
import {
    TransferPreviewBlock,
    AccountListBlock,
    BeneficiaryListBlock,
    CardListBlock,
    CardPreviewBlock,
    CardActionSuccessBlock,
    SpendingBreakdownBlock,
    SpendingInsightsBlock,
    SubscriptionListBlock,
    BillListBlock,
    BillPaymentPreviewBlock,
    BillPaymentSuccessBlock,
    TicketCreatedBlock,
    TransferSuccessBlock,
    RecommendationsBlock,
    Recommendation
} from './blocks';
import {
    Account,
    Beneficiary,
    TransferPreview,
    Card,
    Bill,
    SpendingBreakdown,
    SpendingInsight,
    Subscription,
    BillPaymentPreview,
    BillPaymentSuccess,
    TicketCreated,
    CardPreview,
    CardActionSuccess
} from '../../types';

interface TransferSuccess {
    transactionId?: string;
    transferId?: string;
    amount?: number;
    currency?: string;
    beneficiaryName?: string;
    fromAccountName?: string;
    status?: string;
    completedAt?: string;
}

interface SimpleMarkdownRendererProps {
    content: string;
    transferPreview?: TransferPreview;
    transferSuccess?: TransferSuccess;
    accounts?: Account[];
    beneficiaries?: Beneficiary[];
    cards?: Card[];
    cardPreview?: CardPreview;
    cardActionSuccess?: CardActionSuccess;
    spendingBreakdown?: SpendingBreakdown[];
    spendingInsights?: SpendingInsight[];
    subscriptions?: Subscription[];
    bills?: Bill[];
    billPaymentPreview?: BillPaymentPreview;
    billPaymentSuccess?: BillPaymentSuccess;
    ticketCreated?: TicketCreated;
    recommendations?: Recommendation[];
    recommendationsIntro?: string;
    recommendationsIntroAr?: string;
    locale?: 'en' | 'ar';
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
    onRecommendationApply?: (recommendation: Recommendation) => void;
    onRecommendationDetails?: (recommendation: Recommendation) => void;
}

const markdownStyles = StyleSheet.create({
    body: {
        color: '#333',
        fontSize: 15,
        lineHeight: 22,
    },
    paragraph: {
        marginBottom: 10,
    },
    list_item: {
        marginBottom: 5,
    },
    bullet_list: {
        marginBottom: 10,
    },
});

const isObject = (val: unknown): val is object => val !== null && typeof val === 'object';

export function SimpleMarkdownRenderer({
    content,
    transferPreview,
    transferSuccess,
    accounts = [],
    beneficiaries = [],
    cards = [],
    cardPreview,
    cardActionSuccess,
    spendingBreakdown = [],
    spendingInsights = [],
    subscriptions = [],
    bills = [],
    billPaymentPreview,
    billPaymentSuccess,
    ticketCreated,
    recommendations = [],
    recommendationsIntro,
    recommendationsIntroAr,
    locale = 'en',
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
}: SimpleMarkdownRendererProps) {

    const hasTransferPreview = isObject(transferPreview);
    const hasTransferSuccess = isObject(transferSuccess);
    const hasAccounts = accounts.length > 0;
    const hasBeneficiaries = beneficiaries.length > 0;
    const hasCards = cards.length > 0;
    const hasCardPreview = isObject(cardPreview);
    const hasCardActionSuccess = isObject(cardActionSuccess);
    const hasSpendingBreakdown = spendingBreakdown.length > 0;
    const hasSpendingInsights = spendingInsights && spendingInsights.length > 0;
    const hasSubscriptions = subscriptions.length > 0;
    const hasBills = bills.length > 0;
    const hasBillPaymentPreview = isObject(billPaymentPreview);
    const hasBillPaymentSuccess = isObject(billPaymentSuccess);
    const hasTicketCreated = isObject(ticketCreated);
    const hasRecommendations = recommendations.length > 0;

    return (
        <View style={styles.container}>
            {/* Text Content */}
            {content ? (
                <View style={styles.bubble}>
                    <Markdown style={markdownStyles}>
                        {content}
                    </Markdown>
                </View>
            ) : null}

            {/* Blocks */}
            {(hasTransferPreview || hasTransferSuccess || hasAccounts || hasBeneficiaries || hasCards || hasCardPreview || hasCardActionSuccess || hasSpendingBreakdown || hasSpendingInsights || hasSubscriptions || hasBills || hasBillPaymentPreview || hasBillPaymentSuccess || hasTicketCreated || hasRecommendations) && (
                <View style={styles.blocksContainer}>
                    {/* Render transfer preview if present */}
                    {hasTransferPreview && transferPreview && (
                        <TransferPreviewBlock
                            block={{
                                id: 'transfer-preview',
                                type: 'transfer',
                                preview: transferPreview,
                                rawContent: '',
                            }}
                            locale={locale}
                            onConfirm={onTransferConfirm}
                            onEdit={onTransferEdit}
                            onCancel={onTransferCancel}
                        />
                    )}

                    {/* Render transfer success if present */}
                    {hasTransferSuccess && (
                        <TransferSuccessBlock
                            success={transferSuccess!}
                            locale={locale}
                        />
                    )}

                    {/* Render accounts if present */}
                    {hasAccounts && (
                        <AccountListBlock
                            accounts={accounts}
                            locale={locale}
                            onSelect={onAccountSelect}
                        />
                    )}

                    {/* Render beneficiaries if present */}
                    {hasBeneficiaries && (
                        <BeneficiaryListBlock
                            beneficiaries={beneficiaries}
                            locale={locale}
                            onSelect={onBeneficiarySelect}
                        />
                    )}

                    {/* Render cards if present */}
                    {hasCards && (
                        <CardListBlock
                            cards={cards}
                            locale={locale}
                            onSelect={onCardSelect}
                        />
                    )}

                    {/* Render card preview if present */}
                    {hasCardPreview && cardPreview && (
                        <CardPreviewBlock
                            cardPreview={cardPreview}
                            locale={locale}
                            onConfirm={onCardActionConfirm}
                            onCancel={onCardActionCancel}
                        />
                    )}

                    {/* Render card action success if present */}
                    {hasCardActionSuccess && cardActionSuccess && (
                        <CardActionSuccessBlock
                            success={cardActionSuccess}
                            locale={locale}
                        />
                    )}

                    {/* Render spending breakdown if present */}
                    {hasSpendingBreakdown && (
                        <SpendingBreakdownBlock
                            breakdown={spendingBreakdown}
                            total={spendingBreakdown.reduce((sum, item) => sum + item.amount, 0)}
                            locale={locale}
                        />
                    )}

                    {/* Render spending insights if present */}
                    {hasSpendingInsights && (
                        <SpendingInsightsBlock
                            insights={spendingInsights}
                            locale={locale}
                        />
                    )}

                    {/* Render subscriptions if present */}
                    {hasSubscriptions && (
                        <SubscriptionListBlock
                            subscriptions={subscriptions}
                            locale={locale}
                        />
                    )}

                    {/* Render bills if present */}
                    {hasBills && (
                        <BillListBlock
                            bills={bills}
                            locale={locale}
                            onSelect={onBillSelect}
                        />
                    )}

                    {/* Render bill payment preview if present */}
                    {hasBillPaymentPreview && billPaymentPreview && (
                        <BillPaymentPreviewBlock
                            preview={billPaymentPreview}
                            locale={locale}
                            onConfirm={onBillPaymentConfirm}
                            onCancel={onBillPaymentCancel}
                        />
                    )}

                    {/* Render bill payment success if present */}
                    {hasBillPaymentSuccess && billPaymentSuccess && (
                        <BillPaymentSuccessBlock
                            success={billPaymentSuccess}
                            locale={locale}
                        />
                    )}

                    {/* Render ticket created if present */}
                    {hasTicketCreated && ticketCreated && (
                        <TicketCreatedBlock
                            ticket={ticketCreated}
                            locale={locale}
                        />
                    )}

                    {/* Render recommendations if present */}
                    {hasRecommendations && (
                        <RecommendationsBlock
                            recommendations={recommendations}
                            introMessage={recommendationsIntro}
                            introMessageAr={recommendationsIntroAr}
                            locale={locale}
                            onApply={onRecommendationApply}
                            onDetails={onRecommendationDetails}
                        />
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    bubble: {
        backgroundColor: '#F3F4F6', // gray-100/secondary
        padding: 12,
        borderRadius: 16,
        borderTopLeftRadius: 0,
        alignSelf: 'flex-start',
        maxWidth: '100%',
    },
    blocksContainer: {
        gap: 16,
        marginTop: 4,
        width: '100%',
    },
});
