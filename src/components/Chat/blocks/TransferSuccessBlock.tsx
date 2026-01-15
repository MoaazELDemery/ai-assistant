import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle2, Copy, Check } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { formatCurrency } from '../../../lib/utils';

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

interface TransferSuccessBlockProps {
    success: TransferSuccess;
    locale?: 'en' | 'ar';
}

export function TransferSuccessBlock({
    success,
    locale = 'en',
}: TransferSuccessBlockProps) {
    const [copied, setCopied] = useState(false);

    const referenceId = success.transactionId || success.transferId || '';

    const handleCopyId = async () => {
        await Clipboard.setStringAsync(referenceId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const t = {
        title: locale === 'ar' ? 'تم التحويل بنجاح!' : 'Transfer Successful!',
        subtitle: locale === 'ar' ? 'تمت معالجة المعاملة' : 'Your money is on its way',
        recipient: locale === 'ar' ? 'المستلم' : 'Recipient',
        reference: locale === 'ar' ? 'رقم المرجع' : 'Reference',
    };

    return (
        <View style={styles.container}>
            {/* Decorative circles */}
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />

            {/* Success Header */}
            <View style={styles.header}>
                <View style={styles.successIcon}>
                    <CheckCircle2 size={36} color="#fff" />
                </View>
                <Text style={styles.title}>{t.title}</Text>
                <Text style={styles.subtitle}>{t.subtitle}</Text>
            </View>

            {/* Amount Display */}
            {success.amount && success.currency && (
                <View style={styles.amountContainer}>
                    <Text style={styles.amount}>
                        {formatCurrency(success.amount, success.currency, locale)}
                    </Text>
                </View>
            )}

            {/* Details Section */}
            <View style={styles.detailsSection}>
                {/* Beneficiary */}
                {success.beneficiaryName && (
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t.recipient}</Text>
                        <Text style={styles.detailValue}>{success.beneficiaryName}</Text>
                    </View>
                )}

                {/* Transaction ID */}
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t.reference}</Text>
                    <TouchableOpacity style={styles.referenceButton} onPress={handleCopyId}>
                        <Text style={styles.referenceText}>{referenceId}</Text>
                        {copied ? (
                            <Check size={14} color="#fff" />
                        ) : (
                            <Copy size={14} color="rgba(255,255,255,0.6)" />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginVertical: 8,
        overflow: 'hidden',
        backgroundColor: '#10b981',
        borderRadius: 16,
    },
    decorativeCircle1: {
        position: 'absolute',
        top: -32,
        right: -32,
        width: 128,
        height: 128,
        borderRadius: 64,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    decorativeCircle2: {
        position: 'absolute',
        bottom: -48,
        left: -48,
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    header: {
        alignItems: 'center',
        marginBottom: 16,
        zIndex: 1,
    },
    successIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
    },
    amountContainer: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 16,
        alignItems: 'center',
        zIndex: 1,
    },
    amount: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    detailsSection: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 12,
        padding: 16,
        gap: 12,
        zIndex: 1,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#fff',
    },
    referenceButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    referenceText: {
        fontSize: 12,
        fontFamily: 'monospace',
        color: '#fff',
    },
});
