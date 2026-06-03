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
import { useI18n } from '@/lib/i18n/context';
import { useGetPatientById, useUpdatePatient } from '@/lib/container';
import { fmtDate, fmtDateLong } from '@/lib/i18n/translations';
import type { Patient } from '@/src/modules/patients/domain/patient';

type Tab = 'history' | 'data';

type State = {
  patient: Patient | null | undefined;
  tab: Tab;
  editing: boolean;
  name: string;
  age: string;
  ageErr: string;
};

type Action =
  | { type: 'LOADED'; patient: Patient | null }
  | { type: 'SET_TAB'; tab: Tab }
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
    case 'SET_TAB':
      return { ...state, tab: action.tab };
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
  tab: 'history',
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
  const { patient, tab, editing, name, age, ageErr } = state;

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
      <div className="content-inner">
        <div className="page-head">
          <p className="pdesc">Paciente no encontrado.</p>
          <Button variant="outline" onClick={() => router.push('/pacientes')}>
            <Icon name="chevronLeft" size={16} />
            {t('detail.back')}
          </Button>
        </div>
      </div>
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
    <div className="content-inner">
      <div className="page-head">
        <div className="crumbs">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 px-1 text-muted-foreground"
            onClick={() => router.push('/pacientes')}
          >
            <Icon name="chevronLeft" size={15} /> {t('detail.back')}
          </Button>
          <span>/</span>
          <span className="text-foreground">{patient.name}</span>
        </div>

        <div className="page-head-row">
          <h1>{patient.name}</h1>
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

      <div className="detail-grid">
        <div className="flex flex-col gap-5">
          <Card className="detail-hero items-center gap-4 p-6">
            <PatientAvatar
              initials={getInitials(patient.name)}
              tone={getAvatarTone(patient.id)}
              size={72}
            />
            {!editing ? (
              <>
                <div className="name">{patient.name}</div>
                <div className="id">{patient.id}</div>
                <div className="mt-2.5">
                  <StatusBadge status={patient.status} />
                </div>
              </>
            ) : (
              <div className="flex w-full flex-col gap-3">
                <div className="field">
                  <label className="lbl" htmlFor="ed-name">
                    {t('detail.name')}
                  </label>
                  <Input
                    id="ed-name"
                    value={name}
                    onChange={e => dispatch({ type: 'SET_NAME', name: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label className="lbl" htmlFor="ed-age">
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
                  {ageErr && <span className="hint text-destructive">{ageErr}</span>}
                </div>
              </div>
            )}
          </Card>

          <Card className="gap-0 p-0">
            <div className="list-card-head">
              <h3>{t('detail.info')}</h3>
            </div>
            <div className="info-list">
              <InfoRow
                label={t('detail.age')}
                value={`${patient.age} ${t('patients.years')}`}
                valueClassName="tabular"
              />
              <InfoRow label={t('detail.id')} value={patient.id} valueClassName="font-mono" />
              <InfoRow label={t('detail.email')} value={patient.email} />
              <InfoRow label={t('detail.phone')} value={patient.phone} valueClassName="tabular" />
              <InfoRow label={t('detail.since')} value={fmtDate(patient.since, lang)} />
            </div>
          </Card>
        </div>

        <div>
          <div className="tabs">
            <Button
              type="button"
              variant="tab"
              aria-pressed={tab === 'history'}
              onClick={() => dispatch({ type: 'SET_TAB', tab: 'history' })}
            >
              {t('detail.tab.history')}
            </Button>
            <Button
              type="button"
              variant="tab"
              aria-pressed={tab === 'data'}
              onClick={() => dispatch({ type: 'SET_TAB', tab: 'data' })}
            >
              {t('detail.tab.data')}
            </Button>
          </div>

          {tab === 'history' ? (
            <Card className="gap-4 p-5 pb-2">
              <p className="pdesc mt-0 mb-[18px]">
                <strong className="text-foreground">{patient.history.length}</strong>{' '}
                {t('detail.totalConsultas')}
              </p>
              <div className="timeline">
                {patient.history.map(c => (
                  <div className="tl-item" key={c.id}>
                    <div className="tl-rail">
                      <span className={`tl-dot ${c.status}`} />
                      <span className="tl-line" />
                    </div>
                    <Card className="tl-body gap-2 p-4">
                      <div className="tl-top">
                        <div>
                          <div className="tl-type">{c.type}</div>
                          <div className="tl-meta">
                            {t('detail.with')} {c.doctor}
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <StatusBadge status={c.status} />
                          <span className="tl-date">{fmtDate(c.date, lang)}</span>
                        </div>
                      </div>
                      <p className="tl-note">{c.note}</p>
                    </Card>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card className="gap-0 p-0">
              <div className="info-list">
                <InfoRow label={t('detail.name')} value={patient.name} noBorderTop />
                <InfoRow label={t('detail.age')} value={patient.age} valueClassName="tabular" />
                <InfoRow label={t('detail.email')} value={patient.email} />
                <InfoRow label={t('detail.phone')} value={patient.phone} valueClassName="tabular" />
                <InfoRow label={t('detail.id')} value={patient.id} valueClassName="font-mono" />
                <InfoRow label={t('detail.since')} value={fmtDateLong(patient.since, lang)} />
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
