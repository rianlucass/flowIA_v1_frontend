import { CandidateAnalysisResponseDTO } from '@/types/analysis';
import StatusBadge from './StatusBadge';
import ScoreDisplay from './ScoreDisplay';
import { Trophy, Award, MapPin, Star, Mail, Briefcase } from 'lucide-react';

interface CandidateCardProps {
  analysis: CandidateAnalysisResponseDTO;
  rank: number;
  onClick: () => void;
}

function getRankIcon(rank: number): React.ReactNode {
  if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
  if (rank === 2) return <Award className="w-5 h-5 text-gray-400" />;
  if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
  return null;
}

export default function CandidateCard({ analysis, rank, onClick }: CandidateCardProps) {
  const displayName = analysis.candidateName || `Candidato #${analysis.candidateId.slice(0, 8)}`;
  const location = [analysis.city, analysis.state].filter(Boolean).join(', ');
  const skills = analysis.strengths?.items?.slice(0, 3) || [];
  const rankIcon = getRankIcon(rank);

  return (
    <div
      className="
        group relative rounded-lg border border-gray-200 bg-white p-5
        transition-all duration-200 hover:border-primary-400 hover:shadow-lg
      "
    >
      <button
        type="button"
        onClick={onClick}
        className="absolute inset-0 z-0 w-full h-full cursor-pointer rounded-lg"
        aria-label={`Ver detalhes de ${displayName}`}
      />

      <div className="relative z-10 pointer-events-none">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 shrink-0">
              {rankIcon && <span className="flex items-center">{rankIcon}</span>}
              <span className="text-lg font-bold text-gray-400">#{rank}</span>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-primary-600">
              {displayName}
            </h3>
          </div>

          <div className="shrink-0">
            <ScoreDisplay score={analysis.finalScore} size="md" showIcon={false} />
          </div>
        </div>

        <div className="mb-3 flex items-center gap-3 flex-wrap">
          <StatusBadge status={analysis.status} size="sm" />
          {location && (
            <span className="text-sm text-gray-600 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {location}
            </span>
          )}
        </div>

        {skills.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Star className="w-4 h-4 text-gray-500" />
            {skills.map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="text-sm text-gray-700 font-medium"
              >
                {skill}
                {index < skills.length - 1 && ' •'}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="relative z-10 mt-4 flex items-center gap-2 flex-wrap">
        <span
          className="
            rounded-md bg-primary-600 px-3 py-1.5 text-sm font-medium text-white
            transition-colors hover:bg-primary-700 cursor-pointer
          "
        >
          Ver Detalhes
        </span>

        {analysis.email && (
          <a
            href={`mailto:${analysis.email}`}
            className="
              pointer-events-auto rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700
              transition-colors hover:bg-gray-50
            "
          >
            <Mail className="w-3.5 h-3.5 inline mr-1" />
            Contato
          </a>
        )}

        {analysis.linkedinUrl && (
          <a
            href={analysis.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              pointer-events-auto rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700
              transition-colors hover:bg-gray-50
            "
          >
            <Briefcase className="w-3.5 h-3.5 inline mr-1" />
            LinkedIn
          </a>
        )}
      </div>
    </div>
  );
}
