import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { PopButton } from "@/components/PopButton";
import { AREAS, QUESTOES, areaBg } from "@/lib/enem-data";
import { useEstatisticas } from "@/lib/progresso";

export const Route = createFileRoute("/treinar/")({
  head: () => ({
    meta: [
      { title: "Treinar questões do ENEM — Jovens Educadores GIYV Estudos" },
      {
        name: "description",
        content: "Escolha uma área e treine questões comentadas do ENEM com correção na hora.",
      },
      {
        property: "og:title",
        content: "Treinar questões do ENEM — Jovens Educadores GIYV Estudos",
      },
      { property: "og:description", content: "Questões comentadas por área com pistas e tutores." },
    ],
  }),
  component: Treinar,
});

function Treinar() {
  const stats = useEstatisticas();
  return (
    <AppShell>
      <PageHeader
        titulo="Treinar"
        subtitulo="Escolha uma área para praticar questões comentadas."
        acao={
          <PopButton asChild tone="action">
            <Link to="/listas">Montar lista personalizada</Link>
          </PopButton>
        }
      />
      <div className="grid gap-5 sm:grid-cols-2">
        {AREAS.map((area) => {
          const disponiveis = QUESTOES.filter((q) => q.area === area.id).length;
          const s = stats.porArea.find((p) => p.area.id === area.id)!;
          return (
            <article key={area.id} className="area-card hover:area-card-hover">
              <div
                className={`flex items-start justify-between gap-4 border-b-2 border-[color:var(--ink)] p-5 ${areaBg[area.id]}`}
              >
                <div className="text-[color:var(--ink)]">
                  <h2 className="font-display text-xl font-bold">{area.nome}</h2>
                  <p className="mt-1 text-sm opacity-80">{area.disciplinas.join(" · ")}</p>
                </div>
                <span className="text-4xl" aria-hidden>
                  {area.emoji}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 p-4">
                <div>
                  <div className="text-2xl font-bold">{s.aproveitamento}%</div>
                  <div className="text-xs text-muted-foreground">
                    {s.total} feitas · {disponiveis} disponíveis
                  </div>
                </div>
                <PopButton asChild tone="action" size="sm" className="ml-auto">
                  <Link to="/treinar/$area" params={{ area: area.id }}>
                    Treinar
                  </Link>
                </PopButton>
              </div>
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}
