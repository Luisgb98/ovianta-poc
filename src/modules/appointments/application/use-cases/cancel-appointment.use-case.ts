import { NotFoundError } from '@/src/shared/domain/errors';
import type { AppointmentRepository } from '../ports/appointment-repository';
import type { Appointment } from '../../domain/appointment';

export class CancelAppointmentUseCase {
  constructor(private readonly repo: AppointmentRepository) {}

  async execute(id: string): Promise<Appointment> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundError('Appointment', id);

    const updated = await this.repo.update(id, { status: 'cancelled' });
    if (!updated) throw new NotFoundError('Appointment', id);
    return updated;
  }
}
