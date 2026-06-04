import { NextResponse } from 'next/server';
import { z } from 'zod';
import { MongoPatientRepository } from '@/src/modules/patients/infrastructure/mongo-patient-repository';
import { withApiHandler } from '@/src/shared/infrastructure/api-handler';
import { NotFoundError } from '@/src/shared/domain/errors';

const repo = new MongoPatientRepository();

export const GET = withApiHandler(async (_req, { params }) => {
  const { id } = await params;
  const patient = await repo.findById(id);
  if (!patient) throw new NotFoundError('Patient', id);
  return NextResponse.json({ success: true, data: patient });
});

const PatchSchema = z.object({
  name: z.string().min(1).optional(),
  age: z.number().int().min(0).max(130).optional(),
});

export const PATCH = withApiHandler(async (req, { params }) => {
  const { id } = await params;
  const parsed = PatchSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid input', code: 'VALIDATION_ERROR' },
      { status: 400 }
    );
  }
  const updated = await repo.update(id, parsed.data);
  if (!updated) throw new NotFoundError('Patient', id);
  return NextResponse.json({ success: true, data: updated });
});
