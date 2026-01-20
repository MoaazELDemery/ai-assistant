/**
 * useAppReset - Hook to integrate components with the AppResetManager
 * 
 * Use this hook to register cleanup callbacks that will be executed
 * when the app resets (e.g., during language switching).
 */

import { useEffect, useCallback, useState } from 'react';
import { AppResetManager, CleanupPriority } from '../services/AppResetManager';

interface UseAppResetOptions {
    /** Cleanup function to run during reset */
    onCleanup?: () => void | Promise<void>;
    /** Priority for the cleanup (higher = runs first) */
    priority?: number;
    /** Unique identifier for this cleanup registration */
    id?: string;
}

/**
 * Hook to register a component's cleanup with the AppResetManager
 */
export function useAppReset(options: UseAppResetOptions = {}) {
    const { onCleanup, priority = CleanupPriority.DEFAULT, id } = options;
    const [resetKey, setResetKey] = useState(AppResetManager.getResetKey());

    useEffect(() => {
        // Subscribe to reset events to trigger re-renders
        const unsubscribe = AppResetManager.onReset(() => {
            setResetKey(AppResetManager.getResetKey());
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        if (!onCleanup) return;

        const cleanupId = id || `cleanup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const unregister = AppResetManager.registerCleanup(cleanupId, onCleanup, priority);

        return () => {
            unregister();
        };
    }, [onCleanup, priority, id]);

    const triggerReset = useCallback(async () => {
        await AppResetManager.executeReset();
    }, []);

    const isResetting = AppResetManager.isResetInProgress();

    return {
        resetKey,
        triggerReset,
        isResetting,
        waitForReset: AppResetManager.waitForReset.bind(AppResetManager),
    };
}

/**
 * Hook specifically for audio/speech components
 * Automatically registers with high priority for cleanup
 */
export function useAudioCleanup(cleanupFn: () => void | Promise<void>, id?: string) {
    return useAppReset({
        onCleanup: cleanupFn,
        priority: CleanupPriority.AUDIO,
        id: id || 'audio-cleanup',
    });
}

/**
 * Hook for recording components
 */
export function useRecordingCleanup(cleanupFn: () => void | Promise<void>, id?: string) {
    return useAppReset({
        onCleanup: cleanupFn,
        priority: CleanupPriority.RECORDING,
        id: id || 'recording-cleanup',
    });
}

export { CleanupPriority };
