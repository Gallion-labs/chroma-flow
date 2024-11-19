import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import fr from './locales/fr';
import en from './locales/en';
import es from './locales/es';
import de from './locales/de';
import it from './locales/it';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: {
        translation: fr
      },
      en: {
        translation: en
      },
      es: {
        translation: es
      },
      de: {
        translation: de
      },
      it: {
        translation: it
      }
    },
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en', 'es', 'de', 'it'],
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'preferred-language',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;