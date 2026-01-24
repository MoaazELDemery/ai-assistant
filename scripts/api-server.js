#!/usr/bin/env node
/**
 * Mock API Server for AI Assistant SDK
 * Provides all the mock data endpoints that n8n calls
 * 
 * Endpoints:
 * - GET /api/accounts
 * - GET /api/beneficiaries
 * - POST /api/beneficiaries
 * - GET /api/products
 * - GET /api/spending/breakdown
 * - GET /api/user/profile
 * - GET /api/exchange-rates
 * - GET /health
 * 
 * Also proxies STT requests to the MLX-Whisper server
 */

const http = require('http');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;
const STT_SERVER = process.env.STT_SERVER || 'http://localhost:8000';

// ============ MOCK DATA ============

const mockAccounts = [
    {
        id: 'acc-001',
        name: 'Main Account',
        nameAr: 'الحساب الرئيسي',
        type: 'current',
        accountNumber: '****4521',
        iban: 'SA03 8000 0000 6080 1016 7519',
        balance: 45750.50,
        currency: 'SAR',
        isDefault: true,
    },
    {
        id: 'acc-002',
        name: 'Secondary Account',
        nameAr: 'الحساب الثانوي',
        type: 'current',
        accountNumber: '****8834',
        iban: 'SA44 2000 0001 2345 6789 0123',
        balance: 12300.00,
        currency: 'SAR',
        isDefault: false,
    },
    {
        id: 'acc-003',
        name: 'Savings Account',
        nameAr: 'حساب التوفير',
        type: 'savings',
        accountNumber: '****2156',
        iban: 'SA89 1000 0000 9876 5432 1098',
        balance: 150000.00,
        currency: 'SAR',
        isDefault: false,
    },
];

const mockBeneficiaries = [
    {
        id: 'ben-001',
        name: 'Abdelrahman Moharib',
        nameAr: 'عبد الرحمن محارب',
        nickname: 'Brother',
        bankCode: 'RJHI',
        bankName: 'Al Rajhi Bank',
        bankNameAr: 'مصرف الراجحي',
        iban: 'SA03 8000 0000 6080 1016 7519',
        accountType: 'personal',
        type: 'national',
        createdAt: '2024-01-15T10:30:00Z',
    },
    {
        id: 'ben-002',
        name: 'Ahmed Mohammed',
        nameAr: 'أحمد محمد',
        bankCode: 'NCB',
        bankName: 'The National Commercial Bank',
        bankNameAr: 'البنك الأهلي السعودي',
        iban: 'SA44 1000 0000 1234 5678 9012',
        accountType: 'personal',
        type: 'national',
        createdAt: '2024-02-20T14:15:00Z',
    },
    {
        id: 'ben-003',
        name: 'Sara Abdullah',
        nameAr: 'سارة عبد الله',
        bankCode: 'SABB',
        bankName: 'Saudi British Bank',
        bankNameAr: 'البنك السعودي البريطاني',
        iban: 'SA03 4500 0000 0067 8901 2345',
        accountType: 'personal',
        type: 'national',
        createdAt: '2024-03-10T09:45:00Z',
    },
    {
        id: 'ben-004',
        name: 'Mohamed Hassan',
        nameAr: 'محمد حسن',
        nickname: 'Family - Egypt',
        bankCode: 'NBE',
        bankName: 'National Bank of Egypt',
        bankNameAr: 'البنك الأهلي المصري',
        iban: 'EG38 0019 0005 0000 0000 2631 8000',
        accountType: 'personal',
        type: 'international',
        country: 'Egypt',
        countryAr: 'مصر',
        swiftCode: 'NBEGEGCX',
        createdAt: '2024-01-25T16:20:00Z',
    },
    {
        id: 'ben-005',
        name: 'John Smith',
        nameAr: 'جون سميث',
        nickname: 'Business Partner',
        bankCode: 'HSBC',
        bankName: 'HSBC UK',
        bankNameAr: 'إتش إس بي سي المملكة المتحدة',
        iban: 'GB29 NWBK 6016 1331 9268 19',
        accountType: 'business',
        type: 'international',
        country: 'United Kingdom',
        countryAr: 'المملكة المتحدة',
        swiftCode: 'HSBCGB2L',
        createdAt: '2024-04-05T11:30:00Z',
    },
];

const mockProducts = [
    {
        id: 'prod-001',
        name: 'Personal Loan',
        nameAr: 'قرض شخصي',
        category: 'lending',
        type: 'personal_loan',
        icon: 'banknote',
        benefit: 'Quick approval within 24 hours',
        benefitAr: 'موافقة سريعة خلال 24 ساعة',
        eligibilityNote: 'Must be employed for at least 3 months',
        eligibilityNoteAr: 'يجب أن تكون موظفاً لمدة 3 أشهر على الأقل',
        isPromoted: false,
        minSalary: 5000,
        minAmount: 5000,
        maxAmount: 500000,
    },
    {
        id: 'prod-002',
        name: 'Micro Loan',
        nameAr: 'قرض صغير',
        category: 'lending',
        type: 'micro_loan',
        icon: 'zap',
        benefit: 'Instant approval',
        benefitAr: 'موافقة فورية',
        eligibilityNote: 'Available for existing customers with active account',
        eligibilityNoteAr: 'متاح للعملاء الحاليين ذوي الحساب النشط',
        isPromoted: true,
        minSalary: 3000,
        minAmount: 1000,
        maxAmount: 10000,
    },
    {
        id: 'prod-010',
        name: 'Automatic Savings Plan',
        nameAr: 'خطة ادخار تلقائية',
        category: 'saving',
        type: 'automatic_savings',
        icon: 'piggy-bank',
        benefit: 'Automatic monthly transfers',
        benefitAr: 'تحويلات شهرية تلقائية',
        eligibilityNote: 'Available for all account holders',
        eligibilityNoteAr: 'متاح لجميع أصحاب الحسابات',
        isPromoted: false,
        minAmount: 100,
    },
    {
        id: 'prod-020',
        name: 'Premium Cashback Card',
        nameAr: 'بطاقة الاسترداد النقدي المميزة',
        category: 'credit_card',
        type: 'new_card',
        icon: 'credit-card',
        benefit: '2% cashback on all purchases',
        benefitAr: '2% استرداد نقدي على جميع المشتريات',
        eligibilityNote: 'Subject to credit approval',
        eligibilityNoteAr: 'يخضع للموافقة الائتمانية',
        isPromoted: true,
        minSalary: 8000,
        maxAmount: 100000,
    },
];

const mockBills = [
    {
        id: 'bill-001',
        type: 'electricity',
        providerName: 'Saudi Electricity Company',
        providerNameAr: 'الشركة السعودية للكهرباء',
        accountNumber: '1234567890',
        amount: 450.0,
        dueDate: '2024-12-28T23:59:59Z',
        status: 'pending',
        isPriority: true,
    },
    {
        id: 'bill-002',
        type: 'water',
        providerName: 'National Water Company',
        providerNameAr: 'شركة المياه الوطنية',
        accountNumber: '9876543210',
        amount: 120.0,
        dueDate: '2024-12-30T23:59:59Z',
        status: 'pending',
        isPriority: false,
    },
    {
        id: 'bill-003',
        type: 'internet',
        providerName: 'stc',
        providerNameAr: 'اس تي سي',
        accountNumber: '5551234567',
        amount: 299.0,
        dueDate: '2025-01-05T23:59:59Z',
        status: 'pending',
        isPriority: false,
    },
    {
        id: 'bill-004',
        type: 'phone',
        providerName: 'Mobily',
        providerNameAr: 'موبايلي',
        accountNumber: '0501234567',
        amount: 180.0,
        dueDate: '2025-01-10T23:59:59Z',
        status: 'pending',
        isPriority: false,
    },
    {
        id: 'bill-005',
        type: 'credit_card',
        providerName: 'stc bank Credit Card',
        providerNameAr: 'بطاقة ستي سي بنك الائتمانية',
        accountNumber: '**** **** **** 4532',
        amount: 3250.0,
        dueDate: '2024-12-26T23:59:59Z',
        status: 'overdue',
        isPriority: true,
    },
    {
        id: 'bill-006',
        type: 'government',
        providerName: 'Traffic Department',
        providerNameAr: 'إدارة المرور',
        accountNumber: 'VIO-2024-1234',
        amount: 500.0,
        dueDate: '2024-12-25T23:59:59Z',
        status: 'overdue',
        isPriority: true,
    },
    {
        id: 'bill-007',
        type: 'electricity',
        providerName: 'Saudi Electricity Company',
        providerNameAr: 'الشركة السعودية للكهرباء',
        accountNumber: '1234567890',
        amount: 420.0,
        dueDate: '2024-11-28T23:59:59Z',
        status: 'paid',
        isPriority: false,
    },
    {
        id: 'bill-008',
        type: 'water',
        providerName: 'National Water Company',
        providerNameAr: 'شركة المياه الوطنية',
        accountNumber: '9876543210',
        amount: 115.0,
        dueDate: '2024-11-30T23:59:59Z',
        status: 'paid',
        isPriority: false,
    },
];

const mockTransfers = [
    {
        id: 'txn-001',
        fromAccountId: 'acc-001',
        beneficiaryId: 'ben-001',
        amount: 5000,
        currency: 'SAR',
        purpose: 'family_support',
        reference: 'Monthly support',
        type: 'national',
        status: 'completed',
        createdAt: '2024-11-28T10:30:00Z',
        completedAt: '2024-11-28T10:31:00Z',
    },
    {
        id: 'txn-002',
        fromAccountId: 'acc-001',
        beneficiaryId: 'ben-004',
        amount: 2000,
        currency: 'USD',
        convertedAmount: 7500,
        exchangeRate: 3.75,
        purpose: 'family_support',
        type: 'international',
        status: 'completed',
        createdAt: '2024-11-25T14:15:00Z',
        completedAt: '2024-11-25T14:20:00Z',
    },
    {
        id: 'txn-003',
        fromAccountId: 'acc-002',
        beneficiaryId: 'ben-002',
        amount: 1500,
        currency: 'SAR',
        purpose: 'business',
        reference: 'Invoice #1234',
        type: 'national',
        status: 'completed',
        createdAt: '2024-11-20T09:00:00Z',
        completedAt: '2024-11-20T09:01:00Z',
    },
    {
        id: 'txn-004',
        fromAccountId: 'acc-001',
        beneficiaryId: 'ben-005',
        amount: 500,
        currency: 'GBP',
        convertedAmount: 2344,
        exchangeRate: 4.688,
        purpose: 'business',
        type: 'international',
        status: 'completed',
        createdAt: '2024-11-15T16:45:00Z',
        completedAt: '2024-11-15T16:50:00Z',
    },
];

// In-memory store for pending transfers (requires OTP confirmation)
let pendingTransfers = new Map();

const mockCards = [
    {
        id: 'card-001',
        name: 'Platinum Credit Card',
        nameAr: 'بطاقة الائتمان البلاتينية',
        type: 'credit',
        lastFourDigits: '4521',
        cardNumber: '**** **** **** 4521',
        expiryDate: '12/27',
        status: 'active',
        linkedAccountId: 'acc-001',
        limits: {
            dailyLimit: 50000,
            transactionLimit: 20000,
            currentDailyUsage: 12500,
        },
        settings: {
            internationalTransactions: true,
            onlineTransactions: true,
            contactlessPayments: true,
        },
        cardNetwork: 'visa',
    },
    {
        id: 'card-002',
        name: 'Debit Card',
        nameAr: 'بطاقة الصراف الآلي',
        type: 'debit',
        lastFourDigits: '8834',
        cardNumber: '**** **** **** 8834',
        expiryDate: '09/26',
        status: 'active',
        linkedAccountId: 'acc-002',
        limits: {
            dailyLimit: 15000,
            transactionLimit: 5000,
            currentDailyUsage: 3200,
        },
        settings: {
            internationalTransactions: false,
            onlineTransactions: true,
            contactlessPayments: true,
        },
        cardNetwork: 'mada',
    },
    {
        id: 'card-003',
        name: 'Gold Credit Card',
        nameAr: 'بطاقة الائتمان الذهبية',
        type: 'credit',
        lastFourDigits: '2156',
        cardNumber: '**** **** **** 2156',
        expiryDate: '06/28',
        status: 'frozen',
        linkedAccountId: 'acc-001',
        limits: {
            dailyLimit: 30000,
            transactionLimit: 15000,
            currentDailyUsage: 0,
        },
        settings: {
            internationalTransactions: true,
            onlineTransactions: false,
            contactlessPayments: true,
        },
        cardNetwork: 'mastercard',
    },
];

const mockSubscriptions = [
    {
        id: 'sub-1',
        name: 'Netflix Premium',
        nameAr: 'نتفلكس بريميوم',
        merchantName: 'Netflix',
        amount: 63.99,
        currency: 'SAR',
        frequency: 'monthly',
        nextBillingDate: '2025-01-15T00:00:00Z',
        category: 'entertainment',
        isActive: true,
    },
    {
        id: 'sub-2',
        name: 'Spotify Premium',
        nameAr: 'سبوتيفاي بريميوم',
        merchantName: 'Spotify',
        amount: 19.99,
        currency: 'SAR',
        frequency: 'monthly',
        nextBillingDate: '2025-01-10T00:00:00Z',
        category: 'entertainment',
        isActive: true,
    },
    {
        id: 'sub-3',
        name: 'Apple iCloud Storage',
        nameAr: 'مساحة تخزين آي كلاود',
        merchantName: 'Apple',
        amount: 11.99,
        currency: 'SAR',
        frequency: 'monthly',
        nextBillingDate: '2025-01-05T00:00:00Z',
        category: 'technology',
        isActive: true,
    },
    {
        id: 'sub-4',
        name: 'Fitness Time Membership',
        nameAr: 'عضوية فتنس تايم',
        merchantName: 'Fitness Time',
        amount: 500.0,
        currency: 'SAR',
        frequency: 'monthly',
        nextBillingDate: '2025-01-01T00:00:00Z',
        category: 'health',
        isActive: true,
    },
    {
        id: 'sub-5',
        name: 'Amazon Prime',
        nameAr: 'أمازون برايم',
        merchantName: 'Amazon',
        amount: 16.0,
        currency: 'SAR',
        frequency: 'monthly',
        nextBillingDate: '2025-01-20T00:00:00Z',
        category: 'shopping',
        isActive: true,
    },
    {
        id: 'sub-6',
        name: 'Adobe Creative Cloud',
        nameAr: 'أدوبي كريتف كلاود',
        merchantName: 'Adobe',
        amount: 149.99,
        currency: 'SAR',
        frequency: 'monthly',
        nextBillingDate: '2025-01-12T00:00:00Z',
        category: 'technology',
        isActive: true,
    },
    {
        id: 'sub-7',
        name: 'Disney+ Annual',
        nameAr: 'ديزني بلس سنوي',
        merchantName: 'Disney+',
        amount: 299.99,
        currency: 'SAR',
        frequency: 'yearly',
        nextBillingDate: '2025-06-15T00:00:00Z',
        category: 'entertainment',
        isActive: true,
    },
    {
        id: 'sub-8',
        name: 'The Economist Digital',
        nameAr: 'ذا إيكونومست الرقمي',
        merchantName: 'The Economist',
        amount: 45.0,
        currency: 'SAR',
        frequency: 'monthly',
        nextBillingDate: '2025-01-08T00:00:00Z',
        category: 'news',
        isActive: false,
    },
];

const mockExchangeRates = {
    base: 'SAR',
    rates: {
        USD: 0.2666,
        EUR: 0.2456,
        GBP: 0.2107,
        AED: 0.9793,
        EGP: 8.2133,
        INR: 22.2890,
        PKR: 74.1333,
        PHP: 14.9067,
    },
    lastUpdated: new Date().toISOString(),
};

// ============ SPENDING BREAKDOWN GENERATOR ============

const categoryTemplates = [
    { categoryId: 'dining', categoryName: 'Dining & Restaurants', categoryNameAr: 'المطاعم والمقاهي' },
    { categoryId: 'shopping', categoryName: 'Shopping', categoryNameAr: 'التسوق' },
    { categoryId: 'groceries', categoryName: 'Groceries', categoryNameAr: 'البقالة' },
    { categoryId: 'entertainment', categoryName: 'Entertainment', categoryNameAr: 'الترفيه' },
    { categoryId: 'transportation', categoryName: 'Transportation', categoryNameAr: 'المواصلات' },
    { categoryId: 'health', categoryName: 'Health & Fitness', categoryNameAr: 'الصحة واللياقة' },
    { categoryId: 'subscriptions', categoryName: 'Subscriptions', categoryNameAr: 'الاشتراكات' },
    { categoryId: 'other', categoryName: 'Other', categoryNameAr: 'أخرى' },
];

const sessionSpendingCache = new Map();

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, decimals = 1) {
    const value = Math.random() * (max - min) + min;
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

function generateRandomSpendingBreakdown() {
    const profiles = ['high_dining', 'shopaholic', 'balanced', 'frugal'];
    const profile = profiles[Math.floor(Math.random() * profiles.length)];

    const rawAmounts = [];
    switch (profile) {
        case 'high_dining':
            rawAmounts.push(randomInt(4500, 7000), randomInt(800, 2000), randomInt(1200, 2000),
                randomInt(300, 800), randomInt(400, 1000), randomInt(200, 600), randomInt(150, 400), randomInt(100, 300));
            break;
        case 'shopaholic':
            rawAmounts.push(randomInt(800, 2000), randomInt(5000, 9000), randomInt(1000, 1800),
                randomInt(500, 1200), randomInt(300, 800), randomInt(100, 400), randomInt(200, 500), randomInt(100, 400));
            break;
        case 'frugal':
            rawAmounts.push(randomInt(300, 800), randomInt(200, 600), randomInt(600, 1200),
                randomInt(100, 400), randomInt(200, 500), randomInt(100, 300), randomInt(50, 200), randomInt(50, 150));
            break;
        default:
            rawAmounts.push(randomInt(1500, 3000), randomInt(1200, 2800), randomInt(1000, 2200),
                randomInt(800, 1800), randomInt(600, 1400), randomInt(400, 1000), randomInt(200, 600), randomInt(150, 400));
    }

    const totalSpending = rawAmounts.reduce((sum, amt) => sum + amt, 0);
    const breakdown = categoryTemplates.map((template, index) => {
        const amount = rawAmounts[index];
        const percentage = Math.round((amount / totalSpending) * 1000) / 10;
        const change = randomFloat(-20, 40, 0);
        const transactionCount = Math.max(2, Math.round(amount / randomInt(80, 150)));
        return { ...template, amount, percentage, transactionCount, change };
    });

    breakdown.sort((a, b) => b.amount - a.amount);
    return { breakdown, totalSpending };
}

// ============ USER PROFILE GENERATOR ============

const sessionProfileCache = new Map();

function generateRandomUserProfile() {
    const employmentTypes = ['government', 'private', 'private', 'self_employed', 'retired'];
    const employmentType = employmentTypes[Math.floor(Math.random() * employmentTypes.length)];
    const isEmployed = !['retired', 'unemployed'].includes(employmentType);

    const age = employmentType === 'retired' ? randomInt(55, 70) : randomInt(23, 58);
    let monthlySalary;
    if (employmentType === 'retired') monthlySalary = randomInt(3000, 15000);
    else if (employmentType === 'government') monthlySalary = randomInt(8000, 35000);
    else monthlySalary = randomInt(4000, 45000);

    const nationalities = ['saudi', 'saudi', 'saudi', 'gcc', 'expat'];
    const creditScores = ['excellent', 'good', 'good', 'fair'];

    return {
        age,
        nationality: nationalities[Math.floor(Math.random() * nationalities.length)],
        isEmployed,
        employmentType,
        monthlySalary,
        employmentDurationMonths: isEmployed ? randomInt(3, 180) : 0,
        salaryTransferredToBank: isEmployed && Math.random() > 0.3,
        accountAgeMonths: randomInt(1, 120),
        hasSavingsAccount: Math.random() > 0.4,
        hasCurrentAccount: true,
        averageMonthlyBalance: randomInt(5000, 50000),
        creditScore: creditScores[Math.floor(Math.random() * creditScores.length)],
        hasExistingLoans: isEmployed && Math.random() > 0.5,
        existingLoanAmount: Math.random() > 0.5 ? randomInt(10000, 500000) : 0,
        debtToIncomeRatio: randomFloat(0, 0.65),
        savingsRate: randomFloat(0, 0.4),
    };
}

function generateEligibilitySummary(profile) {
    const summary = [];
    if (profile.monthlySalary >= 15000) summary.push('High income tier - eligible for premium products');
    else if (profile.monthlySalary >= 8000) summary.push('Mid income tier - eligible for most products');
    else if (profile.monthlySalary >= 5000) summary.push('Standard income tier - eligible for basic products');
    else summary.push('Entry income tier - limited products');

    if (profile.isEmployed && profile.employmentDurationMonths >= 6) summary.push('Stable employment - meets requirement');
    if (profile.creditScore === 'excellent' || profile.creditScore === 'good')
        summary.push(`${profile.creditScore} credit score - strong approval likelihood`);

    return summary;
}

// ============ HTTP SERVER ============

function parseBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch {
                resolve({});
            }
        });
    });
}

function sendJson(res, data, status = 200) {
    res.writeHead(status, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': '*',
    });
    res.end(JSON.stringify(data));
}

function proxyToSTT(req, res) {
    const parsedUrl = new URL(STT_SERVER + req.url);
    const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname + parsedUrl.search,
        method: req.method,
        headers: { ...req.headers, host: parsedUrl.host },
    };

    const proxyReq = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
        console.error(`[STT Proxy Error] ${err.message}`);
        sendJson(res, { error: 'STT Server Error', message: err.message }, 502);
    });

    req.pipe(proxyReq);
}

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const path = url.pathname;
    const method = req.method;

    // CORS preflight
    if (method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': '*',
        });
        res.end();
        return;
    }

    console.log(`[API] ${method} ${path}`);

    // Proxy STT requests to MLX-Whisper server
    if (path.startsWith('/v1/audio')) {
        return proxyToSTT(req, res);
    }

    // Health check
    if (path === '/health') {
        return sendJson(res, { status: 'ok', stt: STT_SERVER, timestamp: new Date().toISOString() });
    }

    // API Routes
    if (path === '/api/accounts' && method === 'GET') {
        return sendJson(res, { accounts: mockAccounts });
    }

    if (path === '/api/beneficiaries') {
        if (method === 'GET') {
            const type = url.searchParams.get('type');
            let filtered = mockBeneficiaries;
            if (type === 'national' || type === 'international') {
                filtered = mockBeneficiaries.filter(b => b.type === type);
            }
            return sendJson(res, { beneficiaries: filtered });
        }
        if (method === 'POST') {
            const body = await parseBody(req);
            const newBen = {
                id: `ben-${Date.now()}`,
                name: body.name,
                nameAr: body.nameAr || body.name,
                ...body,
                createdAt: new Date().toISOString(),
            };
            mockBeneficiaries.push(newBen);
            return sendJson(res, { beneficiary: newBen, message: 'Beneficiary added' }, 201);
        }
    }

    if (path === '/api/products' && method === 'GET') {
        const category = url.searchParams.get('category') || 'all';
        let filtered = mockProducts;
        if (category !== 'all') {
            filtered = mockProducts.filter(p => p.category === category);
        }
        return sendJson(res, {
            products: filtered,
            totalCount: filtered.length,
            categories: {
                lending: mockProducts.filter(p => p.category === 'lending').length,
                saving: mockProducts.filter(p => p.category === 'saving').length,
                credit_card: mockProducts.filter(p => p.category === 'credit_card').length,
            }
        });
    }

    if (path === '/api/exchange-rates' && method === 'GET') {
        return sendJson(res, mockExchangeRates);
    }

    if (path === '/api/spending/breakdown' && method === 'GET') {
        const sessionId = url.searchParams.get('sessionId') || 'default';
        let data = sessionSpendingCache.get(sessionId);
        if (!data) {
            data = generateRandomSpendingBreakdown();
            sessionSpendingCache.set(sessionId, data);
        }
        return sendJson(res, {
            period: url.searchParams.get('period') || 'current_month',
            breakdown: data.breakdown,
            totalSpending: data.totalSpending,
            currency: 'SAR',
        });
    }

    if (path === '/api/user/profile' && method === 'GET') {
        const sessionId = url.searchParams.get('sessionId') || 'default';
        let data = sessionProfileCache.get(sessionId);
        if (!data) {
            const profile = generateRandomUserProfile();
            data = { profile, eligibilitySummary: generateEligibilitySummary(profile) };
            sessionProfileCache.set(sessionId, data);
        }
        return sendJson(res, data);
    }

    // Bills API
    if (path === '/api/bills' && method === 'GET') {
        const status = url.searchParams.get('status');
        const type = url.searchParams.get('type');

        let filtered = mockBills;

        // Filter by status
        if (status && status !== 'all') {
            filtered = filtered.filter(bill => bill.status === status);
        }

        // Filter by type
        if (type) {
            filtered = filtered.filter(bill => bill.type === type);
        }

        // Calculate total amount
        const totalAmount = filtered.reduce((sum, bill) => sum + bill.amount, 0);

        return sendJson(res, {
            bills: filtered,
            count: filtered.length,
            totalAmount,
            currency: 'SAR',
        });
    }

    // Bills by ID
    if (path.startsWith('/api/bills/') && path.includes('/pay') && method === 'POST') {
        const billId = path.split('/')[3];
        const bill = mockBills.find(b => b.id === billId);

        if (!bill) {
            return sendJson(res, { error: 'Bill not found' }, 404);
        }

        // Simulate payment
        bill.status = 'paid';

        return sendJson(res, {
            success: true,
            message: 'Bill paid successfully',
            bill,
            reference: `BP-${Date.now()}`,
        });
    }

    // Transfers API
    if (path === '/api/transfers') {
        if (method === 'GET') {
            const limit = parseInt(url.searchParams.get('limit') || '10');
            const status = url.searchParams.get('status');

            let filtered = mockTransfers;
            if (status && status !== 'all') {
                filtered = mockTransfers.filter(t => t.status === status);
            }

            return sendJson(res, {
                transfers: filtered.slice(0, limit),
                total: filtered.length,
            });
        }

        if (method === 'POST') {
            const body = await parseBody(req);

            // Validate account exists
            const account = mockAccounts.find(a => a.id === body.fromAccountId);
            if (!account) {
                return sendJson(res, { error: 'Account not found' }, 404);
            }

            // Validate beneficiary exists
            const beneficiary = mockBeneficiaries.find(b => b.id === body.beneficiaryId);
            if (!beneficiary) {
                return sendJson(res, { error: 'Beneficiary not found' }, 404);
            }

            // Check sufficient balance
            if (account.balance < body.amount) {
                return sendJson(res, { error: 'Insufficient balance' }, 400);
            }

            const newTransfer = {
                id: `txn-${Date.now()}`,
                fromAccountId: body.fromAccountId,
                beneficiaryId: body.beneficiaryId,
                amount: body.amount,
                currency: body.currency || 'SAR',
                convertedAmount: body.convertedAmount,
                exchangeRate: body.exchangeRate,
                purpose: body.purpose || 'other',
                reference: body.reference,
                type: body.type || 'national',
                status: 'pending',
                createdAt: new Date().toISOString(),
            };

            // Store as pending (requires OTP confirmation)
            pendingTransfers.set(newTransfer.id, newTransfer);

            return sendJson(res, {
                transfer: newTransfer,
                fromAccountName: account.name,
                beneficiaryName: beneficiary.name,
                transferType: beneficiary.type,
                requiresOtp: true,
                message: 'Transfer created. Please confirm with OTP.',
            }, 201);
        }
    }

    // Transfer confirm
    if (path.startsWith('/api/transfers/') && path.includes('/confirm') && method === 'POST') {
        const transferId = path.split('/')[3];
        const transfer = pendingTransfers.get(transferId);

        if (!transfer) {
            return sendJson(res, { error: 'Transfer not found or already processed' }, 404);
        }

        // Complete the transfer
        transfer.status = 'completed';
        transfer.completedAt = new Date().toISOString();
        mockTransfers.push(transfer);
        pendingTransfers.delete(transferId);

        return sendJson(res, {
            success: true,
            transfer,
            message: 'Transfer completed successfully',
        });
    }

    // Cards API
    if (path === '/api/cards' && method === 'GET') {
        const type = url.searchParams.get('type');
        let filtered = mockCards;

        if (type) {
            filtered = mockCards.filter(card => card.type === type);
        }

        return sendJson(res, {
            cards: filtered,
            count: filtered.length,
        });
    }

    // Subscriptions API
    if (path === '/api/subscriptions' && method === 'GET') {
        const active = url.searchParams.get('active');
        let filtered = mockSubscriptions;

        if (active === 'true') {
            filtered = mockSubscriptions.filter(sub => sub.isActive);
        } else if (active === 'false') {
            filtered = mockSubscriptions.filter(sub => !sub.isActive);
        }

        const monthlyTotal = filtered
            .filter(sub => sub.frequency === 'monthly' && sub.isActive)
            .reduce((sum, sub) => sum + sub.amount, 0);

        return sendJson(res, {
            subscriptions: filtered,
            count: filtered.length,
            monthlyTotal,
            currency: 'SAR',
        });
    }

    // 404
    sendJson(res, { error: 'Not Found', path }, 404);
});

server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║          AI Assistant Mock API Server                      ║
╠════════════════════════════════════════════════════════════╣
║  API Server:    http://localhost:${PORT}                       ║
║  STT Proxy:     -> ${STT_SERVER}                      ║
╠════════════════════════════════════════════════════════════╣
║  Endpoints:                                                ║
║   GET  /api/accounts         - User accounts               ║
║   GET  /api/beneficiaries    - Payment beneficiaries       ║
║   POST /api/beneficiaries    - Add new beneficiary         ║
║   GET  /api/bills            - User bills                  ║
║   POST /api/bills/:id/pay    - Pay a bill                  ║
║   GET  /api/transfers        - Transfer history            ║
║   POST /api/transfers        - Create new transfer         ║
║   POST /api/transfers/:id/confirm - Confirm transfer       ║
║   GET  /api/cards            - User cards                  ║
║   GET  /api/subscriptions    - User subscriptions          ║
║   GET  /api/products         - Bank products catalog       ║
║   GET  /api/exchange-rates   - Currency exchange rates     ║
║   GET  /api/spending/breakdown - Spending analytics        ║
║   GET  /api/user/profile     - User profile data           ║
║   POST /v1/audio/*           - Proxied to STT server       ║
║   GET  /health               - Health check                ║
╚════════════════════════════════════════════════════════════╝
`);
});
