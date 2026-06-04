import { describe, it, expect, beforeEach } from 'vitest';
import { CreateAppointmentUseCase } from './create-appointment.use-case';
import { InMemoryAppointmentRepository } from '../../infrastructure/in-memory-appointment-repository';
import { ValidationError, ConflictError } from '@/src/shared/domain/errors';
import type { Appointment } from '../../domain/appointment';

const VALID = {
  patientId: 'PT-00001',
  patientName: 'Ana Torres',
  doctor: 'Dra. Elena Ruiz',
  type: 'Revisión general',
  start: '2026-06-04T09:00:00',
  durationMin: 30,
  notes: '',
};

const EXISTING: Appointment = {
  id: 'AP-00001',
  patientId: 'PT-00002',
  patientName: 'Carlos Díaz',
  doctor: 'Dra. Elena Ruiz',
  type: 'Control',
  status: 'scheduled',
  start: '2026-06-04T09:00:00',
  durationMin: 60,
  notes: '',
};

describe('CreateAppointmentUseCase', () => {
  let useCase: CreateAppointmentUseCase;

  beforeEach(() => {
    useCase = new CreateAppointmentUseCase(new InMemoryAppointmentRepository([]));
  });

  it('creates an appointment with generated id', async () => {
    const result = await useCase.execute(VALID);
    expect(result.id).toBeTruthy();
    expect(result.status).toBe('scheduled');
    expect(result.patientName).toBe('Ana Torres');
  });

  it('throws ValidationError when patientId is empty', async () => {
    await expect(useCase.execute({ ...VALID, patientId: '  ' })).rejects.toThrow(ValidationError);
  });

  it('throws ValidationError when doctor is empty', async () => {
    await expect(useCase.execute({ ...VALID, doctor: '' })).rejects.toThrow(ValidationError);
  });

  it('throws ValidationError for invalid start datetime', async () => {
    await expect(useCase.execute({ ...VALID, start: 'not-a-date' })).rejects.toThrow(
      ValidationError
    );
  });

  it('throws ValidationError when durationMin <= 0', async () => {
    await expect(useCase.execute({ ...VALID, durationMin: 0 })).rejects.toThrow(ValidationError);
  });

  it('throws ConflictError when same doctor overlaps', async () => {
    const repo = new InMemoryAppointmentRepository([EXISTING]);
    const conflictCase = new CreateAppointmentUseCase(repo);
    await expect(conflictCase.execute(VALID)).rejects.toThrow(ConflictError);
  });

  it('does not throw conflict for different doctor at same time', async () => {
    const repo = new InMemoryAppointmentRepository([EXISTING]);
    const noConflict = new CreateAppointmentUseCase(repo);
    const result = await noConflict.execute({ ...VALID, doctor: 'Dr. Andrés Vega' });
    expect(result.id).toBeTruthy();
  });

  it('does not throw conflict for cancelled appointment at same slot', async () => {
    const repo = new InMemoryAppointmentRepository([{ ...EXISTING, status: 'cancelled' }]);
    const noConflict = new CreateAppointmentUseCase(repo);
    const result = await noConflict.execute(VALID);
    expect(result.id).toBeTruthy();
  });
});
