import { parseISO, isValid } from 'date-fns';
import { ValidationError, ConflictError } from '@/src/shared/domain/errors';
import { hasConflict } from '../../domain/conflict';
import type { AppointmentRepository } from '../ports/appointment-repository';
import type { Appointment } from '../../domain/appointment';

export interface CreateAppointmentInput {
  patientId: string;
  patientName: string;
  doctor: string;
  type: string;
  start: string;
  durationMin: number;
  notes?: string;
}

export class CreateAppointmentUseCase {
  constructor(private readonly repo: AppointmentRepository) {}

  async execute(input: CreateAppointmentInput): Promise<Appointment> {
    const patientId = input.patientId.trim();
    const patientName = input.patientName.trim();
    const doctor = input.doctor.trim();
    const type = input.type.trim();
    const start = input.start.trim();
    const notes = (input.notes ?? '').trim();
    const { durationMin } = input;

    if (!patientId) throw new ValidationError('Patient ID is required');
    if (!patientName) throw new ValidationError('Patient name is required');
    if (!doctor) throw new ValidationError('Doctor is required');
    if (!type) throw new ValidationError('Appointment type is required');
    if (!start || !isValid(parseISO(start))) throw new ValidationError('Invalid start datetime');
    if (!Number.isInteger(durationMin) || durationMin <= 0) {
      throw new ValidationError('Duration must be a positive integer');
    }

    const all = await this.repo.findAll();
    if (hasConflict(all, { doctor, start, durationMin })) {
      throw new ConflictError(`Doctor ${doctor} has a conflicting appointment at this time`);
    }

    return this.repo.create({
      patientId,
      patientName,
      doctor,
      type,
      status: 'scheduled',
      start,
      durationMin,
      notes,
    });
  }
}
