export interface Account {
    id: string;
    name: string;
    nameAr: string;
    type: 'current' | 'savings';
    accountNumber: string;
    iban: string;
    balance: number;
    currency: 'SAR';
    isDefault: boolean;
}

export interface Beneficiary {
    id: string;
    name: string;
    nameAr: string;
    nickname?: string;
    bankCode: string;
    bankName: string;
    bankNameAr: string;
    bankLogo?: string;
    iban: string;
    accountType: 'personal' | 'business';
    type: 'national' | 'international';
    country?: string;
    countryAr?: string;
    swiftCode?: string;
    createdAt: string;
}

export interface Transfer {
    id: string;
    fromAccountId: string;
    beneficiaryId: string;
    amount: number;
    currency: string;
    convertedAmount?: number;
    exchangeRate?: number;
    purpose: TransferPurpose;
    reference?: string;
    type: 'national' | 'international';
    status: 'pending' | 'processing' | 'completed' | 'failed';
    createdAt: string;
    completedAt?: string;
}

export type TransferPurpose =
    | 'family_support'
    | 'salary'
    | 'investment'
    | 'education'
    | 'medical'
    | 'business'
    | 'other';

export interface ChatMessageUI {
    showAccounts: boolean;
    showBeneficiaries: boolean;
    transferPreview?: TransferPreview | null;
    transferSuccess?: {
        transactionId: string;
        amount?: number;
        currency?: string;
        beneficiaryName?: string;
    } | null;
    exchangeRate?: {
        from: string;
        to: string;
        rate: number;
    } | null;
    requestOtp: boolean;
    showCards?: boolean;
    cardPreview?: CardPreview | null;
    cardActionSuccess?: CardActionSuccess | null;
    showSpendingBreakdown?: boolean;
    spendingInsights?: SpendingInsight[] | null;
    showSubscriptions?: boolean;
    showBills?: boolean;
    billPaymentPreview?: BillPaymentPreview | null;
    billPaymentSuccess?: BillPaymentSuccess | null;
    ticketCreated?: TicketCreated | null;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    ui?: ChatMessageUI;
    accounts?: Account[];
    beneficiaries?: Beneficiary[];
    // Legacy support
    transferPreview?: TransferPreview;
}

export interface TransferPreview {
    fromAccountId: string;
    fromAccountName?: string;
    beneficiaryId: string;
    beneficiaryName?: string;
    amount: number;
    currency: string;
    type?: 'national' | 'international';
    convertedAmount?: number;
    exchangeRate?: number;
    purpose?: TransferPurpose;
    fees?: number;
    totalAmount?: number;
}

export interface ExchangeRates {
    baseCurrency: 'SAR';
    rates: Record<string, number>;
    timestamp: string;
}

// Card Management Types
export interface Card {
    id: string;
    name: string;
    nameAr: string;
    type: 'credit' | 'debit';
    lastFourDigits: string;
    cardNumber: string;
    expiryDate: string;
    status: 'active' | 'frozen';
    linkedAccountId: string;
    limits: CardLimits;
    settings: CardSettings;
    cardNetwork: 'visa' | 'mastercard' | 'mada';
}

export interface CardLimits {
    dailyLimit: number;
    transactionLimit: number;
    currentDailyUsage: number;
}

export interface CardSettings {
    internationalTransactions: boolean;
    onlineTransactions: boolean;
    contactlessPayments: boolean;
}

export type CardAction =
    | 'freeze'
    | 'unfreeze'
    | 'set_daily_limit'
    | 'set_transaction_limit'
    | 'toggle_international'
    | 'toggle_online'
    | 'request_replacement'
    | 'reset_pin';

export interface CardPreview {
    cardId: string;
    cardName?: string;
    action: CardAction;
    newDailyLimit?: number;
    newTransactionLimit?: number;
}

export interface CardActionSuccess {
    cardId: string;
    cardName?: string;
    action: CardAction;
    message: string;
    messageAr: string;
}

// Financial Insights Types
export interface SpendingCategory {
    id: string;
    name: string;
    nameAr: string;
    icon: string;
    color: string;
}

export interface SpendingBreakdown {
    categoryId: string;
    categoryName: string;
    categoryNameAr: string;
    amount: number;
    percentage: number;
    transactionCount: number;
    change: number;
}

export interface MerchantSpending {
    merchantName: string;
    merchantNameAr: string;
    category: string;
    totalAmount: number;
    transactionCount: number;
    lastTransaction: string;
}

export interface Subscription {
    id: string;
    name: string;
    nameAr: string;
    merchantName: string;
    amount: number;
    currency: string;
    frequency: 'weekly' | 'monthly' | 'yearly';
    nextBillingDate: string;
    category: string;
    isActive: boolean;
}

export interface SpendingInsight {
    type: 'comparison' | 'unusual' | 'subscription' | 'trend';
    message: string;
    messageAr: string;
    category?: string;
    amount?: number;
    changePercent?: number;
}

// Bill Payment Types
export interface Bill {
    id: string;
    type: 'electricity' | 'water' | 'internet' | 'phone' | 'credit_card' | 'government';
    providerName: string;
    providerNameAr: string;
    providerLogo?: string;
    accountNumber: string;
    amount: number;
    dueDate: string;
    status: 'pending' | 'paid' | 'overdue';
    isPriority: boolean;
}

export interface BillPayment {
    id: string;
    billId: string;
    fromAccountId: string;
    amount: number;
    paidAt: string;
    reference: string;
    status: 'completed' | 'pending' | 'failed';
}

export interface BillPaymentPreview {
    billId: string;
    providerName?: string;
    fromAccountId: string;
    fromAccountName?: string;
    amount: number;
    dueDate: string;
}

export interface BillPaymentSuccess {
    billId: string;
    providerName?: string;
    amount: number;
    paidAt: string;
    reference: string;
}

// Support Ticket Types
export interface SupportTicket {
    id: string;
    ticketNumber: string;
    summary: string;
    summaryAr: string;
    description: string;
    category: 'general' | 'account' | 'card' | 'transfer' | 'bill' | 'technical' | 'complaint';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    context: TicketContext;
    createdAt: string;
    updatedAt: string;
}

export interface TicketContext {
    accountIds?: string[];
    cardIds?: string[];
    transactionIds?: string[];
    userMessage: string;
    aiAnalysis: string;
}

export interface TicketCreated {
    ticketId: string;
    ticketNumber: string;
    estimatedResolutionTime: string;
}
