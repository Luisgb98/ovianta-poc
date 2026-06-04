'use client';

import { useState } from 'react';
import { ThemeProvider } from './theme/context';
import { I18nProvider } from './i18n/context';
import { AuthProvider } from './auth/context';
import { ServiceProvider } from './container';
import { ApiPatientRepository } from '@/src/modules/patients/infrastructure/api-patient-repository';
import { ListPatientsUseCase } from '@/src/modules/patients/application/use-cases/list-patients.use-case';
import { GetPatientByIdUseCase } from '@/src/modules/patients/application/use-cases/get-patient-by-id.use-case';
import { UpdatePatientUseCase } from '@/src/modules/patients/application/use-cases/update-patient.use-case';
import { CreatePatientUseCase } from '@/src/modules/patients/application/use-cases/create-patient.use-case';
import { ApiAppointmentRepository } from '@/src/modules/appointments/infrastructure/api-appointment-repository';
import { ListAppointmentsUseCase } from '@/src/modules/appointments/application/use-cases/list-appointments.use-case';
import { CreateAppointmentUseCase } from '@/src/modules/appointments/application/use-cases/create-appointment.use-case';
import { RescheduleAppointmentUseCase } from '@/src/modules/appointments/application/use-cases/reschedule-appointment.use-case';
import { CancelAppointmentUseCase } from '@/src/modules/appointments/application/use-cases/cancel-appointment.use-case';
import { GetAppointmentByIdUseCase } from '@/src/modules/appointments/application/use-cases/get-appointment-by-id.use-case';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  const [services] = useState(() => {
    const patientRepo = new ApiPatientRepository();
    const appointmentRepo = new ApiAppointmentRepository();
    return {
      listPatients: new ListPatientsUseCase(patientRepo),
      getPatientById: new GetPatientByIdUseCase(patientRepo),
      updatePatient: new UpdatePatientUseCase(patientRepo),
      createPatient: new CreatePatientUseCase(patientRepo),
      listAppointments: new ListAppointmentsUseCase(appointmentRepo),
      createAppointment: new CreateAppointmentUseCase(appointmentRepo),
      rescheduleAppointment: new RescheduleAppointmentUseCase(appointmentRepo),
      cancelAppointment: new CancelAppointmentUseCase(appointmentRepo),
      getAppointmentById: new GetAppointmentByIdUseCase(appointmentRepo),
    };
  });

  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <ServiceProvider {...services}>
            {children}
            <Toaster position="bottom-right" richColors />
          </ServiceProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
