'use client';

import { Suspense, useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useRouter, useSearchParams } from 'next/navigation';
import { Icon } from '@/components/atoms/icon';
import { PatientAvatar, getInitials, getAvatarTone } from '@/components/atoms/avatar';
import { StatusBadge } from '@/components/atoms/status-badge';
import { Button } from '@/components/atoms/button';
import { Card } from '@/components/ui/card';
import { NewPatientDialog } from '@/components/organisms/new-patient-dialog';
import { useI18n } from '@/lib/i18n/context';
import { useListPatients } from '@/lib/container';
import { fmtDate } from '@/lib/i18n/translations';
import type { Patient } from '@/src/modules/patients/domain/patient';
import type { PatientStatus } from '@/src/modules/patients/domain/patient';

type SortKey = 'name' | 'age' | 'lastVisit' | 'consultas';
type SortDir = 'asc' | 'desc';

const ALL_STATUSES: PatientStatus[] = ['activo', 'pendiente', 'completada', 'cancelada'];

function PacientesPageContent() {
  const { t, lang } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const listPatients = useListPatients();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '');
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: 'name', dir: 'asc' });
  const [view, setView] = useState<'table' | 'cards'>('table');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<PatientStatus[]>([]);

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '');
  }, [searchParams]);

  useEffect(() => {
    listPatients.execute(query).then(setPatients);
  }, [query, listPatients]);

  const sorted = patients.toSorted((a, b) => {
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

  function toggleStatus(s: PatientStatus) {
    setStatusFilter(prev => (prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]));
  }

  const visible =
    statusFilter.length === 0 ? sorted : sorted.filter(p => statusFilter.includes(p.status));

  const displayCount = statusFilter.length > 0 ? visible.length : patients.length;
  const countLabel = `${displayCount} ${displayCount === 1 ? t('patients.count.one') : t('patients.count.other')}`;

  return (
    <div className="content-inner">
      <div className="page-head">
        <div className="page-head-row">
          <div>
            <h1>{t('patients.title')}</h1>
            <p className="pdesc">{countLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="tabs mb-0">
              <Button
                type="button"
                variant="tab"
                aria-pressed={view === 'table'}
                onClick={() => setView('table')}
              >
                <Icon name="grid" size={14} className="mr-1 align-[-2px]" />
                {t('patients.view.table')}
              </Button>
              <Button
                type="button"
                variant="tab"
                aria-pressed={view === 'cards'}
                onClick={() => setView('cards')}
              >
                <Icon name="activity" size={14} className="mr-1 align-[-2px]" />
                {t('patients.view.cards')}
              </Button>
            </div>
            <Button onClick={() => setDialogOpen(true)}>
              <Icon name="plus" size={16} />
              {t('patients.new')}
            </Button>
          </div>
        </div>
      </div>

      <NewPatientDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={patient => setPatients(prev => [patient, ...prev])}
      />

      {view === 'cards' ? (
        <div className="pt-card-grid">
          {visible.map(p => (
            <Card
              key={p.id}
              className="pt-card cursor-pointer gap-3 p-4"
              role="button"
              tabIndex={0}
              onClick={() => router.push(`/pacientes/${p.id}`)}
              onKeyDown={e => {
                if (e.key === 'Enter') router.push(`/pacientes/${p.id}`);
              }}
            >
              <div className="pt-card-top">
                <PatientAvatar
                  initials={getInitials(p.name)}
                  tone={getAvatarTone(p.id)}
                  size={44}
                />
                <div className="min-w-0">
                  <div className="pt-name text-[15px]">{p.name}</div>
                  <div className="pt-sub">{p.id}</div>
                </div>
                <div className="ml-auto">
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
            </Card>
          ))}
          {visible.length === 0 && <p className="pdesc">{t('patients.empty')}</p>}
        </div>
      ) : (
        <Card className="table-wrap gap-0 p-0">
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
                <th className="sortable">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="th-in w-full cursor-pointer appearance-none border-0 bg-transparent p-0 font-[inherit] text-[inherit]">
                      {t('patients.col.status')}
                      {statusFilter.length > 0 ? (
                        <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] leading-none text-primary-foreground">
                          {statusFilter.length}
                        </span>
                      ) : (
                        <Icon name="chevronUpDown" />
                      )}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {ALL_STATUSES.map(s => (
                        <DropdownMenuCheckboxItem
                          key={s}
                          checked={statusFilter.includes(s)}
                          onCheckedChange={() => toggleStatus(s)}
                          closeOnClick={false}
                          className="focus:bg-muted focus:text-foreground focus:**:text-foreground"
                        >
                          <StatusBadge status={s} />
                        </DropdownMenuCheckboxItem>
                      ))}
                      {statusFilter.length > 0 && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setStatusFilter([])}>
                            Clear filter
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </th>
                <th scope="col" aria-label={t('patients.col.actions')} className="w-10" />
              </tr>
            </thead>
            <tbody>
              {visible.map(p => (
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
                    {p.age} <span className="text-muted-foreground">{t('patients.years')}</span>
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
              {visible.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-muted-foreground">
                    {t('patients.empty')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

export default function PacientesPage() {
  return (
    <Suspense fallback={null}>
      <PacientesPageContent />
    </Suspense>
  );
}
