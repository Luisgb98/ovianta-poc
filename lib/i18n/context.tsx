'use client';

import { createContext, use, useCallback, useMemo, useState } from 'react';
import {
  translations,
  LANGS,
  type Lang,
  type TranslationKey,
  type LangOption,
} from './translations';

interface I18nContextValue {
  lang: Lang;
  langs: LangOption[];
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'es';
    const saved = localStorage.getItem('ovianta-lang') as Lang | null;
    return saved && translations[saved] ? saved : 'es';
  });

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem('ovianta-lang', l);
    document.documentElement.lang = l;
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      const value = translations[lang][key];
      if (value === undefined) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[i18n] Missing translation key "${key}" for lang "${lang}"`);
        }
        return key;
      }
      return value;
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, langs: LANGS, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = use(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
