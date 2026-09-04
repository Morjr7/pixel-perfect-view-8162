import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Flame, Star } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { PopButton } from "@/components/PopButton";
import { RANKING } from "@/lib/enem-data";
import { useProgresso } from "@/lib/progresso";

export const Route = createFileRoute("/ranking")({
  head: () => ({
    meta: [
      { title: "Ranking de estudantes — Acelera ENEM" },
      { name: "description", content: "Veja sua posição no ranking semanal por XP e ofensiva de estudos." },
      { property: "og:title", content: "Ranking de estudantes — Acelera ENEM" },
      { property: "og:description", content: "Compare seu XP com o de outros estudantes e suba de posição." },
    ],
  }),
  component: Ranking,
});

function Ranking() {
  const { estado } = useProgresso();
  const [periodo, setPeriodo] = useState<"semana" | "mes" | "geral">("semana");

  const lista = RANKING.map((r) =>
    r.eu ? { ...r, nome: estado.nome, xp: estado.xp, ofensiva: estado.ofensiva, avatar: estado.avatar } : r,
  )
    .sort((a, b) => b.xp - a.xp)
    .map((r, i) => ({ ...r, pos: i + 1 }));

  return (
    <AppShell>
      <PageHeader titulo="Ranking" subtitulo="Estudantes fictícios para demonstrar a competição saudável." />

      <div className="mb-5 flex flex-wrap gap-2">
        {(["semana", "mes", "geral"] as const).map((p) => (
          <PopButton key={p} size="sm" tone={periodo === p ? "primary" : "neutral"} onClick={() => setPeriodo(p)}>
            {p === "semana" ? "Semana" : p === "mes" ? "Mês" : "Geral"}
          </PopButton>
        ))}
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {lista.slice(0, 3).map((r, i) => (
          <div
            key={r.nome}
            className={`panel-strong p-5 text-center ${i === 0 ? "sm:-translate-y-2" : ""}`}
          >
            <div className="text-4xl">{r.avatar}</div>
            <div className="mt-2 text-2xl">{["🥇", "🥈", "🥉"][i]}</div>
            <p className="mt-1 font-bold">{r.nome}</p>
            <p className="text-sm text-secondary">{r.xp.toLocaleString("pt-BR")} XP</p>
          </div>
        ))}
      </div>

      <ol className="panel divide-y divide-border">
        {lista.map((r) => (
          <li
            key={r.nome + r.pos}
            className={`flex items-center gap-4 p-4 ${r.eu ? "bg-primary/20" : ""}`}
          >
            <span className="w-8 text-center font-display text-lg font-bold">{r.pos}</span>
            <span className="grid size-10 place-items-center rounded-xl bg-muted/50 text-xl">
              {r.avatar}
            </span>
            <span className="font-semibold">
              {r.nome}
              {r.eu && <span className="ml-2 text-xs text-secondary">você</span>}
            </span>
            <span className="ml-auto flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Flame className="size-4 text-warning" aria-hidden />
                {r.ofensiva}
              </span>
              <span className="flex items-center gap-1 font-bold">
                <Star className="size-4 text-warning" aria-hidden />
                {r.xp.toLocaleString("pt-BR")}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </AppShell>
  );
}
