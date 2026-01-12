import { Account, Beneficiary, Card, Bill, SpendingBreakdown, Subscription } from '../types';
import { ENV } from '../config/constants';
import { getExchangeRate } from '../data/exchange-rates';

const N8N_WEBHOOK_URL = ENV.N8N_WEBHOOK_URL;

// Currency code aliases and common misspellings (from STT)
const currencyAliases: Record<string, string> = {
    'SAR': 'SAR', 'SER': 'SAR', 'RIYAL': 'SAR', 'SAUDI': 'SAR',
    'USD': 'USD', 'DOLLAR': 'USD', 'DOLLARS': 'USD', 'US': 'USD',
    'EUR': 'EUR', 'EURO': 'EUR', 'EUROS': 'EUR',
    'GBP': 'GBP', 'POUND': 'GBP', 'POUNDS': 'GBP', 'STERLING': 'GBP',
    'AED': 'AED', 'DIRHAM': 'AED', 'DIRHAMS': 'AED', 'EMIRATI': 'AED',
    'EGP': 'EGP', 'EGB': 'EGP', 'EGYPTIAN': 'EGP', 'EGYPT': 'EGP',
};

function normalizeCurrency(input: string): string | null {
    const upper = input.toUpperCase().replace(/[^A-Z]/g, '');
    return currencyAliases[upper] || null;
}

function isExchangeRateQuery(message: string): { isQuery: boolean; from?: string; to?: string } {
    const cleanedMessage = message.replace(/([A-Za-z])-([A-Za-z])/g, '$1$2');
    const lowerMessage = cleanedMessage.toLowerCase();

    const patterns = [
        /(?:exchange\s*rate|convert|rate)\s*(?:from|for)?\s*(\w+)\s*(?:to|2|-|→)\s*(\w+)/i,
        /(\w+)\s*(?:to|2)\s*(\w+)\s*(?:exchange|rate|conversion)/i,
        /(\w+)\s*(?:to|2)\s*(\w+)/i,
        /how\s*much\s*is\s*\d*\s*(\w+)\s*in\s*(\w+)/i,
        /(\w{3})\s*(\w{3})/i,
    ];

    const isExchangeQuery =
        lowerMessage.includes('exchange') ||
        lowerMessage.includes('rate') ||
        lowerMessage.includes('convert') ||
        lowerMessage.includes('sar') ||
        lowerMessage.includes('ser') ||
        lowerMessage.includes('usd') ||
        lowerMessage.includes('dollar') ||
        lowerMessage.includes('egp') ||
        lowerMessage.includes('egb') ||
        lowerMessage.includes('eur') ||
        lowerMessage.includes('gbp');

    if (isExchangeQuery) {
        for (const pattern of patterns) {
            const match = cleanedMessage.match(pattern);
            if (match) {
                const from = normalizeCurrency(match[1]);
                const to = normalizeCurrency(match[2]);
                if (from && to) {
                    return { isQuery: true, from, to };
                }
            }
        }
        return { isQuery: true };
    }

    return { isQuery: false };
}

function generateExchangeRateResponse(from: string, to: string, locale: string) {
    const rate = getExchangeRate(from, to);

    if (rate === null) {
        return {
            message: locale === 'ar'
                ? `عذراً، لا يمكنني العثور على سعر الصرف من ${from} إلى ${to}.`
                : `Sorry, I couldn't find the exchange rate from ${from} to ${to}.`,
            ui: {
                showAccounts: false,
                showBeneficiaries: false,
                transferPreview: null,
                transferSuccess: null,
                exchangeRate: null,
                requestOtp: false,
            }
        };
    }

    const roundedRate = Math.round(rate * 10000) / 10000;

    return {
        message: locale === 'ar'
            ? `سعر الصرف الحالي من ${from} إلى ${to} هو ${roundedRate}. هذا يعني 1 ${from} = ${roundedRate} ${to}.`
            : `The current exchange rate from ${from} to ${to} is ${roundedRate}. This means 1 ${from} = ${roundedRate} ${to}.`,
        ui: {
            showAccounts: false,
            showBeneficiaries: false,
            transferPreview: null,
            transferSuccess: null,
            exchangeRate: { from, to, rate: roundedRate },
            requestOtp: false,
        }
    };
}

export class ChatService {
    static async sendMessage(content: string, sessionId: string, locale: string): Promise<any> {
        try {
            // Check for exchange rate query first - handle locally for reliability
            const exchangeQuery = isExchangeRateQuery(content);
            if (exchangeQuery.isQuery && exchangeQuery.from && exchangeQuery.to) {
                return generateExchangeRateResponse(exchangeQuery.from, exchangeQuery.to, locale);
            }

            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chatInput: content,
                    sessionId,
                    locale,
                    client: 'react-native-sdk',
                    apiUrl: ENV.API_CALLBACK_URL
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('ChatService: API Error:', errorText);
                throw new Error(`API Error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();

            if (!data.structured) {
                return data;
            }

            let jsonString = data.structured;

            if (typeof jsonString === 'object') {
                const parsed = jsonString;
                if (parsed.message &&
                    (parsed.message.includes('technical issue') ||
                        parsed.message.includes('trouble retrieving') ||
                        parsed.message.includes('unable to retrieve'))) {
                    const retryQuery = isExchangeRateQuery(content);
                    if (retryQuery.isQuery && retryQuery.from && retryQuery.to) {
                        return generateExchangeRateResponse(retryQuery.from, retryQuery.to, locale);
                    }
                }
                return parsed;
            }

            const codeBlockMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
            if (codeBlockMatch) {
                jsonString = codeBlockMatch[1];
            } else {
                const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    jsonString = jsonMatch[0];
                }
            }

            try {
                const parsed = JSON.parse(jsonString.trim());
                if (parsed.message &&
                    (parsed.message.includes('technical issue') ||
                        parsed.message.includes('trouble retrieving') ||
                        parsed.message.includes('unable to retrieve'))) {
                    const retryQuery = isExchangeRateQuery(content);
                    if (retryQuery.isQuery && retryQuery.from && retryQuery.to) {
                        return generateExchangeRateResponse(retryQuery.from, retryQuery.to, locale);
                    }
                }
                return parsed;
            } catch (jsonError) {
                console.error('ChatService: Failed to parse response');
                throw new Error('Invalid JSON from AI');
            }

        } catch (error) {
            console.error('ChatService Error:', error);
            throw error;
        }
    }

    static async fetchInitialData() {
        return {
            accounts: [] as Account[],
            beneficiaries: [] as Beneficiary[],
            cards: [] as Card[],
            bills: [] as Bill[],
            spendingBreakdown: [] as SpendingBreakdown[],
            subscriptions: [] as Subscription[],
        };
    }
}
