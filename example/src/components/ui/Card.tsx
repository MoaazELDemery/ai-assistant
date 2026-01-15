import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CardProps {
    children: React.ReactNode;
    variant?: 'default' | 'gradient';
    style?: StyleProp<ViewStyle>;
    onPress?: () => void; // Support touch if needed, though mostly View
}

export const Card: React.FC<CardProps> = ({ children, variant = 'default', style }) => {
    if (variant === 'gradient') {
        return (
            <LinearGradient
                // Deep purple gradient
                colors={['#4F008D', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.card, styles.gradientCard, style]}
            >
                {children}
            </LinearGradient>
        );
    }

    return (
        <View style={[styles.card, styles.defaultCard, style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 12,
    },
    defaultCard: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e5e7eb', // border-gray-200
    },
    gradientCard: {
        // Gradient handles background
    },
});
