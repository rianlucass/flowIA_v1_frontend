import { Trophy, Award, BarChart3 } from 'lucide-react';

interface ScoreDisplayProps {
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

function getScoreColor(score: number): string {
  if (score >= 75) return 'text-green-600';
  if (score >= 50) return 'text-amber-600';
  return 'text-red-600';
}

function getScoreIcon(score: number): React.ReactNode {
  if (score >= 90) return <Trophy className="w-5 h-5 text-yellow-500" />;
  if (score >= 75) return <Award className="w-5 h-5 text-gray-400" />;
  if (score >= 50) return <Award className="w-5 h-5 text-amber-600" />;
  return <BarChart3 className="w-4 h-4 text-gray-400" />;
}

export default function ScoreDisplay({ score, size = 'md', showIcon = true }: ScoreDisplayProps) {
  if (score === undefined || score === null) {
    return (
      <span className="text-gray-400 text-sm font-medium">
        Score não disponível
      </span>
    );
  }

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl'
  };

  const colorClass = getScoreColor(score);
  const icon = getScoreIcon(score);

  return (
    <div className="inline-flex items-center gap-2">
      {showIcon && size !== 'sm' && (
        <span className="flex items-center">{icon}</span>
      )}
      <span className={`font-bold ${colorClass} ${sizeClasses[size]}`}>
        {score.toFixed(1)}
      </span>
    </div>
  );
}
