import {
    SpendingCategory,
    SpendingBreakdown,
    MerchantSpending,
} from '../types';

export const spendingCategories: SpendingCategory[] = [
    {
        id: 'cat-001',
        name: 'Groceries',
        nameAr: 'البقالة',
        icon: 'shopping-cart',
        color: '#10B981',
    },
    {
        id: 'cat-002',
        name: 'Dining',
        nameAr: 'المطاعم',
        icon: 'utensils',
        color: '#F59E0B',
    },
    {
        id: 'cat-003',
        name: 'Transportation',
        nameAr: 'المواصلات',
        icon: 'car',
        color: '#3B82F6',
    },
    {
        id: 'cat-004',
        name: 'Entertainment',
        nameAr: 'الترفيه',
        icon: 'film',
        color: '#8B5CF6',
    },
    {
        id: 'cat-005',
        name: 'Shopping',
        nameAr: 'التسوق',
        icon: 'shopping-bag',
        color: '#EC4899',
    },
    {
        id: 'cat-006',
        name: 'Health',
        nameAr: 'الصحة',
        icon: 'heart',
        color: '#EF4444',
    },
    {
        id: 'cat-007',
        name: 'Bills & Utilities',
        nameAr: 'الفواتير والخدمات',
        icon: 'receipt',
        color: '#6366F1',
    },
    {
        id: 'cat-008',
        name: 'Education',
        nameAr: 'التعليم',
        icon: 'book',
        color: '#14B8A6',
    },
    {
        id: 'cat-009',
        name: 'Travel',
        nameAr: 'السفر',
        icon: 'plane',
        color: '#06B6D4',
    },
    {
        id: 'cat-010',
        name: 'Other',
        nameAr: 'أخرى',
        icon: 'more-horizontal',
        color: '#64748B',
    },
];

export const mockSpendingBreakdown: SpendingBreakdown[] = [
    {
        categoryId: 'dining',
        categoryName: 'Dining & Restaurants',
        categoryNameAr: 'المطاعم والمقاهي',
        amount: 2850.0,
        percentage: 28.5,
        transactionCount: 24,
        change: 22.0,
    },
    {
        categoryId: 'shopping',
        categoryName: 'Shopping',
        categoryNameAr: 'التسوق',
        amount: 1900.0,
        percentage: 19.0,
        transactionCount: 12,
        change: 45.0,
    },
    {
        categoryId: 'groceries',
        categoryName: 'Groceries',
        categoryNameAr: 'البقالة',
        amount: 1650.0,
        percentage: 16.5,
        transactionCount: 18,
        change: -5.0,
    },
    {
        categoryId: 'entertainment',
        categoryName: 'Entertainment',
        categoryNameAr: 'الترفيه',
        amount: 1200.0,
        percentage: 12.0,
        transactionCount: 8,
        change: 15.0,
    },
    {
        categoryId: 'transportation',
        categoryName: 'Transportation',
        categoryNameAr: 'المواصلات',
        amount: 980.0,
        percentage: 9.8,
        transactionCount: 32,
        change: -2.0,
    },
    {
        categoryId: 'health',
        categoryName: 'Health & Fitness',
        categoryNameAr: 'الصحة واللياقة',
        amount: 750.0,
        percentage: 7.5,
        transactionCount: 6,
        change: 8.0,
    },
    {
        categoryId: 'subscriptions',
        categoryName: 'Subscriptions',
        categoryNameAr: 'الاشتراكات',
        amount: 450.0,
        percentage: 4.5,
        transactionCount: 4,
        change: 0.0,
    },
    {
        categoryId: 'other',
        categoryName: 'Other',
        categoryNameAr: 'أخرى',
        amount: 220.0,
        percentage: 2.2,
        transactionCount: 5,
        change: -10.0,
    },
];

export const mockMerchantSpending: MerchantSpending[] = [
    {
        merchantName: 'Starbucks',
        merchantNameAr: 'ستاربكس',
        category: 'dining',
        totalAmount: 680.0,
        transactionCount: 12,
        lastTransaction: '2024-12-24T14:30:00Z',
    },
    {
        merchantName: 'Panda',
        merchantNameAr: 'بنده',
        category: 'groceries',
        totalAmount: 1120.0,
        transactionCount: 8,
        lastTransaction: '2024-12-23T18:45:00Z',
    },
    {
        merchantName: 'Amazon',
        merchantNameAr: 'أمازون',
        category: 'shopping',
        totalAmount: 850.0,
        transactionCount: 5,
        lastTransaction: '2024-12-22T10:20:00Z',
    },
    {
        merchantName: 'Al Baik',
        merchantNameAr: 'البيك',
        category: 'dining',
        totalAmount: 420.0,
        transactionCount: 8,
        lastTransaction: '2024-12-24T20:15:00Z',
    },
    {
        merchantName: 'Uber',
        merchantNameAr: 'أوبر',
        category: 'transportation',
        totalAmount: 580.0,
        transactionCount: 18,
        lastTransaction: '2024-12-24T09:30:00Z',
    },
];

// Base categories for generating random spending breakdowns
const spendingCategoryTemplates = [
    { categoryId: 'dining', categoryName: 'Dining & Restaurants', categoryNameAr: 'المطاعم والمقاهي' },
    { categoryId: 'shopping', categoryName: 'Shopping', categoryNameAr: 'التسوق' },
    { categoryId: 'groceries', categoryName: 'Groceries', categoryNameAr: 'البقالة' },
    { categoryId: 'entertainment', categoryName: 'Entertainment', categoryNameAr: 'الترفيه' },
    { categoryId: 'transportation', categoryName: 'Transportation', categoryNameAr: 'المواصلات' },
    { categoryId: 'health', categoryName: 'Health & Fitness', categoryNameAr: 'الصحة واللياقة' },
    { categoryId: 'subscriptions', categoryName: 'Subscriptions', categoryNameAr: 'الاشتراكات' },
    { categoryId: 'other', categoryName: 'Other', categoryNameAr: 'أخرى' },
];

// Generate randomized spending breakdown data for each request (matching web behavior)
export function generateRandomSpendingBreakdown(): SpendingBreakdown[] {
    // Generate random total between 7000 and 15000
    const totalSpending = Math.floor(Math.random() * 8000) + 7000;

    // Shuffle categories and assign random percentages
    const shuffled = [...spendingCategoryTemplates].sort(() => Math.random() - 0.5);

    // Generate percentages that sum to ~100%
    let remainingPercent = 100;
    const percentages: number[] = [];

    for (let i = 0; i < shuffled.length - 1; i++) {
        // Give higher percentages to first few categories
        const maxPercent = Math.min(remainingPercent - (shuffled.length - i - 1), remainingPercent * 0.5);
        const minPercent = Math.max(3, remainingPercent * 0.05);
        const percent = Math.floor(Math.random() * (maxPercent - minPercent) + minPercent);
        percentages.push(percent);
        remainingPercent -= percent;
    }
    percentages.push(remainingPercent);

    // Sort percentages descending
    percentages.sort((a, b) => b - a);

    // Build the breakdown
    return shuffled.map((template, index) => {
        const percentage = percentages[index];
        const amount = Math.round((percentage / 100) * totalSpending);
        const transactionCount = Math.floor(Math.random() * 30) + 3;
        const change = Math.floor(Math.random() * 60) - 20; // -20 to +40

        return {
            categoryId: template.categoryId,
            categoryName: template.categoryName,
            categoryNameAr: template.categoryNameAr,
            amount,
            percentage,
            transactionCount,
            change,
        };
    }).sort((a, b) => b.percentage - a.percentage); // Sort by percentage descending
}
