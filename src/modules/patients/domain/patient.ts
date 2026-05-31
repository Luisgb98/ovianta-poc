export type PatientStatus = 'completada' | 'pendiente' | 'cancelada' | 'activo';
export type AvatarTone = 'primary' | 'info' | 'warning';

export interface Consultation {
  date: string;
  type: string;
  doctor: string;
  status: PatientStatus;
  note: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  initials: string;
  tone: AvatarTone;
  email: string;
  phone: string;
  since: string;
  lastVisit: string;
  status: PatientStatus;
  history: Consultation[];
}

export interface PatientPatch {
  name?: string;
  age?: number;
}
