'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ClipboardList, Search } from 'lucide-react';
import analysisService from '@/services/analysisService';
import {
  CandidateAnalysisResponseDTO,
  CandidateFilter,
  SortOption,
  StatusCounts,
  AnalysisStatus
} from '@/types/analysis';
import CandidateListHeader from '@/components/candidates/CandidateListHeader';
import CandidateCard from '@/components/candidates/CandidateCard';
import CandidateDetailsModal from '@/components/candidates/CandidateDetailsModal';

interface CandidatesViewProps {
  jobId: string;
}

export default function CandidatesView({ jobId }: CandidatesViewProps) {
  const router = useRouter();
  
  const [analyses, setAnalyses] = useState<CandidateAnalysisResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filter, setFilter] = useState<CandidateFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('score-desc');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedAnalysis, setSelectedAnalysis] = useState<CandidateAnalysisResponseDTO | null>(null);

  useEffect(() => {
    const loadAnalyses = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await analysisService.getAnalysesByJob(jobId);
        setAnalyses(data);
      } catch (err) {
        console.error('Erro ao carregar candidatos:', err);
        setError('Erro ao carregar candidatos. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadAnalyses();
  }, [jobId]);

  const counts: StatusCounts = useMemo(() => {
    return {
      total: analyses.length,
      approved: analyses.filter((a) => a.status === AnalysisStatus.APPROVED).length,
      review: analyses.filter((a) => a.status === AnalysisStatus.REVIEW).length,
      rejected: analyses.filter((a) => a.status === AnalysisStatus.REJECTED).length
    };
  }, [analyses]);

  const filteredAnalyses = useMemo(() => {
    let filtered = [...analyses];

    if (filter !== 'all') {
      filtered = filtered.filter((analysis) => {
        if (filter === 'approved') return analysis.status === AnalysisStatus.APPROVED;
        if (filter === 'review') return analysis.status === AnalysisStatus.REVIEW;
        if (filter === 'rejected') return analysis.status === AnalysisStatus.REJECTED;
        return true;
      });
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((analysis) => {
        const name = analysis.candidateName?.toLowerCase() || '';
        const email = analysis.email?.toLowerCase() || '';
        const skills = analysis.strengths?.items?.join(' ').toLowerCase() || '';
        
        return name.includes(query) || email.includes(query) || skills.includes(query);
      });
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score-desc':
          return (b.finalScore ?? 0) - (a.finalScore ?? 0);
        case 'score-asc':
          return (a.finalScore ?? 0) - (b.finalScore ?? 0);
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'name-asc':
          const nameA = a.candidateName || '';
          const nameB = b.candidateName || '';
          return nameA.localeCompare(nameB);
        default:
          return 0;
      }
    });

    return filtered;
  }, [analyses, filter, searchQuery, sortBy]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Carregando candidatos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto" />
          <h3 className="mt-4 text-xl font-semibold text-gray-900">Erro ao carregar</h3>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <ClipboardList className="w-16 h-16 text-gray-300 mx-auto" />
          <h3 className="mt-4 text-xl font-semibold text-gray-900">Nenhum candidato ainda</h3>
          <p className="mt-2 text-gray-600">
            Os candidatos aparecerão aqui após se candidatarem à vaga.
          </p>
          <button
            onClick={() => router.push('/vagas')}
            className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
          >
            Voltar para Vagas
          </button>
        </div>
      </div>
    );
  }

  if (filteredAnalyses.length === 0) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.push('/vagas')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <span>←</span>
          <span>Voltar para Vagas</span>
        </button>

        <CandidateListHeader
          filter={filter}
          onFilterChange={setFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          counts={counts}
        />

        <div className="flex min-h-[300px] items-center justify-center">
          <div className="text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto" />
            <h3 className="mt-4 text-xl font-semibold text-gray-900">Nenhum resultado encontrado</h3>
            <p className="mt-2 text-gray-600">
              Tente ajustar os filtros ou busca para ver mais candidatos.
            </p>
            <button
              onClick={() => {
                setFilter('all');
                setSearchQuery('');
              }}
              className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
            >
              Limpar filtros
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.push('/vagas')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <span>←</span>
        <span>Voltar para Vagas</span>
      </button>

      <CandidateListHeader
        filter={filter}
        onFilterChange={setFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        counts={counts}
      />

      <div className="space-y-4">
        {filteredAnalyses.map((analysis, index) => (
          <CandidateCard
            key={analysis.id}
            analysis={analysis}
            rank={index + 1}
            onClick={() => setSelectedAnalysis(analysis)}
          />
        ))}
      </div>

      {selectedAnalysis && (
        <CandidateDetailsModal
          analysis={selectedAnalysis}
          onClose={() => setSelectedAnalysis(null)}
        />
      )}
    </div>
  );
}
