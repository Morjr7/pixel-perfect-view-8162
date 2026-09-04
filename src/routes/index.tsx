import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, Flame, Star, Target, Trophy, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PopButton } from "@/components/PopButton";
import { Progress } from "@/components/ui/progress";
import { AREAS, RANKING, areaBg, notaTriEstimada } from "@/lib/enem-data";
import { useEstatisticas, useProgresso } from "@/lib/progresso";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Acelera ENEM — seu painel de estudos" },
      {
        name: "description",
        content:
          "Veja o que estudar hoje, sua ofensiva, XP, ranking e desempenho por área no Acelera ENEM.",
      },
      { property: "og:title", content: "Acelera ENEM — seu painel de estudos" },
      {
        property: "og:description",
        content: "Painel com metas do dia, ofensiva, XP e evolução por área de conhecimento.",
      },
    ],
  }),
  component: Inicio,
});

function Inicio() {
  const { estado } = useProgresso();
  const stats = useEstatisticas();
  const respondidasHoje = estado.respostas.filter(
    (r) => r.data.slice(0, 10) === new Date().toISOString().slice(0, 10),
  ).length;
  const metaPct = Math.min(100, Math.round((respondidasHoje / estado.metaDiaria) * 100));
  const posicao = RANKING.filter((r) => r.xp > estado.xp).length + 1;

  const fraca = [...stats.porArea].sort((a, b) => a.aproveitamento - b.aproveitamento)[0];

  return (
    <AppShell>
      <section className="panel-strong relative overflow-hidden p-6 sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <p className="text-sm font-semibold text-secondary">Bom estudo, {estado.nome.split(" ")[0]}!</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">O que você vai estudar hoje?</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sua meta diária é de {estado.metaDiaria} questões. Você já fez {respondidasHoje} hoje.
          </p>
          <Progress value={metaPct} className="mt-4 max-w-md" />
          <div className="mt-5 flex flex-wrap gap-3">
            <PopButton asChild tone="action" size="lg">
              <Link to="/treinar">
                Treinar agora <ArrowRight className="size-4" aria-hidden />
              </Link>
            </PopButton>
            <PopButton asChild tone="neutral" size="lg">
              <Link to="/simulados">Fazer simulado</Link>
            </PopButton>
            <PopButton asChild tone="neutral" size="lg">
              <Link to="/redacao">Escrever redação</Link>
            </PopButton>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-10 -top-10 hidden text-[12rem] opacity-20 sm:block">
          🚀
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icone: Flame, rotulo: "Ofensiva atual", valor: `${estado.ofensiva} dias`, extra: `Melhor: ${estado.melhorOfensiva}` },
          { icone: Star, rotulo: "XP acumulado", valor: estado.xp, extra: "15 XP por acerto" },
          { icone: Target, rotulo: "Aproveitamento", valor: `${stats.aproveitamento}%`, extra: `${stats.total} questões` },
          { icone: Trophy, rotulo: "Posição no ranking", valor: `#${posicao}`, extra: "Ranking semanal" },
        ].map((c) => (
          <div key={c.rotulo} className="panel p-5">
            <c.icone className="size-5 text-secondary" aria-hidden />
            <div className="mt-3 text-3xl font-bold">{c.valor}</div>
            <div className="text-sm font-semibold">{c.rotulo}</div>
            <div className="text-xs text-muted-foreground">{c.extra}</div>
          </div>
        ))}
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-2xl font-bold">Áreas de conhecimento</h2>
          <Link to="/estatisticas" className="text-sm font-semibold text-secondary hover:underline">
            Ver estatísticas
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {stats.porArea.map(({ area, total, aproveitamento }) => (
            <article key={area.id} className="area-card group hover:area-card-hover">
              <div
                className={`flex items-start justify-between gap-4 border-b-2 border-[color:var(--ink)] p-5 ${areaBg[area.id]}`}
              >
                <div className="text-[color:var(--ink)]">
                  <h3 className="font-display text-xl font-bold">{area.nome}</h3>
                  <p className="mt-1 text-sm opacity-80">{area.descricao}</p>
                </div>
                <span className="text-4xl" aria-hidden>
                  {area.emoji}
                </span>
              </div>
              <div className="flex items-center gap-3 p-4">
                <div>
                  <div className="text-2xl font-bold">{aproveitamento}%</div>
                  <div className="text-xs text-muted-foreground">{total} questões feitas</div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <PopButton asChild tone="action" size="sm">
                    <Link to="/treinar/$area" params={{ area: area.id }}>
                      Treinar
                    </Link>
                  </PopButton>
                  <PopButton asChild tone="neutral" size="sm" aria-label={`Estatísticas de ${area.nome}`}>
                    <Link to="/estatisticas">
                      <BarChart3 className="size-4" aria-hidden />
                    </Link>
                  </PopButton>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="panel p-5 lg:col-span-2">
          <h2 className="text-lg font-bold">Próximos passos sugeridos</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
              <span className="text-xl">🎯</span>
              <span>
                Sua área mais frágil é <strong>{fraca.area.nome}</strong> ({fraca.aproveitamento}%).
                Faça 10 questões focadas.
              </span>
              <PopButton asChild tone="primary" size="sm" className="ml-auto">
                <Link to="/treinar/$area" params={{ area: fraca.area.id }}>
                  Ir
                </Link>
              </PopButton>
            </li>
            <li className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
              <span className="text-xl">📝</span>
              <span>Nenhuma redação enviada esta semana. Treine a competência 5.</span>
              <PopButton asChild tone="neutral" size="sm" className="ml-auto">
                <Link to="/redacao">Escrever</Link>
              </PopButton>
            </li>
            <li className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
              <span className="text-xl">🧠</span>
              <span>Simulado geral de 45 questões pendente.</span>
              <PopButton asChild tone="neutral" size="sm" className="ml-auto">
                <Link to="/simulados">Começar</Link>
              </PopButton>
            </li>
          </ul>
        </div>
        <div className="panel p-5">
          <h2 className="text-lg font-bold">Estimativa ENEM</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Baseada no seu aproveitamento atual (valor demonstrativo).
          </p>
          <div className="mt-6 text-center">
            <div className="font-display text-5xl font-bold text-secondary">
              {notaTriEstimada(stats.acertos, stats.total)}
            </div>
            <div className="text-xs text-muted-foreground">nota estimada por área</div>
          </div>
          <div className="mt-6 space-y-2">
            {AREAS.map((a) => {
              const s = stats.porArea.find((p) => p.area.id === a.id)!;
              return (
                <div key={a.id}>
                  <div className="flex justify-between text-xs">
                    <span>{a.nome}</span>
                    <span className="font-bold">{s.aproveitamento}%</span>
                  </div>
                  <Progress value={s.aproveitamento} className="mt-1 h-2" />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
