// ─── Enums ────────────────────────────────────────────────────────────────────

export type CandidateStatus =
  | 'RECEIVED'
  | 'PROCESSING'
  | 'REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'HIRED';

// ─── DTOs ─────────────────────────────────────────────────────────────────────

/**
 * Response from POST /jobs/{jobId}/apply (public endpoint — no auth).
 * Docs: candidate.md § ApplyJobResponseDTO
 */
export interface ApplyJobResponseDTO {
  candidateId: string;
  jobId: string;
  resumeUrl: string;
  status: CandidateStatus;
}

/**
 * Minimal public view of a Job used in the public application page.
 * Returned by GET /jobs/{id} — only fields safe to display publicly.
 */
export interface JobPublicDTO {
  id: string;
  title: string;
  description: string;
  modality: string;
  salary: string | null;
  city: string | null;
  state: string | null;
  status: string;
}

/**
 * Full candidate response returned by authenticated endpoints.
 * Docs: candidate.md § CandidateResponseDTO
 */
export interface CandidateResponseDTO {
  id: string;
  jobId: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  resumeUrl: string | null;
  resumeText: string | null;
  status: CandidateStatus | null;
  processedByAi: boolean;
  analysisOutdated: boolean;
  createdAt: string;
}
