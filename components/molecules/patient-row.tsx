'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { PatientAvatar, getInitials, getAvatarTone } from '@/components/atoms/avatar';
import type { Patient } from '@/src/modules/patients/domain/patient';

interface PatientRowProps {
  patient: Patient;
  subtitle: ReactNode;
  trailing?: ReactNode;
}

export function PatientRow({ patient, subtitle, trailing }: PatientRowProps) {
  const router = useRouter();
  return (
    <div
      className="row-item"
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/pacientes/${patient.id}`)}
      onKeyDown={e => {
        if (e.key === 'Enter') router.push(`/pacientes/${patient.id}`);
      }}
    >
      <PatientAvatar
        initials={getInitials(patient.name)}
        tone={getAvatarTone(patient.id)}
        size={36}
      />
      <div className="meta">
        <div className="r-title">{patient.name}</div>
        <div className="r-sub">{subtitle}</div>
      </div>
      {trailing}
    </div>
  );
}
