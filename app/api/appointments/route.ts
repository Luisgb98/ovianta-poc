import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { MongoAppointmentRepository } from '@/src/modules/appointments/infrastructure/mongo-appointment-repository';
import { CreateAppointmentUseCase } from '@/src/modules/appointments/application/use-cases/create-appointment.use-case';
import { withApiHandler } from '@/src/shared/infrastructure/api-handler';

const repo = new MongoAppointmentRepository();

export const GET = withApiHandler(async (req: NextRequest) => {
  const from = req.nextUrl.searchParams.get('from') ?? undefined;
  const to = req.nextUrl.searchParams.get('to') ?? undefined;

  const data = from && to ? await repo.findInRange(from, to) : await repo.findAll();
  return NextResponse.json({ success: true, data });
});

const CreateSchema = z.object({
  patientId: z.string().min(1),
  patientName: z.string().min(1),
  doctor: z.string().min(1),
  type: z.string().min(1),
  start: z.string().min(1),
  durationMin: z.number().int().min(5).max(480),
  notes: z.string().optional(),
});

export const POST = withApiHandler(async (req: NextRequest) => {
  const parsed = CreateSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid input', code: 'VALIDATION_ERROR' },
      { status: 400 }
    );
  }

  const useCase = new CreateAppointmentUseCase(repo);
  const appointment = await useCase.execute(parsed.data);
  return NextResponse.json({ success: true, data: appointment }, { status: 201 });
});
