import { MongoPatientRepository } from '@/src/modules/patients/infrastructure/mongo-patient-repository';
import { ListPatientsUseCase } from '@/src/modules/patients/application/use-cases/list-patients.use-case';
import { PatientsClient } from '@/src/modules/patients/presentation/PatientsClient';

export default async function PatientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const repo = new MongoPatientRepository();
  const uc = new ListPatientsUseCase(repo);
  const patients = await uc.execute(q);
  return <PatientsClient initialPatients={patients} />;
}
