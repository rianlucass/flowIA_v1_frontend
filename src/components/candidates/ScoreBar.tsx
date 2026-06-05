interface ScoreBarProps {
  label: string;
  score?: number;
  showValue?: boolean;
}

function getScoreGradient(score: number): string {
  if (score >= 75) return 'bg-gradient-to-r from-green-500 to-green-600';
  if (score >= 50) return 'bg-gradient-to-r from-amber-500 to-amber-600';
  return 'bg-gradient-to-r from-red-500 to-red-600';
}

export default function ScoreBar({ label, score, showValue = true }: ScoreBarProps) {
  const displayScore = score ?? 0;
  const gradientClass = getScoreGradient(displayScore);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {showValue && (
          <span className="text-sm font-bold text-gray-900">
            {displayScore.toFixed(0)}
          </span>
        )}
      </div>
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full transition-all duration-500 ${gradientClass}`}
          style={{ width: `${displayScore}%` }}
        />
      </div>
    </div>
  );
}
