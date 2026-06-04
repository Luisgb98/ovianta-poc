import mongoose, { Schema, Model } from 'mongoose';
import { connectDb } from '@/src/shared/infrastructure/mongoose';
import type { AppointmentRepository } from '../application/ports/appointment-repository';
import type { Appointment, AppointmentPatch, AppointmentStatus } from '../domain/appointment';

const VALID_STATUSES: AppointmentStatus[] = ['scheduled', 'completed', 'cancelled', 'no-show'];

function normalizeStatus(s: string): AppointmentStatus {
  return (VALID_STATUSES.includes(s as AppointmentStatus) ? s : 'scheduled') as AppointmentStatus;
}

const AppointmentSchema = new Schema(
  {
    _id: { type: String },
    patientId: { type: String, required: true, index: true },
    patientName: { type: String, required: true },
    doctor: { type: String, required: true, index: true },
    type: { type: String, required: true },
    status: { type: String, required: true, default: 'scheduled' },
    start: { type: String, required: true, index: true },
    durationMin: { type: Number, required: true },
    notes: { type: String, default: '' },
  },
  { _id: false }
);

type AppointmentDoc = Omit<Appointment, 'id'> & { _id: string };

function getModel(): Model<AppointmentDoc> {
  return (mongoose.models.Appointment ??
    mongoose.model<AppointmentDoc>('Appointment', AppointmentSchema)) as Model<AppointmentDoc>;
}

function docToAppointment(doc: Record<string, unknown> & { _id: string }): Appointment {
  const { _id, ...rest } = doc;
  const a = { id: _id, ...(rest as Omit<Appointment, 'id'>) };
  a.status = normalizeStatus(a.status);
  return a;
}

async function nextId(): Promise<string> {
  const last = await getModel().findOne({}, { _id: 1 }).sort({ _id: -1 }).lean();
  if (!last) return 'AP-00001';
  const num = parseInt((last._id as string).replace('AP-', ''), 10);
  return `AP-${String(num + 1).padStart(5, '0')}`;
}

export class MongoAppointmentRepository implements AppointmentRepository {
  async findAll(): Promise<Appointment[]> {
    await connectDb();
    const docs = await getModel().find({}).sort({ start: 1 }).lean();
    return docs.map(d => docToAppointment(d as Record<string, unknown> & { _id: string }));
  }

  async findInRange(fromISO: string, toISO: string): Promise<Appointment[]> {
    await connectDb();
    const docs = await getModel()
      .find({ start: { $gte: fromISO, $lt: toISO } })
      .sort({ start: 1 })
      .lean();
    return docs.map(d => docToAppointment(d as Record<string, unknown> & { _id: string }));
  }

  async findById(id: string): Promise<Appointment | null> {
    await connectDb();
    const doc = await getModel().findById(id).lean();
    return doc ? docToAppointment(doc as Record<string, unknown> & { _id: string }) : null;
  }

  async create(data: Omit<Appointment, 'id'>): Promise<Appointment> {
    await connectDb();
    const id = await nextId();
    const doc = await getModel().create({ _id: id, ...data });
    return docToAppointment(doc.toObject() as Record<string, unknown> & { _id: string });
  }

  async update(id: string, patch: AppointmentPatch): Promise<Appointment | null> {
    await connectDb();
    const doc = await getModel().findByIdAndUpdate(id, { $set: patch }, { new: true }).lean();
    return doc ? docToAppointment(doc as Record<string, unknown> & { _id: string }) : null;
  }

  async delete(id: string): Promise<boolean> {
    await connectDb();
    const result = await getModel().findByIdAndDelete(id);
    return result !== null;
  }
}
