'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/atoms/icon';
import { PatientAvatar } from '@/components/atoms/avatar';
import { useI18n } from '@/lib/i18n/context';
import { useAuth } from '@/lib/auth/context';

const NAV_ITEMS = [
  { key: 'home', href: '/', icon: 'grid' as const, section: 'clinica' },
  {
    key: 'consultas',
    href: '/consultas',
    icon: 'stethoscope' as const,
    section: 'clinica',
  },
  {
    key: 'agenda',
    href: '/agenda',
    icon: 'calendar' as const,
    section: 'clinica',
  },
  {
    key: 'pacientes',
    href: '/pacientes',
    icon: 'users' as const,
    section: 'clinica',
    showCount: true,
  },
  {
    key: 'ajustes',
    href: '/ajustes',
    icon: 'settings' as const,
    section: 'general',
  },
] as const;

interface SidebarProps {
  patientCount: number;
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ patientCount, mobileOpen, onClose }: SidebarProps) {
  const { t } = useI18n();
  const { email } = useAuth();
  const pathname = usePathname();

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
  const initials = email ? (email[0] ?? 'U').toUpperCase() + (email[1] ?? '').toUpperCase() : 'U';

  let lastSection = '';

  return (
    <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
      <div className="sidebar-head">
        <span className="brand-mark" style={{ width: 30, height: 30, fontSize: 16 }}>
          O
        </span>
        <div className="brand-text">
          Ovianta
          <small>{t('app.tagline')}</small>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => {
          const showSection = item.section !== lastSection;
          lastSection = item.section;
          const active = isActive(item.href, item.key);
          return (
            <div key={item.key}>
              {showSection && (
                <div className="nav-section">
                  {t(`nav.section.${item.section}` as Parameters<typeof t>[0])}
                </div>
              )}
              <Link
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
            </div>
          );
        })}
      </nav>

      <div className="sidebar-foot">
        <div className="user-chip">
          <PatientAvatar initials={initials} tone="primary" size={34} />
          <div className="meta">
            <div className="nm">{displayName}</div>
            <div className="em">{email}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
