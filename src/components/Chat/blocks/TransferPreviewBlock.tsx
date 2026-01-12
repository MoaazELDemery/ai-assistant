import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Wallet, Building2, ArrowRight } from 'lucide-react-native';
import { Card } from '../../ui/Card';
import { formatCurrency } from '../../../lib/utils';
import { TransferPreview } from '../../../types';
// import Animated, { FadeInUp } from 'react-native-reanimated';

interface TransferBlockData {
    id: string;
    type: 'transfer';
    preview: TransferPreview;
    rawContent: string;
}

interface TransferPreviewBlockProps {
    block: TransferBlockData;
    locale?: 'en' | 'ar';
    onConfirm?: () => void;
    onEdit?: () => void;
    onCancel?: () => void;
}

export function TransferPreviewBlock({
    block,
    locale = 'en',
    onConfirm,
    onEdit,
    onCancel
}: TransferPreviewBlockProps) {
    const { preview } = block;

    const purposeLabels: Record<string, Record<string, string>> = {
        en: {
            family_support: 'Family Support',
            salary: 'Salary',
            investment: 'Investment',
            education: 'Education',
            medical: 'Medical',
            business: 'Business',
            other: 'Other',
        },
        ar: {
            family_support: 'دعم عائلي',
            salary: 'راتب',
            investment: 'استثمار',
            education: 'تعليم',
            medical: 'طبي',
            business: 'أعمال',
            other: 'أخرى',
        },
    };

    const t = {
        title: locale === 'ar' ? 'ملخص التحويل' : 'Transfer Summary',
        pending: locale === 'ar' ? 'قيد الانتظار' : 'Pending',
        from: locale === 'ar' ? 'من' : 'From',
        to: locale === 'ar' ? 'إلى' : 'To',
        amount: locale === 'ar' ? 'المبلغ' : 'Amount',
        type: locale === 'ar' ? 'النوع' : 'Type',
        exchangeRate: locale === 'ar' ? 'سعر الصرف' : 'Exchange Rate',
        convertedAmount: locale === 'ar' ? 'المبلغ المحول' : 'Converted Amount',
        fees: locale === 'ar' ? 'الرسوم' : 'Fees',
        purpose: locale === 'ar' ? 'الغرض' : 'Purpose',
        total: locale === 'ar' ? 'الإجمالي' : 'Total',
        cancel: locale === 'ar' ? 'إلغاء' : 'Cancel',
        edit: locale === 'ar' ? 'تعديل' : 'Edit',
        confirm: locale === 'ar' ? 'تأكيد' : 'Confirm',
        account: locale === 'ar' ? 'حساب' : 'Account',
        beneficiary: locale === 'ar' ? 'مستفيد' : 'Beneficiary',
    };

    return (
        <View>
            <Card variant="gradient" style={styles.cardPadding}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{t.title}</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{t.pending}</Text>
                    </View>
                </View>

                {/* Transfer flow visualization */}
                <View style={styles.flowContainer}>
                    <View style={styles.flowItem}>
                        <View style={styles.iconCircle}>
                            <Wallet size={20} color="#fff" />
                        </View>
                        <View style={styles.flowTextContainer}>
                            <Text style={styles.flowLabel}>{t.from}</Text>
                            <Text style={styles.flowValue} numberOfLines={1}>
                                {preview.fromAccountName || (preview.fromAccountId ? `${t.account} ${preview.fromAccountId.slice(-4)}` : t.account)}
                            </Text>
                        </View>
                    </View>

                    <ArrowRight size={20} color="rgba(255,255,255,0.6)" />

                    <View style={styles.flowItem}>
                        <View style={styles.iconCircle}>
                            <Building2 size={20} color="#fff" />
                        </View>
                        <View style={styles.flowTextContainer}>
                            <Text style={styles.flowLabel}>{t.to}</Text>
                            <Text style={styles.flowValue} numberOfLines={1}>
                                {preview.beneficiaryName || (preview.beneficiaryId ? `${t.beneficiary} ${preview.beneficiaryId.slice(-4)}` : t.beneficiary)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Amount details */}
                <View style={styles.detailsContainer}>
                    <DetailRow label={t.amount} value={formatCurrency(preview.amount, preview.currency, locale)} />

                    {preview.type && (
                        <DetailRow label={t.type} value={preview.type} capitalize />
                    )}

                    {preview.exchangeRate && (
                        <DetailRow label={t.exchangeRate} value={`1 ${preview.currency} = ${preview.exchangeRate.toFixed(4)} SAR`} />
                    )}

                    {preview.convertedAmount && (
                        <DetailRow label={t.convertedAmount} value={formatCurrency(preview.convertedAmount, 'SAR', locale)} />
                    )}

                    {preview.fees !== undefined && (
                        <DetailRow label={t.fees} value={formatCurrency(preview.fees, preview.currency, locale)} />
                    )}

                    {preview.purpose && (
                        <DetailRow label={t.purpose} value={purposeLabels[locale][preview.purpose] || preview.purpose} />
                    )}

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>{t.total}</Text>
                        <Text style={styles.totalValue}>
                            {formatCurrency(preview.totalAmount || preview.amount + (preview.fees || 0), preview.currency, locale)}
                        </Text>
                    </View>
                </View>

                {/* Action buttons */}
                {(onConfirm || onEdit || onCancel) && (
                    <View style={styles.actionsContainer}>
                        {onCancel && (
                            <TouchableOpacity style={styles.ghostButton} onPress={onCancel}>
                                <Text style={styles.ghostButtonText}>{t.cancel}</Text>
                            </TouchableOpacity>
                        )}
                        {onEdit && (
                            <TouchableOpacity style={styles.ghostButton} onPress={onEdit}>
                                <Text style={styles.ghostButtonText}>{t.edit}</Text>
                            </TouchableOpacity>
                        )}
                        {onConfirm && (
                            <TouchableOpacity style={styles.primaryButton} onPress={onConfirm}>
                                <Text style={styles.primaryButtonText}>{t.confirm}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </Card>
        </View>
    );
}

const DetailRow = ({ label, value, capitalize }: { label: string, value: string, capitalize?: boolean }) => (
    <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={[styles.detailValue, capitalize && styles.capitalize]}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    cardPadding: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    badge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    flowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 12,
        borderRadius: 12,
    },
    flowItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    flowTextContainer: {
        flex: 1,
    },
    flowLabel: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.7)',
    },
    flowValue: {
        fontSize: 13,
        fontWeight: '500',
        color: '#fff',
    },
    detailsContainer: {
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
        color: '#fff',
    },
    capitalize: {
        textTransform: 'capitalize',
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.2)',
        paddingTop: 12,
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    ghostButton: {
        flex: 1,
        paddingVertical: 10,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        alignItems: 'center',
    },
    ghostButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    primaryButton: {
        flex: 1,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#4F46E5', // Primary color
        fontSize: 14,
        fontWeight: '600',
    },
});
