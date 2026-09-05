import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Dumbbell,
  ClipboardList,
  ListChecks,
  PenLine,
  PlayCircle,
  BarChart3,
  Trophy,
  Medal,
  Users,
  User,
  Settings,
  LifeBuoy,
  Flame,
  Star,
  Bell,
  Search,
  Menu,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useProgresso } from "@/lib/progresso";
import { useNavigate } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const NAV = [
  { to: "/", label: "Início", icon: Home },
  { to: "/treinar", label: "Treinar", icon: Dumbbell },
  { to: "/simulados", label: "Simulados", icon: ClipboardList },
  { to: "/listas", label: "Listas", icon: ListChecks },
  { to: "/redacao", label: "Redação", icon: PenLine },
  { to: "/videos", label: "Vídeos", icon: PlayCircle },
  { to: "/estatisticas", label: "Estatísticas", icon: BarChart3 },
  { to: "/ranking", label: "Ranking", icon: Trophy },
  { to: "/conquistas", label: "Conquistas", icon: Medal },
  { to: "/comunidade", label: "Comunidade", icon: Users },
  { to: "/perfil", label: "Perfil", icon: User },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
  { to: "/ajuda", label: "Ajuda", icon: LifeBuoy },
] as const;

const MOBILE_NAV = NAV.filter((n) =>
  ["/", "/treinar", "/simulados", "/redacao", "/estatisticas"].includes(n.to),
);

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="grid size-9 place-items-center rounded-xl border-2 border-[color:var(--ink)] bg-primary text-lg shadow-pop-sm">
        ⚡
      </span>
      {!compact && (
        <span className="font-display text-lg font-bold leading-none">
          Jovens Educadores <span className="text-secondary">GIYV Estudos</span>
        </span>
      )}
    </Link>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => {
        const ativo = to === "/" ? path === "/" : path.startsWith(to);
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
              ativo
                ? "bg-primary/25 text-foreground ring-1 ring-secondary/50"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            }`}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { estado } = useProgresso();
  const [aberto, setAberto] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  useEffect(() => {
    if (estado.pronto === false) return;
    if (!estado.logado && path !== "/entrar") navigate({ to: "/entrar", replace: true });
  }, [estado.logado, estado.pronto, navigate, path]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-4">
          <Sheet open={aberto} onOpenChange={setAberto}>
            <SheetTrigger
              aria-label="Abrir menu"
              className="grid size-9 place-items-center rounded-xl border border-border lg:hidden"
            >
              <Menu className="size-4" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-sidebar p-4">
              <SheetTitle className="sr-only">Menu principal</SheetTitle>
              <div className="mb-6">
                <Logo />
              </div>
              <NavLinks onNavigate={() => setAberto(false)} />
            </SheetContent>
          </Sheet>

          <Logo />

          <div className="ml-2 hidden flex-1 items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2 md:flex">
            <Search className="size-4 text-muted-foreground" aria-hidden />
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Buscar questões, assuntos, temas de redação…"
              aria-label="Buscar na plataforma"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-sm font-bold">
              <Flame className="size-4 text-warning" aria-hidden />
              {estado.ofensiva}
            </span>
            <span className="flex items-center gap-1 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-sm font-bold">
              <Star className="size-4 text-warning" aria-hidden />
              {estado.xp}
            </span>
            <button
              aria-label="Notificações"
              className="hidden size-9 place-items-center rounded-xl border border-border sm:grid"
            >
              <Bell className="size-4" />
            </button>
            <Link
              to="/perfil"
              className="flex items-center gap-2 rounded-xl border border-border px-2 py-1.5"
            >
              <span className="grid size-7 place-items-center rounded-lg bg-primary/30">
                {estado.avatar}
              </span>
              <span className="hidden max-w-24 truncate text-sm font-semibold sm:block">
                {estado.nome.split(" ")[0]}
              </span>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px] gap-6 px-4 py-6">
        <aside className="sticky top-20 hidden h-fit w-60 shrink-0 lg:block">
          <div className="panel p-3">
            <NavLinks />
          </div>
        </aside>
        <main className="min-w-0 flex-1 pb-24 lg:pb-6">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur lg:hidden">
        <ul className="mx-auto flex max-w-lg items-stretch justify-between px-2">
          {MOBILE_NAV.map(({ to, label, icon: Icon }) => {
            const ativo = to === "/" ? path === "/" : path.startsWith(to);
            return (
              <li key={to} className="flex-1">
                <Link
                  to={to}
                  className={`flex flex-col items-center gap-1 py-2 text-[11px] font-semibold ${
                    ativo ? "text-secondary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="size-5" aria-hidden />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export function PageHeader({
  titulo,
  subtitulo,
  acao,
}: {
  titulo: string;
  subtitulo?: string;
  acao?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">{titulo}</h1>
        {subtitulo && <p className="mt-1 text-sm text-muted-foreground">{subtitulo}</p>}
      </div>
      {acao}
    </div>
  );
}
