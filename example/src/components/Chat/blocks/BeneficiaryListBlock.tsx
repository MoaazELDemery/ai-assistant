import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Card } from '../../ui/Card';
import { Beneficiary } from '../../../types';
// import Animated, { FadeInRight } from 'react-native-reanimated';

interface BeneficiaryListBlockProps {
    beneficiaries: Beneficiary[];
    locale?: 'en' | 'ar';
    onSelect?: (beneficiary: Beneficiary) => void;
}

function ChatBeneficiaryCard({
    beneficiary,
    locale = 'en',
    onSelect,
}: {
    beneficiary: Beneficiary;
    locale?: 'en' | 'ar';
    onSelect?: (beneficiary: Beneficiary) => void;
}) {
    const displayName = locale === 'ar' ? beneficiary.nameAr : beneficiary.name;
    const bankName = locale === 'ar' ? beneficiary.bankNameAr : beneficiary.bankName;

    return (
        <TouchableOpacity activeOpacity={0.8} onPress={() => onSelect?.(beneficiary)}>
            <Card style={styles.cardContainer}>
                <View style={styles.cardContent}>
                    {/* Initials Avatar */}
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {displayName.charAt(0).toUpperCase()}
                        </Text>
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={styles.nameText} numberOfLines={1}>{displayName}</Text>
                        <Text style={styles.bankText} numberOfLines={1}>{bankName}</Text>
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );
}

export function BeneficiaryListBlock({
    beneficiaries,
    locale = 'en',
    onSelect,
}: BeneficiaryListBlockProps) {
    if (beneficiaries.length === 0) return null;

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {beneficiaries.map((beneficiary, index) => (
                    <View
                        key={beneficiary.id}
                        style={styles.cardWrapper}
                    >
                        <ChatBeneficiaryCard
                            beneficiary={beneficiary}
                            locale={locale}
                            onSelect={onSelect}
                        />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    scrollContent: {
        paddingRight: 16,
    },
    cardWrapper: {
        marginRight: 12,
    },
    cardContainer: {
        width: 160,
        padding: 12,
    },
    cardContent: {
        alignItems: 'center',
        gap: 8,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#EEF2FF', // Indigo 50
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    avatarText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#4F008D', // Indigo 600 -> Purple
    },
    textContainer: {
        alignItems: 'center',
    },
    nameText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937', // Gray 800
        marginBottom: 2,
        textAlign: 'center',
    },
    bankText: {
        fontSize: 12,
        color: '#6B7280', // Gray 500
        textAlign: 'center',
    },
});
