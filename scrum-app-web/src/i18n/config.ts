export const locales = ['pt-BR', 'en-US'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en-US';
