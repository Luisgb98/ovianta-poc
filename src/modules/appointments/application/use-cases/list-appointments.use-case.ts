import type { AppointmentRepository } from '../ports/appointment-repository';
import type { Appointment } from '../../domain/appointment';

interface ListInput {
  from?: string;
  to?: string;
}

export class ListAppointmentsUseCase {
  constructor(private readonly repo: AppointmentRepository) {}

  async execute(input?: ListInput): Promise<Appointment[]> {
    if (input?.from && input?.to) {
      return this.repo.findInRange(input.from, input.to);
    }
    return this.repo.findAll();
  }
}
