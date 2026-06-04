import { parseISO, isValid } from 'date-fns';
import { ValidationError, NotFoundError, ConflictError } from '@/src/shared/domain/errors';
import { hasConflict } from '../../domain/conflict';
import type { AppointmentRepository } from '../ports/appointment-repository';
import type { Appointment } from '../../domain/appointment';

export interface RescheduleInput {
  id: string;
  start: string;
  durationMin?: number;
}

export class RescheduleAppointmentUseCase {
  constructor(private readonly repo: AppointmentRepository) {}

  async execute(input: RescheduleInput): Promise<Appointment> {
    const start = input.start.trim();
    if (!start || !isValid(parseISO(start))) throw new ValidationError('Invalid start datetime');

    const existing = await this.repo.findById(input.id);
    if (!existing) throw new NotFoundError('Appointment', input.id);

    const durationMin = input.durationMin ?? existing.durationMin;
    if (!Number.isInteger(durationMin) || durationMin <= 0) {
      throw new ValidationError('Duration must be a positive integer');
    }

    const all = await this.repo.findAll();
    if (hasConflict(all, { id: input.id, doctor: existing.doctor, start, durationMin }, input.id)) {
      throw new ConflictError(
        `Doctor ${existing.doctor} has a conflicting appointment at this time`
      );
    }

    const updated = await this.repo.update(input.id, { start, durationMin });
    if (!updated) throw new NotFoundError('Appointment', input.id);
    return updated;
  }
}
