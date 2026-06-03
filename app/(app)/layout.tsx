'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/context';
import { Sidebar } from '@/components/organisms/sidebar';
import { Topbar } from '@/components/organisms/topbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
        <div
          className="animate-spin"
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '3px solid var(--border)',
            borderTopColor: 'var(--primary)',
          }}
        />
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
