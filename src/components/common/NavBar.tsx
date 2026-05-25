'use client'; // Necessário para usar hooks de navegação do lado do cliente

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Car, User, LayoutDashboard, LogOut } from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Caronas', href: '/caronas', icon: Car },
  { name: 'Perfil', href: '/perfil', icon: User },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 bg-surface border-r border-muted p-6 flex flex-col justify-between">
      <div className="space-y-8">
        <div className="flex items-center gap-2 px-2">
          <span className="text-xl font-bold tracking-tight text-foreground">BoraLá</span>
        </div>

        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-accent text-accent-foreground font-semibold'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-red-500 rounded-lg hover:bg-red-50/50 transition-colors w-full">
        <LogOut className="w-5 h-5" />
        Sair da conta
      </button>
    </nav>
  );
}