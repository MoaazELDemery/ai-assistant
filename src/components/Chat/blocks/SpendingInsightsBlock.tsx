import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, AlertCircle, Calendar, BarChart3 } from 'lucide-react-native';
import { Card } from '../../ui/Card';
import { SpendingInsight } from '../../../types';
import { formatCurrency } from '../../../lib/utils';

interface SpendingInsightsBlockProps {
    insights: SpendingInsight[];
    locale?: 'en' | 'ar';
}

export function SpendingInsightsBlock({
    insights,
    locale = 'en',
}: SpendingInsightsBlockProps) {
    if (insights.length === 0) return null;

    const getInsightIcon = (type: SpendingInsight['type']) => {
        switch (type) {
            case 'comparison':
                return BarChart3;
            case 'unusual':
                return AlertCircle;
            case 'subscription':
                return Calendar;
            case 'trend':
                return TrendingUp;
            default:
                return BarChart3;
        }
    };

    const getInsightColors = (type: SpendingInsight['type']) => {
        switch (type) {
            case 'comparison':
                return { bg: 'rgba(59,130,246,0.2)', icon: '#60a5fa' };
            case 'unusual':
                return { bg: 'rgba(239,68,68,0.2)', icon: '#f87171' };
            case 'subscription':
                return { bg: 'rgba(168,85,247,0.2)', icon: '#c084fc' };
            case 'trend':
                return { bg: 'rgba(34,197,94,0.2)', icon: '#4ade80' };
            default:
                return { bg: 'rgba(255,255,255,0.2)', icon: '#fff' };
        }
    };

    const getInsightBadge = (type: SpendingInsight['type']) => {
        const labels = {
            comparison: { en: 'Comparison', ar: 'مقارنة' },
            unusual: { en: 'Unusual', ar: 'غير عادي' },
            subscription: { en: 'Subscription', ar: 'اشتراك' },
            trend: { en: 'Trend', ar: 'اتجاه' },
        };
        return labels[type]?.[locale] || type;
    };

    const t = {
        title: locale === 'ar' ? 'رؤى الإنفاق' : 'Spending Insights',
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>{t.title}</Text>

            <View style={styles.insightsList}>
                {insights.map((insight, index) => {
                    const Icon = getInsightIcon(insight.type);
                    const colors = getInsightColors(insight.type);
                    const message = locale === 'ar' ? insight.messageAr : insight.message;

                    return (
                        <Card key={index} style={styles.insightCard}>
                            <View style={styles.insightContent}>
                                <View style={[styles.iconContainer, { backgroundColor: colors.bg }]}>
                                    <Icon size={20} color={colors.icon} />
                                </View>

                                <View style={styles.insightDetails}>
                                    <View style={styles.badgeRow}>
                                        <View style={styles.badge}>
                                            <Text style={styles.badgeText}>{getInsightBadge(insight.type)}</Text>
                                        </View>
                                        {insight.changePercent !== undefined && (
                                            <Text style={[
                                                styles.changePercent,
                                                insight.changePercent > 0 ? styles.changePositive : styles.changeNegative
                                            ]}>
                                                {insight.changePercent > 0 ? '+' : ''}{insight.changePercent}%
                                            </Text>
                                        )}
                                    </View>

                                    <Text style={styles.insightMessage}>{message}</Text>

                                    {insight.amount !== undefined && (
                                        <Text style={styles.insightAmount}>
                                            {formatCurrency(insight.amount, 'SAR', locale)}
                                        </Text>
                                    )}
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
    insightsList: {
        gap: 8,
    },
    insightCard: {
        padding: 12,
    },
    insightContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    insightDetails: {
        flex: 1,
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    badge: {
        backgroundColor: 'rgba(79, 0, 141, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    badgeText: {
        fontSize: 10,
        color: '#4F008D',
        fontWeight: '500',
    },
    changePercent: {
        fontSize: 12,
        fontWeight: '500',
    },
    changePositive: {
        color: '#ef4444',
    },
    changeNegative: {
        color: '#00C58D',
    },
    insightMessage: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
    insightAmount: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4F008D',
    },
});
