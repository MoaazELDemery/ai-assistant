/**
 * AppResetManager - Centralized teardown and re-initialization service
 * 
 * This manager handles the complete cleanup of all background services,
 * voice engines, and observers when the app needs to be reset (e.g., language switch).
 */

type CleanupCallback = () => void | Promise<void>;
type CleanupEntry = {
    id: string;
    callback: CleanupCallback;
    priority: number; // Higher priority = runs first (e.g., audio should stop before other cleanup)
};

class AppResetManagerClass {
    private cleanupCallbacks: Map<string, CleanupEntry> = new Map();
    private isResetting: boolean = false;
    private resetPromise: Promise<void> | null = null;
    private listeners: Set<() => void> = new Set();
    private resetKey: number = 0;

    /**
     * Register a cleanup callback that will be called during app reset
     * @param id Unique identifier for this cleanup callback
     * @param callback Function to call during cleanup
     * @param priority Higher priority callbacks run first (default: 0)
     * @returns Unregister function
     */
    registerCleanup(id: string, callback: CleanupCallback, priority: number = 0): () => void {
        this.cleanupCallbacks.set(id, { id, callback, priority });

        return () => {
            this.cleanupCallbacks.delete(id);
        };
    }

    /**
     * Subscribe to reset events
     * @param listener Callback when reset completes
     * @returns Unsubscribe function
     */
    onReset(listener: () => void): () => void {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }

    /**
     * Get the current reset key (changes on each reset)
     */
    getResetKey(): number {
        return this.resetKey;
    }

    /**
     * Check if a reset is currently in progress
     */
    isResetInProgress(): boolean {
        return this.isResetting;
    }

    /**
     * Wait for any ongoing reset to complete
     */
    async waitForReset(): Promise<void> {
        if (this.resetPromise) {
            await this.resetPromise;
        }
    }

    /**
     * Execute all cleanup callbacks and reset the app state
     * This is the main method to call when switching languages
     */
    async executeReset(): Promise<void> {
        // If already resetting, wait for it to complete
        if (this.resetPromise) {
            return this.resetPromise;
        }

        this.isResetting = true;

        this.resetPromise = this._performReset();

        try {
            await this.resetPromise;
        } finally {
            this.isResetting = false;
            this.resetPromise = null;
        }
    }

    private async _performReset(): Promise<void> {
        console.log('[AppResetManager] Starting app reset...');

        // Sort callbacks by priority (higher first)
        const sortedCallbacks = Array.from(this.cleanupCallbacks.values())
            .sort((a, b) => b.priority - a.priority);

        // Execute all cleanup callbacks
        for (const entry of sortedCallbacks) {
            try {
                console.log(`[AppResetManager] Executing cleanup: ${entry.id}`);
                await entry.callback();
            } catch (error) {
                console.error(`[AppResetManager] Cleanup failed for ${entry.id}:`, error);
                // Continue with other cleanups even if one fails
            }
        }

        // Increment the reset key to force re-renders
        this.resetKey++;

        // Small delay to ensure all async cleanup completes
        await new Promise(resolve => setTimeout(resolve, 100));

        // Notify all listeners that reset is complete
        this.listeners.forEach(listener => {
            try {
                listener();
            } catch (error) {
                console.error('[AppResetManager] Listener error:', error);
            }
        });

        console.log('[AppResetManager] App reset complete');
    }

    /**
     * Force immediate cleanup of a specific registered callback
     */
    async cleanupById(id: string): Promise<void> {
        const entry = this.cleanupCallbacks.get(id);
        if (entry) {
            try {
                await entry.callback();
            } catch (error) {
                console.error(`[AppResetManager] Cleanup failed for ${id}:`, error);
            }
        }
    }

    /**
     * Clear all registered callbacks (useful for testing)
     */
    clearAll(): void {
        this.cleanupCallbacks.clear();
        this.listeners.clear();
    }
}

// Singleton instance
export const AppResetManager = new AppResetManagerClass();

// Priority constants for common cleanup types
export const CleanupPriority = {
    AUDIO: 100,        // Audio should stop first
    RECORDING: 90,     // Stop any recordings
    NETWORK: 50,       // Cancel network requests
    STATE: 25,         // Clear state
    DEFAULT: 0,        // Default priority
} as const;
