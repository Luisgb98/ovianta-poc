import type { PatientRepository } from '../application/ports/patient-repository';
import type { Patient, PatientPatch } from '../domain/patient';

export class InMemoryPatientRepository implements PatientRepository {
  private patients: Patient[];

  constructor(initialData: Patient[]) {
    this.patients = initialData.map(p => ({ ...p, history: [...p.history] }));
  }

  async findAll(query?: string): Promise<Patient[]> {
    if (!query) return [...this.patients];
    const q = query.toLowerCase();
    return this.patients.filter(
      p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
    );
  }

  async findById(id: string): Promise<Patient | null> {
    return this.patients.find(p => p.id === id) ?? null;
  }

  async create(data: Omit<Patient, 'id'>): Promise<Patient> {
    const patient: Patient = { ...data, id: `PT-${Date.now()}` };
    this.patients = [...this.patients, patient];
    return patient;
  }

  async update(id: string, patch: PatientPatch): Promise<Patient | null> {
    const idx = this.patients.findIndex(p => p.id === id);
    if (idx === -1) return null;
    const updated = { ...this.patients[idx], ...patch };
    this.patients = [...this.patients.slice(0, idx), updated, ...this.patients.slice(idx + 1)];
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const before = this.patients.length;
    this.patients = this.patients.filter(p => p.id !== id);
    return this.patients.length < before;
  }
}
