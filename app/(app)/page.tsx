'use client';

import { useRouter } from 'next/navigation';
import { Icon } from '@/components/atoms/icon';
import { PatientAvatar } from '@/components/atoms/avatar';
import { StatusBadge } from '@/components/atoms/status-badge';
import { useI18n } from '@/lib/i18n/context';
import { usePatientRepository } from '@/lib/container';
import { fmtDate } from '@/lib/i18n/translations';

export default function DashboardPage() {
  const { t, lang } = useI18n();
  const repo = usePatientRepository();
  const router = useRouter();

  const patients = repo.getAll();

  const stats = [
    { key: 'patients', icon: 'users' as const, val: patients.length, trend: '+2' },
    { key: 'today', icon: 'stethoscope' as const, val: 8, trend: '+1' },
    {
      key: 'pending',
      icon: 'clock' as const,
      val: patients.filter(p => p.status === 'pendiente').length,
    },
    { key: 'week', icon: 'activity' as const, val: 24, trend: '+12%' },
  ];

  const upcoming = patients
    .slice(0, 4)
    .map(p => (p.history[0] ? { p, c: p.history[0] } : null))
    .filter(Boolean) as { p: (typeof patients)[0]; c: (typeof patients)[0]['history'][0] }[];

  const recent = [...patients].sort((a, b) => b.lastVisit.localeCompare(a.lastVisit)).slice(0, 5);

  return (
    <div className="content-inner">
      <div className="page-head">
        <h1>{t('home.greeting')} 👋</h1>
        <p className="pdesc">{t('home.subtitle')}</p>
      </div>

      <div className="stat-grid">
        {stats.map(s => (
          <div className="card stat" key={s.key}>
            <div className="st-top">
              <span className="st-label">{t(`home.stat.${s.key}` as Parameters<typeof t>[0])}</span>
              <span className="st-ic">
                <Icon name={s.icon} size={18} />
              </span>
            </div>
            <div className="st-val tabular">{s.val}</div>
            {s.trend && (
              <div className="st-trend">
                <Icon name="trend" size={13} style={{ verticalAlign: '-2px', marginRight: 3 }} />
                {s.trend}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid-2col">
        <div className="card">
          <div className="list-card-head">
            <h3>{t('home.upcoming')}</h3>
          </div>
          {upcoming.map(({ p, c }) => (
            <div className="row-item" key={p.id} onClick={() => router.push(`/pacientes/${p.id}`)}>
              <PatientAvatar initials={p.initials} tone={p.tone} size={36} />
              <div className="meta">
                <div className="r-title">{p.name}</div>
                <div className="r-sub">
                  {c.type} · {c.doctor}
                </div>
              </div>
              <StatusBadge status={c.status} t={t} />
            </div>
          ))}
        </div>

        <div className="card">
          <div className="list-card-head">
            <h3>{t('home.recent')}</h3>
            <button className="link-btn" onClick={() => router.push('/pacientes')}>
              {t('home.viewAll')}
            </button>
          </div>
          {recent.map(p => (
            <div className="row-item" key={p.id} onClick={() => router.push(`/pacientes/${p.id}`)}>
              <PatientAvatar initials={p.initials} tone={p.tone} size={36} />
              <div className="meta">
                <div className="r-title">{p.name}</div>
                <div className="r-sub">{p.id}</div>
              </div>
              <span className="r-time">{fmtDate(p.lastVisit, lang)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
