'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/atoms/button';
import { Icon } from '@/components/atoms/icon';
import { PatientAvatar } from '@/components/atoms/avatar';
import { useI18n } from '@/lib/i18n/context';
import { useAuth } from '@/lib/auth/context';
import { useListPatients } from '@/lib/container';

const NAV_ITEMS = [
  { key: 'home', href: '/', icon: 'grid' as const, section: 'clinica' },
  { key: 'consultas', href: '/consultas', icon: 'stethoscope' as const, section: 'clinica' },
  { key: 'agenda', href: '/agenda', icon: 'calendar' as const, section: 'clinica' },
  {
    key: 'pacientes',
    href: '/pacientes',
    icon: 'users' as const,
    section: 'clinica',
    showCount: true,
  },
  { key: 'ajustes', href: '/ajustes', icon: 'settings' as const, section: 'general' },
] as const;

type NavItem = (typeof NAV_ITEMS)[number];

const NAV_GROUPS = NAV_ITEMS.reduce(
  (acc, item) => {
    const last = acc[acc.length - 1];
    if (last?.section === item.section) {
      return [...acc.slice(0, -1), { section: last.section, items: [...last.items, item] }];
    }
    return [...acc, { section: item.section, items: [item] }];
  },
  [] as { section: string; items: NavItem[] }[]
);

const STORAGE_KEY = 'sidebar-collapsed';

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const { t } = useI18n();
  const { email } = useAuth();
  const pathname = usePathname();
  const listPatients = useListPatients();
  const [patientCount, setPatientCount] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === 'true') setCollapsed(true);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    listPatients.execute().then(ps => setPatientCount(ps.length));
  }, [listPatients]);

  function toggle() {
    setCollapsed(c => {
      const next = !c;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }

  function isActive(href: string, key: string): boolean {
    if (href === '/') return pathname === '/';
    if (key === 'pacientes') return pathname.startsWith('/pacientes');
    return pathname.startsWith(href);
  }

  const displayName = email
    ? email
        .split('@')[0]
        .replace(/\./g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
    : '';
  const userInitials = email
    ? (email[0] ?? 'U').toUpperCase() + (email[1] ?? '').toUpperCase()
    : 'U';

  const isCollapsed = !isMobile && collapsed;

  return (
    <aside className={`sidebar ${mobileOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-head">
        {isCollapsed ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="sidebar-toggle hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={toggle}
            aria-label="Expand sidebar"
          >
            <Icon name="chevronRight" size={16} />
          </Button>
        ) : (
          <>
            <span className="brand-mark" style={{ width: 30, height: 30, fontSize: 16 }}>
              O
            </span>
            <div className="brand-text">
              Ovianta
              <small>{t('app.tagline')}</small>
            </div>
            {!isMobile && (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="sidebar-toggle hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                onClick={toggle}
                aria-label="Collapse sidebar"
              >
                <Icon name="chevronLeft" size={16} />
              </Button>
            )}
          </>
        )}
      </div>

      <nav className="sidebar-nav">
        {NAV_GROUPS.map(group => (
          <div key={group.section}>
            <div className="nav-section">
              {t(`nav.section.${group.section}` as Parameters<typeof t>[0])}
            </div>
            {group.items.map(item => {
              const active = isActive(item.href, item.key);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`navitem ${active ? 'on' : ''}`}
                  onClick={onClose}
                  title={t(`nav.${item.key}` as Parameters<typeof t>[0])}
                >
                  <Icon name={item.icon} size={18} />
                  <span>{t(`nav.${item.key}` as Parameters<typeof t>[0])}</span>
                  {'showCount' in item && item.showCount && (
                    <span className="count">{patientCount}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-foot">
        <div className="user-chip">
          <PatientAvatar initials={userInitials} tone="primary" size={34} />
          <div className="meta">
            <div className="nm">{displayName}</div>
            <div className="em">{email}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
