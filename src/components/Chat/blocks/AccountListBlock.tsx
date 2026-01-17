import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { Card } from '../../ui/Card';
import { Account } from '../../../types';
import { formatCurrency } from '../../../lib/utils';

interface AccountListBlockProps {
    accounts: Account[];
    title?: string;
    locale?: 'en' | 'ar';
    onSelect?: (account: Account) => void;
}

function ChatAccountCard({
    account,
    locale = 'en',
    onSelect,
}: {
    account: Account;
    locale?: 'en' | 'ar';
    onSelect?: (account: Account) => void;
}) {
    const [showBalance, setShowBalance] = useState(true);
    const displayName = locale === 'ar' ? account.nameAr : account.name;

    return (
        <TouchableOpacity activeOpacity={0.9} onPress={() => onSelect?.(account)}>
            <Card variant="gradient" style={styles.cardContainer}>
                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.accountName}>{displayName}</Text>
                        <TouchableOpacity
                            onPress={() => setShowBalance(!showBalance)}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            {showBalance ? (
                                <Eye size={18} color="rgba(255,255,255,0.9)" />
                            ) : (
                                <EyeOff size={18} color="rgba(255,255,255,0.9)" />
                            )}
                        </TouchableOpacity>
                    </View>

                    <View>
                        <Text style={styles.balanceText}>
                            {showBalance ? formatCurrency(account.balance, account.currency, locale) : '••••••'}
                        </Text>
                        <Text style={styles.accountNumber}>{account.accountNumber}</Text>
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );
}

export function AccountListBlock({
    accounts,
    title,
    locale = 'en',
    onSelect,
}: AccountListBlockProps) {
    if (accounts.length === 0) return null;

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
                {accounts.map((account, index) => (
                    <View
                        key={account.id}
                        style={styles.cardWrapper}
                    >
                        <ChatAccountCard
                            account={account}
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
    accountName: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
        fontWeight: '500',
    },
    balanceText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    accountNumber: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        marginTop: 6,
        fontWeight: '500',
    },
});
