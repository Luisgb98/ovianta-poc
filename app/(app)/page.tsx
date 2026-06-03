'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/atoms/icon';
import { StatusBadge } from '@/components/atoms/status-badge';
import { PatientRow } from '@/components/molecules/patient-row';
import { Button } from '@/components/atoms/button';
import { Card } from '@/components/ui/card';
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
    (sum, p) => sum + p.history.reduce((n, c) => n + (c.status === 'activo' ? 1 : 0), 0),
    0
  );
  const totalConsultations = patients.reduce((sum, p) => sum + p.history.length, 0);

  const stats = [
    { key: 'patients', icon: 'users' as const, val: patients.length },
    { key: 'today', icon: 'stethoscope' as const, val: activeConsultations },
    {
      key: 'pending',
      icon: 'clock' as const,
      val: patients.filter(p => p.status === 'pendiente').length,
    },
    { key: 'week', icon: 'activity' as const, val: totalConsultations },
  ];

  const upcoming = patients
    .slice(0, 4)
    .flatMap(p => (p.history[0] ? [{ p, c: p.history[0] }] : []));

  const recent = patients.toSorted((a, b) => b.lastVisit.localeCompare(a.lastVisit)).slice(0, 5);

  return (
    <div className="content-inner">
      <div className="page-head">
        <h1>
          {t('home.greeting')} <span aria-hidden="true">👋</span>
        </h1>
        <p className="pdesc">{t('home.subtitle')}</p>
      </div>

      <div className="stat-grid">
        {stats.map(s => (
          <Card key={s.key} className="stat gap-3 p-4">
            <div className="st-top">
              <span className="st-label">{t(`home.stat.${s.key}` as Parameters<typeof t>[0])}</span>
              <span className="st-ic">
                <Icon name={s.icon} size={18} />
              </span>
            </div>
            <div className="st-val tabular">{s.val}</div>
          </Card>
        ))}
      </div>

      <div className="grid-2col">
        <Card className="gap-0 p-0">
          <div className="list-card-head">
            <h3>{t('home.upcoming')}</h3>
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
          <div className="list-card-head">
            <h3>{t('home.recent')}</h3>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0"
              onClick={() => router.push('/pacientes')}
            >
              {t('home.viewAll')}
            </Button>
          </div>
          {recent.map(p => (
            <PatientRow
              key={p.id}
              patient={p}
              subtitle={p.id}
              trailing={<span className="r-time">{fmtDate(p.lastVisit, lang)}</span>}
            />
          ))}
        </Card>
      </div>
    </div>
  );
}
