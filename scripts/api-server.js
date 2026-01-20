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
║   GET  /api/products         - Bank products catalog       ║
║   GET  /api/exchange-rates   - Currency exchange rates     ║
║   GET  /api/spending/breakdown - Spending analytics        ║
║   GET  /api/user/profile     - User profile data           ║
║   POST /v1/audio/*           - Proxied to STT server       ║
║   GET  /health               - Health check                ║
╚════════════════════════════════════════════════════════════╝
`);
});
