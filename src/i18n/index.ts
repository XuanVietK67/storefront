import { createI18n } from 'vue-i18n'
import en from './locales/en'
import vi from './locales/vi'
import ja from './locales/ja'
import zh from './locales/zh'
import ko from './locales/ko'

const STORAGE_KEY = 'custommaker_locale'

function getSavedLocale(): string {
  try { return localStorage.getItem(STORAGE_KEY) || 'en' } catch { return 'en' }
}

export const i18n = createI18n({
  legacy: false,
  locale: getSavedLocale(),
  fallbackLocale: 'en',
  messages: { en, vi, ja, zh, ko },
})

export function setLocale(locale: string): void {
  (i18n.global.locale as any).value = locale
  try { localStorage.setItem(STORAGE_KEY, locale) } catch { /* ignore */ }
  document.documentElement.lang = locale
}

export const LOCALES = [
  { code: 'en', flag: '🇺🇸' },
  { code: 'vi', flag: '🇻🇳' },
  { code: 'ja', flag: '🇯🇵' },
  { code: 'zh', flag: '🇨🇳' },
  { code: 'ko', flag: '🇰🇷' },
]
