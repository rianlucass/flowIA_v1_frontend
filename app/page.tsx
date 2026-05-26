import Link from "next/link";
import { Navbar } from "@/components/common/NavBar";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-16">
        <div className="max-w-3xl w-full text-center flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4">
            <span className="text-sm font-medium text-primary bg-primary/8 px-4 py-1.5 rounded-full border border-primary/20">
              Plataforma ATS Inteligente
            </span>
            <h1 className="text-5xl font-bold tracking-tight text-foreground leading-tight">
              Recrutamento mais<br />
              <span className="text-primary">inteligente</span> com IA
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Automatize a triagem de currículos, ranqueie candidatos e tome decisões
              baseadas em dados — tudo em um único lugar.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/register"
              className="px-6 py-3 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary-hover transition-colors rounded-lg"
            >
              Começar gratuitamente
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground border border-muted hover:border-foreground/20 transition-colors rounded-lg"
            >
              Já tenho uma conta
            </Link>
          </div>

          <div className="w-full mt-4 p-px rounded-2xl bg-linear-to-b from-muted to-transparent">
            <div className="bg-surface rounded-2xl p-8 flex items-center justify-center min-h-64">
              <p className="text-muted-foreground text-sm">Dashboard preview em breve</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
