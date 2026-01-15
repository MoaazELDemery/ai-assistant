import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Zap, Droplet, Wifi, Phone, CreditCard, Building2 } from 'lucide-react-native';
import { Card } from '../../ui/Card';
import { Bill } from '../../../types';
import { formatCurrency } from '../../../lib/utils';

interface BillListBlockProps {
    bills: Bill[];
    locale?: 'en' | 'ar';
    onSelect?: (bill: Bill) => void;
}

export function BillListBlock({
    bills,
    locale = 'en',
    onSelect,
}: BillListBlockProps) {
    if (bills.length === 0) return null;

    const getBillIcon = (type: Bill['type']) => {
        switch (type) {
            case 'electricity':
                return { Icon: Zap, color: '#eab308' };
            case 'water':
                return { Icon: Droplet, color: '#3b82f6' };
            case 'internet':
                return { Icon: Wifi, color: '#a855f7' };
            case 'phone':
                return { Icon: Phone, color: '#00C58D' };
            case 'credit_card':
                return { Icon: CreditCard, color: '#ef4444' };
            case 'government':
                return { Icon: Building2, color: '#6b7280' };
            default:
                return { Icon: Building2, color: '#4F008D' };
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const isOverdue = (bill: Bill) => {
        return bill.status === 'overdue' || new Date(bill.dueDate) < new Date();
    };

    const t = {
        title: locale === 'ar' ? 'الفواتير المعلقة' : 'Pending Bills',
        account: locale === 'ar' ? 'رقم الحساب' : 'Account',
        due: locale === 'ar' ? 'تاريخ الاستحقاق' : 'Due',
        overdue: locale === 'ar' ? 'متأخر' : 'Overdue',
        paid: locale === 'ar' ? 'مدفوع' : 'Paid',
        pending: locale === 'ar' ? 'معلق' : 'Pending',
        priority: locale === 'ar' ? 'أولوية' : 'Priority',
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>{t.title}</Text>

            <View style={styles.billList}>
                {bills.map((bill) => {
                    const { Icon, color } = getBillIcon(bill.type);
                    const providerName = locale === 'ar' ? bill.providerNameAr : bill.providerName;
                    const overdue = isOverdue(bill);

                    const getStatusText = () => {
                        if (overdue) return t.overdue;
                        if (bill.status === 'paid') return t.paid;
                        return t.pending;
                    };

                    return (
                        <TouchableOpacity
                            key={bill.id}
                            activeOpacity={onSelect ? 0.7 : 1}
                            onPress={() => onSelect?.(bill)}
                        >
                            <Card style={[
                                styles.billCard,
                                overdue && styles.overdueCard
                            ]}>
                                <View style={styles.billContent}>
                                    <View style={styles.leftSection}>
                                        <View style={[styles.iconContainer, { backgroundColor: `${color}1A` }]}>
                                            <Icon size={20} color={color} />
                                        </View>

                                        <View style={styles.billDetails}>
                                            <View style={styles.nameRow}>
                                                <Text style={styles.providerName}>{providerName}</Text>
                                                {bill.isPriority && (
                                                    <View style={styles.priorityBadge}>
                                                        <Text style={styles.priorityText}>{t.priority}</Text>
                                                    </View>
                                                )}
                                            </View>

                                            <Text style={styles.accountNumber}>
                                                {t.account}: {bill.accountNumber}
                                            </Text>

                                            <View style={styles.statusRow}>
                                                <View style={[
                                                    styles.statusBadge,
                                                    overdue ? styles.overdueBadge :
                                                        bill.status === 'paid' ? styles.paidBadge : styles.pendingBadge
                                                ]}>
                                                    <Text style={[
                                                        styles.statusText,
                                                        overdue ? styles.overdueText :
                                                            bill.status === 'paid' ? styles.paidText : styles.pendingText
                                                    ]}>
                                                        {getStatusText()}
                                                    </Text>
                                                </View>
                                                <Text style={[
                                                    styles.dueDate,
                                                    overdue && styles.overdueDueDate
                                                ]}>
                                                    {t.due}: {formatDate(bill.dueDate)}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    <Text style={[
                                        styles.amount,
                                        overdue && styles.overdueAmount
                                    ]}>
                                        {formatCurrency(bill.amount, 'SAR', locale)}
                                    </Text>
                                </View>
                            </Card>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        paddingHorizontal: 4,
    },
    billList: {
        gap: 8,
    },
    billCard: {
        padding: 12,
    },
    overdueCard: {
        borderColor: 'rgba(239,68,68,0.5)',
        backgroundColor: 'rgba(239,68,68,0.05)',
    },
    billContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    billDetails: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    providerName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    priorityBadge: {
        backgroundColor: 'rgba(251,191,36,0.2)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    priorityText: {
        fontSize: 10,
        fontWeight: '500',
        color: '#d97706',
    },
    accountNumber: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 8,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statusBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    overdueBadge: {
        backgroundColor: 'rgba(239,68,68,0.1)',
    },
    paidBadge: {
        backgroundColor: 'rgba(34,197,94,0.1)',
    },
    pendingBadge: {
        backgroundColor: 'rgba(107,114,128,0.1)',
    },
    statusText: {
        fontSize: 10,
        fontWeight: '500',
    },
    overdueText: {
        color: '#ef4444',
    },
    paidText: {
        color: '#00C58D',
    },
    pendingText: {
        color: '#6B7280',
    },
    dueDate: {
        fontSize: 12,
        color: '#6B7280',
    },
    overdueDueDate: {
        color: '#ef4444',
        fontWeight: '500',
    },
    amount: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    overdueAmount: {
        color: '#ef4444',
    },
});
