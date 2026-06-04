import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { MongoAppointmentRepository } from '@/src/modules/appointments/infrastructure/mongo-appointment-repository';
import { RescheduleAppointmentUseCase } from '@/src/modules/appointments/application/use-cases/reschedule-appointment.use-case';
import { CancelAppointmentUseCase } from '@/src/modules/appointments/application/use-cases/cancel-appointment.use-case';
import { withApiHandler } from '@/src/shared/infrastructure/api-handler';
import { NotFoundError } from '@/src/shared/domain/errors';

const repo = new MongoAppointmentRepository();

export const GET = withApiHandler(async (_req: NextRequest, { params }) => {
  const { id } = await params;
  const appointment = await repo.findById(id);
  if (!appointment) throw new NotFoundError('Appointment', id);
  return NextResponse.json({ success: true, data: appointment });
});

const PatchSchema = z.object({
  start: z.string().optional(),
  durationMin: z.number().int().min(5).max(480).optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled', 'no-show']).optional(),
  doctor: z.string().min(1).optional(),
  type: z.string().min(1).optional(),
  notes: z.string().optional(),
});

export const PATCH = withApiHandler(async (req: NextRequest, { params }) => {
  const { id } = await params;
  const parsed = PatchSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid input', code: 'VALIDATION_ERROR' },
      { status: 400 }
    );
  }

  const patch = parsed.data;

  if (patch.start !== undefined) {
    const useCase = new RescheduleAppointmentUseCase(repo);
    const updated = await useCase.execute({
      id,
      start: patch.start,
      durationMin: patch.durationMin,
    });
    return NextResponse.json({ success: true, data: updated });
  }

  if (patch.status === 'cancelled') {
    const useCase = new CancelAppointmentUseCase(repo);
    const updated = await useCase.execute(id);
    return NextResponse.json({ success: true, data: updated });
  }

  const updated = await repo.update(id, patch);
  if (!updated) throw new NotFoundError('Appointment', id);
  return NextResponse.json({ success: true, data: updated });
});

export const DELETE = withApiHandler(async (_req: NextRequest, { params }) => {
  const { id } = await params;
  const deleted = await repo.delete(id);
  if (!deleted) throw new NotFoundError('Appointment', id);
  return NextResponse.json({ success: true, data: null });
});
