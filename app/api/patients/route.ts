import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { MongoPatientRepository } from '@/src/modules/patients/infrastructure/mongo-patient-repository';

const repo = new MongoPatientRepository();

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? undefined;
  const data = await repo.findAll(q);
  return NextResponse.json({ success: true, data });
}

const CreateSchema = z.object({
  name: z.string().min(1),
  age: z.number().int().min(0).max(130),
  email: z.string().email(),
  phone: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const parsed = CreateSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
  }
  const { name, age, email, phone } = parsed.data;
  const today = new Date().toISOString().split('T')[0];
  const patient = await repo.create({
    name,
    age,
    email,
    phone,
    since: today,
    lastVisit: today,
    status: 'activo',
    history: [],
  });
  return NextResponse.json({ success: true, data: patient }, { status: 201 });
}
