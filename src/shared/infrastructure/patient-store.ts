import { SEED_PATIENTS } from '@/src/modules/patients/infrastructure/seed-patients';
import type { Patient, PatientPatch } from '@/src/modules/patients/domain/patient';

declare global {
  // eslint-disable-next-line no-var
  var __patientStore: { patients: Patient[]; counter: number } | undefined;
}

function getStore() {
  if (!global.__patientStore) {
    global.__patientStore = {
      patients: SEED_PATIENTS.map(p => ({ ...p, history: [...p.history] })),
      counter: 4831,
    };
  }
  return global.__patientStore;
}

function padId(n: number): string {
  return `PT-${String(n).padStart(5, '0')}`;
}

export function listPatients(query?: string): Patient[] {
  const { patients } = getStore();
  if (!query) return [...patients];
  const q = query.toLowerCase();
  return patients.filter(p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
}

export function getPatientById(id: string): Patient | null {
  return getStore().patients.find(p => p.id === id) ?? null;
}

export function createPatient(data: Omit<Patient, 'id'>): Patient {
  const store = getStore();
  const patient: Patient = { ...data, id: padId(store.counter++) };
  store.patients = [...store.patients, patient];
  return patient;
}

export function updatePatient(id: string, patch: PatientPatch): Patient | null {
  const store = getStore();
  const idx = store.patients.findIndex(p => p.id === id);
  if (idx === -1) return null;
  const updated = { ...store.patients[idx], ...patch };
  store.patients = [...store.patients.slice(0, idx), updated, ...store.patients.slice(idx + 1)];
  return updated;
}
