/**
 * API Service for fetching data from the backend server
 * This replaces the local mock data imports with API calls
 */

import { ENV } from '../config/constants';
import { Account, Beneficiary, Card, Bill, SpendingBreakdown, Subscription, Product } from '../types';

// Use the API callback URL as the base for all API requests
const API_BASE_URL = ENV.API_CALLBACK_URL;

// Cache for API responses to avoid repeated calls
interface ApiCache {
    accounts: Account[] | null;
    beneficiaries: Beneficiary[] | null;
    cards: Card[] | null;
    bills: Bill[] | null;
    spendingBreakdown: SpendingBreakdown[] | null;
    subscriptions: Subscription[] | null;
    products: Product[] | null;
    userProfile: any | null;
    exchangeRates: any | null;
    lastFetch: {
        accounts?: number;
        beneficiaries?: number;
        cards?: number;
        bills?: number;
        spendingBreakdown?: number;
        subscriptions?: number;
        products?: number;
        userProfile?: number;
        exchangeRates?: number;
    };
}

const cache: ApiCache = {
    accounts: null,
    beneficiaries: null,
    cards: null,
    bills: null,
    spendingBreakdown: null,
    subscriptions: null,
    products: null,
    userProfile: null,
    exchangeRates: null,
    lastFetch: {},
};

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// Helper to check if cache is valid
function isCacheValid(key: keyof typeof cache.lastFetch): boolean {
    const lastFetch = cache.lastFetch[key];
    if (!lastFetch) return false;
    return Date.now() - lastFetch < CACHE_DURATION;
}

// Generic fetch function with error handling
async function fetchFromApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`[ApiService] Fetching: ${url}`);

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
                ...options?.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`[ApiService] Response from ${endpoint}:`, JSON.stringify(data).substring(0, 200));
        return data;
    } catch (error) {
        console.error(`[ApiService] Error fetching ${endpoint}:`, error);
        throw error;
    }
}

export class ApiService {
    /**
     * Fetch user accounts
     */
    static async getAccounts(forceRefresh = false): Promise<Account[]> {
        if (!forceRefresh && cache.accounts && isCacheValid('accounts')) {
            return cache.accounts;
        }

        try {
            const response = await fetchFromApi<{ accounts: Account[] }>('/api/accounts');
            cache.accounts = response.accounts;
            cache.lastFetch.accounts = Date.now();
            return response.accounts;
        } catch (error) {
            console.error('[ApiService] Failed to fetch accounts, using empty array');
            return [];
        }
    }

    /**
     * Fetch beneficiaries
     */
    static async getBeneficiaries(type?: 'national' | 'international', forceRefresh = false): Promise<Beneficiary[]> {
        if (!forceRefresh && cache.beneficiaries && isCacheValid('beneficiaries') && !type) {
            return cache.beneficiaries;
        }

        try {
            const endpoint = type ? `/api/beneficiaries?type=${type}` : '/api/beneficiaries';
            const response = await fetchFromApi<{ beneficiaries: Beneficiary[] }>(endpoint);
            if (!type) {
                cache.beneficiaries = response.beneficiaries;
                cache.lastFetch.beneficiaries = Date.now();
            }
            return response.beneficiaries;
        } catch (error) {
            console.error('[ApiService] Failed to fetch beneficiaries, using empty array');
            return [];
        }
    }

    /**
     * Fetch bills
     */
    static async getBills(status?: string, forceRefresh = false): Promise<{ bills: Bill[]; totalAmount: number }> {
        if (!forceRefresh && cache.bills && isCacheValid('bills') && !status) {
            const totalAmount = cache.bills.reduce((sum, bill) => sum + bill.amount, 0);
            return { bills: cache.bills, totalAmount };
        }

        try {
            const endpoint = status ? `/api/bills?status=${status}` : '/api/bills';
            const response = await fetchFromApi<{ bills: Bill[]; totalAmount: number }>(endpoint);
            if (!status) {
                cache.bills = response.bills;
                cache.lastFetch.bills = Date.now();
            }
            return response;
        } catch (error) {
            console.error('[ApiService] Failed to fetch bills, using empty array');
            return { bills: [], totalAmount: 0 };
        }
    }

    /**
     * Pay a bill
     */
    static async payBill(billId: string): Promise<{ success: boolean; reference?: string; error?: string }> {
        try {
            const response = await fetchFromApi<{ success: boolean; reference: string }>(`/api/bills/${billId}/pay`, {
                method: 'POST',
            });
            // Invalidate bills cache after payment
            cache.bills = null;
            return response;
        } catch (error) {
            console.error('[ApiService] Failed to pay bill:', error);
            return { success: false, error: 'Failed to pay bill' };
        }
    }

    /**
     * Fetch transfers/transactions
     */
    static async getTransfers(limit = 10, status?: string): Promise<{ transfers: any[]; total: number }> {
        try {
            let endpoint = `/api/transfers?limit=${limit}`;
            if (status) endpoint += `&status=${status}`;
            const response = await fetchFromApi<{ transfers: any[]; total: number }>(endpoint);
            return response;
        } catch (error) {
            console.error('[ApiService] Failed to fetch transfers, using empty array');
            return { transfers: [], total: 0 };
        }
    }

    /**
     * Create a new transfer
     */
    static async createTransfer(transferData: {
        fromAccountId: string;
        beneficiaryId: string;
        amount: number;
        currency?: string;
        purpose?: string;
        reference?: string;
    }): Promise<{ transfer?: any; requiresOtp?: boolean; error?: string }> {
        try {
            const response = await fetchFromApi<any>('/api/transfers', {
                method: 'POST',
                body: JSON.stringify(transferData),
            });
            return response;
        } catch (error) {
            console.error('[ApiService] Failed to create transfer:', error);
            return { error: 'Failed to create transfer' };
        }
    }

    /**
     * Confirm a transfer with OTP
     */
    static async confirmTransfer(transferId: string, otp?: string): Promise<{ success: boolean; transfer?: any; error?: string }> {
        try {
            const response = await fetchFromApi<{ success: boolean; transfer: any }>(`/api/transfers/${transferId}/confirm`, {
                method: 'POST',
                body: JSON.stringify({ otp }),
            });
            return response;
        } catch (error) {
            console.error('[ApiService] Failed to confirm transfer:', error);
            return { success: false, error: 'Failed to confirm transfer' };
        }
    }

    /**
     * Fetch spending breakdown
     */
    static async getSpendingBreakdown(sessionId = 'default', period = 'current_month', forceRefresh = false): Promise<SpendingBreakdown[]> {
        if (!forceRefresh && cache.spendingBreakdown && isCacheValid('spendingBreakdown')) {
            return cache.spendingBreakdown;
        }

        try {
            const response = await fetchFromApi<{ breakdown: SpendingBreakdown[] }>(
                `/api/spending/breakdown?sessionId=${sessionId}&period=${period}`
            );
            cache.spendingBreakdown = response.breakdown;
            cache.lastFetch.spendingBreakdown = Date.now();
            return response.breakdown;
        } catch (error) {
            console.error('[ApiService] Failed to fetch spending breakdown, using empty array');
            return [];
        }
    }

    /**
     * Fetch user profile
     */
    static async getUserProfile(sessionId = 'default', forceRefresh = false): Promise<any> {
        if (!forceRefresh && cache.userProfile && isCacheValid('userProfile')) {
            return cache.userProfile;
        }

        try {
            const response = await fetchFromApi<any>(`/api/user/profile?sessionId=${sessionId}`);
            cache.userProfile = response;
            cache.lastFetch.userProfile = Date.now();
            return response;
        } catch (error) {
            console.error('[ApiService] Failed to fetch user profile');
            return null;
        }
    }

    /**
     * Fetch exchange rates
     */
    static async getExchangeRates(forceRefresh = false): Promise<any> {
        if (!forceRefresh && cache.exchangeRates && isCacheValid('exchangeRates')) {
            return cache.exchangeRates;
        }

        try {
            const response = await fetchFromApi<any>('/api/exchange-rates');
            cache.exchangeRates = response;
            cache.lastFetch.exchangeRates = Date.now();
            return response;
        } catch (error) {
            console.error('[ApiService] Failed to fetch exchange rates');
            return null;
        }
    }

    /**
     * Fetch products
     */
    static async getProducts(category = 'all', forceRefresh = false): Promise<Product[]> {
        if (!forceRefresh && cache.products && isCacheValid('products') && category === 'all') {
            return cache.products;
        }

        try {
            const response = await fetchFromApi<{ products: Product[] }>(`/api/products?category=${category}`);
            if (category === 'all') {
                cache.products = response.products;
                cache.lastFetch.products = Date.now();
            }
            return response.products;
        } catch (error) {
            console.error('[ApiService] Failed to fetch products, using empty array');
            return [];
        }
    }

    /**
     * Fetch user cards
     */
    static async getCards(type?: 'credit' | 'debit', forceRefresh = false): Promise<Card[]> {
        if (!forceRefresh && cache.cards && isCacheValid('cards') && !type) {
            return cache.cards;
        }

        try {
            const endpoint = type ? `/api/cards?type=${type}` : '/api/cards';
            const response = await fetchFromApi<{ cards: Card[] }>(endpoint);
            if (!type) {
                cache.cards = response.cards;
                cache.lastFetch.cards = Date.now();
            }
            return response.cards;
        } catch (error) {
            console.error('[ApiService] Failed to fetch cards, using empty array');
            return [];
        }
    }

    /**
     * Fetch user subscriptions
     */
    static async getSubscriptions(activeOnly = false, forceRefresh = false): Promise<Subscription[]> {
        if (!forceRefresh && cache.subscriptions && isCacheValid('subscriptions') && !activeOnly) {
            return cache.subscriptions;
        }

        try {
            const endpoint = activeOnly ? '/api/subscriptions?active=true' : '/api/subscriptions';
            const response = await fetchFromApi<{ subscriptions: Subscription[] }>(endpoint);
            if (!activeOnly) {
                cache.subscriptions = response.subscriptions;
                cache.lastFetch.subscriptions = Date.now();
            }
            return response.subscriptions;
        } catch (error) {
            console.error('[ApiService] Failed to fetch subscriptions, using empty array');
            return [];
        }
    }

    /**
     * Fetch all initial data needed for the chat
     */
    static async fetchAllData(): Promise<{
        accounts: Account[];
        beneficiaries: Beneficiary[];
        bills: Bill[];
        spendingBreakdown: SpendingBreakdown[];
        products: Product[];
    }> {
        const [accounts, beneficiaries, billsResponse, spendingBreakdown, products] = await Promise.all([
            this.getAccounts(),
            this.getBeneficiaries(),
            this.getBills(),
            this.getSpendingBreakdown(),
            this.getProducts(),
        ]);

        return {
            accounts,
            beneficiaries,
            bills: billsResponse.bills,
            spendingBreakdown,
            products,
        };
    }

    /**
     * Clear all cached data
     */
    static clearCache(): void {
        cache.accounts = null;
        cache.beneficiaries = null;
        cache.cards = null;
        cache.bills = null;
        cache.spendingBreakdown = null;
        cache.subscriptions = null;
        cache.products = null;
        cache.userProfile = null;
        cache.exchangeRates = null;
        cache.lastFetch = {};
        console.log('[ApiService] Cache cleared');
    }
}
