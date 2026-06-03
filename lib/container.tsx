'use client';

import { createContext, use } from 'react';
import type { ListPatientsUseCase } from '@/src/modules/patients/application/use-cases/list-patients.use-case';
import type { GetPatientByIdUseCase } from '@/src/modules/patients/application/use-cases/get-patient-by-id.use-case';
import type { UpdatePatientUseCase } from '@/src/modules/patients/application/use-cases/update-patient.use-case';
import type { CreatePatientUseCase } from '@/src/modules/patients/application/use-cases/create-patient.use-case';

export interface ServiceContainer {
  listPatients: ListPatientsUseCase;
  getPatientById: GetPatientByIdUseCase;
  updatePatient: UpdatePatientUseCase;
  createPatient: CreatePatientUseCase;
}

const ServiceContext = createContext<ServiceContainer | null>(null);

export function ServiceProvider({
  children,
  ...services
}: { children: React.ReactNode } & ServiceContainer) {
  return <ServiceContext.Provider value={services}>{children}</ServiceContext.Provider>;
}

function useServices(): ServiceContainer {
  const ctx = use(ServiceContext);
  if (!ctx) throw new Error('Service hooks must be used within ServiceProvider');
  return ctx;
}

export function useListPatients(): ListPatientsUseCase {
  return useServices().listPatients;
}

export function useGetPatientById(): GetPatientByIdUseCase {
  return useServices().getPatientById;
}

export function useUpdatePatient(): UpdatePatientUseCase {
  return useServices().updatePatient;
}

export function useCreatePatient(): CreatePatientUseCase {
  return useServices().createPatient;
}
