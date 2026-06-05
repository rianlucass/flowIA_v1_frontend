import { AnalysisStatus } from '@/types/analysis';
import { CheckCircle2, AlertTriangle, XCircle, ClipboardList, Clock, RefreshCw } from 'lucide-react';

interface StatusBadgeProps {
  status: AnalysisStatus;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG = {
  [AnalysisStatus.APPROVED]: {
    label: 'Aprovado',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-300'
  },
  [AnalysisStatus.REVIEW]: {
    label: 'Revisar',
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    border: 'border-amber-300'
  },
  [AnalysisStatus.REJECTED]: {
    label: 'Reprovado',
    icon: <XCircle className="w-3.5 h-3.5" />,
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-300'
  },
  [AnalysisStatus.COMPLETED]: {
    label: 'Concluído',
    icon: <ClipboardList className="w-3.5 h-3.5" />,
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-300'
  },
  [AnalysisStatus.PENDING]: {
    label: 'Pendente',
    icon: <Clock className="w-3.5 h-3.5" />,
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-300'
  },
  [AnalysisStatus.IN_PROGRESS]: {
    label: 'Processando',
    icon: <RefreshCw className="w-3.5 h-3.5" />,
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    border: 'border-purple-300'
  },
  [AnalysisStatus.FAILED]: {
    label: 'Falhou',
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    border: 'border-orange-300'
  }
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs' 
    : 'px-3 py-1 text-sm';

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-medium
        ${config.bg} ${config.text} ${config.border} ${sizeClasses}
      `}
    >
      <span className="flex items-center">{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
