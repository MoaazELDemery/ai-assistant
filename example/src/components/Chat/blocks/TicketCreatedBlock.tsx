import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle2, Ticket, Clock, Copy, Check } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Card } from '../../ui/Card';
import { TicketCreated } from '../../../types';

interface TicketCreatedBlockProps {
    ticket: TicketCreated;
    locale?: 'en' | 'ar';
}

export function TicketCreatedBlock({
    ticket,
    locale = 'en',
}: TicketCreatedBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopyTicketNumber = async () => {
        await Clipboard.setStringAsync(ticket.ticketNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const t = {
        title: locale === 'ar' ? 'تم إنشاء التذكرة' : 'Ticket Created',
        subtitle: locale === 'ar' ? 'سنتواصل معك قريبًا' : "We'll get back to you soon",
        ticketNumber: locale === 'ar' ? 'رقم التذكرة' : 'Ticket Number',
        estimatedResolution: locale === 'ar' ? 'الوقت المقدر للحل' : 'Estimated Resolution',
        notification: locale === 'ar'
            ? 'سيتم إرسال إشعار عبر البريد الإلكتروني والرسائل القصيرة عند تحديث حالة التذكرة'
            : "You'll receive email and SMS notifications when your ticket is updated",
    };

    return (
        <Card variant="gradient" style={styles.container}>
            <View style={styles.header}>
                <View style={styles.successIcon}>
                    <CheckCircle2 size={24} color="#60a5fa" />
                </View>
                <View>
                    <Text style={styles.title}>{t.title}</Text>
                    <Text style={styles.subtitle}>{t.subtitle}</Text>
                </View>
            </View>

            <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                    <View style={styles.iconContainer}>
                        <Ticket size={20} color="#fff" />
                    </View>
                    <View style={styles.infoDetails}>
                        <Text style={styles.infoLabel}>{t.ticketNumber}</Text>
                        <TouchableOpacity style={styles.copyButton} onPress={handleCopyTicketNumber}>
                            <Text style={styles.ticketNumber}>{ticket.ticketNumber}</Text>
                            {copied ? (
                                <Check size={14} color="#fff" />
                            ) : (
                                <Copy size={14} color="rgba(255,255,255,0.6)" />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <View style={styles.iconContainer}>
                        <Clock size={20} color="#fff" />
                    </View>
                    <View style={styles.infoDetails}>
                        <Text style={styles.infoLabel}>{t.estimatedResolution}</Text>
                        <Text style={styles.resolutionTime}>{ticket.estimatedResolutionTime}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.notificationBox}>
                <Text style={styles.notificationText}>{t.notification}</Text>
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
        backgroundColor: 'rgba(96,165,250,0.2)',
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
    infoSection: {
        gap: 12,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoDetails: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
    },
    copyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    ticketNumber: {
        fontSize: 14,
        fontFamily: 'monospace',
        fontWeight: '500',
        color: '#fff',
    },
    resolutionTime: {
        fontSize: 14,
        fontWeight: '500',
        color: '#fff',
        marginTop: 4,
    },
    notificationBox: {
        padding: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(96,165,250,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(96,165,250,0.2)',
    },
    notificationText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
    },
});
