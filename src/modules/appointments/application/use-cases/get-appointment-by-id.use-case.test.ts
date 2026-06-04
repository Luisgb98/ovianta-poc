import { describe, it, expect, beforeEach } from 'vitest';
import { GetAppointmentByIdUseCase } from './get-appointment-by-id.use-case';
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

describe('GetAppointmentByIdUseCase', () => {
  let useCase: GetAppointmentByIdUseCase;

  beforeEach(() => {
    useCase = new GetAppointmentByIdUseCase(new InMemoryAppointmentRepository([APPT]));
  });

  it('returns the appointment when found', async () => {
    const result = await useCase.execute('AP-00001');
    expect(result.id).toBe('AP-00001');
    expect(result.patientName).toBe('Ana Torres');
  });

  it('throws NotFoundError for unknown id', async () => {
    await expect(useCase.execute('AP-99999')).rejects.toThrow(NotFoundError);
  });
});
