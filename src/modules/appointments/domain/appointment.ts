export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no-show';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctor: string;
  type: string;
  status: AppointmentStatus;
  start: string;
  durationMin: number;
  notes: string;
}

export interface AppointmentPatch {
  start?: string;
  durationMin?: number;
  status?: AppointmentStatus;
  doctor?: string;
  type?: string;
  notes?: string;
}
