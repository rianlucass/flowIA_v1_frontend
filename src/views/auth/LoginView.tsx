'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, CheckCircle2 } from 'lucide-react';
import { useLogin, useAuthError } from '@/hooks/useAuth';

const features = [
  {
    title: 'Análise Inteligente',
    description: 'IA analisa e ranqueia candidatos automaticamente',
  },
  {
    title: 'Economia de Tempo',
    description: 'Reduza 80% do tempo na triagem de currículos',
  },
  {
    title: 'Processo Organizado',
    description: 'Centralize todo o processo seletivo em um só lugar',
  },
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
    <div className="min-h-screen flex">
      {/* Painel esquerdo */}
      <div
        className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between"
        style={{ background: 'linear-gradient(135deg, #4f34d4 0%, #7c3aed 45%, #a21caf 100%)' }}
      >
        <div>
          <span className="text-white text-xl font-bold tracking-tight">
            Teste<span className="opacity-80">IA</span>
          </span>
          <p className="text-purple-200 text-sm mt-1">Plataforma ATS Inteligente</p>
        </div>

        <div className="flex flex-col gap-10">
          <div>
            <h1 className="text-white text-3xl font-bold leading-tight">
              Automatize seu recrutamento com inteligência artificial
            </h1>
            <p className="text-purple-200 mt-4 text-sm leading-relaxed">
              Analise currículos, ranqueie candidatos e agende entrevistas automaticamente
            </p>
          </div>

          <ul className="flex flex-col gap-5">
            {features.map((feature) => (
              <li key={feature.title} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-purple-300 mt-0.5 shrink-0" />
                <div>
                  <p className="text-white text-sm font-semibold">{feature.title}</p>
                  <p className="text-purple-300 text-xs mt-0.5">{feature.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-purple-400 text-xs">© 2026 TesteIA. Todos os direitos reservados.</p>
      </div>

      <div className="flex-1 flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-foreground">Entrar na TesteIA</h2>
            <p className="text-sm text-muted-foreground">Acesse sua conta para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {errorMessage && (
              <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {errorMessage}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-muted rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-muted rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-muted accent-primary"
                />
                <span className="text-sm text-muted-foreground">Lembrar de mim</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Esqueci a senha
              </Link>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-2.5 px-4 rounded-lg bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
            >
              {loginMutation.isPending ? 'Entrando...' : 'Entrar →'}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <Link href="/register" className="text-primary font-medium hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
