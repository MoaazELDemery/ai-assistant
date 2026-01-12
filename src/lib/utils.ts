export function formatCurrency(
    amount: number,
    currency: string = 'SAR',
    locale: 'en' | 'ar' = 'en'
): string {
    // Use consistent locale codes
    const localeCode = locale === 'ar' ? 'ar-SA' : 'en-US';

    try {
        return new Intl.NumberFormat(localeCode, {
            style: 'currency',
            currency,
            minimumFractionDigits: 2,
        }).format(amount);
    } catch (e) {
        return `${currency} ${amount.toFixed(2)}`;
    }
}

export function formatDate(
    date: string | Date,
    locale: 'en' | 'ar' = 'en'
): string {
    const localeCode = locale === 'ar' ? 'ar-SA' : 'en-US';
    try {
        return new Intl.DateTimeFormat(localeCode, {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }).format(new Date(date));
    } catch (e) {
        return new Date(date).toLocaleDateString();
    }
}
