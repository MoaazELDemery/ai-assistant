import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, CreditCard } from 'lucide-react-native';
import { Card } from '../../ui/Card';
import { Subscription } from '../../../types';
import { formatCurrency } from '../../../lib/utils';

interface SubscriptionListBlockProps {
    subscriptions: Subscription[];
    locale?: 'en' | 'ar';
}

export function SubscriptionListBlock({
    subscriptions,
    locale = 'en',
}: SubscriptionListBlockProps) {
    if (subscriptions.length === 0) return null;

    const frequencyLabels: Record<string, { en: string; ar: string }> = {
        weekly: { en: 'Weekly', ar: 'أسبوعيًا' },
        monthly: { en: 'Monthly', ar: 'شهريًا' },
        yearly: { en: 'Yearly', ar: 'سنويًا' },
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const t = {
        title: locale === 'ar' ? 'الاشتراكات' : 'Subscriptions',
        active: locale === 'ar' ? 'نشط' : 'Active',
        inactive: locale === 'ar' ? 'غير نشط' : 'Inactive',
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>{t.title}</Text>

            <View style={styles.subscriptionList}>
                {subscriptions.map((subscription) => {
                    const name = locale === 'ar' ? subscription.nameAr : subscription.name;
                    const frequency = frequencyLabels[subscription.frequency]?.[locale] || subscription.frequency;
                    const frequencyLower = frequencyLabels[subscription.frequency]?.[locale]?.toLowerCase() || subscription.frequency;

                    return (
                        <Card key={subscription.id} style={styles.subscriptionCard}>
                            <View style={styles.subscriptionContent}>
                                <View style={styles.leftSection}>
                                    <View style={styles.iconContainer}>
                                        <CreditCard size={20} color="#4F008D" />
                                    </View>

                                    <View style={styles.subscriptionDetails}>
                                        <View style={styles.nameRow}>
                                            <Text style={styles.subscriptionName}>{name}</Text>
                                            <View style={[
                                                styles.statusBadge,
                                                subscription.isActive ? styles.activeBadge : styles.inactiveBadge
                                            ]}>
                                                <Text style={[
                                                    styles.statusText,
                                                    subscription.isActive ? styles.activeText : styles.inactiveText
                                                ]}>
                                                    {subscription.isActive ? t.active : t.inactive}
                                                </Text>
                                            </View>
                                        </View>

                                        <Text style={styles.merchantName}>{subscription.merchantName}</Text>

                                        <View style={styles.metaRow}>
                                            <View style={styles.dateContainer}>
                                                <Calendar size={12} color="#6B7280" />
                                                <Text style={styles.metaText}>{formatDate(subscription.nextBillingDate)}</Text>
                                            </View>
                                            <Text style={styles.metaDot}>•</Text>
                                            <Text style={styles.metaText}>{frequency}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.amountContainer}>
                                    <Text style={styles.amount}>
                                        {formatCurrency(subscription.amount, subscription.currency, locale)}
                                    </Text>
                                    <Text style={styles.frequencyText}>/{frequencyLower}</Text>
                                </View>
                            </View>
                        </Card>
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
    subscriptionList: {
        gap: 8,
    },
    subscriptionCard: {
        padding: 12,
    },
    subscriptionContent: {
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
        backgroundColor: 'rgba(79, 0, 141, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    subscriptionDetails: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 2,
    },
    subscriptionName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    statusBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    activeBadge: {
        backgroundColor: 'rgba(34,197,94,0.1)',
    },
    inactiveBadge: {
        backgroundColor: 'rgba(107,114,128,0.1)',
    },
    statusText: {
        fontSize: 10,
        fontWeight: '500',
    },
    activeText: {
        color: '#00C58D',
    },
    inactiveText: {
        color: '#6B7280',
    },
    merchantName: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 8,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 12,
        color: '#6B7280',
    },
    metaDot: {
        color: '#6B7280',
    },
    amountContainer: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    frequencyText: {
        fontSize: 12,
        color: '#6B7280',
    },
});
