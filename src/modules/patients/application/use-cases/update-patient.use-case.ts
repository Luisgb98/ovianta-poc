import type { PatientRepository } from '../ports/patient-repository';
import type { Patient, PatientPatch } from '../../domain/patient';
import { NotFoundError, ValidationError } from '@/src/shared/domain/errors';

export class UpdatePatientUseCase {
  constructor(private readonly repo: PatientRepository) {}

  async execute(id: string, patch: PatientPatch): Promise<Patient> {
    if (patch.name !== undefined && !patch.name.trim())
      throw new ValidationError('Name cannot be empty');
    if (patch.age !== undefined && (isNaN(patch.age) || patch.age < 0 || patch.age > 130))
      throw new ValidationError('Age must be between 0 and 130');

    const updated = await this.repo.update(id, { ...patch, name: patch.name?.trim() });
    if (!updated) throw new NotFoundError('Patient', id);
    return updated;
  }
}
