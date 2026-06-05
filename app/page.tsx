import Link from 'next/link';
import { Navbar } from '@/components/common/NavBar';
import { 
  Sparkles, 
  Brain, 
  Zap, 
  BarChart3, 
  ArrowRight,
  Star,
} from 'lucide-react';

const features = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'Análise com IA',
    description: 'Nossa IA extrai e analisa currículos automaticamente, ranqueando os melhores candidatos em segundos.',
    gradient: 'from-violet-500/10 to-violet-500/5',
    iconColor: 'text-violet-500',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Automação Inteligente',
    description: 'Elimine tarefas manuais. O FlowIA automatiza a triagem para você focar nas entrevistas.',
    gradient: 'from-cyan-500/10 to-cyan-500/5',
    iconColor: 'text-cyan-500',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Decisões Baseadas em Dados',
    description: 'Scores detalhados, pontos fortes e fracos, e recomendações para cada candidato.',
    gradient: 'from-blue-500/10 to-blue-500/5',
    iconColor: 'text-blue-500',
  },
];

const stats = [
  { value: '80%', label: 'Redução no tempo de triagem' },
  { value: '3x', label: 'Mais assertividade nas contratações' },
  { value: '< 2min', label: 'Análise por currículo' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute rounded-full blur-3xl opacity-15 pointer-events-none w-[600px] h-[600px] bg-violet-500 -top-40 -right-40" />
      <div className="absolute rounded-full blur-3xl opacity-12 pointer-events-none w-[500px] h-[500px] bg-cyan-500 -bottom-20 -left-20" />
      <div className="absolute rounded-full blur-3xl opacity-8 pointer-events-none w-[300px] h-[300px] bg-blue-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none" />

      <Navbar />

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-16 relative z-10">
        <div className="max-w-4xl w-full text-center flex flex-col items-center gap-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-sm text-violet-600">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-medium">Plataforma ATS com Inteligência Artificial</span>
          </div>

          {/* Headline */}
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight">
              Recrutamento{' '}
              <span className="gradient-text">inteligente</span>
              <br />
              com um clique
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Automatize a triagem de currículos com IA, ranqueie os melhores talentos 
              e tome decisões de contratação baseadas em dados — tudo em uma plataforma.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link
              href="/register"
              className="group px-7 py-3.5 text-sm font-semibold text-white rounded-xl bg-linear-to-r from-violet-600 via-indigo-500 via-blue-500 to-cyan-400 shadow-lg shadow-violet-500/20 hover:shadow-xl hover:shadow-violet-500/30 transition-all flex items-center gap-2"
            >
              Começar gratuitamente
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="px-7 py-3.5 text-sm font-semibold text-foreground rounded-xl border border-border-strong bg-surface/50 backdrop-blur-sm hover:border-violet-500 hover:shadow-lg hover:shadow-violet-500/10 transition-all"
            >
              Já tenho uma conta
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 sm:gap-12 flex-wrap justify-center">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <span className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature cards */}
        <div className="max-w-5xl w-full mt-14 sm:mt-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Tudo que você precisa para{' '}
              <span className="gradient-text">contratar melhor</span>
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Combine o poder da IA com a praticidade que seu RH merece
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`group relative p-6 rounded-2xl bg-surface border border-border hover:border-violet-500/30 transition-all duration-300 bg-linear-to-br ${feature.gradient}`}
              >
                <div className={`w-11 h-11 rounded-xl bg-surface border border-border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${feature.iconColor}`}>
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 p-8 rounded-2xl bg-surface border border-border relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-violet-500/5 to-transparent" />
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-linear-to-r from-violet-600 via-indigo-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-foreground font-semibold text-sm">
                    Pronto para transformar seu recrutamento?
                  </p>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    Junte-se a centenas de empresas que já automatizaram sua triagem
                  </p>
                </div>
              </div>
              <Link
                href="/register"
                className="shrink-0 px-6 py-3 text-sm font-semibold text-white rounded-xl bg-linear-to-r from-violet-600 via-indigo-500 via-blue-500 to-cyan-400 shadow-lg shadow-violet-500/20 hover:shadow-xl hover:shadow-violet-500/30 transition-all flex items-center gap-2"
              >
                Criar conta gratuita
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-linear-to-r from-violet-600 via-indigo-500 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">F</span>
            </div>
            <span className="text-sm font-semibold text-foreground">
              Flow<span className="gradient-text">IA</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 FlowIA. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
