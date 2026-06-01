import type { Patient, PatientPatch } from '../../domain/patient';

export interface PatientRepository {
  findAll(query?: string): Promise<Patient[]>;
  findById(id: string): Promise<Patient | null>;
  create(data: Omit<Patient, 'id'>): Promise<Patient>;
  update(id: string, patch: PatientPatch): Promise<Patient | null>;
  delete(id: string): Promise<boolean>;
}
