import { describe, it, expect, beforeEach } from 'vitest';
import { ListAppointmentsUseCase } from './list-appointments.use-case';
import { InMemoryAppointmentRepository } from '../../infrastructure/in-memory-appointment-repository';
import type { Appointment } from '../../domain/appointment';

const BASE: Appointment = {
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

const LATER: Appointment = {
  ...BASE,
  id: 'AP-00002',
  start: '2026-06-05T10:00:00',
};

describe('ListAppointmentsUseCase', () => {
  let useCase: ListAppointmentsUseCase;

  beforeEach(() => {
    useCase = new ListAppointmentsUseCase(new InMemoryAppointmentRepository([BASE, LATER]));
  });

  it('returns all appointments when no range given', async () => {
    const result = await useCase.execute();
    expect(result).toHaveLength(2);
  });

  it('filters by date range', async () => {
    const result = await useCase.execute({
      from: '2026-06-04T00:00:00',
      to: '2026-06-05T00:00:00',
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('AP-00001');
  });

  it('returns empty array when range matches nothing', async () => {
    const result = await useCase.execute({
      from: '2026-07-01T00:00:00',
      to: '2026-07-02T00:00:00',
    });
    expect(result).toHaveLength(0);
  });
});
