import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { MongoPatientRepository } from '@/src/modules/patients/infrastructure/mongo-patient-repository';

const repo = new MongoPatientRepository();

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patient = await repo.findById(id);
  if (!patient) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, data: patient });
}

const PatchSchema = z.object({
  name: z.string().min(1).optional(),
  age: z.number().int().min(0).max(130).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = PatchSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
  }
  const updated = await repo.update(id, parsed.data);
  if (!updated) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, data: updated });
}
