import { describe, it, expect, beforeEach } from 'vitest';
import { CancelAppointmentUseCase } from './cancel-appointment.use-case';
import { InMemoryAppointmentRepository } from '../../infrastructure/in-memory-appointment-repository';
import { NotFoundError } from '@/src/shared/domain/errors';
import type { Appointment } from '../../domain/appointment';

const APPT: Appointment = {
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

describe('CancelAppointmentUseCase', () => {
  let useCase: CancelAppointmentUseCase;

  beforeEach(() => {
    useCase = new CancelAppointmentUseCase(new InMemoryAppointmentRepository([APPT]));
  });

  it('sets status to cancelled', async () => {
    const result = await useCase.execute('AP-00001');
    expect(result.status).toBe('cancelled');
  });

  it('preserves other fields', async () => {
    const result = await useCase.execute('AP-00001');
    expect(result.patientName).toBe('Ana Torres');
    expect(result.doctor).toBe('Dra. Elena Ruiz');
  });

  it('throws NotFoundError for unknown id', async () => {
    await expect(useCase.execute('AP-99999')).rejects.toThrow(NotFoundError);
  });
});
