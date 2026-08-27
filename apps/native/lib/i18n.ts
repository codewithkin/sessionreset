import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

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

const deviceLanguage = Localization.getLocales()[0]?.languageCode ?? 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
