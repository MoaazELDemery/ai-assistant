import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Receipt, Building2 } from 'lucide-react-native';
import { Card } from '../../ui/Card';
import { BillPaymentPreview } from '../../../types';
import { formatCurrency } from '../../../lib/utils';

interface BillPaymentPreviewBlockProps {
    preview: BillPaymentPreview;
    onConfirm?: () => void;
    onCancel?: () => void;
    locale?: 'en' | 'ar';
}

export function BillPaymentPreviewBlock({
    preview,
    onConfirm,
    onCancel,
    locale = 'en',
}: BillPaymentPreviewBlockProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const t = {
        title: locale === 'ar' ? 'معاينة دفع الفاتورة' : 'Bill Payment Preview',
        pending: locale === 'ar' ? 'قيد الانتظار' : 'Pending',
        provider: locale === 'ar' ? 'المزود' : 'Provider',
        fromAccount: locale === 'ar' ? 'من الحساب' : 'From Account',
        amount: locale === 'ar' ? 'المبلغ' : 'Amount',
        dueDate: locale === 'ar' ? 'تاريخ الاستحقاق' : 'Due Date',
        cancel: locale === 'ar' ? 'إلغاء' : 'Cancel',
        confirm: locale === 'ar' ? 'تأكيد الدفع' : 'Confirm Payment',
    };

    return (
        <Card variant="gradient" style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{t.title}</Text>
                <View style={styles.pendingBadge}>
                    <Text style={styles.pendingText}>{t.pending}</Text>
                </View>
            </View>

            <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                    <View style={styles.iconContainer}>
                        <Receipt size={20} color="#fff" />
                    </View>
                    <View style={styles.infoDetails}>
                        <Text style={styles.infoLabel}>{t.provider}</Text>
                        <Text style={styles.infoValue}>
                            {preview.providerName || (preview as any).billName || preview.billId}
                        </Text>
                    </View>
                </View>

                {(preview.fromAccountName || preview.fromAccountId) && (
                    <View style={styles.infoRow}>
                        <View style={styles.iconContainer}>
                            <Building2 size={20} color="#fff" />
                        </View>
                        <View style={styles.infoDetails}>
                            <Text style={styles.infoLabel}>{t.fromAccount}</Text>
                            <Text style={styles.infoValue}>
                                {preview.fromAccountName || preview.fromAccountId}
                            </Text>
                        </View>
                    </View>
                )}
            </View>

            <View style={styles.detailsSection}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t.amount}</Text>
                    <Text style={styles.detailValue}>{formatCurrency(preview.amount, 'SAR', locale)}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t.dueDate}</Text>
                    <Text style={styles.detailValue}>{formatDate(preview.dueDate)}</Text>
                </View>
            </View>

            {(onConfirm || onCancel) && (
                <View style={styles.actions}>
                    {onCancel && (
                        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                            <Text style={styles.cancelButtonText}>{t.cancel}</Text>
                        </TouchableOpacity>
                    )}
                    {onConfirm && (
                        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
                            <Text style={styles.confirmButtonText}>{t.confirm}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
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
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    pendingBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    pendingText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    infoSection: {
        gap: 12,
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoDetails: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#fff',
    },
    detailsSection: {
        gap: 8,
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    confirmButton: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#4F008D',
        fontSize: 14,
        fontWeight: '600',
    },
});
