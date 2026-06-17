import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import translations, { type Locale, type TranslationKey } from './translations';

interface I18nContextValue {
  locale: Locale;
  t: TranslationKey;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>('zh');

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);
  const toggleLocale = useCallback(() => {
    setLocaleState(prev => (prev === 'zh' ? 'en' : 'zh'));
  }, []);

  const value: I18nContextValue = {
    locale,
    t: translations[locale],
    setLocale,
    toggleLocale,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextValue => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
};
