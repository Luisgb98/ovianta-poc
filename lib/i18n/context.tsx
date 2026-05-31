'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
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
  const [lang, setLangState] = useState<Lang>('es');

  useEffect(() => {
    const saved = localStorage.getItem('ovianta-lang') as Lang | null;
    if (saved && translations[saved]) setLangState(saved);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem('ovianta-lang', l);
    document.documentElement.lang = l;
  }, []);

  const t = useCallback((key: TranslationKey): string => translations[lang][key] ?? key, [lang]);

  return (
    <I18nContext.Provider value={{ lang, langs: LANGS, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
