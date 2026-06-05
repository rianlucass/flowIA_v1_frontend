/**
 * Status da análise de candidato
 */
export enum AnalysisStatus {
  PENDING = 'PENDING',           // Análise ainda não iniciada
  IN_PROGRESS = 'IN_PROGRESS',   // Análise em processamento
  COMPLETED = 'COMPLETED',       // Análise concluída (resultado neutro)
  APPROVED = 'APPROVED',         // Candidato aprovado pela análise de IA
  REVIEW = 'REVIEW',             // Candidato requer revisão manual
  FAILED = 'FAILED',             // Processamento falhou
  REJECTED = 'REJECTED'          // Candidato eliminado
}

/**
 * Lista de itens (formato JSONB da API)
 */
export interface ItemsList {
  items: string[];
}

/**
 * DTO de resposta da análise de candidato
 */
export interface CandidateAnalysisResponseDTO {
  id: string;
  candidateId: string;
  jobId: string;
  
  // Dados do candidato (extraídos pela IA do currículo)
  candidateName?: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  
  // Scores da análise (0-100)
  finalScore?: number;
  activitiesScore?: number;
  experienceScore?: number;
  educationScore?: number;
  locationScore?: number;
  stabilityScore?: number;
  
  // Status da análise
  status: AnalysisStatus;
  
  // Análise qualitativa (formato: { items: string[] })
  strengths?: ItemsList;
  attentionPoints?: ItemsList;
  missingInformation?: ItemsList;
  interviewQuestions?: ItemsList;
  
  // Motivos de eliminação (array direto, não ItemsList)
  eliminationReasons?: string[];
  
  // Recomendação textual da IA
  recommendation?: string;
  
  // Validações e configurações aplicadas
  validations?: Record<string, any>;
  weightsUsed?: Record<string, any>;
  
  // Metadados
  aiModel?: string;
  promptVersion?: string;
  outdated?: boolean;
  createdAt: string;
}

/**
 * Filtros para listagem de candidatos
 */
export type CandidateFilter = 'all' | 'approved' | 'review' | 'rejected';

/**
 * Opções de ordenação
 */
export type SortOption = 
  | 'score-desc'      // Score maior → menor (padrão)
  | 'score-asc'       // Score menor → maior
  | 'date-desc'       // Mais recente → mais antigo
  | 'name-asc';       // Nome A → Z

/**
 * Interface para contadores de status
 */
export interface StatusCounts {
  total: number;
  approved: number;
  review: number;
  rejected: number;
}
