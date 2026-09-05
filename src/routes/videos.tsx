import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Play, Clock } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { PopButton } from "@/components/PopButton";
import { AREAS, VIDEOS, areaBg, areaById, type AreaId } from "@/lib/enem-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: "Videoaulas por área — Jovens Educadores GIYV Estudos" },
      {
        name: "description",
        content: "Aulas curtas por área para revisar antes de treinar questões.",
      },
      { property: "og:title", content: "Videoaulas por área — Jovens Educadores GIYV Estudos" },
      {
        property: "og:description",
        content: "Revisões rápidas de Matemática, Linguagens, Humanas e Natureza.",
      },
    ],
  }),
  component: Videos,
});

function Videos() {
  const [filtro, setFiltro] = useState<AreaId | "todas">("todas");
  const [aberto, setAberto] = useState<string | null>(null);
  const lista = VIDEOS.filter((v) => filtro === "todas" || v.area === filtro);
  const atual = VIDEOS.find((v) => v.id === aberto);

  return (
    <AppShell>
      <PageHeader titulo="Vídeos" subtitulo="Revisões curtas para destravar antes do treino." />

      <div className="mb-5 flex flex-wrap gap-2">
        <PopButton
          size="sm"
          tone={filtro === "todas" ? "primary" : "neutral"}
          onClick={() => setFiltro("todas")}
        >
          Todas
        </PopButton>
        {AREAS.map((a) => (
          <PopButton
            key={a.id}
            size="sm"
            tone={filtro === a.id ? "primary" : "neutral"}
            onClick={() => setFiltro(a.id)}
          >
            {a.emoji} {a.nome}
          </PopButton>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {lista.map((v) => (
          <article key={v.id} className="area-card hover:area-card-hover">
            <div
              className={`flex h-32 items-center justify-center border-b-2 border-[color:var(--ink)] text-5xl ${areaBg[v.area]}`}
            >
              {areaById(v.area).emoji}
            </div>
            <div className="p-4">
              <h2 className="font-display text-lg font-bold">{v.titulo}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{v.descricao}</p>
              <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="size-3" aria-hidden /> {v.duracao}
                </span>
                <span>{v.professor}</span>
              </div>
              <PopButton
                tone="action"
                size="block"
                className="mt-4"
                onClick={() => setAberto(v.id)}
              >
                <Play className="size-4" aria-hidden /> Assistir
              </PopButton>
            </div>
          </article>
        ))}
      </div>

      <Dialog open={!!aberto} onOpenChange={(o) => !o && setAberto(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{atual?.titulo}</DialogTitle>
            <DialogDescription>
              {atual?.professor} · {atual?.duracao}
            </DialogDescription>
          </DialogHeader>
          <div className="grid aspect-video place-items-center rounded-xl border-2 border-[color:var(--ink)] bg-muted/40 text-center text-sm text-muted-foreground">
            <div>
              <div className="text-5xl">🎬</div>
              <p className="mt-2">Player demonstrativo do trabalho escolar</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{atual?.descricao}</p>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
