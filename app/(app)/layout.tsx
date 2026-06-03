'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/context';
import { Sidebar } from '@/components/organisms/sidebar';
import { Topbar } from '@/components/organisms/topbar';
import { Spinner } from '@/components/atoms/spinner';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="grid h-screen place-items-center">
        <Spinner size={32} className="border-[3px]" />
      </div>
    );
  }

  return (
    <div className="shell">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      {mobileOpen && (
        <div
          className="scrim"
          role="button"
          aria-label="Close menu"
          tabIndex={0}
          onClick={() => setMobileOpen(false)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') setMobileOpen(false);
          }}
        />
      )}
      <div className="main-col">
        <Topbar onToggleMobile={() => setMobileOpen(o => !o)} />
        <div className="content">{children}</div>
      </div>
    </div>
  );
}
