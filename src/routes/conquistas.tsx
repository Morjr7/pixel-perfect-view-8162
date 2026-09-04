import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Progress } from "@/components/ui/progress";
import { CONQUISTAS } from "@/lib/enem-data";
import { useEstatisticas, useProgresso } from "@/lib/progresso";

export const Route = createFileRoute("/conquistas")({
  head: () => ({
    meta: [
      { title: "Conquistas e medalhas — Acelera ENEM" },
      { name: "description", content: "Desbloqueie medalhas ao responder questões, manter a ofensiva e escrever redações." },
      { property: "og:title", content: "Conquistas e medalhas — Acelera ENEM" },
      { property: "og:description", content: "Metas de estudo que transformam a rotina em uma jornada." },
    ],
  }),
  component: Conquistas,
});

function Conquistas() {
  const { estado } = useProgresso();
  const stats = useEstatisticas();

  const progressoDe = (tipo: string) =>
    ({
      questoes: stats.total,
      acertos: stats.acertos,
      ofensiva: estado.ofensiva,
      redacoes: estado.redacoes.length,
      simulados: estado.simulados.length,
    })[tipo] ?? 0;

  const desbloqueadas = CONQUISTAS.filter((c) => progressoDe(c.tipo) >= c.meta).length;

  return (
    <AppShell>
      <PageHeader
        titulo="Conquistas"
        subtitulo={`${desbloqueadas} de ${CONQUISTAS.length} medalhas desbloqueadas`}
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {CONQUISTAS.map((c) => {
          const atual = progressoDe(c.tipo);
          const ok = atual >= c.meta;
          return (
            <article
              key={c.id}
              className={`panel p-5 ${ok ? "ring-2 ring-warning" : "opacity-80"}`}
            >
              <div className="flex items-center gap-3">
                <span className={`grid size-12 place-items-center rounded-2xl text-2xl ${ok ? "bg-warning/25" : "bg-muted/50 grayscale"}`}>
                  {c.emoji}
                </span>
                <div>
                  <h2 className="font-bold">{c.titulo}</h2>
                  <p className="text-xs text-muted-foreground">{c.descricao}</p>
                </div>
              </div>
              <Progress value={Math.min(100, (atual / c.meta) * 100)} className="mt-4 h-2" />
              <p className="mt-2 text-xs text-muted-foreground">
                {ok ? "Desbloqueada! 🎉" : `${Math.min(atual, c.meta)} de ${c.meta}`}
              </p>
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}
