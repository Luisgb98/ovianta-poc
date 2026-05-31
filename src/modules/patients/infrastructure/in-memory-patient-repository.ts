import type { PatientRepository } from '../application/ports/patient-repository';
import type { Patient, PatientPatch } from '../domain/patient';

export class InMemoryPatientRepository implements PatientRepository {
  private patients: Patient[];

  constructor(initialData: Patient[]) {
    this.patients = initialData.map(p => ({ ...p, history: [...p.history] }));
  }

  getAll(): Patient[] {
    return [...this.patients];
  }

  findAll(query?: string): Patient[] {
    if (!query) return [...this.patients];
    const q = query.toLowerCase();
    return this.patients.filter(
      p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
    );
  }

  findById(id: string): Patient | null {
    return this.patients.find(p => p.id === id) ?? null;
  }

  update(id: string, patch: PatientPatch): Patient | null {
    const idx = this.patients.findIndex(p => p.id === id);
    if (idx === -1) return null;
    const updated = { ...this.patients[idx], ...patch };
    this.patients = [...this.patients.slice(0, idx), updated, ...this.patients.slice(idx + 1)];
    return updated;
  }
}
