'use client';

import { createContext, useContext } from 'react';
import type { PatientRepository } from '@/src/modules/patients/application/ports/patient-repository';

export interface ServiceContainer {
  patientRepository: PatientRepository;
}

const ServiceContext = createContext<ServiceContainer | null>(null);

export function ServiceProvider({
  children,
  patientRepository,
}: {
  children: React.ReactNode;
  patientRepository: PatientRepository;
}) {
  return (
    <ServiceContext.Provider value={{ patientRepository }}>{children}</ServiceContext.Provider>
  );
}

export function usePatientRepository(): PatientRepository {
  const ctx = useContext(ServiceContext);
  if (!ctx) throw new Error('usePatientRepository must be used within ServiceProvider');
  return ctx.patientRepository;
}
