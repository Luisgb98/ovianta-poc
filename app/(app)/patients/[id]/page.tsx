'use client';

import { useEffect, useReducer } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Icon } from '@/components/atoms/icon';
import { PatientAvatar, getInitials, getAvatarTone } from '@/components/atoms/avatar';
import { StatusBadge } from '@/components/atoms/status-badge';
import { Spinner } from '@/components/atoms/spinner';
import { InfoRow } from '@/components/molecules/info-row';
import { Button } from '@/components/atoms/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { PageLayout } from '@/components/templates/PageLayout';
import { useI18n } from '@/lib/i18n/context';
import { useGetPatientById, useUpdatePatient } from '@/lib/container';
import { fmtDate } from '@/lib/i18n/translations';
import type { Patient } from '@/src/modules/patients/domain/patient';

type State = {
  patient: Patient | null | undefined;
  editing: boolean;
  name: string;
  age: string;
  ageErr: string;
};

type Action =
  | { type: 'LOADED'; patient: Patient | null }
  | { type: 'START_EDIT' }
  | { type: 'CANCEL_EDIT' }
  | { type: 'SET_NAME'; name: string }
  | { type: 'SET_AGE'; age: string }
  | { type: 'SAVE_SUCCESS'; patient: Patient }
  | { type: 'SAVE_ERROR'; ageErr: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOADED':
      if (!action.patient) return { ...state, patient: null };
      return {
        ...state,
        patient: action.patient,
        name: action.patient.name,
        age: String(action.patient.age),
        editing: false,
      };
    case 'START_EDIT':
      return { ...state, editing: true };
    case 'CANCEL_EDIT':
      return {
        ...state,
        editing: false,
        name: state.patient?.name ?? '',
        age: state.patient ? String(state.patient.age) : '',
        ageErr: '',
      };
    case 'SET_NAME':
      return { ...state, name: action.name };
    case 'SET_AGE':
      return { ...state, age: action.age };
    case 'SAVE_SUCCESS':
      return { ...state, patient: action.patient, editing: false, ageErr: '' };
    case 'SAVE_ERROR':
      return { ...state, ageErr: action.ageErr };
    default:
      return state;
  }
}

const initialState: State = {
  patient: undefined,
  editing: false,
  name: '',
  age: '',
  ageErr: '',
};

export default function PatientDetailPage() {
  const { t, lang } = useI18n();
  const getPatientById = useGetPatientById();
  const updatePatient = useUpdatePatient();
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';

  const [state, dispatch] = useReducer(reducer, initialState);
  const { patient, editing, name, age, ageErr } = state;

  useEffect(() => {
    getPatientById.execute(id).then(p => dispatch({ type: 'LOADED', patient: p }));
  }, [id, getPatientById]);

  if (patient === undefined) {
    return (
      <div className="grid h-[50vh] place-items-center">
        <Spinner size={24} />
      </div>
    );
  }

  if (!patient) {
    return (
      <PageLayout>
        <div className="mb-6">
          <p className="mt-1 text-body-sm text-muted-foreground">Paciente no encontrado.</p>
          <Button variant="outline" onClick={() => router.push('/patients')}>
            <Icon name="chevronLeft" size={16} />
            {t('detail.back')}
          </Button>
        </div>
      </PageLayout>
    );
  }

  async function save() {
    if (!name.trim()) return;
    try {
      const updated = await updatePatient.execute(patient!.id, { name, age: parseInt(age, 10) });
      toast.success(t('detail.saved'));
      dispatch({ type: 'SAVE_SUCCESS', patient: updated });
    } catch {
      dispatch({ type: 'SAVE_ERROR', ageErr: t('detail.ageInvalid') });
    }
  }

  return (
    <PageLayout>
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-1.5 text-body-2xs text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 px-1 text-muted-foreground"
            onClick={() => router.push('/patients')}
          >
            <Icon name="chevronLeft" size={15} /> {t('detail.back')}
          </Button>
          <span>/</span>
          <span className="text-foreground">{patient.name}</span>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-heading font-bold tracking-heading">{patient.name}</h1>
          {!editing ? (
            <Button variant="outline" onClick={() => dispatch({ type: 'START_EDIT' })}>
              <Icon name="edit" size={16} />
              {t('detail.edit')}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => dispatch({ type: 'CANCEL_EDIT' })}>
                {t('detail.cancel')}
              </Button>
              <Button onClick={save}>
                <Icon name="check" size={16} />
                {t('detail.save')}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-[300px_1fr] items-start gap-5 max-[980px]:grid-cols-1">
        <div className="flex flex-col gap-5">
          <Card className="items-center gap-4 p-6 text-center">
            <PatientAvatar
              initials={getInitials(patient.name)}
              tone={getAvatarTone(patient.id)}
              size={72}
            />
            {!editing ? (
              <>
                <div className="mt-3 text-xl font-bold tracking-snug">{patient.name}</div>
                <div className="font-mono text-xs-plus whitespace-nowrap text-muted-foreground">
                  {patient.id}
                </div>
                <div className="mt-2.5">
                  <StatusBadge status={patient.status} />
                </div>
              </>
            ) : (
              <div className="flex w-full flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-body-2xs font-[550] text-foreground" htmlFor="ed-name">
                    {t('detail.name')}
                  </label>
                  <Input
                    id="ed-name"
                    value={name}
                    onChange={e => dispatch({ type: 'SET_NAME', name: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-body-2xs font-[550] text-foreground" htmlFor="ed-age">
                    {t('detail.age')}
                  </label>
                  <Input
                    id="ed-age"
                    type="number"
                    min={0}
                    max={130}
                    value={age}
                    aria-invalid={!!ageErr}
                    onChange={e => dispatch({ type: 'SET_AGE', age: e.target.value })}
                  />
                  {ageErr && <span className="text-xs text-destructive">{ageErr}</span>}
                </div>
              </div>
            )}
          </Card>

          <Card className="gap-0 p-0">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="text-cta font-semibold">{t('detail.info')}</h3>
            </div>
            <div className="py-1">
              <InfoRow
                label={t('detail.age')}
                value={`${patient.age} ${t('patients.years')}`}
                valueClassName="tabular"
                noBorderTop
              />
              <InfoRow label={t('detail.id')} value={patient.id} valueClassName="font-mono" />
              <InfoRow label={t('detail.email')} value={patient.email} />
              <InfoRow label={t('detail.phone')} value={patient.phone} valueClassName="tabular" />
              <InfoRow label={t('detail.since')} value={fmtDate(patient.since, lang)} />
            </div>
          </Card>
        </div>

        <div>
          <Card className="gap-4 p-5 pb-2">
            <p className="mt-0 mb-4.5 text-body-sm text-muted-foreground">
              <strong className="text-foreground">{patient.history.length}</strong>{' '}
              {t('detail.totalAppointments')}
            </p>
            <div className="relative pl-1">
              {patient.history.map((c, idx) => (
                <div className="relative grid grid-cols-[28px_1fr] gap-3.5 pb-1.5" key={c.id}>
                  <div className="flex flex-col items-center">
                    <span
                      className={cn(
                        'z-1 mt-4.5 size-3 flex-none rounded-full border-[3px] border-card shadow-[0_0_0_1px_var(--border)]',
                        {
                          'bg-success': c.status === 'completed',
                          'bg-warning': c.status === 'pending',
                          'bg-destructive': c.status === 'cancelled',
                          'bg-primary': c.status === 'active',
                        }
                      )}
                    />
                    {idx < patient.history.length - 1 && (
                      <span className="my-0.5 w-0.5 flex-1 bg-border" />
                    )}
                  </div>
                  <Card className="mb-3.5 gap-2 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-body-sm font-[650]">{c.type}</div>
                        <div className="mt-0.5 text-xs-plus text-muted-foreground">
                          {t('detail.with')} {c.doctor}
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <StatusBadge status={c.status} />
                        <span className="text-xs-plus font-[550] whitespace-nowrap text-muted-foreground">
                          {fmtDate(c.date, lang)}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2.5 text-body-xs leading-body text-foreground">{c.note}</p>
                  </Card>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
