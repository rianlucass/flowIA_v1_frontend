import axios from 'axios';
import { api } from './api';
import type { ApplyJobResponseDTO, JobPublicDTO } from '@/types/candidate';

// ─── Error normalisation ──────────────────────────────────────────────────────

export function parseCandidateError(err: unknown): string {
  if (!axios.isAxiosError(err)) return 'Erro inesperado. Tente novamente.';

  const status = err.response?.status;
  const data   = err.response?.data as { error?: string } | undefined;

  if (data?.error) return data.error;
  if (status === 400) return 'Arquivo inválido ou parâmetros ausentes.';
  if (status === 404) return 'Vaga não encontrada.';
  return 'Erro de conexão com o servidor.';
}

// ─── Public endpoints — no auth required ─────────────────────────────────────

/**
 * POST /jobs/{jobId}/apply
 * Public endpoint — no authentication needed.
 * Sends the resume PDF and triggers the OCR + N8N pipeline.
 * Docs: candidate.md § POST /jobs/{jobId}/apply
 */
export async function applyToJob(
  jobId: string,
  file: File,
): Promise<ApplyJobResponseDTO> {
  const form = new FormData();
  form.append('file', file);

  const response = await api.post<ApplyJobResponseDTO>(
    `/jobs/${jobId}/apply`,
    form,
    {
      headers: {
        // Override Content-Type so axios sets the correct multipart boundary
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
}

/**
 * GET /jobs/{jobId}/public
 * Fetches public job data to display on the application page.
 * This is a public endpoint that does NOT require authentication.
 * 
 * Returns only public fields:
 * - title, description, modality, salary, city, state, status
 * 
 * Does NOT return sensitive data:
 * - recruiterId, companyId, criteria
 * 
 * See BACKEND_AJUSTE_NECESSARIO.md for backend implementation details.
 */
export async function getJobPublic(jobId: string): Promise<JobPublicDTO> {
  const response = await api.get<JobPublicDTO>(`/jobs/${jobId}/public`);
  return response.data;
}
