import { parseISO } from 'date-fns';
import type { AppointmentRepository } from '../application/ports/appointment-repository';
import type { Appointment, AppointmentPatch } from '../domain/appointment';

export class InMemoryAppointmentRepository implements AppointmentRepository {
  private appointments: Appointment[];
  private counter = 1;

  constructor(initialData: Appointment[] = []) {
    this.appointments = initialData.map(a => ({ ...a }));
    this.counter = initialData.length + 1;
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointments.map(a => ({ ...a }));
  }

  async findInRange(fromISO: string, toISO: string): Promise<Appointment[]> {
    const from = parseISO(fromISO);
    const to = parseISO(toISO);
    return this.appointments
      .filter(a => {
        const t = parseISO(a.start);
        return t >= from && t < to;
      })
      .map(a => ({ ...a }));
  }

  async findById(id: string): Promise<Appointment | null> {
    return this.appointments.find(a => a.id === id) ?? null;
  }

  async create(data: Omit<Appointment, 'id'>): Promise<Appointment> {
    const appt: Appointment = { id: `AP-${String(this.counter++).padStart(5, '0')}`, ...data };
    this.appointments = [...this.appointments, appt];
    return { ...appt };
  }

  async update(id: string, patch: AppointmentPatch): Promise<Appointment | null> {
    const idx = this.appointments.findIndex(a => a.id === id);
    if (idx === -1) return null;
    const updated = { ...this.appointments[idx], ...patch };
    this.appointments = [
      ...this.appointments.slice(0, idx),
      updated,
      ...this.appointments.slice(idx + 1),
    ];
    return { ...updated };
  }

  async delete(id: string): Promise<boolean> {
    const idx = this.appointments.findIndex(a => a.id === id);
    if (idx === -1) return false;
    this.appointments = [...this.appointments.slice(0, idx), ...this.appointments.slice(idx + 1)];
    return true;
  }
}
