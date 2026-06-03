export type PatientStatus = 'completada' | 'pendiente' | 'cancelada' | 'activo';

export interface Consultation {
  id: string;
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
