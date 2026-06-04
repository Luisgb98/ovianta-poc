import { describe, it, expect, beforeEach } from 'vitest';
import { GetPatientByIdUseCase } from './get-patient-by-id.use-case';
import { InMemoryPatientRepository } from '../../infrastructure/in-memory-patient-repository';
import type { Patient } from '../../domain/patient';

const PATIENT: Patient = {
  id: 'PT-001',
  name: 'Ana Torres',
  age: 34,
  email: 'ana@test.com',
  phone: '+34 600 000 001',
  since: '2021-01-01',
  lastVisit: '2026-05-01',
  status: 'completed',
  history: [],
};

describe('GetPatientByIdUseCase', () => {
  let useCase: GetPatientByIdUseCase;

  beforeEach(() => {
    useCase = new GetPatientByIdUseCase(new InMemoryPatientRepository([PATIENT]));
  });

  it('returns the patient when found', async () => {
    const result = await useCase.execute('PT-001');
    expect(result?.name).toBe('Ana Torres');
    expect(result?.id).toBe('PT-001');
  });

  it('returns null when patient does not exist', async () => {
    const result = await useCase.execute('PT-999');
    expect(result).toBeNull();
  });
});
