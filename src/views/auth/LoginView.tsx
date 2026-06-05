'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, CheckCircle2, Sparkles } from 'lucide-react';
import { useLogin, useAuthError } from '@/hooks/useAuth';

const features = [
  'Análise de currículos com IA em segundos',
  'Ranking inteligente dos melhores candidatos',
  'Scores detalhados por competência',
  'Recomendações personalizadas para entrevista',
];

export function LoginView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useLogin();
  const errorMessage = useAuthError(loginMutation.error);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-[#0A0A14] via-[#100F2E] to-[#1A1040]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
        <div className="absolute rounded-full blur-3xl opacity-25 pointer-events-none w-[500px] h-[500px] bg-violet-500 top-10 -left-20" />
        <div className="absolute rounded-full blur-3xl opacity-20 pointer-events-none w-[400px] h-[400px] bg-cyan-500 -bottom-10 right-10" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group w-fit">
            <div className="w-9 h-9 rounded-lg bg-linear-to-r from-violet-600 via-indigo-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Flow<span className="text-cyan-400">IA</span>
            </span>
          </Link>

          {/* Content */}
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="text-4xl font-bold text-white leading-tight">
                Bem-vindo de volta
                <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-violet-400">
                  ao futuro do RH
                </span>
              </h1>
              <p className="text-violet-200/70 mt-4 text-sm leading-relaxed max-w-md">
                Acesse sua conta para gerenciar vagas, acompanhar candidatos 
                e tomar as melhores decisões de contratação com IA.
              </p>
            </div>

            {/* Features */}
            <ul className="flex flex-col gap-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <span className="text-sm text-violet-100/80">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Quote */}
            <div className="border-t border-white/10 pt-6">
              <p className="text-xs text-violet-300/50 italic leading-relaxed">
                &ldquo;O FlowIA reduziu em 80% o tempo que gastávamos 
                analisando currículos manualmente.&rdquo;
              </p>
              <p className="text-xs text-violet-300/60 mt-1">
                — Equipe de RH, TechCorp
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-xs text-violet-400/50">
            © 2026 FlowIA. Todos os direitos reservados.
          </p>
        </div>

        {/* Decorative gradient line at edge */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-violet-500/30 to-transparent" />
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm flex flex-col gap-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-linear-to-r from-violet-600 via-indigo-500 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-lg font-bold text-foreground">
              Flow<span className="gradient-text">IA</span>
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-foreground">Entrar na plataforma</h2>
            <p className="text-sm text-muted-foreground">Acesse sua conta para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {errorMessage && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                {errorMessage}
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 text-sm border border-border rounded-xl bg-surface text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-3 text-sm border border-border rounded-xl bg-surface text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember + forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border bg-surface accent-violet-500"
                />
                <span className="text-sm text-muted-foreground">Lembrar de mim</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
              >
                Esqueci a senha
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-violet-600 via-indigo-500 via-blue-500 to-cyan-400 shadow-lg shadow-violet-500/20 hover:shadow-xl hover:shadow-violet-500/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 mt-1"
            >
              {loginMutation.isPending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Entrar na plataforma
                </>
              )}
            </button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <Link href="/register" className="text-violet-400 font-medium hover:underline transition-colors">
              Criar conta gratuita
            </Link>
          </p>

          {/* Footer info */}
          <p className="text-center text-xs text-muted-foreground">
            Ao entrar, você concorda com nossos{' '}
            <Link href="/terms" className="underline hover:text-foreground transition-colors">
              Termos de Uso
            </Link>
            {' '}e{' '}
            <Link href="/privacy" className="underline hover:text-foreground transition-colors">
              Privacidade
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
