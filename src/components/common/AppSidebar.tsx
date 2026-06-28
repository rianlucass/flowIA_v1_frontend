'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  UsersRound,
  CalendarDays,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useLogout, useMe } from '@/hooks/useAuth';
import { useUIStore } from '@/store/uiStore';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Vagas', href: '/vagas', icon: Briefcase },
  { label: 'Candidatos', href: '/candidatos', icon: UsersRound },
  { label: 'Agenda', href: '/agenda', icon: CalendarDays },
  { label: 'Configurações', href: '/configuracoes', icon: Settings },
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

export function AppSidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const { isSidebarOpen, closeSidebar } = useUIStore();

  useMe();

  return (
    <>
      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden border-0"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-surface border-r border-muted flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-6 py-6 flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary tracking-tight">TesteIA</span>
            <p className="text-sm text-muted-foreground mt-0.5">ATS Inteligente</p>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={closeSidebar}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mx-4 border-t border-muted" />

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-foreground/70 hover:bg-accent hover:text-foreground'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary' : ''}`} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-muted px-4 py-4 flex flex-col gap-3">
          {user && (
            <div className="flex items-center gap-3 px-2">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">{getInitials(user.name)}</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-foreground truncate">{user.name}</span>
                <span className="text-xs text-muted-foreground truncate">{user.email}</span>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              closeSidebar();
              logout();
            }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors w-full"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}
