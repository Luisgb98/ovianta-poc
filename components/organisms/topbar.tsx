'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/atoms/icon';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/lib/i18n/context';
import { useTheme } from '@/lib/theme/context';
import { useAuth } from '@/lib/auth/context';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Lang } from '@/lib/i18n/translations';

interface TopbarProps {
  mobileOpen: boolean;
  onToggleMobile: () => void;
}

export function Topbar({ mobileOpen, onToggleMobile }: TopbarProps) {
  const { t, lang, langs, setLang } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [langOpen, setLangOpen] = useState(false);
  const [query, setQuery] = useState('');
  const langRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (pathname === '/pacientes') {
      setQuery(searchParams.get('q') ?? '');
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  function handleLogout() {
    logout();
    router.push('/login');
  }

  function handleSearchChange(value: string) {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const q = value.trim();
      router.replace(q ? `/pacientes?q=${encodeURIComponent(q)}` : '/pacientes');
    }, 300);
  }

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = query.trim();
    router.push(q ? `/pacientes?q=${encodeURIComponent(q)}` : '/pacientes');
  }

  const current = langs.find(l => l.code === lang);

  return (
    <header className="topbar">
      <Button
        variant="ghost"
        size="icon"
        className="hamburger"
        onClick={onToggleMobile}
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
      >
        <Icon name={mobileOpen ? 'x' : 'menu'} size={20} />
      </Button>

      <form className="search" onSubmit={handleSearchSubmit}>
        <div className="input-icon-wrap">
          <Icon name="search" size={16} />
          <Input
            type="search"
            placeholder={t('topbar.search')}
            aria-label={t('topbar.search')}
            value={query}
            onChange={e => handleSearchChange(e.target.value)}
          />
        </div>
      </form>

      <div className="topbar-spacer" />

      <div className="topbar-actions">
        <div className="lang-wrap" ref={langRef}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLangOpen(o => !o)}
            aria-label="Language"
            title={current?.label}
          >
            <Icon name="globe" size={19} />
          </Button>
          {langOpen && (
            <div className="lang-menu">
              {langs.map(l => (
                <Button
                  key={l.code}
                  type="button"
                  variant="menu"
                  aria-pressed={l.code === lang}
                  onClick={() => {
                    setLang(l.code as Lang);
                    setLangOpen(false);
                  }}
                >
                  <span className="flag">{l.flag}</span>
                  {l.label}
                  {l.code === lang && <Icon name="check" size={15} className="ml-auto" />}
                </Button>
              ))}
            </div>
          )}
        </div>

        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Icon name="bell" size={19} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={t('theme.toggle')}
          title={t('theme.toggle')}
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={19} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          aria-label={t('topbar.logout')}
          title={t('topbar.logout')}
        >
          <Icon name="logout" size={19} />
        </Button>
      </div>
    </header>
  );
}
