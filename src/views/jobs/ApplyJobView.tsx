'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  CheckCircle2,
  AlertCircle,
  Loader2,
  Home,
  Shuffle,
  Building2,
  PartyPopper,
  Check,
} from 'lucide-react';
import { FileUpload } from '@/components/common/FileUpload';
import { getJobPublic, applyToJob, parseCandidateError } from '@/services/candidateService';
import type { JobPublicDTO } from '@/types/candidate';

const MODALITY_CONFIG: Record<string, { label: string; icon: React.ReactNode }> = {
  REMOTE:  { label: 'Trabalho Remoto', icon: <Home className="w-4 h-4" /> },
  HYBRID:  { label: 'Modelo Híbrido', icon: <Shuffle className="w-4 h-4" /> },
  ON_SITE: { label: 'Presencial', icon: <Building2 className="w-4 h-4" /> },
};

interface ApplyJobViewProps {
  jobId: string;
}

export function ApplyJobView({ jobId }: ApplyJobViewProps) {
  const router = useRouter();

  const [job, setJob] = useState<JobPublicDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    async function loadJob() {
      try {
        setLoading(true);
        setError(null);
        const data = await getJobPublic(jobId);
        
        if (data.status !== 'OPEN') {
          setError('Esta vaga não está mais recebendo candidaturas.');
        } else {
          setJob(data);
        }
      } catch (err) {
        console.error('Erro ao carregar vaga:', err);
        setError('Vaga não encontrada ou não está mais disponível.');
      } finally {
        setLoading(false);
      }
    }

    loadJob();
  }, [jobId]);

  function handleFileSelect(file: File) {
    setSelectedFile(file);
    setUploadError(null);
  }

  function handleFileRemove() {
    setSelectedFile(null);
    setUploadError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!selectedFile) {
      setUploadError('Por favor, selecione um arquivo PDF com seu currículo.');
      return;
    }

    setSubmitting(true);
    setUploadError(null);

    try {
      await applyToJob(jobId, selectedFile);
      setSuccess(true);
      setSelectedFile(null);
    } catch (err) {
      const message = parseCandidateError(err);
      setUploadError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Carregando vaga...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            Vaga Indisponível
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            {error || 'Não foi possível carregar os dados da vaga.'}
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
            Candidatura Enviada!
            <PartyPopper className="w-5 h-5 text-yellow-500" />
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Seu currículo foi recebido e está sendo analisado por nossa IA. 
            Entraremos em contato em breve caso seu perfil seja aprovado.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-xs text-blue-700 font-medium mb-1">
              O que acontece agora?
            </p>
            <ul className="text-xs text-blue-600 space-y-1">
              <li className="flex items-center gap-1">
                <Check className="w-3 h-3 shrink-0" />
                Seu currículo foi recebido com sucesso
              </li>
              <li className="flex items-center gap-1">
                <Check className="w-3 h-3 shrink-0" />
                Nossa IA está extraindo e analisando os dados
              </li>
              <li className="flex items-center gap-1">
                <Check className="w-3 h-3 shrink-0" />
                Você receberá um retorno em até 48 horas
              </li>
            </ul>
          </div>
          <button
            onClick={() => router.push('/')}
            className="w-full px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  const modalityCfg = MODALITY_CONFIG[job.modality] ?? {
    label: job.modality,
    icon: <Briefcase className="w-4 h-4" />,
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-linear-to-r from-primary to-indigo-600 p-6 sm:p-8 text-white">
            <div className="flex items-start gap-3 mb-4">
              <div className="shrink-0 w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{job.title}</h1>
                <div className="flex flex-wrap gap-2 text-sm opacity-90">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full">
                    {modalityCfg.icon} {modalityCfg.label}
                  </span>
                  {(job.city || job.state) && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full">
                      <MapPin className="w-3.5 h-3.5" />
                      {[job.city, job.state].filter(Boolean).join(', ')}
                    </span>
                  )}
                  {job.salary && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full">
                      <DollarSign className="w-3.5 h-3.5" />
                      {job.salary}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-foreground mb-3">
              Sobre a Vaga
            </h2>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {job.description}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Envie seu Currículo
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Faça upload do seu currículo em formato PDF. Nossa IA irá analisar 
              automaticamente suas qualificações e experiências.
            </p>

            <FileUpload
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              accept=".pdf"
              maxSizeMB={10}
              disabled={submitting}
              error={uploadError}
              className="mb-6"
            />

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div className="text-xs text-amber-700">
                  <p className="font-medium mb-1">Dicas para um bom currículo:</p>
                  <ul className="space-y-0.5 ml-4 list-disc">
                    <li>Certifique-se de que o PDF está legível</li>
                    <li>Inclua suas experiências mais recentes</li>
                    <li>Destaque suas principais habilidades</li>
                    <li>Mantenha o arquivo com menos de 10MB</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedFile || submitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Enviar Candidatura
                </>
              )}
            </button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              Ao enviar sua candidatura, você concorda com o processamento dos seus dados 
              para fins de recrutamento.
            </p>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Powered by <span className="font-semibold text-primary">FlowIA</span> 
            {' '}• Análise inteligente de currículos
          </p>
        </div>
      </div>
    </div>
  );
}
