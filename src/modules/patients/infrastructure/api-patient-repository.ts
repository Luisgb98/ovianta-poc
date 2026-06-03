import type { PatientRepository } from '../application/ports/patient-repository';
import type { Patient, PatientPatch } from '../domain/patient';

export class ApiPatientRepository implements PatientRepository {
  async findAll(query?: string): Promise<Patient[]> {
    const url = query ? `/api/patients?q=${encodeURIComponent(query)}` : '/api/patients';
    const res = await fetch(url);
    const json = await res.json();
    return json.data as Patient[];
  }

  async findById(id: string): Promise<Patient | null> {
    const res = await fetch(`/api/patients/${encodeURIComponent(id)}`);
    if (res.status === 404) return null;
    const json = await res.json();
    return json.data as Patient;
  }

  async create(data: Omit<Patient, 'id'>): Promise<Patient> {
    const res = await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? 'Failed to create patient');
    return json.data as Patient;
  }

  async update(id: string, patch: PatientPatch): Promise<Patient | null> {
    const res = await fetch(`/api/patients/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    if (res.status === 404) return null;
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? 'Failed to update patient');
    return json.data as Patient;
  }

  async delete(id: string): Promise<boolean> {
    const res = await fetch(`/api/patients/${encodeURIComponent(id)}`, { method: 'DELETE' });
    return res.ok;
  }
}
