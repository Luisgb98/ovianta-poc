import { describe, it, expect, beforeEach } from 'vitest';
import { ListPatientsUseCase } from './list-patients.use-case';
import { InMemoryPatientRepository } from '../../infrastructure/in-memory-patient-repository';
import type { Patient } from '../../domain/patient';

const PATIENTS: Patient[] = [
  {
    id: 'PT-001',
    name: 'Ana Torres',
    age: 34,
    email: 'ana@test.com',
    phone: '+34 600 000 001',
    since: '2021-01-01',
    lastVisit: '2026-05-01',
    status: 'completed',
    history: [],
  },
  {
    id: 'PT-002',
    name: 'Marco Rossi',
    age: 51,
    email: 'marco@test.com',
    phone: '+39 333 000 002',
    since: '2019-06-15',
    lastVisit: '2026-04-01',
    status: 'pending',
    history: [],
  },
];

describe('ListPatientsUseCase', () => {
  let useCase: ListPatientsUseCase;

  beforeEach(() => {
    useCase = new ListPatientsUseCase(new InMemoryPatientRepository(PATIENTS));
  });

  it('returns all patients when no query is given', async () => {
    const result = await useCase.execute();
    expect(result).toHaveLength(2);
  });

  it('filters patients by query', async () => {
    const result = await useCase.execute('ana');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('PT-001');
  });

  it('returns empty array when no patients match', async () => {
    const result = await useCase.execute('nonexistent');
    expect(result).toHaveLength(0);
  });

  it('returns empty list when repository has no patients', async () => {
    const empty = new ListPatientsUseCase(new InMemoryPatientRepository([]));
    const result = await empty.execute();
    expect(result).toEqual([]);
  });
});
