import type { PatientRepository } from '../ports/patient-repository';
import type { Patient } from '../../domain/patient';

export class GetPatientByIdUseCase {
  constructor(private readonly repo: PatientRepository) {}

  async execute(id: string): Promise<Patient | null> {
    return this.repo.findById(id);
  }
}
