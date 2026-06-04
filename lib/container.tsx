'use client';

import { createContext, use } from 'react';
import type { ListPatientsUseCase } from '@/src/modules/patients/application/use-cases/list-patients.use-case';
import type { GetPatientByIdUseCase } from '@/src/modules/patients/application/use-cases/get-patient-by-id.use-case';
import type { UpdatePatientUseCase } from '@/src/modules/patients/application/use-cases/update-patient.use-case';
import type { CreatePatientUseCase } from '@/src/modules/patients/application/use-cases/create-patient.use-case';
import type { ListAppointmentsUseCase } from '@/src/modules/appointments/application/use-cases/list-appointments.use-case';
import type { CreateAppointmentUseCase } from '@/src/modules/appointments/application/use-cases/create-appointment.use-case';
import type { RescheduleAppointmentUseCase } from '@/src/modules/appointments/application/use-cases/reschedule-appointment.use-case';
import type { CancelAppointmentUseCase } from '@/src/modules/appointments/application/use-cases/cancel-appointment.use-case';
import type { GetAppointmentByIdUseCase } from '@/src/modules/appointments/application/use-cases/get-appointment-by-id.use-case';

export interface ServiceContainer {
  listPatients: ListPatientsUseCase;
  getPatientById: GetPatientByIdUseCase;
  updatePatient: UpdatePatientUseCase;
  createPatient: CreatePatientUseCase;
  listAppointments: ListAppointmentsUseCase;
  createAppointment: CreateAppointmentUseCase;
  rescheduleAppointment: RescheduleAppointmentUseCase;
  cancelAppointment: CancelAppointmentUseCase;
  getAppointmentById: GetAppointmentByIdUseCase;
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

export function useListAppointments(): ListAppointmentsUseCase {
  return useServices().listAppointments;
}

export function useCreateAppointment(): CreateAppointmentUseCase {
  return useServices().createAppointment;
}

export function useRescheduleAppointment(): RescheduleAppointmentUseCase {
  return useServices().rescheduleAppointment;
}

export function useCancelAppointment(): CancelAppointmentUseCase {
  return useServices().cancelAppointment;
}

export function useGetAppointmentById(): GetAppointmentByIdUseCase {
  return useServices().getAppointmentById;
}
