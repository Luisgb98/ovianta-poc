import 'dotenv/config';
import mongoose, { Schema, Model } from 'mongoose';
import { SEED_PATIENTS } from '../src/modules/patients/infrastructure/seed-patients';
import { SEED_APPOINTMENTS } from '../src/modules/appointments/infrastructure/seed-appointments';

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

const AppointmentSchema = new Schema(
  {
    _id: { type: String },
    patientId: String,
    patientName: String,
    doctor: String,
    type: String,
    status: String,
    start: String,
    durationMin: Number,
    notes: String,
  },
  { _id: false }
);

async function seed() {
  await mongoose.connect(uri as string);

  const Patient = (mongoose.models.Patient ?? mongoose.model('Patient', PatientSchema)) as Model<
    Record<string, unknown>
  >;

  const Appointment = (mongoose.models.Appointment ??
    mongoose.model('Appointment', AppointmentSchema)) as Model<Record<string, unknown>>;

  // Patients
  await Patient.deleteMany({});
  const patientDocs = SEED_PATIENTS.map(p => ({ _id: p.id, ...p }));
  await Patient.insertMany(patientDocs);
  console.log(`✓ Seeded ${patientDocs.length} patients.`);

  // Appointments
  await Appointment.deleteMany({});
  const appointmentDocs = SEED_APPOINTMENTS.map(a => ({ _id: a.id, ...a }));
  await Appointment.insertMany(appointmentDocs);
  console.log(`✓ Seeded ${appointmentDocs.length} appointments.`);

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
