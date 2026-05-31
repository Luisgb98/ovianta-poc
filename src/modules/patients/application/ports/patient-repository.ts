import type { Patient, PatientPatch } from '../../domain/patient';

export interface PatientRepository {
  findAll(query?: string): Patient[];
  findById(id: string): Patient | null;
  update(id: string, patch: PatientPatch): Patient | null;
  getAll(): Patient[];
}
