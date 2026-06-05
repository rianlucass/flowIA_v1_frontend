import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listJobs,
  getJob,
  createJob,
  updateJob,
} from '@/services/jobService';
import type {
  CreateJobRequestDTO,
  UpdateJobRequestDTO,
  JobResponseDTO,
  JobStatus,
} from '@/types/job';
import {
  isFieldBlockedForStatus,
  isValidStatusTransition,
  isWeightSumValid,
} from '@/types/job';

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useJobs() {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: listJobs,
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => getJob(id),
    enabled: !!id,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJobRequestDTO) => createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJobRequestDTO }) =>
      updateJob(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}

// ─── Client-side validators (mirrors API business rules) ──────────────────────

export function validateJobUpdate(
  currentJob: JobResponseDTO,
  data: UpdateJobRequestDTO,
): string | null {
  const currentStatus = currentJob.status as JobStatus;

  if (data.modality !== undefined && isFieldBlockedForStatus('modality', currentStatus)) {
    return 'Não é possível alterar a modalidade de uma vaga CLOSED.';
  }

  if (data.criteria !== undefined && isFieldBlockedForStatus('criteria', currentStatus)) {
    return 'Não é possível alterar os critérios de uma vaga CLOSED.';
  }

  if (data.criteria?.weights !== undefined && !isWeightSumValid(data.criteria.weights)) {
    const sum =
      data.criteria.weights.activities +
      data.criteria.weights.experience +
      data.criteria.weights.education +
      data.criteria.weights.location +
      data.criteria.weights.stability;
    return `A soma dos pesos de critérios deve ser 100, mas é ${sum}.`;
  }

  if (data.status !== undefined && !isValidStatusTransition(currentStatus, data.status)) {
    return `Transição de status inválida: ${currentStatus} → ${data.status}.`;
  }

  return null;
}
