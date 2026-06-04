import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryAppointmentRepository } from './in-memory-appointment-repository';
import type { Appointment } from '../domain/appointment';

const A1: Appointment = {
  id: 'AP-00001',
  patientId: 'PT-00001',
  patientName: 'Ana Torres',
  doctor: 'Dra. Elena Ruiz',
  type: 'Revisión general',
  status: 'scheduled',
  start: '2026-06-04T09:00:00',
  durationMin: 30,
  notes: '',
};

const A2: Appointment = {
  ...A1,
  id: 'AP-00002',
  start: '2026-06-05T10:00:00',
};

describe('InMemoryAppointmentRepository', () => {
  let repo: InMemoryAppointmentRepository;

  beforeEach(() => {
    repo = new InMemoryAppointmentRepository([A1, A2]);
  });

  it('findAll returns all appointments', async () => {
    expect(await repo.findAll()).toHaveLength(2);
  });

  it('findInRange filters correctly', async () => {
    const result = await repo.findInRange('2026-06-04T00:00:00', '2026-06-05T00:00:00');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('AP-00001');
  });

  it('findById returns correct appointment', async () => {
    const result = await repo.findById('AP-00002');
    expect(result?.start).toBe('2026-06-05T10:00:00');
  });

  it('findById returns null for unknown id', async () => {
    expect(await repo.findById('AP-99999')).toBeNull();
  });

  it('create adds and returns with generated id', async () => {
    const { id: _id, ...data } = A1;
    const result = await repo.create({ ...data, start: '2026-06-06T08:00:00' });
    expect(result.id).toBeTruthy();
    expect(result.id).not.toBe('AP-00001');
    expect(await repo.findAll()).toHaveLength(3);
  });

  it('update patches fields immutably', async () => {
    const updated = await repo.update('AP-00001', { status: 'completed' });
    expect(updated?.status).toBe('completed');
    const untouched = await repo.findById('AP-00002');
    expect(untouched?.status).toBe('scheduled');
  });

  it('update returns null for unknown id', async () => {
    expect(await repo.update('AP-99999', { status: 'cancelled' })).toBeNull();
  });

  it('delete removes the appointment', async () => {
    expect(await repo.delete('AP-00001')).toBe(true);
    expect(await repo.findAll()).toHaveLength(1);
  });

  it('delete returns false for unknown id', async () => {
    expect(await repo.delete('AP-99999')).toBe(false);
  });
});
