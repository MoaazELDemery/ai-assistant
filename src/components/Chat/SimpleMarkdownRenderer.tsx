import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Markdown, { RenderRules } from 'react-native-markdown-display';
import {
    TransferPreviewBlock,
    AccountListBlock,
    BeneficiaryListBlock
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

interface SimpleMarkdownRendererProps {
    content: string;
    transferPreview?: TransferPreview;
    accounts?: Account[];
    beneficiaries?: Beneficiary[];
    locale?: 'en' | 'ar';
    onAccountSelect?: (account: Account) => void;
    onBeneficiarySelect?: (beneficiary: Beneficiary) => void;
    onTransferConfirm?: () => void;
    onTransferEdit?: () => void;
    onTransferCancel?: () => void;
    // Add other handlers
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

export function SimpleMarkdownRenderer({
    content,
    transferPreview,
    accounts = [],
    beneficiaries = [],
    locale = 'en',
    onAccountSelect,
    onBeneficiarySelect,
    onTransferConfirm,
    onTransferEdit,
    onTransferCancel,
}: SimpleMarkdownRendererProps) {

    const hasTransferPreview = !!transferPreview;
    const hasAccounts = accounts.length > 0;
    const hasBeneficiaries = beneficiaries.length > 0;

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
            <View style={styles.blocksContainer}>
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

                {hasAccounts && (
                    <AccountListBlock
                        accounts={accounts}
                        locale={locale}
                        onSelect={onAccountSelect}
                    />
                )}

                {hasBeneficiaries && (
                    <BeneficiaryListBlock
                        beneficiaries={beneficiaries}
                        locale={locale}
                        onSelect={onBeneficiarySelect}
                    />
                )}
            </View>
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
