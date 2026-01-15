import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle2, Receipt, Copy, Check } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Card } from '../../ui/Card';
import { BillPaymentSuccess } from '../../../types';
import { formatCurrency } from '../../../lib/utils';

interface BillPaymentSuccessBlockProps {
    success: BillPaymentSuccess;
    locale?: 'en' | 'ar';
}

export function BillPaymentSuccessBlock({
    success,
    locale = 'en',
}: BillPaymentSuccessBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopyReference = async () => {
        await Clipboard.setStringAsync(success.reference);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const t = {
        success: locale === 'ar' ? 'تم الدفع بنجاح' : 'Payment Successful',
        subtitle: locale === 'ar' ? 'تمت معالجة الفاتورة' : 'Your bill has been paid',
        provider: locale === 'ar' ? 'المزود' : 'Provider',
        amountPaid: locale === 'ar' ? 'المبلغ المدفوع' : 'Amount Paid',
        paidOn: locale === 'ar' ? 'تاريخ الدفع' : 'Paid On',
        reference: locale === 'ar' ? 'رقم المرجع' : 'Reference',
    };

    return (
        <Card variant="gradient" style={styles.container}>
            <View style={styles.header}>
                <View style={styles.successIcon}>
                    <CheckCircle2 size={24} color="#4ade80" />
                </View>
                <View>
                    <Text style={styles.title}>{t.success}</Text>
                    <Text style={styles.subtitle}>{t.subtitle}</Text>
                </View>
            </View>

            <View style={styles.providerInfo}>
                <View style={styles.iconContainer}>
                    <Receipt size={20} color="#fff" />
                </View>
                <View style={styles.providerDetails}>
                    <Text style={styles.providerLabel}>{t.provider}</Text>
                    <Text style={styles.providerName}>
                        {success.providerName || (success as any).billName || success.billId}
                    </Text>
                </View>
            </View>

            <View style={styles.detailsSection}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t.amountPaid}</Text>
                    <Text style={styles.detailValue}>{formatCurrency(success.amount, 'SAR', locale)}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t.paidOn}</Text>
                    <Text style={styles.detailValue}>{formatDate(success.paidAt)}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t.reference}</Text>
                    <TouchableOpacity style={styles.referenceButton} onPress={handleCopyReference}>
                        <Text style={styles.referenceText}>{success.reference}</Text>
                        {copied ? (
                            <Check size={14} color="#fff" />
                        ) : (
                            <Copy size={14} color="rgba(255,255,255,0.6)" />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginVertical: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    successIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(74,222,128,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
    },
    providerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        marginBottom: 16,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    providerDetails: {
        flex: 1,
    },
    providerLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
    },
    providerName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#fff',
    },
    detailsSection: {
        gap: 8,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.8)',
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
