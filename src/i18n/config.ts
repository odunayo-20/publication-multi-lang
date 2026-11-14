export const locales = ['en', 'hr'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  hr: 'Hrvatski',
}

export const isLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value)
