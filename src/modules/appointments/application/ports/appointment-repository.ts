import type { Appointment, AppointmentPatch } from '../../domain/appointment';

export interface AppointmentRepository {
  findAll(): Promise<Appointment[]>;
  findInRange(fromISO: string, toISO: string): Promise<Appointment[]>;
  findById(id: string): Promise<Appointment | null>;
  create(data: Omit<Appointment, 'id'>): Promise<Appointment>;
  update(id: string, patch: AppointmentPatch): Promise<Appointment | null>;
  delete(id: string): Promise<boolean>;
}
