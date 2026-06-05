import {
  Briefcase,
  UsersRound,
  CircleCheck,
  CalendarDays,
  Clock,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';

interface StatCard {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  description: string;
}

const statCards: StatCard[] = [
  {
    title: 'Vagas Abertas',
    icon: Briefcase,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-50',
    description: 'Vagas ativas no momento',
  },
  {
    title: 'Candidatos Analisados',
    icon: UsersRound,
    iconColor: 'text-violet-500',
    iconBg: 'bg-violet-50',
    description: 'Total de candidatos processados',
  },
  {
    title: 'Candidatos Aprovados',
    icon: CircleCheck,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-50',
    description: 'Aprovados para próxima fase',
  },
  {
    title: 'Entrevistas Agendadas',
    icon: CalendarDays,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-50',
    description: 'Entrevistas na agenda',
  },
  {
    title: 'Tempo Médio de Triagem',
    icon: Clock,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-50',
    description: 'Média por candidato',
  },
  {
    title: 'Taxa de Conversão',
    icon: TrendingUp,
    iconColor: 'text-slate-500',
    iconBg: 'bg-slate-100',
    description: 'Candidatos → contratados',
  },
];

export function DashboardView() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visão geral do seu processo de recrutamento
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {statCards.map(({ title, icon: Icon, iconColor, iconBg, description }) => (
          <div
            key={title}
            className="bg-surface border border-muted rounded-xl p-6 flex flex-col gap-4"
          >
            <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">{title}</span>
              <span className="text-3xl font-bold text-foreground">—</span>
              <span className="text-xs text-muted-foreground">{description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
