'use client';

import { Suspense, useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/context';
import { Sidebar } from '@/components/organisms/sidebar';
import { Topbar } from '@/components/organisms/topbar';
import { Spinner } from '@/components/atoms/spinner';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isAuthenticated) {
    return (
      <div className="grid h-screen place-items-center">
        <Spinner size={32} className="border-[3px]" />
      </div>
    );
  }

  return (
    <div className="grid h-screen grid-cols-1 overflow-hidden md:grid-cols-[auto_1fr]">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/40"
          role="button"
          aria-label="Close menu"
          tabIndex={0}
          onClick={() => setMobileOpen(false)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') setMobileOpen(false);
          }}
        />
      )}
      <div className="flex h-screen min-w-0 flex-col overflow-hidden">
        <Suspense fallback={null}>
          <Topbar mobileOpen={mobileOpen} onToggleMobile={() => setMobileOpen(o => !o)} />
        </Suspense>
        <div className="flex-1 overflow-y-auto px-4 py-5 md:p-8">{children}</div>
      </div>
    </div>
  );
}
