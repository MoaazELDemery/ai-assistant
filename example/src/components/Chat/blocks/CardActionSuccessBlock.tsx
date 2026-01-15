import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2, CreditCard } from 'lucide-react-native';
import { Card } from '../../ui/Card';
import { CardActionSuccess } from '../../../types';

interface CardActionSuccessBlockProps {
    success: CardActionSuccess;
    locale?: 'en' | 'ar';
}

export function CardActionSuccessBlock({
    success,
    locale = 'en',
}: CardActionSuccessBlockProps) {
    const message = locale === 'ar' ? success.messageAr : success.message;

    const t = {
        success: locale === 'ar' ? 'تم بنجاح' : 'Success',
        actionCompleted: locale === 'ar' ? 'تم تنفيذ الإجراء' : 'Action completed',
        card: locale === 'ar' ? 'البطاقة' : 'Card',
    };

    return (
        <Card variant="gradient" style={styles.container}>
            <View style={styles.header}>
                <View style={styles.successIcon}>
                    <CheckCircle2 size={24} color="#4ade80" />
                </View>
                <View>
                    <Text style={styles.title}>{t.success}</Text>
                    <Text style={styles.subtitle}>{t.actionCompleted}</Text>
                </View>
            </View>

            <View style={styles.cardInfo}>
                <View style={styles.iconContainer}>
                    <CreditCard size={20} color="#fff" />
                </View>
                <View style={styles.cardDetails}>
                    <Text style={styles.cardLabel}>{t.card}</Text>
                    <Text style={styles.cardName}>
                        {success.cardName || `Card ${success.cardId.slice(-4)}`}
                    </Text>
                </View>
            </View>

            <View style={styles.messageContainer}>
                <Text style={styles.message}>{message}</Text>
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
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    successIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(74,222,128,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
    },
    cardInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        marginBottom: 16,
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
    messageContainer: {
        padding: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    message: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
    },
});
