import axios, { AxiosError } from 'axios';
import { api } from './api';
import type {
  CreateJobRequestDTO,
  UpdateJobRequestDTO,
  JobResponseDTO,
  JobApiError,
  JobValidationError,
} from '@/types/job';

// ─── Error normalisation ──────────────────────────────────────────────────────

/**
 * Extracts a human-readable message from an Axios error thrown by the Jobs API.
 *
 * The API can return:
 *  - { error: string }                  — single-message errors (404, 403, 422, 400)
 *  - { [field]: string }                — validation map (400 MethodArgumentNotValidException)
 */
export function parseJobError(err: unknown): string {
  if (!axios.isAxiosError(err)) {
    return 'Erro inesperado. Tente novamente.';
  }

  const axiosErr = err as AxiosError<JobApiError | JobValidationError>;
  const data = axiosErr.response?.data;
  const status = axiosErr.response?.status;

  if (!data) {
    if (status === 401 || status === 403) return 'Sem autorização. Faça login novamente.';
    return 'Erro de conexão com o servidor.';
  }

  // Safe check if data is an object
  if (typeof data === 'object' && data !== null) {
    // Single-message error: { error: "..." }
    if ('error' in data && typeof (data as JobApiError).error === 'string') {
      return (data as JobApiError).error;
    }

    // Validation map: { field: "message", ... }
    const messages = Object.values(data as JobValidationError).filter(Boolean);
    if (messages.length > 0) return messages.join(' | ');
  } else if (typeof data === 'string') {
    return data;
  }

  return 'Erro inesperado. Tente novamente.';
}

// ─── Job endpoints ────────────────────────────────────────────────────────────

/**
 * POST /jobs
 * Creates a new job with initial status OPEN.
 * Requires authentication.
 */
export async function createJob(data: CreateJobRequestDTO): Promise<JobResponseDTO> {
  const response = await api.post<JobResponseDTO>('/jobs', data);
  return response.data;
}
  
/**
 * GET /jobs/:id
 * Fetches a single job by ID.
 * Requires authentication.
 * Throws 404 if the job does not exist.
 */
export async function getJob(id: string): Promise<JobResponseDTO> {
  const response = await api.get<JobResponseDTO>(`/jobs/${id}`);
  return response.data;
}

/**
 * GET /jobs
 * Lists all jobs.
 * Requires authentication.
 */
export async function listJobs(): Promise<JobResponseDTO[]> {
  const response = await api.get<JobResponseDTO[]>('/jobs');
  return response.data;
}

/**
 * PATCH /jobs/:id
 * Partial update of a job. Only the owner recruiter may update.
 *
 * Business rules enforced by the API (surface errors via parseJobError):
 *  - `modality` and `criteria` are blocked for CLOSED jobs (400)
 *  - `criteria.weights` must sum to 100 (400)
 *  - Status must follow allowed transitions (422)
 *  - Only the job owner may update (403)
 *
 * Requires authentication.
 */
export async function updateJob(
  id: string,
  data: UpdateJobRequestDTO,
): Promise<JobResponseDTO> {
  const response = await api.patch<JobResponseDTO>(`/jobs/${id}`, data);
  return response.data;
}
