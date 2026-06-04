import { describe, it, expect, beforeEach } from 'vitest';
import { UpdatePatientUseCase } from './update-patient.use-case';
import { InMemoryPatientRepository } from '../../infrastructure/in-memory-patient-repository';
import { NotFoundError, ValidationError } from '@/src/shared/domain/errors';
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

describe('UpdatePatientUseCase', () => {
  let useCase: UpdatePatientUseCase;

  beforeEach(() => {
    useCase = new UpdatePatientUseCase(new InMemoryPatientRepository([PATIENT]));
  });

  it('updates name and returns the updated patient', async () => {
    const result = await useCase.execute('PT-001', { name: 'Ana García' });
    expect(result.name).toBe('Ana García');
    expect(result.id).toBe('PT-001');
  });

  it('updates age and returns the updated patient', async () => {
    const result = await useCase.execute('PT-001', { age: 40 });
    expect(result.age).toBe(40);
  });

  it('trims whitespace from name', async () => {
    const result = await useCase.execute('PT-001', { name: '  Ana García  ' });
    expect(result.name).toBe('Ana García');
  });

  it('preserves fields that are not in the patch', async () => {
    const result = await useCase.execute('PT-001', { age: 99 });
    expect(result.name).toBe('Ana Torres');
    expect(result.email).toBe('ana@test.com');
  });

  it('throws NotFoundError when patient does not exist', async () => {
    await expect(useCase.execute('PT-999', { name: 'Ghost' })).rejects.toThrow(NotFoundError);
    await expect(useCase.execute('PT-999', { name: 'Ghost' })).rejects.toThrow('PT-999');
  });

  it('throws ValidationError when name is empty string', async () => {
    await expect(useCase.execute('PT-001', { name: '' })).rejects.toThrow(ValidationError);
    await expect(useCase.execute('PT-001', { name: '   ' })).rejects.toThrow(
      'Name cannot be empty'
    );
  });

  it('throws ValidationError when age is negative', async () => {
    await expect(useCase.execute('PT-001', { age: -1 })).rejects.toThrow(ValidationError);
  });

  it('throws ValidationError when age exceeds 130', async () => {
    await expect(useCase.execute('PT-001', { age: 131 })).rejects.toThrow(ValidationError);
  });

  it('accepts boundary ages 0 and 130', async () => {
    await expect(useCase.execute('PT-001', { age: 0 })).resolves.toBeDefined();
    await expect(useCase.execute('PT-001', { age: 130 })).resolves.toBeDefined();
  });

  it('accepts an empty patch without throwing', async () => {
    const result = await useCase.execute('PT-001', {});
    expect(result.name).toBe('Ana Torres');
  });
});
