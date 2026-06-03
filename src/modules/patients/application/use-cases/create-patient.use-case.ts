import type { PatientRepository } from '../ports/patient-repository';
import type { Patient } from '../../domain/patient';
import { ValidationError } from '@/src/shared/domain/errors';

export interface CreatePatientInput {
  name: string;
  age: number;
  email: string;
  phone: string;
}

export class CreatePatientUseCase {
  constructor(private readonly repo: PatientRepository) {}

  async execute(input: CreatePatientInput): Promise<Patient> {
    const name = input.name.trim();
    if (!name) throw new ValidationError('Name is required');

    if (isNaN(input.age) || input.age < 0 || input.age > 130) {
      throw new ValidationError('Age must be between 0 and 130');
    }

    const email = input.email.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ValidationError('Invalid email');
    }

    const phone = input.phone.trim();
    if (!phone) throw new ValidationError('Phone is required');

    const today = new Date().toISOString().split('T')[0];

    return this.repo.create({
      name,
      age: input.age,
      email,
      phone,
      since: today,
      lastVisit: today,
      status: 'activo',
      history: [],
    });
  }
}
