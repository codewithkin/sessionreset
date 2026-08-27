import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import { storage } from './storage';

import en from './translations/en.json';
import es from './translations/es.json';
import hi from './translations/hi.json';
import ar from './translations/ar.json';
import pt from './translations/pt.json';
import ru from './translations/ru.json';
import ja from './translations/ja.json';
import de from './translations/de.json';
import fr from './translations/fr.json';
import ko from './translations/ko.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
  hi: { translation: hi },
  ar: { translation: ar },
  pt: { translation: pt },
  ru: { translation: ru },
  ja: { translation: ja },
  de: { translation: de },
  fr: { translation: fr },
  ko: { translation: ko },
};

/**
 * Shipped locales, in the order the picker lists them.
 *
 * `nativeName` is deliberately written in each language's own script — that is
 * what a speaker scans for. Manrope has no Devanagari, Arabic, CJK or Hangul
 * coverage, so those names fall back to the system face per glyph, which is
 * the correct result rather than a bug to work around.
 */
export const SUPPORTED_LANGUAGES = [
  { code: 'en', nativeName: 'English' },
  { code: 'es', nativeName: 'Español' },
  { code: 'de', nativeName: 'Deutsch' },
  { code: 'fr', nativeName: 'Français' },
  { code: 'pt', nativeName: 'Português' },
  { code: 'ru', nativeName: 'Русский' },
  { code: 'hi', nativeName: 'हिन्दी' },
  { code: 'ar', nativeName: 'العربية' },
  { code: 'ja', nativeName: '日本語' },
  { code: 'ko', nativeName: '한국어' },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

const isSupported = (code: string): code is LanguageCode =>
  SUPPORTED_LANGUAGES.some((l) => l.code === code);

/**
 * An explicit in-app choice wins; otherwise follow the device, but only if we
 * actually ship that language — an unsupported device locale must land on
 * English rather than on i18next's empty-resource state.
 */
function resolveInitialLanguage(): LanguageCode {
  const saved = storage.language.get();
  if (saved && isSupported(saved)) return saved;

  const device = Localization.getLocales()[0]?.languageCode ?? 'en';
  return isSupported(device) ? device : 'en';
}

i18n.use(initReactI18next).init({
  resources,
  lng: resolveInitialLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

/**
 * Switch language and remember it. react-i18next re-renders every component
 * using useTranslation, so the change lands across the app immediately —
 * no reload, no navigation.
 */
export async function setAppLanguage(code: LanguageCode): Promise<void> {
  storage.language.set(code);
  await i18n.changeLanguage(code);
}

export function getAppLanguage(): LanguageCode {
  const current = i18n.language;
  return isSupported(current) ? current : 'en';
}

export default i18n;
