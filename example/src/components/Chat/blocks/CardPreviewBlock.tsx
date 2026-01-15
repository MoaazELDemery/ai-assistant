import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CreditCard } from 'lucide-react-native';
import { Card } from '../../ui/Card';
import { CardPreview } from '../../../types';

interface CardPreviewBlockProps {
    cardPreview: CardPreview;
    onConfirm?: () => void;
    onCancel?: () => void;
    locale?: 'en' | 'ar';
}

export function CardPreviewBlock({
    cardPreview,
    onConfirm,
    onCancel,
    locale = 'en',
}: CardPreviewBlockProps) {
    const actionLabels: Record<string, { en: string; ar: string }> = {
        freeze: { en: 'Freeze Card', ar: 'تجميد البطاقة' },
        unfreeze: { en: 'Unfreeze Card', ar: 'إلغاء تجميد البطاقة' },
        set_daily_limit: { en: 'Set Daily Limit', ar: 'تعيين الحد اليومي' },
        set_transaction_limit: { en: 'Set Transaction Limit', ar: 'تعيين حد المعاملة' },
        toggle_international: { en: 'Toggle International Transactions', ar: 'تبديل المعاملات الدولية' },
        toggle_online: { en: 'Toggle Online Transactions', ar: 'تبديل المعاملات عبر الإنترنت' },
        request_replacement: { en: 'Request Replacement', ar: 'طلب بطاقة بديلة' },
        reset_pin: { en: 'Reset PIN', ar: 'إعادة تعيين الرمز السري' },
    };

    const actionLabel = actionLabels[cardPreview.action]?.[locale] || cardPreview.action;

    const formatNumber = (num: number) => {
        return num.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US');
    };

    const t = {
        title: locale === 'ar' ? 'معاينة إجراء البطاقة' : 'Card Action Preview',
        pending: locale === 'ar' ? 'قيد الانتظار' : 'Pending',
        card: locale === 'ar' ? 'البطاقة' : 'Card',
        action: locale === 'ar' ? 'الإجراء' : 'Action',
        newDailyLimit: locale === 'ar' ? 'الحد اليومي الجديد' : 'New Daily Limit',
        newTransactionLimit: locale === 'ar' ? 'حد المعاملة الجديد' : 'New Transaction Limit',
        cancel: locale === 'ar' ? 'إلغاء' : 'Cancel',
        confirm: locale === 'ar' ? 'تأكيد' : 'Confirm',
    };

    return (
        <Card variant="gradient" style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{t.title}</Text>
                <View style={styles.pendingBadge}>
                    <Text style={styles.pendingText}>{t.pending}</Text>
                </View>
            </View>

            <View style={styles.cardInfo}>
                <View style={styles.iconContainer}>
                    <CreditCard size={20} color="#fff" />
                </View>
                <View style={styles.cardDetails}>
                    <Text style={styles.cardLabel}>{t.card}</Text>
                    <Text style={styles.cardName}>
                        {cardPreview.cardName || `Card ${cardPreview.cardId.slice(-4)}`}
                    </Text>
                </View>
            </View>

            <View style={styles.detailsSection}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t.action}</Text>
                    <Text style={styles.detailValue}>{actionLabel}</Text>
                </View>

                {cardPreview.newDailyLimit !== undefined && (
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t.newDailyLimit}</Text>
                        <Text style={styles.detailValue}>
                            {formatNumber(cardPreview.newDailyLimit)} SAR
                        </Text>
                    </View>
                )}

                {cardPreview.newTransactionLimit !== undefined && (
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t.newTransactionLimit}</Text>
                        <Text style={styles.detailValue}>
                            {formatNumber(cardPreview.newTransactionLimit)} SAR
                        </Text>
                    </View>
                )}
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
    cardInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        marginBottom: 20,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardDetails: {
        flex: 1,
    },
    cardLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
    },
    cardName: {
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
