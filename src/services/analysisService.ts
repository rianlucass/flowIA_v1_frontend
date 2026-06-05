import { api } from './api';
import { CandidateAnalysisResponseDTO } from '@/types/analysis';

/**
 * Service para gerenciar análises de candidatos
 */
const analysisService = {
  /**
   * Busca todas as análises de candidatos de uma vaga específica
   * @param jobId - ID da vaga
   * @returns Lista de análises de candidatos
   */
  getAnalysesByJob: async (jobId: string): Promise<CandidateAnalysisResponseDTO[]> => {
    try {
      const response = await api.get<CandidateAnalysisResponseDTO[]>(`/analysis/job/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar análises de candidatos:', error);
      throw error;
    }
  },

  /**
   * Busca uma análise específica por ID
   * @param analysisId - ID da análise
   * @returns Análise do candidato
   */
  getAnalysisById: async (analysisId: string): Promise<CandidateAnalysisResponseDTO> => {
    try {
      const response = await api.get<CandidateAnalysisResponseDTO>(`/analysis/${analysisId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar análise:', error);
      throw error;
    }
  }
};

export default analysisService;
