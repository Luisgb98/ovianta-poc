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
      className="flex cursor-pointer items-center gap-3 border-b border-border px-5 py-3 last:border-b-0 hover:bg-muted"
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/patients/${patient.id}`)}
      onKeyDown={e => {
        if (e.key === 'Enter') router.push(`/patients/${patient.id}`);
      }}
    >
      <PatientAvatar
        initials={getInitials(patient.name)}
        tone={getAvatarTone(patient.id)}
        size={36}
      />
      <div className="min-w-0 flex-1">
        <div className="text-[13.5px] font-semibold">{patient.name}</div>
        <div className="text-[12px] text-muted-foreground">{subtitle}</div>
      </div>
      {trailing}
    </div>
  );
}
