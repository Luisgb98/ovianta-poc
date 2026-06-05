import { MongoPatientRepository } from '@/src/modules/patients/infrastructure/mongo-patient-repository';
import { ListPatientsUseCase } from '@/src/modules/patients/application/use-cases/list-patients.use-case';
import { DashboardClient } from '@/src/modules/patients/presentation/DashboardClient';

export default async function DashboardPage() {
  const repo = new MongoPatientRepository();
  const uc = new ListPatientsUseCase(repo);
  const patients = await uc.execute();
  return <DashboardClient patients={patients} />;
}
