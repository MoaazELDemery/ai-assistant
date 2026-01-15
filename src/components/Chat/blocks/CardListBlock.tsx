import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { CreditCard } from 'lucide-react-native';
import { Card as UICard } from '../../ui/Card';
import { Card } from '../../../types';

interface CardListBlockProps {
    cards: Card[];
    title?: string;
    locale?: 'en' | 'ar';
    onSelect?: (card: Card) => void;
}

function ChatCardItem({
    card,
    locale = 'en',
    onSelect,
}: {
    card: Card;
    locale?: 'en' | 'ar';
    onSelect?: (card: Card) => void;
}) {
    const displayName = locale === 'ar' ? card.nameAr : card.name;

    const networkIcons: Record<string, string> = {
        visa: '🅥',
        mastercard: 'Ⓜ',
        mada: '🇸🇦',
    };

    const cardTypeText = card.type === 'credit' ?
        (locale === 'ar' ? 'بطاقة ائتمانية' : 'Credit') :
        (locale === 'ar' ? 'بطاقة خصم' : 'Debit');

    const statusText = card.status === 'active'
        ? (locale === 'ar' ? 'نشطة' : 'Active')
        : (locale === 'ar' ? 'مجمدة' : 'Frozen');

    return (
        <TouchableOpacity activeOpacity={0.9} onPress={() => onSelect?.(card)}>
            <UICard variant="gradient" style={styles.cardContainer}>
                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardName}>{displayName}</Text>
                        <Text style={styles.networkIcon}>{networkIcons[card.cardNetwork] || '💳'}</Text>
                    </View>

                    <View style={styles.cardDetails}>
                        <View style={styles.cardNumberRow}>
                            <CreditCard size={16} color="rgba(255,255,255,0.7)" />
                            <Text style={styles.cardNumber}>•••• {card.lastFourDigits}</Text>
                        </View>
                        <View style={styles.cardFooter}>
                            <Text style={styles.cardType}>{cardTypeText}</Text>
                            <View style={[
                                styles.statusBadge,
                                card.status === 'active' ? styles.statusActive : styles.statusFrozen
                            ]}>
                                <Text style={styles.statusText}>{statusText}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </UICard>
        </TouchableOpacity>
    );
}

export function CardListBlock({
    cards,
    title,
    locale = 'en',
    onSelect,
}: CardListBlockProps) {
    if (cards.length === 0) return null;

    return (
        <View style={styles.container}>
            {title && (
                <Text style={styles.title}>{title}</Text>
            )}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {cards.map((card) => (
                    <View key={card.id} style={styles.cardWrapper}>
                        <ChatCardItem
                            card={card}
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
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        paddingHorizontal: 4,
    },
    scrollContent: {
        paddingRight: 16,
    },
    cardWrapper: {
        marginRight: 12,
    },
    cardContainer: {
        width: 280,
        minHeight: 160,
        padding: 16,
    },
    cardContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardName: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
        fontWeight: '500',
    },
    networkIcon: {
        fontSize: 20,
    },
    cardDetails: {
        marginTop: 8,
    },
    cardNumberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    cardNumber: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 18,
        fontFamily: 'monospace',
        letterSpacing: 2,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardType: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusActive: {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    statusFrozen: {
        backgroundColor: 'rgba(251,191,36,0.3)',
    },
    statusText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '500',
    },
});
