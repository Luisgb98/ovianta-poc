'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/atoms/icon';
import { StatusBadge } from '@/components/atoms/status-badge';
import { PatientRow } from '@/components/molecules/patient-row';
import { Button } from '@/components/atoms/button';
import { Card } from '@/components/ui/card';
import { PageLayout } from '@/components/templates/PageLayout';
import { PageHeader } from '@/components/molecules/PageHeader';
import { useI18n } from '@/lib/i18n/context';
import { useListPatients } from '@/lib/container';
import { fmtDate } from '@/lib/i18n/translations';
import type { Patient } from '@/src/modules/patients/domain/patient';

export default function DashboardPage() {
  const { t, lang } = useI18n();
  const router = useRouter();
  const listPatients = useListPatients();
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    listPatients.execute().then(setPatients);
  }, [listPatients]);

  const activeConsultations = patients.reduce(
    (sum, p) => sum + p.history.reduce((n, c) => n + (c.status === 'active' ? 1 : 0), 0),
    0
  );
  const totalConsultations = patients.reduce((sum, p) => sum + p.history.length, 0);

  const stats = [
    { key: 'patients', icon: 'users' as const, val: patients.length },
    { key: 'today', icon: 'stethoscope' as const, val: activeConsultations },
    {
      key: 'pending',
      icon: 'clock' as const,
      val: patients.filter(p => p.status === 'pending').length,
    },
    { key: 'week', icon: 'activity' as const, val: totalConsultations },
  ];

  const upcoming = patients
    .slice(0, 4)
    .flatMap(p => (p.history[0] ? [{ p, c: p.history[0] }] : []));

  const recent = patients.toSorted((a, b) => b.lastVisit.localeCompare(a.lastVisit)).slice(0, 5);

  return (
    <PageLayout>
      <PageHeader
        title={
          <>
            {t('home.greeting')} <span aria-hidden="true">👋</span>
          </>
        }
        description={t('home.subtitle')}
      />

      <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(s => (
          <Card key={s.key} className="gap-3 p-4">
            <div className="flex items-center justify-between">
              <span className="text-body-2xs font-medium text-muted-foreground">
                {t(`home.stat.${s.key}` as Parameters<typeof t>[0])}
              </span>
              <span className="grid size-[34px] place-items-center rounded-md bg-accent text-accent-foreground">
                <Icon name={s.icon} size={18} />
              </span>
            </div>
            <div className="tabular mt-2.5 text-3xl font-bold tracking-snug">{s.val}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card className="gap-0 p-0">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="text-cta font-semibold">{t('home.upcoming')}</h3>
          </div>
          {upcoming.map(({ p, c }) => (
            <PatientRow
              key={p.id}
              patient={p}
              subtitle={`${c.type} · ${c.doctor}`}
              trailing={<StatusBadge status={c.status} />}
            />
          ))}
        </Card>

        <Card className="gap-0 p-0">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="text-cta font-semibold">{t('home.recent')}</h3>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0"
              onClick={() => router.push('/patients')}
            >
              {t('home.viewAll')}
            </Button>
          </div>
          {recent.map(p => (
            <PatientRow
              key={p.id}
              patient={p}
              subtitle={p.id}
              trailing={
                <span className="text-xs whitespace-nowrap text-muted-foreground">
                  {fmtDate(p.lastVisit, lang)}
                </span>
              }
            />
          ))}
        </Card>
      </div>
    </PageLayout>
  );
}
