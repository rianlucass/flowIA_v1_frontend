import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-muted">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-foreground">
            Teste<span className="text-primary">IA</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary-hover transition-colors rounded-lg"
          >
            Criar conta
          </Link>
        </div>
      </div>
    </nav>
  );
}