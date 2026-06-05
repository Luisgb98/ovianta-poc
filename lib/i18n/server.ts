import { cookies } from 'next/headers';
import { translations, type Lang, type TranslationKey } from './translations';

const VALID_LANGS = new Set<string>(['es', 'en', 'it', 'pt']);

export async function getServerT() {
  const cookieStore = await cookies();
  const raw = cookieStore.get('ovianta-lang')?.value ?? 'es';
  const lang: Lang = VALID_LANGS.has(raw) ? (raw as Lang) : 'es';
  const t = (key: TranslationKey): string => translations[lang][key] ?? key;
  return { t, lang };
}
