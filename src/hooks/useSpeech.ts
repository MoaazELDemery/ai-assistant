import { useCallback, useRef, useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { VoiceService } from '../services/VoiceService';
import { AppResetManager, CleanupPriority } from '../services/AppResetManager';

interface UseSpeechOptions {
    language?: string;
}

interface UseSpeechReturn {
    speak: (text: string, messageId: string) => Promise<void>;
    stop: () => void;
    toggle: (text: string, messageId: string) => void;
    isSpeaking: boolean;
    isLoading: boolean;
    currentMessageId: string | null;
    dispose: () => Promise<void>;
}

// Detect if text is primarily Arabic
function isArabicText(text: string): boolean {
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F]/g;
    const arabicChars = text.match(arabicPattern) || [];
    const latinPattern = /[a-zA-Z]/g;
    const latinChars = text.match(latinPattern) || [];
    return arabicChars.length > latinChars.length;
}

// Instance counter for unique IDs
let instanceCounter = 0;

export function useSpeech(options: UseSpeechOptions = {}): UseSpeechReturn {
    const { language: defaultLanguage = 'en' } = options;
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);
    const soundRef = useRef<Audio.Sound | null>(null);
    const isStoppingRef = useRef(false);
    const isDisposedRef = useRef(false);
    const instanceIdRef = useRef(`speech-${++instanceCounter}`);

    // Use ref to always have access to current language
    const languageRef = useRef(defaultLanguage);

    /**
     * Fully dispose of all audio resources
     * This is the key method for preventing overlapping audio
     */
    const dispose = useCallback(async () => {
        console.log(`[useSpeech:${instanceIdRef.current}] Disposing audio resources...`);

        isDisposedRef.current = true;
        isStoppingRef.current = true;

        if (soundRef.current) {
            try {
                // First stop playback
                await soundRef.current.stopAsync().catch(() => { });
                // Then unload the sound completely
                await soundRef.current.unloadAsync().catch(() => { });
            } catch (error) {
                console.warn(`[useSpeech:${instanceIdRef.current}] Error during dispose:`, error);
            } finally {
                soundRef.current = null;
            }
        }

        setIsSpeaking(false);
        setIsLoading(false);
        setCurrentMessageId(null);

        console.log(`[useSpeech:${instanceIdRef.current}] Audio resources disposed`);
    }, []);

    // Register with AppResetManager for cleanup during language switch
    useEffect(() => {
        const cleanupId = `speech-cleanup-${instanceIdRef.current}`;

        const unregister = AppResetManager.registerCleanup(
            cleanupId,
            dispose,
            CleanupPriority.AUDIO
        );

        // Reset disposed state when component mounts
        isDisposedRef.current = false;

        return () => {
            unregister();
            // Also dispose when component unmounts
            dispose();
        };
    }, [dispose]);

    // Update language ref and cleanup when language changes
    useEffect(() => {
        const previousLanguage = languageRef.current;
        languageRef.current = defaultLanguage;

        // If language actually changed, stop current speech
        if (previousLanguage !== defaultLanguage) {
            console.log(`[useSpeech:${instanceIdRef.current}] Language changed from ${previousLanguage} to ${defaultLanguage}`);
            dispose();
            // Reset disposed flag for new language
            isDisposedRef.current = false;
        }
    }, [defaultLanguage, dispose]);

    const cleanText = (text: string): string => {
        return text
            .replace(/\*\*/g, '')
            .replace(/\*/g, '')
            .replace(/#{1,6}\s/g, '')
            .replace(/`{1,3}/g, '')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/•/g, '')
            .replace(/&/g, 'and')
            .replace(/</g, '')
            .replace(/>/g, '')
            .trim();
    };

    const stop = useCallback(() => {
        console.log(`[useSpeech:${instanceIdRef.current}] Stopping speech`);

        isStoppingRef.current = true;

        if (soundRef.current) {
            soundRef.current.stopAsync().catch(() => { });
            soundRef.current.unloadAsync().catch(() => { });
            soundRef.current = null;
        }

        setIsSpeaking(false);
        setIsLoading(false);
        setCurrentMessageId(null);
    }, []);

    const speak = useCallback(async (text: string, messageId: string) => {
        // Don't speak if disposed
        if (isDisposedRef.current) {
            console.log(`[useSpeech:${instanceIdRef.current}] Cannot speak - instance disposed`);
            return;
        }

        if (!text.trim()) return;

        // Stop any current speech first
        stop();
        isStoppingRef.current = false;

        setIsLoading(true);
        setCurrentMessageId(messageId);

        try {
            const cleanedText = cleanText(text);
            const currentLanguage = languageRef.current;
            const detectedLanguage = isArabicText(cleanedText) ? 'ar' : currentLanguage;

            console.log(`[useSpeech:${instanceIdRef.current}] Generating TTS for language: ${detectedLanguage}`);

            const audioUri = await VoiceService.textToSpeech(cleanedText, detectedLanguage);

            // Check if we were stopped or disposed while waiting for TTS
            if (isStoppingRef.current || isDisposedRef.current) {
                console.log(`[useSpeech:${instanceIdRef.current}] Speech cancelled - stopped or disposed`);
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
                staysActiveInBackground: false,
            });

            const { sound } = await Audio.Sound.createAsync(
                { uri: audioUri },
                { shouldPlay: true }
            );

            // Double-check we weren't disposed while creating sound
            if (isDisposedRef.current || isStoppingRef.current) {
                console.log(`[useSpeech:${instanceIdRef.current}] Disposing newly created sound - instance stopped`);
                await sound.unloadAsync().catch(() => { });
                return;
            }

            soundRef.current = sound;

            setIsLoading(false);
            setIsSpeaking(true);

            sound.setOnPlaybackStatusUpdate((status: any) => {
                if (status.isLoaded && status.didJustFinish) {
                    setIsSpeaking(false);
                    setCurrentMessageId(null);
                    sound.unloadAsync().catch(() => { });
                    if (soundRef.current === sound) {
                        soundRef.current = null;
                    }
                }
            });
        } catch (error) {
            console.error(`[useSpeech:${instanceIdRef.current}] Speech error:`, error);
            setIsLoading(false);
            setIsSpeaking(false);
            setCurrentMessageId(null);
        }
    }, [stop]);

    const toggle = useCallback((text: string, messageId: string) => {
        if (isSpeaking || isLoading) {
            stop();
        } else {
            speak(text, messageId);
        }
    }, [isSpeaking, isLoading, speak, stop]);

    return {
        speak,
        stop,
        toggle,
        isSpeaking,
        isLoading,
        currentMessageId,
        dispose,
    };
}
