'use client';

import { Menu } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { AppSidebar } from '@/components/common/AppSidebar';

interface DashboardLayoutShellProps {
  children: React.ReactNode;
}

export function DashboardLayoutShell({ children }: DashboardLayoutShellProps) {
  const { toggleSidebar } = useUIStore();

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
        {/* Mobile Top Bar */}
        <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-surface border-b border-muted flex items-center justify-between px-6 z-30">
          <span className="text-xl font-bold text-primary tracking-tight">TesteIA</span>
          
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-foreground hover:bg-accent transition-colors"
            aria-label="Abrir menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Content area */}
        <main className="grow p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
