'use client';

import { useState } from 'react';
import { Dialog } from '@base-ui/react/dialog';
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

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!fields.name.trim()) errs.name = t('newPatient.nameRequired');
    const age = parseInt(fields.age, 10);
    if (isNaN(age) || age < 0 || age > 130) errs.age = t('newPatient.ageInvalid');
    if (!fields.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
      errs.email = t('newPatient.emailInvalid');
    }
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

  function handleClose() {
    if (saving) return;
    onOpenChange(false);
    setFields(EMPTY);
    setErrors({});
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(v: boolean) => {
        if (!v) handleClose();
        else onOpenChange(true);
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="dialog-backdrop" />
        <Dialog.Popup className="dialog-popup" aria-labelledby="new-patient-title">
          <div className="dialog-head">
            <Dialog.Title id="new-patient-title" className="dialog-title">
              {t('newPatient.title')}
            </Dialog.Title>
            <Dialog.Close className="dialog-close" aria-label="Close" disabled={saving}>
              <Icon name="x" size={18} />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} noValidate className="dialog-body">
            <div className="field">
              <label className="lbl" htmlFor="np-name">
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
              {errors.name && <span className="hint text-destructive">{errors.name}</span>}
            </div>

            <div className="field">
              <label className="lbl" htmlFor="np-age">
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
              {errors.age && <span className="hint text-destructive">{errors.age}</span>}
            </div>

            <div className="field">
              <label className="lbl" htmlFor="np-email">
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
              {errors.email && <span className="hint text-destructive">{errors.email}</span>}
            </div>

            <div className="field">
              <label className="lbl" htmlFor="np-phone">
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
              {errors.phone && <span className="hint text-destructive">{errors.phone}</span>}
            </div>

            <div className="dialog-foot">
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
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
