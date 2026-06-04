import { NotFoundError } from '@/src/shared/domain/errors';
import type { AppointmentRepository } from '../ports/appointment-repository';
import type { Appointment } from '../../domain/appointment';

export class GetAppointmentByIdUseCase {
  constructor(private readonly repo: AppointmentRepository) {}

  async execute(id: string): Promise<Appointment> {
    const appt = await this.repo.findById(id);
    if (!appt) throw new NotFoundError('Appointment', id);
    return appt;
  }
}
