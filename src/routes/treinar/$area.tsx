import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { PopButton } from "@/components/PopButton";
import { QuestionPlayer } from "@/components/QuestionPlayer";
import { AREAS, QUESTOES, type AreaId, type Dificuldade } from "@/lib/enem-data";

export const Route = createFileRoute("/treinar/$area")({
  head: () => ({
    meta: [
      { title: "Treino por área — Acelera ENEM" },
      {
        name: "description",
        content: "Sessão de treino com filtros de disciplina e dificuldade, correção e explicação.",
      },
      { property: "og:title", content: "Treino por área — Acelera ENEM" },
      { property: "og:description", content: "Responda, receba correção comentada e peça ajuda ao tutor." },
    ],
  }),
  component: TreinoArea,
});

function TreinoArea() {
  const { area } = useParams({ from: "/treinar/$area" });
  const areaInfo = AREAS.find((a) => a.id === (area as AreaId));
  const [disciplina, setDisciplina] = useState("todas");
  const [dificuldade, setDificuldade] = useState<"todas" | Dificuldade>("todas");
  const [iniciado, setIniciado] = useState(false);

  const questoes = useMemo(
    () =>
      QUESTOES.filter(
        (q) =>
          q.area === area &&
          (disciplina === "todas" || q.disciplina === disciplina) &&
          (dificuldade === "todas" || q.dificuldade === dificuldade),
      ),
    [area, disciplina, dificuldade],
  );

  if (!areaInfo) {
    return (
      <AppShell>
        <div className="panel p-8 text-center">
          <p className="text-lg font-bold">Área não encontrada.</p>
          <PopButton asChild tone="neutral" className="mt-4">
            <Link to="/treinar">Voltar para Treinar</Link>
          </PopButton>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        titulo={`Treinar ${areaInfo.nome}`}
        subtitulo={areaInfo.descricao}
        acao={
          <PopButton asChild tone="neutral" size="sm">
            <Link to="/treinar">Trocar de área</Link>
          </PopButton>
        }
      />

      {!iniciado ? (
        <div className="panel p-6">
          <h2 className="text-lg font-bold">Configure seu treino</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block font-semibold">Disciplina</span>
              <select
                value={disciplina}
                onChange={(e) => setDisciplina(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="todas">Todas</option>
                {areaInfo.disciplinas.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-semibold">Dificuldade</span>
              <select
                value={dificuldade}
                onChange={(e) => setDificuldade(e.target.value as Dificuldade | "todas")}
                className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="todas">Todas</option>
                <option value="facil">Fácil</option>
                <option value="media">Média</option>
                <option value="dificil">Difícil</option>
              </select>
            </label>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {questoes.length} questões disponíveis com esses filtros.
          </p>
          <PopButton
            tone="success"
            size="lg"
            className="mt-4"
            disabled={questoes.length === 0}
            onClick={() => setIniciado(true)}
          >
            Começar treino
          </PopButton>
        </div>
      ) : (
        <QuestionPlayer questoes={questoes} titulo={`Treino de ${areaInfo.nome}`} modo="treino" />
      )}
    </AppShell>
  );
}
