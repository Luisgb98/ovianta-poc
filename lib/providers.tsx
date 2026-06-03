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
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  const [services] = useState(() => {
    const repo = new ApiPatientRepository();
    return {
      listPatients: new ListPatientsUseCase(repo),
      getPatientById: new GetPatientByIdUseCase(repo),
      updatePatient: new UpdatePatientUseCase(repo),
      createPatient: new CreatePatientUseCase(repo),
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
