import { describe, it, expect, beforeEach } from 'vitest';
import { RescheduleAppointmentUseCase } from './reschedule-appointment.use-case';
import { InMemoryAppointmentRepository } from '../../infrastructure/in-memory-appointment-repository';
import { ValidationError, NotFoundError, ConflictError } from '@/src/shared/domain/errors';
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

const BLOCKER: Appointment = {
  id: 'AP-00002',
  patientId: 'PT-00002',
  patientName: 'Carlos Díaz',
  doctor: 'Dra. Elena Ruiz',
  type: 'Control',
  status: 'scheduled',
  start: '2026-06-04T11:00:00',
  durationMin: 60,
  notes: '',
};

describe('RescheduleAppointmentUseCase', () => {
  let useCase: RescheduleAppointmentUseCase;

  beforeEach(() => {
    useCase = new RescheduleAppointmentUseCase(new InMemoryAppointmentRepository([APPT, BLOCKER]));
  });

  it('reschedules appointment to new time', async () => {
    const result = await useCase.execute({ id: 'AP-00001', start: '2026-06-04T14:00:00' });
    expect(result.start).toBe('2026-06-04T14:00:00');
    expect(result.durationMin).toBe(30);
  });

  it('updates duration when provided', async () => {
    const result = await useCase.execute({
      id: 'AP-00001',
      start: '2026-06-04T15:00:00',
      durationMin: 60,
    });
    expect(result.durationMin).toBe(60);
  });

  it('throws NotFoundError for unknown id', async () => {
    await expect(useCase.execute({ id: 'AP-99999', start: '2026-06-04T14:00:00' })).rejects.toThrow(
      NotFoundError
    );
  });

  it('throws ValidationError for invalid start', async () => {
    await expect(useCase.execute({ id: 'AP-00001', start: 'bad-date' })).rejects.toThrow(
      ValidationError
    );
  });

  it('throws ConflictError when new slot overlaps another appointment', async () => {
    await expect(useCase.execute({ id: 'AP-00001', start: '2026-06-04T11:00:00' })).rejects.toThrow(
      ConflictError
    );
  });

  it('does not conflict with itself when staying at same time', async () => {
    const result = await useCase.execute({ id: 'AP-00001', start: '2026-06-04T09:00:00' });
    expect(result.start).toBe('2026-06-04T09:00:00');
  });
});
