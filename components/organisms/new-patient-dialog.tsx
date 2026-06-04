'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { Icon } from '@/components/atoms/icon';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/lib/i18n/context';
import { useCreatePatient } from '@/lib/container';
import type { Patient } from '@/src/modules/patients/domain/patient';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (patient: Patient) => void;
}

interface FormErrors {
  name?: string;
  age?: string;
  email?: string;
  phone?: string;
}

const EMPTY = { name: '', age: '', email: '', phone: '' };

export function NewPatientDialog({ open, onOpenChange, onCreated }: Props) {
  const { t } = useI18n();
  const createPatient = useCreatePatient();

  const [fields, setFields] = useState(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  function setField(key: keyof typeof EMPTY, value: string) {
    setFields(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: undefined }));
  }

  const handleClose = useCallback(() => {
    if (saving) return;
    onOpenChange(false);
    setFields(EMPTY);
    setErrors({});
  }, [saving, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, handleClose]);

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!fields.name.trim()) errs.name = t('newPatient.nameRequired');
    const age = parseInt(fields.age, 10);
    if (isNaN(age) || age < 0 || age > 130) errs.age = t('newPatient.ageInvalid');
    if (!fields.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim()))
      errs.email = t('newPatient.emailInvalid');
    if (!fields.phone.trim()) errs.phone = t('newPatient.phoneRequired');
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSaving(true);
    try {
      const patient = await createPatient.execute({
        name: fields.name.trim(),
        age: parseInt(fields.age, 10),
        email: fields.email.trim(),
        phone: fields.phone.trim(),
      });
      toast.success(t('newPatient.created'));
      onCreated(patient);
      onOpenChange(false);
      setFields(EMPTY);
      setErrors({});
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[200] bg-black/40 transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0"
        onClick={handleClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-patient-title"
        className="z-dialog fixed top-1/2 left-1/2 w-full max-w-dialog -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card shadow-[var(--shadow-lg)] transition-[opacity,transform] duration-200 outline-none data-[ending-style]:[transform:translate(-50%,-46%)] data-[ending-style]:opacity-0 data-[starting-style]:[transform:translate(-50%,-46%)] data-[starting-style]:opacity-0"
      >
        <div className="flex items-center justify-between px-5 pt-5">
          <h2 id="new-patient-title" className="text-dialog font-bold tracking-snug">
            {t('newPatient.title')}
          </h2>
          <button
            type="button"
            className="grid size-8 flex-none cursor-pointer place-items-center rounded-md border-0 bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Close"
            disabled={saving}
            onClick={handleClose}
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 p-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-[550] text-foreground" htmlFor="np-name">
              {t('newPatient.name')}
            </label>
            <Input
              id="np-name"
              placeholder={t('newPatient.namePlaceholder')}
              value={fields.name}
              onChange={e => setField('name', e.target.value)}
              aria-invalid={!!errors.name}
              disabled={saving}
              autoFocus
            />
            {errors.name && <span className="text-[12px] text-destructive">{errors.name}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-[550] text-foreground" htmlFor="np-age">
              {t('newPatient.age')}
            </label>
            <Input
              id="np-age"
              type="number"
              min={0}
              max={130}
              placeholder="0"
              value={fields.age}
              onChange={e => setField('age', e.target.value)}
              aria-invalid={!!errors.age}
              disabled={saving}
            />
            {errors.age && <span className="text-[12px] text-destructive">{errors.age}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-[550] text-foreground" htmlFor="np-email">
              {t('newPatient.email')}
            </label>
            <Input
              id="np-email"
              type="email"
              placeholder={t('newPatient.emailPlaceholder')}
              value={fields.email}
              onChange={e => setField('email', e.target.value)}
              aria-invalid={!!errors.email}
              disabled={saving}
            />
            {errors.email && <span className="text-[12px] text-destructive">{errors.email}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-[550] text-foreground" htmlFor="np-phone">
              {t('newPatient.phone')}
            </label>
            <Input
              id="np-phone"
              type="tel"
              placeholder={t('newPatient.phonePlaceholder')}
              value={fields.phone}
              onChange={e => setField('phone', e.target.value)}
              aria-invalid={!!errors.phone}
              disabled={saving}
            />
            {errors.phone && <span className="text-[12px] text-destructive">{errors.phone}</span>}
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={handleClose} disabled={saving}>
              {t('detail.cancel')}
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {t('newPatient.submit')}
                </span>
              ) : (
                <>
                  <Icon name="plus" size={16} />
                  {t('newPatient.submit')}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </>,
    document.body
  );
}
