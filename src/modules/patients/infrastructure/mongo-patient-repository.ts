import mongoose, { Schema, Model } from 'mongoose';
import { connectDb } from '@/src/shared/infrastructure/mongoose';
import type { PatientRepository } from '../application/ports/patient-repository';
import type { Patient, PatientPatch } from '../domain/patient';

const ConsultationSchema = new Schema(
  {
    id: { type: String, required: true },
    date: { type: String, required: true },
    type: { type: String, required: true },
    doctor: { type: String, required: true },
    status: { type: String, required: true },
    note: { type: String, required: true },
  },
  { _id: false }
);

const PatientSchema = new Schema(
  {
    _id: { type: String },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    since: { type: String, required: true },
    lastVisit: { type: String, required: true },
    status: { type: String, required: true },
    history: { type: [ConsultationSchema], default: [] },
  },
  { _id: false }
);

type PatientDoc = Omit<Patient, 'id'> & { _id: string };

function getModel(): Model<PatientDoc> {
  return (mongoose.models.Patient ?? mongoose.model('Patient', PatientSchema)) as Model<PatientDoc>;
}

function docToPatient(doc: Record<string, unknown> & { _id: string }): Patient {
  const { _id, ...rest } = doc;
  return { id: _id, ...(rest as Omit<Patient, 'id'>) };
}

async function nextId(): Promise<string> {
  const last = await getModel().findOne({}, { _id: 1 }).sort({ _id: -1 }).lean();
  if (!last) return 'PT-00001';
  const num = parseInt((last._id as string).replace('PT-', ''), 10);
  return `PT-${String(num + 1).padStart(5, '0')}`;
}

export class MongoPatientRepository implements PatientRepository {
  async findAll(query?: string): Promise<Patient[]> {
    await connectDb();
    const filter = query
      ? {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { _id: { $regex: query, $options: 'i' } },
          ],
        }
      : {};
    const docs = await getModel().find(filter).lean();
    return docs.map(d => docToPatient(d as Record<string, unknown> & { _id: string }));
  }

  async findById(id: string): Promise<Patient | null> {
    await connectDb();
    const doc = await getModel().findById(id).lean();
    return doc ? docToPatient(doc as Record<string, unknown> & { _id: string }) : null;
  }

  async create(data: Omit<Patient, 'id'>): Promise<Patient> {
    await connectDb();
    const id = await nextId();
    const doc = await getModel().create({ _id: id, ...data });
    return docToPatient(doc.toObject() as Record<string, unknown> & { _id: string });
  }

  async update(id: string, patch: PatientPatch): Promise<Patient | null> {
    await connectDb();
    const doc = await getModel().findByIdAndUpdate(id, { $set: patch }, { new: true }).lean();
    return doc ? docToPatient(doc as Record<string, unknown> & { _id: string }) : null;
  }

  async delete(id: string): Promise<boolean> {
    await connectDb();
    const result = await getModel().findByIdAndDelete(id);
    return result !== null;
  }
}
