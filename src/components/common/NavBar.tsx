import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/70 backdrop-blur-xl border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-linear-to-r from-violet-600 via-indigo-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Flow<span className="gradient-text">IA</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 text-sm font-semibold text-white rounded-lg bg-linear-to-r from-violet-600 to-indigo-500 shadow-lg shadow-violet-500/20 hover:shadow-xl hover:shadow-violet-500/30 transition-all"
          >
            Começar agora
          </Link>
        </div>
      </div>
    </nav>
  );
}
