'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { Icon } from '@/components/atoms/icon';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/lib/i18n/context';
import { useListPatients } from '@/lib/container';
import type { Appointment } from '../domain/appointment';
import type { CreateAppointmentInput } from '../application/use-cases/create-appointment.use-case';
import { cn } from '@/lib/utils';

const DOCTORS = ['Dra. Elena Ruiz', 'Dr. Andrés Vega', 'Dra. María Torres', 'Dr. Luis García'];
const TYPES = [
  'Revisión general',
  'Análisis de sangre',
  'Control de seguimiento',
  'Primera consulta',
  'Consulta dermatología',
  'Consulta nutrición',
  'Ecografía abdominal',
  'Control tensión',
  'Revisión analítica',
];
const DURATIONS = [15, 20, 30, 45, 60, 90];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: Appointment | null;
  defaultDate?: string;
  onCreate?: (input: CreateAppointmentInput) => Promise<void>;
  onCancel?: (id: string) => Promise<void>;
}

interface FormState {
  patientId: string;
  patientName: string;
  doctor: string;
  type: string;
  date: string;
  time: string;
  durationMin: number;
  notes: string;
}

const EMPTY: FormState = {
  patientId: '',
  patientName: '',
  doctor: DOCTORS[0],
  type: TYPES[0],
  date: '',
  time: '09:00',
  durationMin: 30,
  notes: '',
};

function buildForm(
  appointment: Appointment | null | undefined,
  defaultDate: string | undefined
): FormState {
  if (appointment) {
    const d = parseISO(appointment.start);
    return {
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      doctor: appointment.doctor,
      type: appointment.type,
      date: format(d, 'yyyy-MM-dd'),
      time: format(d, 'HH:mm'),
      durationMin: appointment.durationMin,
      notes: appointment.notes,
    };
  }
  if (defaultDate) {
    const d = parseISO(defaultDate);
    return { ...EMPTY, date: format(d, 'yyyy-MM-dd'), time: format(d, 'HH:mm') };
  }
  return EMPTY;
}

export function AppointmentDialog({
  open,
  onOpenChange,
  appointment,
  defaultDate,
  onCreate,
  onCancel,
}: Props) {
  const { t } = useI18n();
  const listPatients = useListPatients();

  const [patients, setPatients] = useState<Array<{ id: string; name: string }>>([]);
  const [form, setForm] = useState<FormState>(() => buildForm(appointment, defaultDate));
  const [saving, setSaving] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    listPatients.execute().then(ps => setPatients(ps.map(p => ({ id: p.id, name: p.name }))));
  }, [listPatients]);

  useEffect(() => {
    setForm(open ? buildForm(appointment, defaultDate) : EMPTY);
  }, [open, appointment, defaultDate]);

  // Stable refs so the keyboard effect never re-subscribes due to callback churn
  const stateRef = useRef({ saving, cancelling, onOpenChange });
  stateRef.current = { saving, cancelling, onOpenChange };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const { saving, cancelling, onOpenChange } = stateRef.current;
        if (!saving && !cancelling) onOpenChange(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  function handleClose() {
    if (saving || cancelling) return;
    onOpenChange(false);
  }

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(f => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.patientId || !form.date || !form.time) return;

    const start = `${form.date}T${form.time}:00`;
    setSaving(true);
    try {
      await onCreate?.({
        patientId: form.patientId,
        patientName: form.patientName,
        doctor: form.doctor,
        type: form.type,
        start,
        durationMin: form.durationMin,
        notes: form.notes,
      });
      toast.success(t('schedule.created'));
      onOpenChange(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('schedule.conflict');
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleCancel() {
    if (!appointment) return;
    setCancelling(true);
    try {
      await onCancel?.(appointment.id);
      toast.success(t('schedule.cancelled'));
      onOpenChange(false);
    } catch {
      toast.error('Error cancelling appointment');
    } finally {
      setCancelling(false);
    }
  }

  const isViewMode = !!appointment;
  const isCancellable = appointment && appointment.status !== 'cancelled';

  if (!open) return null;

  return createPortal(
    <>
      <div
        aria-hidden="true"
        className="fixed inset-0 z-[200] bg-black/40 transition-opacity duration-200"
        onClick={handleClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="appt-dialog-title"
        className="fixed top-1/2 left-1/2 z-[201] w-full max-w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card shadow-[var(--shadow-lg)]"
      >
        <div className="flex items-center justify-between px-5 pt-5">
          <h2 id="appt-dialog-title" className="text-dialog font-bold">
            {isViewMode ? appointment.patientName : t('schedule.new')}
          </h2>
          <button
            type="button"
            className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={handleClose}
            aria-label="Close"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        {isViewMode ? (
          <div className="flex flex-col gap-3 p-5">
            <Row label={t('schedule.type')} value={appointment.type} />
            <Row label={t('schedule.doctor')} value={appointment.doctor} />
            <Row
              label={t('schedule.date')}
              value={`${format(parseISO(appointment.start), 'dd MMM yyyy')} · ${format(parseISO(appointment.start), 'HH:mm')}`}
            />
            <Row label={t('schedule.duration')} value={`${appointment.durationMin} min`} />
            {appointment.notes && <Row label={t('schedule.notes')} value={appointment.notes} />}

            {isCancellable && (
              <div className="flex justify-end gap-2 border-t border-border pt-4">
                <Button type="button" variant="ghost" onClick={handleClose}>
                  {t('detail.cancel')}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleCancel}
                  disabled={cancelling}
                >
                  {cancelling ? <Spinner /> : t('schedule.cancelAppt')}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5 p-5">
            <Field label={t('schedule.patient')}>
              <select
                value={form.patientId}
                onChange={e => {
                  const p = patients.find(p => p.id === e.target.value);
                  setField('patientId', e.target.value);
                  setField('patientName', p?.name ?? '');
                }}
                required
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-body-xs outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">{t('schedule.selectPatient')}</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label={t('schedule.doctor')}>
                <select
                  value={form.doctor}
                  onChange={e => setField('doctor', e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-body-xs outline-none focus:ring-1 focus:ring-ring"
                >
                  {DOCTORS.map(d => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t('schedule.type')}>
                <select
                  value={form.type}
                  onChange={e => setField('type', e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-body-xs outline-none focus:ring-1 focus:ring-ring"
                >
                  {TYPES.map(tp => (
                    <option key={tp} value={tp}>
                      {tp}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <Field label={t('schedule.date')}>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={e => setField('date', e.target.value)}
                    required
                    className="h-9 text-body-xs"
                  />
                </Field>
              </div>
              <Field label={t('schedule.time')}>
                <Input
                  type="time"
                  value={form.time}
                  onChange={e => setField('time', e.target.value)}
                  required
                  className="h-9 text-body-xs"
                />
              </Field>
            </div>

            <Field label={`${t('schedule.duration')} (min)`}>
              <div
                role="group"
                aria-label={`${t('schedule.duration')} (min)`}
                className="flex flex-wrap gap-1.5"
              >
                {DURATIONS.map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setField('durationMin', d)}
                    className={cn(
                      'rounded-md border px-2.5 py-1 text-[12px] transition-colors',
                      form.durationMin === d
                        ? 'border-primary bg-primary/10 font-semibold text-primary'
                        : 'border-border text-muted-foreground hover:bg-muted'
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </Field>

            <Field label={t('schedule.notes')}>
              <textarea
                value={form.notes}
                onChange={e => setField('notes', e.target.value)}
                rows={2}
                className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-body-xs outline-none focus:ring-1 focus:ring-ring"
              />
            </Field>

            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="ghost" onClick={handleClose} disabled={saving}>
                {t('detail.cancel')}
              </Button>
              <Button type="submit" disabled={saving || !form.patientId || !form.date}>
                {saving ? (
                  <Spinner />
                ) : (
                  <>
                    <Icon name="plus" size={15} />
                    {t('schedule.new')}
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </>,
    document.body
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-20 shrink-0 text-xs text-muted-foreground">{label}</span>
      <span className="text-body-xs text-foreground">{value}</span>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[12px] font-[550] text-foreground">{label}</label>
      {children}
    </div>
  );
}

function Spinner() {
  return (
    <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
  );
}
