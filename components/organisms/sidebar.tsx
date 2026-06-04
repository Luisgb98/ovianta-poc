'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/atoms/button';
import { Icon } from '@/components/atoms/icon';
import { PatientAvatar } from '@/components/atoms/avatar';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n/context';
import { useAuth } from '@/lib/auth/context';
import { useListPatients } from '@/lib/container';

const NAV_ITEMS = [
  { key: 'home', href: '/', icon: 'grid' as const, section: 'clinica' },
  { key: 'appointments', href: '/appointments', icon: 'stethoscope' as const, section: 'clinica' },
  { key: 'schedule', href: '/schedule', icon: 'calendar' as const, section: 'clinica' },
  {
    key: 'patients',
    href: '/patients',
    icon: 'users' as const,
    section: 'clinica',
    showCount: true,
  },
  { key: 'settings', href: '/settings', icon: 'settings' as const, section: 'general' },
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
    if (key === 'patients') return pathname.startsWith('/patients');
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
    <aside
      className={cn(
        'group flex min-h-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground',
        isMobile
          ? cn(
              'fixed top-0 bottom-0 left-0 z-sidebar w-sidebar shadow-[var(--shadow-lg)] transition-transform duration-200',
              mobileOpen ? 'translate-x-0' : '-translate-x-full'
            )
          : cn('transition-[width] duration-[220ms] ease-in-out', isCollapsed ? 'w-16' : 'w-64')
      )}
    >
      <div
        className={cn(
          'flex h-topbar flex-none items-center gap-2.5 p-4',
          isCollapsed && 'justify-center px-0'
        )}
      >
        {isCollapsed ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="flex-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={toggle}
            aria-label="Expand sidebar"
          >
            <Icon name="chevronRight" size={16} />
          </Button>
        ) : (
          <>
            <span
              className="grid flex-none place-items-center rounded-lg bg-primary font-bold text-primary-foreground"
              style={{ width: 30, height: 30, fontSize: 16 }}
            >
              O
            </span>
            <div className="text-base leading-brand font-bold tracking-snug">
              Ovianta
              <small className="block text-badge font-medium tracking-normal text-muted-foreground">
                {t('app.tagline')}
              </small>
            </div>
            {!isMobile && (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="ml-auto flex-none opacity-0 transition-opacity duration-150 group-hover:opacity-100 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                onClick={toggle}
                aria-label="Collapse sidebar"
              >
                <Icon name="chevronLeft" size={16} />
              </Button>
            )}
          </>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-2">
        {NAV_GROUPS.map(group => (
          <div key={group.section}>
            {!isCollapsed && (
              <div className="px-3 pt-3.5 pb-1.5 text-2xs font-semibold tracking-micro text-muted-foreground uppercase">
                {t(`nav.section.${group.section}` as Parameters<typeof t>[0])}
              </div>
            )}
            {group.items.map(item => {
              const active = isActive(item.href, item.key);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    'mb-[3px] flex items-center gap-[11px] rounded-md px-3 py-[9px] text-sm font-medium text-sidebar-foreground no-underline',
                    'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    active && 'bg-sidebar-accent font-semibold text-sidebar-accent-foreground',
                    isCollapsed && 'justify-center px-0'
                  )}
                  onClick={onClose}
                  title={t(`nav.${item.key}` as Parameters<typeof t>[0])}
                >
                  <Icon
                    name={item.icon}
                    size={18}
                    className={cn('flex-none', active ? 'opacity-100' : 'opacity-75')}
                  />
                  {!isCollapsed && <span>{t(`nav.${item.key}` as Parameters<typeof t>[0])}</span>}
                  {'showCount' in item && item.showCount && !isCollapsed && (
                    <span
                      className={cn(
                        'ml-auto rounded-full px-[7px] py-px text-[11px] font-semibold',
                        active
                          ? 'text-sidebar-primary [background:color-mix(in_oklch,var(--sidebar-primary)_22%,transparent)]'
                          : '[background:color-mix(in_oklch,var(--sidebar-foreground)_10%,transparent)]'
                      )}
                    >
                      {patientCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div
        className={cn(
          'flex-none border-t border-sidebar-border',
          isCollapsed ? 'px-1 py-3' : 'p-3'
        )}
      >
        <div
          className={cn(
            'flex items-center gap-2.5 rounded-md p-2',
            isCollapsed && 'justify-center px-1'
          )}
        >
          <PatientAvatar initials={userInitials} tone="primary" size={34} />
          {!isCollapsed && (
            <div className="min-w-0">
              <div className="overflow-hidden text-[13px] font-semibold text-ellipsis whitespace-nowrap">
                {displayName}
              </div>
              <div className="overflow-hidden text-table text-ellipsis whitespace-nowrap text-muted-foreground">
                {email}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
