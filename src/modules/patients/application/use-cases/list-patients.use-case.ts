import type { PatientRepository } from '../ports/patient-repository';
import type { Patient } from '../../domain/patient';

export class ListPatientsUseCase {
  constructor(private readonly repo: PatientRepository) {}

  async execute(query?: string): Promise<Patient[]> {
    return this.repo.findAll(query);
  }
}
