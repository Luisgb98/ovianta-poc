'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { usePatientRepository } from '@/lib/container';
import { Sidebar } from '@/components/organisms/sidebar';
import { Topbar } from '@/components/organisms/topbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const repo = usePatientRepository();
  const patientCount = repo.getAll().length;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '3px solid var(--border)',
            borderTopColor: 'var(--primary)',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="shell">
      <Sidebar
        patientCount={patientCount}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      {mobileOpen && <div className="scrim" onClick={() => setMobileOpen(false)} />}
      <div className="main-col">
        <Topbar onToggleMobile={() => setMobileOpen(o => !o)} />
        <div className="content">{children}</div>
      </div>
    </div>
  );
}
