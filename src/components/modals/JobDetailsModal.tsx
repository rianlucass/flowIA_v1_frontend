'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, MapPin, DollarSign, Calendar, ExternalLink, Users, Edit, Pause, Play, XCircle } from 'lucide-react';
import { CopyLinkButton } from '@/components/common/CopyLinkButton';
import { useUpdateJob, validateJobUpdate } from '@/hooks/useJobs';
import { parseJobError } from '@/services/jobService';
import type { JobResponseDTO, JobStatus } from '@/types/job';

interface JobDetailsModalProps {
  job: JobResponseDTO;
  onClose: () => void;
}

const MODALITY_CONFIG: Record<string, { label: string; className: string }> = {
  REMOTE:  { label: 'Remoto',     className: 'bg-blue-100 text-blue-700'   },
  HYBRID:  { label: 'Híbrido',    className: 'bg-orange-100 text-orange-700' },
  ON_SITE: { label: 'Presencial', className: 'bg-green-100 text-green-700'  },
};

const STATUS_CONFIG: Record<JobStatus, { label: string; className: string }> = {
  OPEN:   { label: 'Ativa',      className: 'bg-emerald-100 text-emerald-700' },
  PAUSED: { label: 'Pausada',    className: 'bg-amber-100 text-amber-700'   },
  CLOSED: { label: 'Encerrada',  className: 'bg-slate-100 text-slate-600'   },
  DRAFT:  { label: 'Rascunho',   className: 'bg-slate-100 text-slate-600'   },
};

export function JobDetailsModal({ job, onClose }: JobDetailsModalProps) {
  const router = useRouter();
  const updateMutation = useUpdateJob();
  const [error, setError] = useState<string | null>(null);

  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL;
  const shareableLink = `${baseUrl}/vagas/${job.id}/candidatar`;

  const modalityCfg = MODALITY_CONFIG[job.modality] ?? {
    label: job.modality,
    className: 'bg-slate-100 text-slate-600',
  };

  const statusCfg = STATUS_CONFIG[job.status] ?? STATUS_CONFIG.CLOSED;

  async function handleStatusChange(newStatus: JobStatus) {
    setError(null);
    const validationError = validateJobUpdate(job, { status: newStatus });
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      await updateMutation.mutateAsync({ id: job.id, data: { status: newStatus } });
      onClose();
    } catch (err) {
      setError(parseJobError(err));
    }
  }

  function handleViewCandidates() {
    onClose();
    router.push(`/vagas/${job.id}/candidatos`);
  }

  function handleEdit() {
    onClose();
    router.push(`/vagas/${job.id}/editar`);
  }

  const actionButtons: React.JSX.Element[] = [];

  if (job.status === 'DRAFT') {
    actionButtons.push(
      <button
        key="publish"
        onClick={() => handleStatusChange('OPEN')}
        disabled={updateMutation.isPending}
        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium disabled:opacity-50"
      >
        <Play className="w-4 h-4" />
        Publicar Vaga
      </button>
    );
  } else if (job.status === 'OPEN') {
    actionButtons.push(
      <button
        key="pause"
        onClick={() => handleStatusChange('PAUSED')}
        disabled={updateMutation.isPending}
        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium disabled:opacity-50"
      >
        <Pause className="w-4 h-4" />
        Pausar
      </button>
    );
  } else if (job.status === 'PAUSED') {
    actionButtons.push(
      <button
        key="reactivate"
        onClick={() => handleStatusChange('OPEN')}
        disabled={updateMutation.isPending}
        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium disabled:opacity-50"
      >
        <Play className="w-4 h-4" />
        Reativar
      </button>
    );
  }

  if (job.status !== 'CLOSED') {
    actionButtons.push(
      <button
        key="close"
        onClick={() => handleStatusChange('CLOSED')}
        disabled={updateMutation.isPending}
        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium disabled:opacity-50"
      >
        <XCircle className="w-4 h-4" />
        Encerrar
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-surface border border-muted rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors z-10"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 pb-4 border-b border-muted">
          <div className="flex items-start gap-3 pr-10">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-foreground mb-2">{job.title}</h2>
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusCfg.className}`}>
                  {statusCfg.label}
                </span>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${modalityCfg.className}`}>
                  {modalityCfg.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Descrição</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {job.salary && (
              <div className="flex items-start gap-2 p-3 bg-accent/50 rounded-lg">
                <DollarSign className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-medium">Salário</p>
                  <p className="text-sm text-foreground">{job.salary}</p>
                </div>
              </div>
            )}

            {(job.city || job.state) && (
              <div className="flex items-start gap-2 p-3 bg-accent/50 rounded-lg">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-medium">Localização</p>
                  <p className="text-sm text-foreground">
                    {[job.city, job.state].filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2 p-3 bg-accent/50 rounded-lg">
              <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium">Criada em</p>
                <p className="text-sm text-foreground">
                  {new Date(job.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-accent/50 rounded-lg">
              <ExternalLink className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium">ID da Vaga</p>
                <p className="text-xs text-foreground font-mono">
                  {job.id.slice(0, 8)}...
                </p>
              </div>
            </div>
          </div>

          {job.status !== 'CLOSED' && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <label className="block text-sm font-semibold text-foreground mb-2">
                Link de Candidatura
              </label>
              <p className="text-xs text-muted-foreground mb-3">
                Compartilhe este link para receber candidaturas automaticamente.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 px-3 py-2 bg-surface border border-muted rounded-lg text-sm text-foreground overflow-x-auto whitespace-nowrap">
                  {shareableLink}
                </div>
                <CopyLinkButton
                  link={shareableLink}
                  variant="default"
                  size="sm"
                />
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-muted">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleViewCandidates}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-accent border border-muted text-foreground rounded-lg hover:bg-accent/70 transition-colors text-sm font-medium"
              >
                <Users className="w-4 h-4" />
                Ver Candidatos
              </button>

              {job.status !== 'CLOSED' && (
                <button
                  onClick={handleEdit}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-accent border border-muted text-foreground rounded-lg hover:bg-accent/70 transition-colors text-sm font-medium"
                >
                  <Edit className="w-4 h-4" />
                  Editar Vaga
                </button>
              )}
            </div>

            {actionButtons.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                {actionButtons}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
