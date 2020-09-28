import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'en', // default language
    fallbackLng: 'en', // fallback

    keySeparator: '.',
    interpolation: {
      escapeValue: false,
    },
    react: {
      wait: true,
      useSuspense: false,
    },
  });

export default i18n;
