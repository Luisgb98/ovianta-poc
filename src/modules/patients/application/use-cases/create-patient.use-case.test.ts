import { describe, it, expect, beforeEach } from 'vitest';
import { CreatePatientUseCase } from './create-patient.use-case';
import { InMemoryPatientRepository } from '../../infrastructure/in-memory-patient-repository';
import { ValidationError } from '@/src/shared/domain/errors';

describe('CreatePatientUseCase', () => {
  let useCase: CreatePatientUseCase;

  beforeEach(() => {
    useCase = new CreatePatientUseCase(new InMemoryPatientRepository([]));
  });

  const VALID = { name: 'Ana Torres', age: 34, email: 'ana@test.com', phone: '+34 600 000 001' };

  it('creates a patient and returns it with an id', async () => {
    const patient = await useCase.execute(VALID);
    expect(patient.id).toBeTruthy();
    expect(patient.name).toBe('Ana Torres');
    expect(patient.age).toBe(34);
    expect(patient.email).toBe('ana@test.com');
    expect(patient.phone).toBe('+34 600 000 001');
    expect(patient.status).toBe('active');
    expect(patient.history).toEqual([]);
  });

  it('trims name and email before saving', async () => {
    const patient = await useCase.execute({ ...VALID, name: '  Ana  ', email: '  ana@test.com  ' });
    expect(patient.name).toBe('Ana');
    expect(patient.email).toBe('ana@test.com');
  });

  it('sets since and lastVisit to today', async () => {
    const today = new Date().toISOString().split('T')[0];
    const patient = await useCase.execute(VALID);
    expect(patient.since).toBe(today);
    expect(patient.lastVisit).toBe(today);
  });

  it('throws ValidationError when name is empty', async () => {
    await expect(useCase.execute({ ...VALID, name: '   ' })).rejects.toThrow(ValidationError);
    await expect(useCase.execute({ ...VALID, name: '' })).rejects.toThrow('Name is required');
  });

  it('throws ValidationError when age is NaN', async () => {
    await expect(useCase.execute({ ...VALID, age: NaN })).rejects.toThrow(ValidationError);
  });

  it('throws ValidationError when age is negative', async () => {
    await expect(useCase.execute({ ...VALID, age: -1 })).rejects.toThrow(ValidationError);
  });

  it('throws ValidationError when age exceeds 130', async () => {
    await expect(useCase.execute({ ...VALID, age: 131 })).rejects.toThrow(ValidationError);
  });

  it('accepts boundary ages 0 and 130', async () => {
    await expect(useCase.execute({ ...VALID, age: 0 })).resolves.toBeDefined();
    await expect(useCase.execute({ ...VALID, age: 130 })).resolves.toBeDefined();
  });

  it('throws ValidationError for invalid email', async () => {
    await expect(useCase.execute({ ...VALID, email: 'not-an-email' })).rejects.toThrow(
      ValidationError
    );
    await expect(useCase.execute({ ...VALID, email: '' })).rejects.toThrow('Invalid email');
  });

  it('throws ValidationError when phone is empty', async () => {
    await expect(useCase.execute({ ...VALID, phone: '   ' })).rejects.toThrow(ValidationError);
    await expect(useCase.execute({ ...VALID, phone: '' })).rejects.toThrow('Phone is required');
  });
});
