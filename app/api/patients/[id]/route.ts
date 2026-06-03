import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getPatientById, updatePatient } from '@/src/shared/infrastructure/patient-store';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patient = getPatientById(id);
  if (!patient) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, data: patient });
}

const PatchSchema = z.object({
  name: z.string().min(1).optional(),
  age: z.number().int().min(0).max(130).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
  }
  const updated = updatePatient(id, parsed.data);
  if (!updated) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, data: updated });
}
