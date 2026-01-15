// Product recommendations database - 25 products matching web app
export const productRecommendations = [
    {
        id: 'prod-001',
        title: 'Salary-Linked Savings',
        titleAr: 'ادخار مرتبط بالراتب',
        description: 'Automates savings from your salary to keep your budget on track despite rising expenses.',
        descriptionAr: 'يؤتمت الادخار من راتبك للحفاظ على ميزانيتك رغم ارتفاع النفقات.',
        ctaQuestion: 'Would you like to set this up?',
        ctaQuestionAr: 'هل تود إعداد هذا؟',
        features: ['Save before you spend', 'Salary must be transferred to STC Bank account'],
        featuresAr: ['ادخر قبل أن تنفق', 'يجب تحويل الراتب إلى حساب stc bank'],
        badges: [
            { text: 'Special Offer', textAr: 'عرض خاص', variant: 'special' as const },
            { text: 'Savings', textAr: 'ادخار', variant: 'category' as const }
        ],
        icon: 'savings' as const,
        targetConditions: ['high_spending', 'low_savings_rate'],
    },
    {
        id: 'prod-002',
        title: 'Automatic Savings Plan',
        titleAr: 'خطة ادخار تلقائية',
        description: 'A flexible way to build savings gradually without thinking about it.',
        descriptionAr: 'طريقة مرنة لبناء المدخرات تدريجياً دون التفكير فيها.',
        ctaQuestion: 'View details?',
        ctaQuestionAr: 'عرض التفاصيل؟',
        features: ['Automatic monthly transfers', 'Available for all account holders'],
        featuresAr: ['تحويلات شهرية تلقائية', 'متاح لجميع أصحاب الحسابات'],
        badges: [
            { text: 'Savings', textAr: 'ادخار', variant: 'category' as const }
        ],
        icon: 'piggybank' as const,
        targetConditions: ['all'],
    },
    {
        id: 'prod-003',
        title: 'Goal-Based Savings',
        titleAr: 'ادخار قائم على الأهداف',
        description: "Perfect if you're saving for a specific purchase or vacation.",
        descriptionAr: 'مثالي إذا كنت تدخر لشراء محدد أو إجازة.',
        ctaQuestion: 'Set a goal?',
        ctaQuestionAr: 'حدد هدفاً؟',
        features: ['Track progress towards your goal', 'Set your goal and we will help you achieve it'],
        featuresAr: ['تتبع التقدم نحو هدفك', 'حدد هدفك وسنساعدك على تحقيقه'],
        badges: [
            { text: 'Savings', textAr: 'ادخار', variant: 'category' as const }
        ],
        icon: 'target' as const,
        targetConditions: ['all'],
    },
    {
        id: 'prod-004',
        title: 'Premium Cashback Card',
        titleAr: 'بطاقة استرداد نقدي مميزة',
        description: 'Earn 2% back on your high dining and shopping expenses.',
        descriptionAr: 'احصل على 2% استرداد من نفقات المطاعم والتسوق العالية.',
        ctaQuestion: 'Would you like to apply?',
        ctaQuestionAr: 'هل تود التقديم؟',
        features: ['2% cashback on all purchases', 'Subject to credit approval'],
        featuresAr: ['2% استرداد على جميع المشتريات', 'خاضع للموافقة الائتمانية'],
        badges: [
            { text: 'Special Offer', textAr: 'عرض خاص', variant: 'special' as const },
            { text: 'Credit Card', textAr: 'بطاقة ائتمان', variant: 'category' as const }
        ],
        icon: 'creditcard' as const,
        targetConditions: ['high_spending'],
    },
    {
        id: 'prod-005',
        title: 'Travel Rewards Card',
        titleAr: 'بطاقة مكافآت السفر',
        description: 'Earn miles on every purchase and redeem for free flights.',
        descriptionAr: 'اكسب أميالاً على كل عملية شراء واستبدلها برحلات مجانية.',
        ctaQuestion: 'Start earning miles?',
        ctaQuestionAr: 'ابدأ بكسب الأميال؟',
        features: ['1.5 miles per SAR spent', 'No annual fee first year'],
        featuresAr: ['1.5 ميل لكل ريال', 'بدون رسوم سنوية للسنة الأولى'],
        badges: [
            { text: 'Credit Card', textAr: 'بطاقة ائتمان', variant: 'category' as const }
        ],
        icon: 'creditcard' as const,
        targetConditions: ['international_transfers'],
    },
    {
        id: 'prod-006',
        title: 'Emergency Fund Builder',
        titleAr: 'بناء صندوق الطوارئ',
        description: 'Build a 3-6 month emergency fund automatically.',
        descriptionAr: 'ابنِ صندوق طوارئ لمدة 3-6 أشهر تلقائياً.',
        ctaQuestion: 'Start building today?',
        ctaQuestionAr: 'ابدأ البناء اليوم؟',
        features: ['Automated weekly deposits', 'Easy withdrawal when needed'],
        featuresAr: ['إيداعات أسبوعية تلقائية', 'سحب سهل عند الحاجة'],
        badges: [
            { text: 'Savings', textAr: 'ادخار', variant: 'category' as const }
        ],
        icon: 'piggybank' as const,
        targetConditions: ['low_savings'],
    },
    {
        id: 'prod-007',
        title: 'Personal Loan',
        titleAr: 'قرض شخصي',
        description: 'Competitive rates for your personal financing needs.',
        descriptionAr: 'معدلات تنافسية لاحتياجاتك التمويلية الشخصية.',
        ctaQuestion: 'Check your eligibility?',
        ctaQuestionAr: 'تحقق من أهليتك؟',
        features: ['Up to 500,000 SAR', 'Flexible repayment terms'],
        featuresAr: ['حتى 500,000 ريال', 'شروط سداد مرنة'],
        badges: [
            { text: 'Financing', textAr: 'تمويل', variant: 'category' as const }
        ],
        icon: 'trending' as const,
        targetConditions: ['all'],
    },
    {
        id: 'prod-008',
        title: 'Bill Payment Autopay',
        titleAr: 'دفع الفواتير التلقائي',
        description: 'Never miss a bill payment again with automatic scheduling.',
        descriptionAr: 'لا تفوت أي فاتورة مرة أخرى مع الجدولة التلقائية.',
        ctaQuestion: 'Set up autopay?',
        ctaQuestionAr: 'إعداد الدفع التلقائي؟',
        features: ['Automatic payments on due date', 'SMS reminders before payment'],
        featuresAr: ['دفع تلقائي في تاريخ الاستحقاق', 'تذكيرات SMS قبل الدفع'],
        badges: [
            { text: 'Bills', textAr: 'فواتير', variant: 'category' as const }
        ],
        icon: 'target' as const,
        targetConditions: ['has_bills'],
    },
    {
        id: 'prod-009',
        title: 'Investment Portfolio',
        titleAr: 'محفظة استثمارية',
        description: 'Grow your wealth with professionally managed investments.',
        descriptionAr: 'نمِّ ثروتك باستثمارات تديرها فرق محترفة.',
        ctaQuestion: 'Explore options?',
        ctaQuestionAr: 'استكشف الخيارات؟',
        features: ['Diversified portfolio', 'Low management fees'],
        featuresAr: ['محفظة متنوعة', 'رسوم إدارة منخفضة'],
        badges: [
            { text: 'Investment', textAr: 'استثمار', variant: 'category' as const }
        ],
        icon: 'trending' as const,
        targetConditions: ['high_balance'],
    },
    {
        id: 'prod-010',
        title: 'International Transfer Plus',
        titleAr: 'التحويل الدولي بلس',
        description: 'Better rates on international transfers with reduced fees.',
        descriptionAr: 'أسعار أفضل للتحويلات الدولية مع رسوم مخفضة.',
        ctaQuestion: 'Upgrade now?',
        ctaQuestionAr: 'ترقية الآن؟',
        features: ['50% off transfer fees', 'Priority processing'],
        featuresAr: ['خصم 50% على رسوم التحويل', 'معالجة ذات أولوية'],
        badges: [
            { text: 'Special Offer', textAr: 'عرض خاص', variant: 'special' as const },
            { text: 'Transfers', textAr: 'تحويلات', variant: 'category' as const }
        ],
        icon: 'trending' as const,
        targetConditions: ['international_transfers'],
    },
    {
        id: 'prod-011',
        title: 'Digital Wallet Protection',
        titleAr: 'حماية المحفظة الرقمية',
        description: 'Enhanced security for your digital transactions.',
        descriptionAr: 'أمان معزز لمعاملاتك الرقمية.',
        ctaQuestion: 'Enable protection?',
        ctaQuestionAr: 'تفعيل الحماية؟',
        features: ['Fraud monitoring 24/7', 'Instant transaction alerts'],
        featuresAr: ['مراقبة الاحتيال على مدار الساعة', 'تنبيهات فورية للمعاملات'],
        badges: [
            { text: 'Security', textAr: 'أمان', variant: 'category' as const }
        ],
        icon: 'target' as const,
        targetConditions: ['all'],
    },
    {
        id: 'prod-012',
        title: 'Subscription Manager',
        titleAr: 'مدير الاشتراكات',
        description: 'Track and manage all your recurring subscriptions in one place.',
        descriptionAr: 'تتبع وإدارة جميع اشتراكاتك المتكررة في مكان واحد.',
        ctaQuestion: 'Start managing?',
        ctaQuestionAr: 'ابدأ الإدارة؟',
        features: ['View all subscriptions', 'Cancel with one tap'],
        featuresAr: ['عرض جميع الاشتراكات', 'إلغاء بنقرة واحدة'],
        badges: [
            { text: 'Tools', textAr: 'أدوات', variant: 'category' as const }
        ],
        icon: 'target' as const,
        targetConditions: ['has_subscriptions'],
    },
    {
        id: 'prod-013',
        title: 'Home Financing',
        titleAr: 'تمويل عقاري',
        description: 'Make your dream home a reality with competitive rates.',
        descriptionAr: 'حقق حلم منزلك بمعدلات تنافسية.',
        ctaQuestion: 'Calculate your eligibility?',
        ctaQuestionAr: 'احسب أهليتك؟',
        features: ['Up to 90% financing', 'Up to 25 years tenure'],
        featuresAr: ['تمويل حتى 90%', 'مدة حتى 25 سنة'],
        badges: [
            { text: 'Financing', textAr: 'تمويل', variant: 'category' as const }
        ],
        icon: 'trending' as const,
        targetConditions: ['high_balance'],
    },
    {
        id: 'prod-014',
        title: 'Car Financing',
        titleAr: 'تمويل السيارات',
        description: 'Drive your dream car with easy monthly payments.',
        descriptionAr: 'قُد سيارة أحلامك بأقساط شهرية ميسرة.',
        ctaQuestion: 'Get pre-approved?',
        ctaQuestionAr: 'احصل على موافقة مبدئية؟',
        features: ['Competitive rates', 'Quick approval'],
        featuresAr: ['معدلات تنافسية', 'موافقة سريعة'],
        badges: [
            { text: 'Financing', textAr: 'تمويل', variant: 'category' as const }
        ],
        icon: 'trending' as const,
        targetConditions: ['all'],
    },
    {
        id: 'prod-015',
        title: 'Education Savings',
        titleAr: 'ادخار التعليم',
        description: "Prepare for your children's education with dedicated savings.",
        descriptionAr: 'استعد لتعليم أطفالك بمدخرات مخصصة.',
        ctaQuestion: 'Start planning?',
        ctaQuestionAr: 'ابدأ التخطيط؟',
        features: ['Tax-advantaged savings', 'Flexible contribution options'],
        featuresAr: ['مدخرات معفاة من الضرائب', 'خيارات مساهمة مرنة'],
        badges: [
            { text: 'Savings', textAr: 'ادخار', variant: 'category' as const }
        ],
        icon: 'target' as const,
        targetConditions: ['all'],
    },
    {
        id: 'prod-016',
        title: 'Retirement Planning',
        titleAr: 'تخطيط التقاعد',
        description: 'Secure your future with long-term retirement savings.',
        descriptionAr: 'أمّن مستقبلك بمدخرات تقاعد طويلة الأجل.',
        ctaQuestion: 'Plan for retirement?',
        ctaQuestionAr: 'خطط للتقاعد؟',
        features: ['Employer matching available', 'Tax benefits'],
        featuresAr: ['مطابقة صاحب العمل متاحة', 'مزايا ضريبية'],
        badges: [
            { text: 'Savings', textAr: 'ادخار', variant: 'category' as const }
        ],
        icon: 'piggybank' as const,
        targetConditions: ['high_balance'],
    },
    {
        id: 'prod-017',
        title: 'Business Account',
        titleAr: 'حساب تجاري',
        description: 'Manage your business finances efficiently.',
        descriptionAr: 'أدر شؤونك المالية التجارية بكفاءة.',
        ctaQuestion: 'Open business account?',
        ctaQuestionAr: 'افتح حساباً تجارياً؟',
        features: ['Dedicated business support', 'Integration with accounting software'],
        featuresAr: ['دعم تجاري مخصص', 'تكامل مع برامج المحاسبة'],
        badges: [
            { text: 'Business', textAr: 'أعمال', variant: 'category' as const }
        ],
        icon: 'trending' as const,
        targetConditions: ['high_balance'],
    },
    {
        id: 'prod-018',
        title: 'Spending Insights Pro',
        titleAr: 'تحليل الإنفاق المتقدم',
        description: 'Advanced analytics to understand and optimize your spending.',
        descriptionAr: 'تحليلات متقدمة لفهم إنفاقك وتحسينه.',
        ctaQuestion: 'Upgrade to Pro?',
        ctaQuestionAr: 'ترقية إلى برو؟',
        features: ['Category breakdown', 'Budget recommendations'],
        featuresAr: ['تفصيل حسب الفئة', 'توصيات الميزانية'],
        badges: [
            { text: 'Tools', textAr: 'أدوات', variant: 'category' as const }
        ],
        icon: 'trending' as const,
        targetConditions: ['high_spending'],
    },
    {
        id: 'prod-019',
        title: 'Family Sharing',
        titleAr: 'المشاركة العائلية',
        description: 'Share account access with family members securely.',
        descriptionAr: 'شارك الوصول للحساب مع أفراد العائلة بأمان.',
        ctaQuestion: 'Add family members?',
        ctaQuestionAr: 'أضف أفراد العائلة؟',
        features: ['Up to 5 family members', 'Spending limits per member'],
        featuresAr: ['حتى 5 أفراد من العائلة', 'حدود إنفاق لكل فرد'],
        badges: [
            { text: 'Family', textAr: 'عائلة', variant: 'category' as const }
        ],
        icon: 'target' as const,
        targetConditions: ['all'],
    },
    {
        id: 'prod-020',
        title: 'Virtual Card',
        titleAr: 'بطاقة افتراضية',
        description: 'Create virtual cards for secure online shopping.',
        descriptionAr: 'أنشئ بطاقات افتراضية للتسوق الآمن عبر الإنترنت.',
        ctaQuestion: 'Create virtual card?',
        ctaQuestionAr: 'أنشئ بطاقة افتراضية؟',
        features: ['Instant creation', 'Set spending limits'],
        featuresAr: ['إنشاء فوري', 'حدد حدود الإنفاق'],
        badges: [
            { text: 'Cards', textAr: 'بطاقات', variant: 'category' as const }
        ],
        icon: 'creditcard' as const,
        targetConditions: ['all'],
    },
    {
        id: 'prod-021',
        title: 'Round-Up Savings',
        titleAr: 'ادخار التقريب',
        description: 'Save spare change by rounding up every purchase.',
        descriptionAr: 'ادخر الفكة بتقريب كل عملية شراء.',
        ctaQuestion: 'Start rounding up?',
        ctaQuestionAr: 'ابدأ التقريب؟',
        features: ['Automatic rounding', 'Grows savings effortlessly'],
        featuresAr: ['تقريب تلقائي', 'ينمي المدخرات بسهولة'],
        badges: [
            { text: 'Savings', textAr: 'ادخار', variant: 'category' as const }
        ],
        icon: 'piggybank' as const,
        targetConditions: ['all'],
    },
    {
        id: 'prod-022',
        title: 'Dining Rewards',
        titleAr: 'مكافآت المطاعم',
        description: 'Extra rewards on dining spending at partner restaurants.',
        descriptionAr: 'مكافآت إضافية على الإنفاق في المطاعم الشريكة.',
        ctaQuestion: 'Join rewards program?',
        ctaQuestionAr: 'انضم لبرنامج المكافآت؟',
        features: ['5% back at restaurants', '2000+ partner venues'],
        featuresAr: ['5% استرداد في المطاعم', 'أكثر من 2000 موقع شريك'],
        badges: [
            { text: 'Rewards', textAr: 'مكافآت', variant: 'category' as const }
        ],
        icon: 'creditcard' as const,
        targetConditions: ['high_dining_spending'],
    },
    {
        id: 'prod-023',
        title: 'Currency Exchange Alert',
        titleAr: 'تنبيه أسعار الصرف',
        description: 'Get notified when exchange rates hit your target.',
        descriptionAr: 'احصل على إشعار عند وصول سعر الصرف لهدفك.',
        ctaQuestion: 'Set up alerts?',
        ctaQuestionAr: 'إعداد التنبيهات؟',
        features: ['Custom rate targets', 'Multi-currency support'],
        featuresAr: ['أهداف أسعار مخصصة', 'دعم متعدد العملات'],
        badges: [
            { text: 'Transfers', textAr: 'تحويلات', variant: 'category' as const }
        ],
        icon: 'trending' as const,
        targetConditions: ['international_transfers'],
    },
    {
        id: 'prod-024',
        title: 'Zakat Calculator',
        titleAr: 'حاسبة الزكاة',
        description: 'Calculate and track your annual Zakat obligations.',
        descriptionAr: 'احسب وتتبع التزامات الزكاة السنوية.',
        ctaQuestion: 'Calculate Zakat?',
        ctaQuestionAr: 'احسب الزكاة؟',
        features: ['Automatic calculation', 'Direct donation options'],
        featuresAr: ['حساب تلقائي', 'خيارات تبرع مباشر'],
        badges: [
            { text: 'Islamic', textAr: 'إسلامي', variant: 'category' as const }
        ],
        icon: 'target' as const,
        targetConditions: ['high_balance'],
    },
    {
        id: 'prod-025',
        title: 'Money Request',
        titleAr: 'طلب أموال',
        description: 'Request money from friends and family easily.',
        descriptionAr: 'اطلب أموالاً من الأصدقاء والعائلة بسهولة.',
        ctaQuestion: 'Send a request?',
        ctaQuestionAr: 'أرسل طلباً؟',
        features: ['Send via link or SMS', 'Track pending requests'],
        featuresAr: ['أرسل عبر رابط أو SMS', 'تتبع الطلبات المعلقة'],
        badges: [
            { text: 'Payments', textAr: 'مدفوعات', variant: 'category' as const }
        ],
        icon: 'trending' as const,
        targetConditions: ['all'],
    },
];

// Randomly select N products from the list
export function getRandomRecommendations(count: number = 3): typeof productRecommendations {
    const shuffled = [...productRecommendations].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// Get recommendations based on context (e.g., high spending, low savings)
export function getContextualRecommendations(
    context: {
        highSpending?: boolean;
        lowSavings?: boolean;
        hasInternationalTransfers?: boolean;
        hasBills?: boolean;
        hasSubscriptions?: boolean;
        highBalance?: boolean;
        highDiningSpending?: boolean;
    },
    count: number = 3
): typeof productRecommendations {
    let filtered = productRecommendations;

    // Filter by context conditions
    if (context.highSpending) {
        filtered = filtered.filter(p =>
            p.targetConditions.includes('high_spending') || p.targetConditions.includes('all')
        );
    }
    if (context.highDiningSpending) {
        filtered = filtered.filter(p =>
            p.targetConditions.includes('high_dining_spending') ||
            p.targetConditions.includes('high_spending') ||
            p.targetConditions.includes('all')
        );
    }
    if (context.lowSavings) {
        filtered = filtered.filter(p =>
            p.targetConditions.includes('low_savings') ||
            p.targetConditions.includes('low_savings_rate') ||
            p.targetConditions.includes('all')
        );
    }
    if (context.hasInternationalTransfers) {
        filtered = filtered.filter(p =>
            p.targetConditions.includes('international_transfers') || p.targetConditions.includes('all')
        );
    }
    if (context.hasBills) {
        filtered = filtered.filter(p =>
            p.targetConditions.includes('has_bills') || p.targetConditions.includes('all')
        );
    }
    if (context.hasSubscriptions) {
        filtered = filtered.filter(p =>
            p.targetConditions.includes('has_subscriptions') || p.targetConditions.includes('all')
        );
    }
    if (context.highBalance) {
        filtered = filtered.filter(p =>
            p.targetConditions.includes('high_balance') || p.targetConditions.includes('all')
        );
    }

    // If no specific context matches, use all products
    if (filtered.length < count) {
        filtered = productRecommendations;
    }

    // Shuffle and return
    const shuffled = filtered.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}
