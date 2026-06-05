import { Metadata } from 'next';
import CandidatesView from '@/views/candidates/CandidatesView';

interface PageProps {
  params: Promise<{ jobId: string }>;
}

export const metadata: Metadata = {
  title: 'Candidatos - Flowia',
  description: 'Visualize e gerencie os candidatos da vaga'
};

export default async function CandidatesPage({ params }: PageProps) {
  const { jobId } = await params;

  return (
    <div className="container mx-auto px-4 py-8">
      <CandidatesView jobId={jobId} />
    </div>
  );
}
