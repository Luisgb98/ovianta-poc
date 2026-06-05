import { MongoPatientRepository } from '@/src/modules/patients/infrastructure/mongo-patient-repository';
import { GetPatientByIdUseCase } from '@/src/modules/patients/application/use-cases/get-patient-by-id.use-case';
import { PatientDetailClient } from '@/src/modules/patients/presentation/PatientDetailClient';

export default async function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const repo = new MongoPatientRepository();
  const uc = new GetPatientByIdUseCase(repo);
  const patient = await uc.execute(id);
  return <PatientDetailClient patient={patient} />;
}
