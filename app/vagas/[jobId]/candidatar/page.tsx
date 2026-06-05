import { ApplyJobView } from '@/views/jobs/ApplyJobView';

export const metadata = {
  title: 'Candidatar-se à Vaga — FlowIA',
  description: 'Envie seu currículo e seja analisado por nossa IA',
};

interface PageProps {
  params: Promise<{
    jobId: string;
  }>;
}

export default async function CandidatarPage({ params }: PageProps) {
  const { jobId } = await params;
  return <ApplyJobView jobId={jobId} />;
}
