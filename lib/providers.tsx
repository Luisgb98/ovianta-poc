'use client';

import { ThemeProvider } from './theme/context';
import { I18nProvider } from './i18n/context';
import { AuthProvider } from './auth/context';
import { ServiceProvider } from './container';
import { InMemoryPatientRepository } from '@/src/modules/patients/infrastructure/in-memory-patient-repository';
import { INITIAL_PATIENTS } from './data/patients';
import { Toaster } from 'sonner';

const patientRepository = new InMemoryPatientRepository(INITIAL_PATIENTS);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <ServiceProvider patientRepository={patientRepository}>
            {children}
            <Toaster position="bottom-right" richColors />
          </ServiceProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
