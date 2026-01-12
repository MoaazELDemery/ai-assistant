import { ExchangeRates } from '../types';

export const mockExchangeRates: ExchangeRates = {
    baseCurrency: 'SAR',
    rates: {
        USD: 0.2667,
        EUR: 0.2453,
        GBP: 0.2133,
        AED: 0.9793,
        EGP: 13.07,
    },
    timestamp: new Date().toISOString(),
};

export const currencySymbols: Record<string, string> = {
    SAR: 'ر.س',
    USD: '$',
    EUR: '€',
    GBP: '£',
    AED: 'د.إ',
    EGP: 'ج.م',
};

// Helper function to get exchange rate
export function getExchangeRate(from: string, to: string): number | null {
    const baseCurrency = mockExchangeRates.baseCurrency;

    if (from === to) return 1;

    if (from === baseCurrency && mockExchangeRates.rates[to]) {
        return mockExchangeRates.rates[to];
    }

    if (to === baseCurrency && mockExchangeRates.rates[from]) {
        return 1 / mockExchangeRates.rates[from];
    }

    // Cross rate
    const fromRate = mockExchangeRates.rates[from];
    const toRate = mockExchangeRates.rates[to];
    if (fromRate && toRate) {
        return toRate / fromRate;
    }

    return null;
}
