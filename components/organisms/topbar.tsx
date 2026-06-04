'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/atoms/icon';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
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
    if (pathname === '/patients') {
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
      router.replace(q ? `/patients?q=${encodeURIComponent(q)}` : '/patients');
    }, 300);
  }

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = query.trim();
    router.push(q ? `/patients?q=${encodeURIComponent(q)}` : '/patients');
  }

  const current = langs.find(l => l.code === lang);

  return (
    <header className="z-topbar relative flex h-topbar flex-none items-center gap-3 border-b border-border bg-background px-5">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onToggleMobile}
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
      >
        <Icon name={mobileOpen ? 'x' : 'menu'} size={20} />
      </Button>

      <form className="hidden md:block md:max-w-search md:flex-1" onSubmit={handleSearchSubmit}>
        <div className="relative">
          <Icon
            name="search"
            size={16}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            placeholder={t('topbar.search')}
            aria-label={t('topbar.search')}
            value={query}
            onChange={e => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </form>

      <div className="flex-1" />

      <div className="flex items-center gap-1.5">
        <div className="relative" ref={langRef}>
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
            <div className="z-dropdown absolute top-[var(--topbar-height)] right-0 min-w-42 rounded-md border border-border bg-popover p-1.5 shadow-[var(--shadow-lg)]">
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
                  <span
                    className={cn(
                      'w-5.5 text-badge font-bold',
                      l.code === lang ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    {l.flag}
                  </span>
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
