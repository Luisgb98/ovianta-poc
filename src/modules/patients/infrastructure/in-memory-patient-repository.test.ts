import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryPatientRepository } from './in-memory-patient-repository';
import type { Patient } from '../domain/patient';

const PATIENT_A: Patient = {
  id: 'PT-001',
  name: 'Ana Torres',
  age: 34,
  email: 'ana@test.com',
  phone: '+34 600 000 001',
  since: '2021-01-01',
  lastVisit: '2026-05-01',
  status: 'completada',
  history: [
    {
      id: 'c-001-1',
      date: '2026-05-01',
      type: 'Revisión',
      doctor: 'Dr. Test',
      status: 'completada',
      note: 'Sin incidencias.',
    },
  ],
};

const PATIENT_B: Patient = {
  id: 'PT-002',
  name: 'Marco Rossi',
  age: 51,
  email: 'marco@test.com',
  phone: '+39 333 000 002',
  since: '2019-06-15',
  lastVisit: '2026-04-01',
  status: 'pendiente',
  history: [],
};

describe('InMemoryPatientRepository', () => {
  let repo: InMemoryPatientRepository;

  beforeEach(() => {
    repo = new InMemoryPatientRepository([PATIENT_A, PATIENT_B]);
  });

  describe('findAll', () => {
    it('returns all patients when no query is given', async () => {
      const result = await repo.findAll();
      expect(result).toHaveLength(2);
    });

    it('filters by name (case-insensitive)', async () => {
      const result = await repo.findAll('ana');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('PT-001');
    });

    it('filters by ID', async () => {
      const result = await repo.findAll('PT-002');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('PT-002');
    });

    it('returns empty array when no match', async () => {
      const result = await repo.findAll('nonexistent');
      expect(result).toHaveLength(0);
    });

    it('does not mutate the internal list', async () => {
      const first = await repo.findAll();
      first.push({ ...PATIENT_A, id: 'PT-999' });
      const second = await repo.findAll();
      expect(second).toHaveLength(2);
    });
  });

  describe('findById', () => {
    it('returns the patient when found', async () => {
      const result = await repo.findById('PT-001');
      expect(result?.name).toBe('Ana Torres');
    });

    it('returns null when not found', async () => {
      const result = await repo.findById('PT-999');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('adds a new patient and assigns an id', async () => {
      const { id: _id, ...data } = PATIENT_A;
      const created = await repo.create({ ...data, name: 'Nuevo Paciente' });
      expect(created.id).toBeTruthy();
      expect(created.name).toBe('Nuevo Paciente');
      const all = await repo.findAll();
      expect(all).toHaveLength(3);
    });

    it('does not mutate the original data object', async () => {
      const { id: _id, ...data } = PATIENT_B;
      await repo.create(data);
      expect(data).not.toHaveProperty('id');
    });
  });

  describe('update', () => {
    it('updates name and age immutably', async () => {
      const updated = await repo.update('PT-001', { name: 'Ana García', age: 35 });
      expect(updated?.name).toBe('Ana García');
      expect(updated?.age).toBe(35);
    });

    it('does not mutate the original patient object', async () => {
      const original = (await repo.findById('PT-001'))!;
      await repo.update('PT-001', { name: 'Changed' });
      expect(original.name).toBe('Ana Torres');
    });

    it('returns null when patient does not exist', async () => {
      const result = await repo.update('PT-999', { name: 'Ghost' });
      expect(result).toBeNull();
    });

    it('preserves unchanged fields', async () => {
      const updated = await repo.update('PT-001', { age: 99 });
      expect(updated?.name).toBe('Ana Torres');
      expect(updated?.email).toBe('ana@test.com');
    });
  });

  describe('delete', () => {
    it('removes the patient and returns true', async () => {
      const deleted = await repo.delete('PT-001');
      expect(deleted).toBe(true);
      const all = await repo.findAll();
      expect(all).toHaveLength(1);
    });

    it('returns false when patient does not exist', async () => {
      const result = await repo.delete('PT-999');
      expect(result).toBe(false);
    });
  });
});
