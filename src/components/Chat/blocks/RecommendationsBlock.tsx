import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PiggyBank, Target, TrendingUp, CreditCard, CheckCircle2 } from 'lucide-react-native';
import { Card } from '../../ui/Card';

export interface Recommendation {
    id: string;
    title: string;
    titleAr: string;
    description: string;
    descriptionAr: string;
    ctaQuestion: string;
    ctaQuestionAr: string;
    features: string[];
    featuresAr: string[];
    badges: Array<{ text: string; textAr: string; variant: 'special' | 'category' }>;
    icon: 'savings' | 'piggybank' | 'target' | 'trending' | 'creditcard';
    actionLabel?: string;
    actionLabelAr?: string;
}

interface RecommendationsBlockProps {
    recommendations: Recommendation[];
    introMessage?: string;
    introMessageAr?: string;
    locale?: 'en' | 'ar';
    onApply?: (recommendation: Recommendation) => void;
    onDetails?: (recommendation: Recommendation) => void;
}

const iconMap = {
    savings: PiggyBank,
    piggybank: PiggyBank,
    target: Target,
    trending: TrendingUp,
    creditcard: CreditCard,
};

function RecommendationCard({
    recommendation,
    locale = 'en',
    onApply,
    onDetails,
}: {
    recommendation: Recommendation;
    locale?: 'en' | 'ar';
    onApply?: (recommendation: Recommendation) => void;
    onDetails?: (recommendation: Recommendation) => void;
}) {
    const isAr = locale === 'ar';
    const title = isAr ? recommendation.titleAr : recommendation.title;
    const description = isAr ? recommendation.descriptionAr : recommendation.description;
    const ctaQuestion = isAr ? recommendation.ctaQuestionAr : recommendation.ctaQuestion;
    const features = isAr ? recommendation.featuresAr : recommendation.features;
    const actionLabel = isAr ? (recommendation.actionLabelAr || 'تقديم الآن') : (recommendation.actionLabel || 'Apply Now');
    const detailsLabel = isAr ? 'التفاصيل' : 'Details';

    const IconComponent = iconMap[recommendation.icon] || PiggyBank;

    return (
        <Card style={styles.recommendationCard}>
            <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                    <IconComponent size={20} color="#4F008D" />
                </View>
                <View style={styles.headerContent}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    <View style={styles.badgesRow}>
                        {recommendation.badges.map((badge, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.badge,
                                    badge.variant === 'special' ? styles.specialBadge : styles.categoryBadge
                                ]}
                            >
                                <Text style={[
                                    styles.badgeText,
                                    badge.variant === 'special' ? styles.specialBadgeText : styles.categoryBadgeText
                                ]}>
                                    {isAr ? badge.textAr : badge.text}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>

            <Text style={styles.description}>{description}</Text>

            <View style={styles.featuresContainer}>
                {features.map((feature, index) => (
                    <View key={index} style={styles.featureRow}>
                        <CheckCircle2 size={14} color="#00C58D" />
                        <Text style={styles.featureText}>{feature}</Text>
                    </View>
                ))}
            </View>

            <Text style={styles.ctaQuestion}>{ctaQuestion}</Text>

            <View style={styles.actionsRow}>
                <TouchableOpacity
                    style={styles.applyButton}
                    onPress={() => onApply?.(recommendation)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.applyButtonText}>{actionLabel}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => onDetails?.(recommendation)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.detailsButtonText}>{detailsLabel}</Text>
                </TouchableOpacity>
            </View>
        </Card>
    );
}

export function RecommendationsBlock({
    recommendations,
    introMessage,
    introMessageAr,
    locale = 'en',
    onApply,
    onDetails,
}: RecommendationsBlockProps) {
    if (recommendations.length === 0) return null;

    const isAr = locale === 'ar';
    const title = isAr ? '✨ قد يهمك' : '✨ You might be interested';
    const intro = isAr ? introMessageAr : introMessage;

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>{title}</Text>

            {intro && (
                <Text style={styles.introText}>{intro}</Text>
            )}

            <View style={styles.recommendationsList}>
                {recommendations.map((rec) => (
                    <RecommendationCard
                        key={rec.id}
                        recommendation={rec}
                        locale={locale}
                        onApply={onApply}
                        onDetails={onDetails}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    introText: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 12,
        lineHeight: 18,
    },
    recommendationsList: {
        gap: 12,
    },
    recommendationCard: {
        padding: 16,
        marginBottom: 0,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(79, 0, 141, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
    },
    badgesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
    },
    specialBadge: {
        backgroundColor: 'rgba(234, 88, 12, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(234, 88, 12, 0.3)',
    },
    categoryBadge: {
        backgroundColor: 'rgba(79, 0, 141, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(79, 0, 141, 0.3)',
    },
    specialBadgeText: {
        fontSize: 10,
        fontWeight: '500',
        color: '#ea580c',
    },
    categoryBadgeText: {
        fontSize: 10,
        fontWeight: '500',
        color: '#4F008D',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '500',
    },
    description: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
        marginBottom: 12,
    },
    featuresContainer: {
        gap: 6,
        marginBottom: 12,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    featureText: {
        fontSize: 12,
        color: '#00C58D',
    },
    ctaQuestion: {
        fontSize: 13,
        fontWeight: '500',
        color: '#4F008D',
        marginBottom: 12,
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    applyButton: {
        flex: 1,
        backgroundColor: '#4F008D',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    applyButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    detailsButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        alignItems: 'center',
    },
    detailsButtonText: {
        color: '#6B7280',
        fontSize: 14,
        fontWeight: '500',
    },
});
