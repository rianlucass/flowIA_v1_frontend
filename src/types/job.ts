// ─── Enums ────────────────────────────────────────────────────────────────────

export type JobStatus = 'DRAFT' | 'OPEN' | 'PAUSED' | 'CLOSED';

export type JobModality = 'REMOTE' | 'HYBRID' | 'ON_SITE';

// ─── Criteria sub-types ───────────────────────────────────────────────────────

export interface RequiredCriteria {
  skills: string[];
  activities: string[];
  education: string[];
  minimumExperienceYears: number;
}

export interface DesiredCriteria {
  courses: string[];
  experiences: string[];
  differentials: string[];
}

export interface EliminatoryCriteria {
  requiredDegree: boolean;
  maxDistanceKm?: number;
  minimumExperienceYears: number;
  requiredSchedule: string;
  mandatorySkills: string[];
}

export interface WeightCriteria {
  activities: number;
  experience: number;
  education: number;
  location: number;
  stability: number;
}

export interface PositiveCriteria {
  hasCertifications: boolean;
  jobStabilityYears: number;
  hasLeadershipExperience: boolean;
}

export interface JobCriteria {
  required: RequiredCriteria;
  desired: DesiredCriteria;
  eliminatory: EliminatoryCriteria;
  weights: WeightCriteria;
  positive: PositiveCriteria;
}

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export interface CreateJobRequestDTO {
  title: string;
  description: string;
  companyId: string;
  modality: JobModality;
  salary?: string;
  city?: string;
  state?: string;
  criteria: JobCriteria;
}

export interface UpdateJobRequestDTO {
  title?: string;
  description?: string;
  modality?: JobModality;
  salary?: string;
  city?: string;
  state?: string;
  status?: JobStatus;
  criteria?: JobCriteria;
}

export interface JobResponseDTO {
  id: string;
  recruiterId: string;
  title: string;
  description: string;
  salary: string | null;
  modality: JobModality;
  city: string | null;
  state: string | null;
  status: JobStatus;
  criteria: JobCriteria;
  createdAt: string;
  criteriaUpdatedAt: string | null;
}

// ─── Error payloads ───────────────────────────────────────────────────────────

export interface JobApiError {
  error: string;
}

export interface JobValidationError {
  [field: string]: string;
}

// ─── Status transition map (used for UI validation) ───────────────────────────

export const VALID_STATUS_TRANSITIONS: Record<JobStatus, JobStatus[]> = {
  DRAFT: ['OPEN'],
  OPEN: ['PAUSED', 'CLOSED'],
  PAUSED: ['OPEN', 'CLOSED'],
  CLOSED: [],
};

/**
 * Returns true if changing a field is blocked for the given status.
 * Mirrors the API business rules so the UI can guard before sending.
 */
export function isFieldBlockedForStatus(
  field: 'modality' | 'criteria',
  status: JobStatus,
): boolean {
  if (status === 'CLOSED') return true;
  return false;
}

/**
 * Returns true if the status transition is valid.
 */
export function isValidStatusTransition(from: JobStatus, to: JobStatus): boolean {
  return VALID_STATUS_TRANSITIONS[from].includes(to);
}

/**
 * Returns true if the weight criteria sum equals 100.
 */
export function isWeightSumValid(weights: WeightCriteria): boolean {
  const sum =
    weights.activities +
    weights.experience +
    weights.education +
    weights.location +
    weights.stability;
  return sum === 100;
}
