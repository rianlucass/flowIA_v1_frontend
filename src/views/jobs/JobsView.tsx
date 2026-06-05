'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  MapPin,
  DollarSign,
  MoreHorizontal,
  Plus,
  Search,
  ExternalLink,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useJobs, useUpdateJob, validateJobUpdate } from '@/hooks/useJobs';
import { parseJobError } from '@/services/jobService';
import { JobDetailsModal } from '@/components/modals/JobDetailsModal';
import type { JobResponseDTO, JobStatus } from '@/types/job';

// ─── Config maps ──────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<JobStatus, { label: string; className: string }> = {
  OPEN:   { label: 'Ativa',      className: 'text-emerald-600' },
  PAUSED: { label: 'Pausada',    className: 'text-amber-500'   },
  CLOSED: { label: 'Encerrada',  className: 'text-slate-400'   },
  DRAFT:  { label: 'Rascunho',   className: 'text-slate-400'   },
};

const MODALITY_CONFIG: Record<string, { label: string; className: string }> = {
  REMOTE:  { label: 'Remoto',     className: 'bg-blue-100 text-blue-700'   },
  HYBRID:  { label: 'Híbrido',    className: 'bg-orange-100 text-orange-700' },
  ON_SITE: { label: 'Presencial', className: 'bg-green-100 text-green-700'  },
};

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-surface border border-muted rounded-xl p-5 flex flex-col gap-4 animate-pulse">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-4 w-3/4 bg-muted rounded" />
          <div className="h-3 w-1/3 bg-muted rounded" />
        </div>
        <div className="h-7 w-7 bg-muted rounded-md" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-3 w-2/3 bg-muted rounded" />
        <div className="h-3 w-1/2 bg-muted rounded" />
      </div>
      <div className="flex items-center justify-between pt-1 border-t border-muted">
        <div className="h-3 w-12 bg-muted rounded" />
        <div className="h-3 w-28 bg-muted rounded" />
      </div>
    </div>
  );
}

// ─── Job card ─────────────────────────────────────────────────────────────────

interface MenuOption {
  label: string;
  status: JobStatus;
  danger?: boolean;
}

function JobCard({
  job,
  onClick,
  onError,
}: {
  job: JobResponseDTO;
  onClick: () => void;
  onError: (err: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const updateMutation = useUpdateJob();

  const statusCfg  = STATUS_CONFIG[job.status]    ?? STATUS_CONFIG.CLOSED;
  const modalityCfg = MODALITY_CONFIG[job.modality] ?? {
    label: job.modality,
    className: 'bg-slate-100 text-slate-600',
  };

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  async function handleStatusChange(newStatus: JobStatus) {
    setMenuOpen(false);
    const error = validateJobUpdate(job, { status: newStatus });
    if (error) {
      onError(error);
      return;
    }
    try {
      await updateMutation.mutateAsync({ id: job.id, data: { status: newStatus } });
    } catch (err) {
      onError(parseJobError(err));
    }
  }

  const menuOptions: MenuOption[] = [];
  if (job.status === 'DRAFT') {
    menuOptions.push({ label: 'Publicar vaga', status: 'OPEN' });
  } else if (job.status === 'OPEN') {
    menuOptions.push({ label: 'Pausar vaga', status: 'PAUSED' });
    menuOptions.push({ label: 'Encerrar vaga', status: 'CLOSED', danger: true });
  } else if (job.status === 'PAUSED') {
    menuOptions.push({ label: 'Reativar vaga', status: 'OPEN' });
    menuOptions.push({ label: 'Encerrar vaga', status: 'CLOSED', danger: true });
  }

  const location = [job.city, job.state].filter(Boolean).join(', ');

  return (
    <div
      className="bg-surface border border-muted rounded-xl p-5 flex flex-col gap-4 hover:shadow-sm transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-foreground text-base leading-tight truncate">
            {job.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {job.id.slice(0, 8)}…
          </p>
        </div>

        {menuOptions.length > 0 && (
          <div className="relative shrink-0" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((prev) => !prev);
              }}
              disabled={updateMutation.isPending}
              className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              aria-label="Opções da vaga"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 top-8 z-20 bg-surface border border-muted rounded-lg shadow-lg min-w-42 py-1"
                onClick={(e) => e.stopPropagation()}
              >
                {menuOptions.map((opt) => (
                  <button
                    key={opt.status}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(opt.status);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-accent ${
                      opt.danger ? 'text-red-600 hover:text-red-700' : 'text-foreground'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground justify-between">
          {location ? (
            <div className="flex items-center gap-2 min-w-0">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          ) : (
            <div />
          )}
          <span
            className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium ${modalityCfg.className}`}
          >
            {modalityCfg.label}
          </span>
        </div>

        {job.salary && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="w-3.5 h-3.5 shrink-0" />
            <span>{job.salary}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-muted">
        <span className={`text-sm font-medium ${statusCfg.className}`}>
          {statusCfg.label}
        </span>

        <Link
          href={`/vagas/${job.id}/candidatos`}
          className="flex items-center gap-1.5 text-sm text-primary hover:text-primary-hover font-medium transition-colors"
        >
          Ver candidatos
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────

export function JobsView() {
  const { data: jobs = [], isLoading, error, refetch } = useJobs();
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState<JobResponseDTO | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const queryError = error ? parseJobError(error) : null;
  const displayError = actionError ?? queryError;

  function handleOpenModal(job: JobResponseDTO) {
    setActionError(null);
    setSelectedJob(job);
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    setSelectedJob(null);
    refetch();
  }

  function handleActionError(err: string) {
    setActionError(err);
  }

  function clearErrors() {
    setActionError(null);
  }

  const safeJobs = Array.isArray(jobs) ? jobs : [];
  const filtered = search.trim()
    ? safeJobs.filter((j) =>
        j.title.toLowerCase().includes(search.toLowerCase()),
      )
    : safeJobs;

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Vagas</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gerencie suas vagas abertas
          </p>
        </div>

        <Link
          href="/vagas/nova"
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-semibold rounded-lg transition-colors w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Nova Vaga
        </Link>
      </div>

      {/* Search */}
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar vagas, candidatos..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-surface border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-muted-foreground text-foreground"
        />
      </div>

      {/* Error state */}
      {displayError && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm flex-1">{displayError}</span>
          <button
            onClick={() => { clearErrors(); refetch(); }}
            className="flex items-center gap-1.5 text-sm font-medium hover:underline"
          >
            <RefreshCw className="w-4 h-4" />
            Tentar novamente
          </button>
        </div>
      )}

      {/* Grid */}
      {displayError ? null : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onClick={() => handleOpenModal(job)}
              onError={handleActionError}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <p className="text-muted-foreground text-sm">
            {search ? 'Nenhuma vaga encontrada para essa busca.' : 'Você ainda não criou nenhuma vaga.'}
          </p>
          {!search && (
            <Link
              href="/vagas/nova"
              className="text-sm text-primary hover:text-primary-hover font-medium transition-colors"
            >
              Criar primeira vaga →
            </Link>
          )}
        </div>
      )}

      {/* Job Details Modal */}
      {showModal && selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
