import { Account } from '../types';

export const mockAccounts: Account[] = [
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
