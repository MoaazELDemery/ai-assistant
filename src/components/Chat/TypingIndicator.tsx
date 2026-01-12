import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface TypingIndicatorProps {
    isVisible: boolean;
}

export function TypingIndicator({ isVisible }: TypingIndicatorProps) {
    const dot1Anim = useRef(new Animated.Value(0)).current;
    const dot2Anim = useRef(new Animated.Value(0)).current;
    const dot3Anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!isVisible) return;

        const createBounceAnimation = (animValue: Animated.Value, delay: number) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(animValue, {
                        toValue: -6,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(animValue, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.delay(600 - delay),
                ])
            );
        };

        const anim1 = createBounceAnimation(dot1Anim, 0);
        const anim2 = createBounceAnimation(dot2Anim, 150);
        const anim3 = createBounceAnimation(dot3Anim, 300);

        anim1.start();
        anim2.start();
        anim3.start();

        return () => {
            anim1.stop();
            anim2.stop();
            anim3.stop();
            dot1Anim.setValue(0);
            dot2Anim.setValue(0);
            dot3Anim.setValue(0);
        };
    }, [isVisible, dot1Anim, dot2Anim, dot3Anim]);

    if (!isVisible) return null;

    return (
        <View style={styles.container}>
            <View style={styles.bubble}>
                <View style={styles.dotsContainer}>
                    <Animated.View
                        style={[
                            styles.dot,
                            { transform: [{ translateY: dot1Anim }] }
                        ]}
                    />
                    <Animated.View
                        style={[
                            styles.dot,
                            { transform: [{ translateY: dot2Anim }] }
                        ]}
                    />
                    <Animated.View
                        style={[
                            styles.dot,
                            { transform: [{ translateY: dot3Anim }] }
                        ]}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        alignItems: 'flex-start',
    },
    bubble: {
        backgroundColor: '#F3F4F6',
        borderRadius: 18,
        borderBottomLeftRadius: 4,
        paddingHorizontal: 16,
        paddingVertical: 12,
        maxWidth: '80%',
    },
    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#9CA3AF',
        marginHorizontal: 2,
    },
});
