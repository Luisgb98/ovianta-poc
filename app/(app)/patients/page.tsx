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
import { PageLayout } from '@/components/templates/PageLayout';
import { useI18n } from '@/lib/i18n/context';
import { useListPatients } from '@/lib/container';
import { fmtDate } from '@/lib/i18n/translations';
import type { Patient } from '@/src/modules/patients/domain/patient';
import type { PatientStatus } from '@/src/modules/patients/domain/patient';

type SortKey = 'name' | 'age' | 'lastVisit' | 'appointments';
type SortDir = 'asc' | 'desc';

const ALL_STATUSES: PatientStatus[] = ['active', 'pending', 'completed', 'cancelled'];

function PatientsPageContent() {
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
    if (sort.key === 'appointments') {
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
    <PageLayout>
      <div className="mb-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-heading font-bold tracking-heading">{t('patients.title')}</h1>
            <p className="mt-1 text-body-sm text-muted-foreground">{countLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex gap-0.5 rounded-md bg-muted p-1">
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
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3.5">
          {visible.map(p => (
            <Card
              key={p.id}
              className="cursor-pointer gap-3.5 p-[18px] transition-[box-shadow,border-color] duration-150 hover:[border-color:color-mix(in_oklch,var(--primary)_30%,var(--border))] hover:shadow-[var(--shadow-md)]"
              role="button"
              tabIndex={0}
              onClick={() => router.push(`/patients/${p.id}`)}
              onKeyDown={e => {
                if (e.key === 'Enter') router.push(`/patients/${p.id}`);
              }}
            >
              <div className="flex items-center gap-3">
                <PatientAvatar
                  initials={getInitials(p.name)}
                  tone={getAvatarTone(p.id)}
                  size={44}
                />
                <div className="min-w-0">
                  <div className="text-cta font-semibold whitespace-nowrap">{p.name}</div>
                  <div className="font-mono text-xs text-muted-foreground">{p.id}</div>
                </div>
                <div className="ml-auto">
                  <StatusBadge status={p.status} />
                </div>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-xs-plus text-muted-foreground">
                <span>
                  {t('patients.col.age')}
                  <b className="tabular block text-sm font-semibold text-foreground">
                    {p.age} {t('patients.years')}
                  </b>
                </span>
                <span>
                  {t('patients.col.appointments')}
                  <b className="tabular block text-sm font-semibold text-foreground">
                    {p.history.length}
                  </b>
                </span>
                <span>
                  {t('patients.col.lastVisit')}
                  <b className="block text-sm font-semibold text-foreground">
                    {fmtDate(p.lastVisit, lang)}
                  </b>
                </span>
              </div>
            </Card>
          ))}
          {visible.length === 0 && (
            <p className="mt-1 text-body-sm text-muted-foreground">{t('patients.empty')}</p>
          )}
        </div>
      ) : (
        <Card className="max-h-[calc(100dvh-17.5rem)] gap-0 overflow-auto p-0">
          <table className="tabular w-full border-separate border-spacing-0 text-body-xs">
            <thead className="isolate">
              <tr>
                {(
                  [
                    { key: 'name', label: t('patients.col.patient') },
                    { key: 'age', label: t('patients.col.age') },
                    { key: 'lastVisit', label: t('patients.col.lastVisit') },
                    { key: 'appointments', label: t('patients.col.appointments') },
                  ] as { key: SortKey; label: string }[]
                ).map(col => (
                  <th
                    key={col.key}
                    className="sticky top-0 z-10 cursor-pointer border-b border-border bg-card px-4 py-[11px] text-left text-table font-semibold tracking-label whitespace-nowrap text-muted-foreground uppercase shadow-[0_1px_0_var(--border)] select-none hover:text-foreground"
                    onClick={() => toggleSort(col.key)}
                  >
                    <span className="inline-flex items-center gap-1.25">
                      {col.label}
                      <Icon name="chevronUpDown" size={13} className="opacity-60" />
                    </span>
                  </th>
                ))}
                <th className="sticky top-0 z-10 border-b border-border bg-card px-4 py-[11px] text-left text-table font-semibold tracking-label whitespace-nowrap text-muted-foreground uppercase shadow-[0_1px_0_var(--border)]">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex w-full cursor-pointer appearance-none items-center gap-1.25 border-0 bg-transparent p-0 font-[inherit] text-[inherit]">
                      {t('patients.col.status')}
                      {statusFilter.length > 0 ? (
                        <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] leading-none text-primary-foreground">
                          {statusFilter.length}
                        </span>
                      ) : (
                        <Icon name="chevronUpDown" size={13} className="opacity-60" />
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
                <th
                  scope="col"
                  aria-label={t('patients.col.actions')}
                  className="sticky top-0 z-10 w-10 border-b border-border bg-card px-4 py-[11px] shadow-[0_1px_0_var(--border)]"
                />
              </tr>
            </thead>
            <tbody>
              {visible.map(p => (
                <tr
                  key={p.id}
                  className="group cursor-pointer [&:last-child_td]:border-b-0"
                  onClick={() => router.push(`/patients/${p.id}`)}
                >
                  <td className="border-b border-border bg-card px-4 py-[13px] group-hover:bg-muted">
                    <div className="flex items-center gap-[11px]">
                      <PatientAvatar
                        initials={getInitials(p.name)}
                        tone={getAvatarTone(p.id)}
                        size={34}
                      />
                      <div>
                        <div className="font-semibold whitespace-nowrap">{p.name}</div>
                        <div className="font-mono text-xs text-muted-foreground">{p.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-border bg-card px-4 py-[13px] group-hover:bg-muted">
                    {p.age} <span className="text-muted-foreground">{t('patients.years')}</span>
                  </td>
                  <td className="border-b border-border bg-card px-4 py-[13px] group-hover:bg-muted">
                    {fmtDate(p.lastVisit, lang)}
                  </td>
                  <td className="border-b border-border bg-card px-4 py-[13px] group-hover:bg-muted">
                    {p.history.length}
                  </td>
                  <td className="border-b border-border bg-card px-4 py-[13px] group-hover:bg-muted">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="border-b border-border bg-card px-4 py-[13px] text-right group-hover:bg-muted">
                    <Icon name="chevronRight" size={16} className="text-muted-foreground" />
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
    </PageLayout>
  );
}

export default function PatientsPage() {
  return (
    <Suspense fallback={null}>
      <PatientsPageContent />
    </Suspense>
  );
}
