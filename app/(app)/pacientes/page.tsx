'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/atoms/icon';
import { PatientAvatar, getInitials, getAvatarTone } from '@/components/atoms/avatar';
import { StatusBadge } from '@/components/atoms/status-badge';
import { useI18n } from '@/lib/i18n/context';
import { useListPatients } from '@/lib/container';
import { fmtDate } from '@/lib/i18n/translations';
import type { Patient } from '@/src/modules/patients/domain/patient';

type SortKey = 'name' | 'age' | 'lastVisit' | 'consultas';
type SortDir = 'asc' | 'desc';

export default function PacientesPage() {
  const { t, lang } = useI18n();
  const router = useRouter();
  const listPatients = useListPatients();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: 'name', dir: 'asc' });
  const [view, setView] = useState<'table' | 'cards'>('table');

  useEffect(() => {
    listPatients.execute(query).then(setPatients);
  }, [query, listPatients]);

  const sorted = [...patients].sort((a, b) => {
    let av: string | number = a[sort.key as keyof Patient] as string | number;
    let bv: string | number = b[sort.key as keyof Patient] as string | number;
    if (sort.key === 'consultas') {
      av = a.history.length;
      bv = b.history.length;
    }
    if (typeof av === 'string') {
      const r = av.localeCompare(bv as string);
      return sort.dir === 'asc' ? r : -r;
    }
    return sort.dir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
  });

  function toggleSort(key: SortKey) {
    setSort(s =>
      s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }
    );
  }

  const countLabel = `${patients.length} ${patients.length === 1 ? t('patients.count.one') : t('patients.count.other')}`;

  return (
    <div className="content-inner">
      <div className="page-head">
        <div className="page-head-row">
          <div>
            <h1>{t('patients.title')}</h1>
            <p className="pdesc">{countLabel}</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div className="tabs" style={{ marginBottom: 0 }}>
              <button
                className={`tab ${view === 'table' ? 'on' : ''}`}
                onClick={() => setView('table')}
              >
                <Icon name="grid" size={14} style={{ marginRight: 4, verticalAlign: '-2px' }} />
                {t('patients.view.table')}
              </button>
              <button
                className={`tab ${view === 'cards' ? 'on' : ''}`}
                onClick={() => setView('cards')}
              >
                <Icon name="activity" size={14} style={{ marginRight: 4, verticalAlign: '-2px' }} />
                {t('patients.view.cards')}
              </button>
            </div>
            <button className="btn btn-primary">
              <Icon name="plus" size={16} />
              {t('patients.new')}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 360, marginBottom: 16 }}>
        <div className="input-icon-wrap">
          <Icon name="search" size={16} />
          <input
            className="input"
            placeholder={t('patients.search')}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
      </div>

      {view === 'cards' ? (
        <div className="pt-card-grid">
          {sorted.map(p => (
            <div
              className="card pt-card"
              key={p.id}
              onClick={() => router.push(`/pacientes/${p.id}`)}
            >
              <div className="pt-card-top">
                <PatientAvatar
                  initials={getInitials(p.name)}
                  tone={getAvatarTone(p.id)}
                  size={44}
                />
                <div style={{ minWidth: 0 }}>
                  <div className="pt-name" style={{ fontSize: 15 }}>
                    {p.name}
                  </div>
                  <div className="pt-sub">{p.id}</div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <StatusBadge status={p.status} />
                </div>
              </div>
              <div className="pt-card-meta">
                <span>
                  {t('patients.col.age')}
                  <b className="tabular">
                    {' '}
                    {p.age} {t('patients.years')}
                  </b>
                </span>
                <span>
                  {t('patients.col.consultas')}
                  <b className="tabular"> {p.history.length}</b>
                </span>
                <span>
                  {t('patients.col.lastVisit')}
                  <b> {fmtDate(p.lastVisit, lang)}</b>
                </span>
              </div>
            </div>
          ))}
          {sorted.length === 0 && <p className="pdesc">{t('patients.empty')}</p>}
        </div>
      ) : (
        <div className="card table-wrap">
          <table className="tbl tabular">
            <thead>
              <tr>
                <th className="sortable" onClick={() => toggleSort('name')}>
                  <span className="th-in">
                    {t('patients.col.patient')}
                    <Icon name="chevronUpDown" />
                  </span>
                </th>
                <th className="sortable" onClick={() => toggleSort('age')}>
                  <span className="th-in">
                    {t('patients.col.age')}
                    <Icon name="chevronUpDown" />
                  </span>
                </th>
                <th className="sortable" onClick={() => toggleSort('lastVisit')}>
                  <span className="th-in">
                    {t('patients.col.lastVisit')}
                    <Icon name="chevronUpDown" />
                  </span>
                </th>
                <th className="sortable" onClick={() => toggleSort('consultas')}>
                  <span className="th-in">
                    {t('patients.col.consultas')}
                    <Icon name="chevronUpDown" />
                  </span>
                </th>
                <th>{t('patients.col.status')}</th>
                <th style={{ width: 40 }} />
              </tr>
            </thead>
            <tbody>
              {sorted.map(p => (
                <tr key={p.id} onClick={() => router.push(`/pacientes/${p.id}`)}>
                  <td>
                    <div className="pt-cell">
                      <PatientAvatar
                        initials={getInitials(p.name)}
                        tone={getAvatarTone(p.id)}
                        size={34}
                      />
                      <div>
                        <div className="pt-name">{p.name}</div>
                        <div className="pt-sub">{p.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {p.age}{' '}
                    <span style={{ color: 'var(--muted-foreground)' }}>{t('patients.years')}</span>
                  </td>
                  <td>{fmtDate(p.lastVisit, lang)}</td>
                  <td>{p.history.length}</td>
                  <td>
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="td-right">
                    <Icon name="chevronRight" size={16} className="cell-chevron" />
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{ textAlign: 'center', padding: 40, color: 'var(--muted-foreground)' }}
                  >
                    {t('patients.empty')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
