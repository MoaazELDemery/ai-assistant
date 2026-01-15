import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { Card } from '../../ui/Card';
import { SpendingBreakdown } from '../../../types';
import { formatCurrency } from '../../../lib/utils';

interface SpendingBreakdownBlockProps {
    breakdown: SpendingBreakdown[];
    total: number;
    locale?: 'en' | 'ar';
}

export function SpendingBreakdownBlock({
    breakdown,
    total,
    locale = 'en',
}: SpendingBreakdownBlockProps) {
    if (breakdown.length === 0) return null;

    const t = {
        title: locale === 'ar' ? 'تفصيل الإنفاق' : 'Spending Breakdown',
        totalSpending: locale === 'ar' ? 'إجمالي الإنفاق' : 'Total Spending',
        transactions: locale === 'ar' ? 'معاملة' : 'transactions',
    };

    return (
        <Card variant="gradient" style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{t.title}</Text>
                <Text style={styles.totalAmount}>{formatCurrency(total, 'SAR', locale)}</Text>
                <Text style={styles.totalLabel}>{t.totalSpending}</Text>
            </View>

            <View style={styles.categoryList}>
                {breakdown.map((category) => {
                    const categoryName = locale === 'ar' ? category.categoryNameAr : category.categoryName;
                    const changeIsPositive = category.change > 0;

                    return (
                        <View key={category.categoryId} style={styles.categoryItem}>
                            <View style={styles.categoryHeader}>
                                <View style={styles.categoryNameRow}>
                                    <Text style={styles.categoryName}>{categoryName}</Text>
                                    <View style={styles.changeIndicator}>
                                        {changeIsPositive ? (
                                            <TrendingUp size={12} color="#f87171" />
                                        ) : (
                                            <TrendingDown size={12} color="#4ade80" />
                                        )}
                                        <Text style={[
                                            styles.changeText,
                                            changeIsPositive ? styles.changePositive : styles.changeNegative
                                        ]}>
                                            {Math.abs(category.change)}%
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.categoryAmount}>
                                    {formatCurrency(category.amount, 'SAR', locale)}
                                </Text>
                            </View>

                            <View style={styles.progressBarContainer}>
                                <View
                                    style={[
                                        styles.progressBar,
                                        { width: `${category.percentage}%` }
                                    ]}
                                />
                            </View>

                            <View style={styles.categoryFooter}>
                                <Text style={styles.percentageText}>{category.percentage.toFixed(1)}%</Text>
                                <Text style={styles.transactionCount}>
                                    {category.transactionCount} {t.transactions}
                                </Text>
                            </View>
                        </View>
                    );
                })}
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
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
    },
    totalAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    totalLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
    },
    categoryList: {
        gap: 12,
    },
    categoryItem: {
        gap: 6,
    },
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    categoryName: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
    },
    changeIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    changeText: {
        fontSize: 12,
    },
    changePositive: {
        color: '#f87171',
    },
    changeNegative: {
        color: '#4ade80',
    },
    categoryAmount: {
        fontSize: 14,
        fontWeight: '500',
        color: '#fff',
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 4,
    },
    categoryFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    percentageText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
    },
    transactionCount: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
    },
});
