import 'dotenv/config';
import mongoose, { Schema, Model } from 'mongoose';
import { SEED_PATIENTS } from '../src/modules/patients/infrastructure/seed-patients';

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is not set');
  process.exit(1);
}

const PatientSchema = new Schema(
  {
    _id: { type: String },
    name: String,
    age: Number,
    email: String,
    phone: String,
    since: String,
    lastVisit: String,
    status: String,
    history: { type: Array, default: [] },
  },
  { _id: false }
);

async function seed() {
  await mongoose.connect(uri as string);
  const Patient = (mongoose.models.Patient ?? mongoose.model('Patient', PatientSchema)) as Model<
    Record<string, unknown>
  >;

  await Patient.deleteMany({});
  const docs = SEED_PATIENTS.map(p => ({ _id: p.id, ...p }));
  await Patient.insertMany(docs);

  console.log(`Seeded ${docs.length} patients.`);
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
