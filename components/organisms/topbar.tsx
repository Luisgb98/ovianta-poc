'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/atoms/icon';
import { useI18n } from '@/lib/i18n/context';
import { useTheme } from '@/lib/theme/context';
import { useAuth } from '@/lib/auth/context';
import { useRouter } from 'next/navigation';
import type { Lang } from '@/lib/i18n/translations';

interface TopbarProps {
  onToggleMobile: () => void;
}

export function Topbar({ onToggleMobile }: TopbarProps) {
  const { t, lang, langs, setLang } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const router = useRouter();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

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

  const current = langs.find(l => l.code === lang);

  return (
    <header className="topbar">
      <button
        type="button"
        className="icon-btn hamburger"
        onClick={onToggleMobile}
        aria-label="Menu"
      >
        <Icon name="menu" size={20} />
      </button>

      <div className="search">
        <div className="input-icon-wrap">
          <Icon name="search" size={16} />
          <input
            className="input"
            placeholder={t('topbar.search')}
            aria-label={t('topbar.search')}
            readOnly
          />
        </div>
      </div>

      <div className="topbar-spacer" />

      <div className="topbar-actions">
        <div className="lang-wrap" ref={langRef}>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setLangOpen(o => !o)}
            aria-label="Language"
            title={current?.label}
          >
            <Icon name="globe" size={19} />
          </button>
          {langOpen && (
            <div className="lang-menu">
              {langs.map(l => (
                <button
                  key={l.code}
                  type="button"
                  className={`lang-opt ${l.code === lang ? 'on' : ''}`}
                  onClick={() => {
                    setLang(l.code as Lang);
                    setLangOpen(false);
                  }}
                >
                  <span className="flag">{l.flag}</span>
                  {l.label}
                  {l.code === lang && (
                    <Icon name="check" size={15} style={{ marginLeft: 'auto' }} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <button type="button" className="icon-btn" aria-label="Notifications">
          <Icon name="bell" size={19} />
        </button>

        <button
          type="button"
          className="icon-btn"
          onClick={toggleTheme}
          aria-label={t('theme.toggle')}
          title={t('theme.toggle')}
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={19} />
        </button>

        <button
          type="button"
          className="icon-btn"
          onClick={handleLogout}
          aria-label={t('topbar.logout')}
          title={t('topbar.logout')}
        >
          <Icon name="logout" size={19} />
        </button>
      </div>
    </header>
  );
}
