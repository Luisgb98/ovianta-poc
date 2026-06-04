import type { AppointmentRepository } from '../application/ports/appointment-repository';
import type { Appointment, AppointmentPatch } from '../domain/appointment';

export class ApiAppointmentRepository implements AppointmentRepository {
  async findAll(): Promise<Appointment[]> {
    const res = await fetch('/api/appointments');
    const json = await res.json();
    return json.data as Appointment[];
  }

  async findInRange(fromISO: string, toISO: string): Promise<Appointment[]> {
    const params = new URLSearchParams({ from: fromISO, to: toISO });
    const res = await fetch(`/api/appointments?${params}`);
    const json = await res.json();
    return json.data as Appointment[];
  }

  async findById(id: string): Promise<Appointment | null> {
    const res = await fetch(`/api/appointments/${encodeURIComponent(id)}`);
    if (res.status === 404) return null;
    const json = await res.json();
    return json.data as Appointment;
  }

  async create(data: Omit<Appointment, 'id'>): Promise<Appointment> {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? 'Failed to create appointment');
    return json.data as Appointment;
  }

  async update(id: string, patch: AppointmentPatch): Promise<Appointment | null> {
    const res = await fetch(`/api/appointments/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    if (res.status === 404) return null;
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? 'Failed to update appointment');
    return json.data as Appointment;
  }

  async delete(id: string): Promise<boolean> {
    const res = await fetch(`/api/appointments/${encodeURIComponent(id)}`, { method: 'DELETE' });
    return res.ok;
  }
}
