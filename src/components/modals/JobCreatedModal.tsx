'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X, CheckCircle2, ExternalLink, Users, PartyPopper, MapPin, DollarSign } from 'lucide-react';
import { CopyLinkButton } from '@/components/common/CopyLinkButton';
import type { JobResponseDTO } from '@/types/job';

interface JobCreatedModalProps {
  job: JobResponseDTO;
  onClose: () => void;
}

export function JobCreatedModal({ job, onClose }: JobCreatedModalProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const shareableLink = `${baseUrl}/vagas/${job.id}/candidatar`;

  function handleViewCandidates() {
    onClose();
    router.push(`/vagas/${job.id}/candidatos`);
  }

  function handleViewJobs() {
    onClose();
    router.push('/vagas');
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => onClose();
    const handleClick = (e: MouseEvent) => {
      if (e.target === dialog) onClose();
    };

    dialog.addEventListener('close', handleClose);
    dialog.addEventListener('click', handleClick);

    return () => {
      dialog.removeEventListener('close', handleClose);
      dialog.removeEventListener('click', handleClick);
    };
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-transparent p-0 border-0 w-full h-full max-w-none max-h-none backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div 
        className="relative bg-surface border border-muted rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 pb-4 border-b border-muted">
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                Vaga criada com sucesso!
                <PartyPopper className="w-5 h-5 text-yellow-500" />
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Sua vaga está ativa e pronta para receber candidaturas.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-accent/50 border border-muted rounded-xl p-4">
            <h3 className="font-semibold text-foreground text-base">{job.title}</h3>
            <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-surface rounded-md">
                {job.modality}
              </span>
              {job.city && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-surface rounded-md">
                  <MapPin className="w-3 h-3" />
                  {job.city}{job.state ? `, ${job.state}` : ''}
                </span>
              )}
              {job.salary && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-surface rounded-md">
                  <DollarSign className="w-3 h-3" />
                  {job.salary}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Link para Candidatura
            </label>
            <p className="text-xs text-muted-foreground mb-3">
              Compartilhe este link com candidatos para que possam enviar seus currículos.
              A IA irá analisar automaticamente cada currículo recebido.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 px-4 py-2.5 bg-accent border border-muted rounded-lg text-sm text-foreground overflow-x-auto whitespace-nowrap">
                {shareableLink}
              </div>
              <CopyLinkButton 
                link={shareableLink} 
                variant="default"
                size="md"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-muted">
            <p className="text-sm font-medium text-foreground mb-3">
              O que deseja fazer agora?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleViewCandidates}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium"
              >
                <Users className="w-4 h-4" />
                Ver Candidatos
              </button>
              <button
                onClick={handleViewJobs}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-accent border border-muted text-foreground rounded-lg hover:bg-accent/70 transition-colors text-sm font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Ver Todas as Vagas
              </button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
