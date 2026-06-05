import { Target, CheckCircle2, AlertTriangle, XCircle, Search } from 'lucide-react';
import { CandidateFilter, SortOption, StatusCounts } from '@/types/analysis';

interface CandidateListHeaderProps {
  filter: CandidateFilter;
  onFilterChange: (filter: CandidateFilter) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  counts: StatusCounts;
}

export default function CandidateListHeader({
  filter,
  onFilterChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
  counts
}: CandidateListHeaderProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Candidatos</h2>
        <p className="mt-1 text-sm text-gray-600">
          {counts.total} {counts.total === 1 ? 'candidato analisado' : 'candidatos analisados'}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => onFilterChange('all')}
          className={`
            rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1.5
            ${filter === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          <Target className="w-3.5 h-3.5" />
          Todos ({counts.total})
        </button>

        <button
          onClick={() => onFilterChange('approved')}
          className={`
            rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1.5
            ${filter === 'approved'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Aprovados ({counts.approved})
        </button>

        <button
          onClick={() => onFilterChange('review')}
          className={`
            rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1.5
            ${filter === 'review'
              ? 'bg-amber-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Revisar ({counts.review})
        </button>

        <button
          onClick={() => onFilterChange('rejected')}
          className={`
            rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1.5
            ${filter === 'rejected'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          <XCircle className="w-3.5 h-3.5" />
          Reprovados ({counts.rejected})
        </button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nome, email..."
            className="
              w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4
              text-sm placeholder:text-gray-400
              focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20
            "
          />
        </div>

        <div className="shrink-0">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="
              rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700
              focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20
            "
          >
            <option value="score-desc">Score: Maior → Menor</option>
            <option value="score-asc">Score: Menor → Maior</option>
            <option value="date-desc">Mais Recentes</option>
            <option value="name-asc">Nome: A → Z</option>
          </select>
        </div>
      </div>
    </div>
  );
}
