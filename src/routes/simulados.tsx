import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/AppShell";
import { PopButton } from "@/components/PopButton";
import { QuestionPlayer } from "@/components/QuestionPlayer";
import { AREAS, QUESTOES, areaBg, notaTriEstimada, type AreaId } from "@/lib/enem-data";
import { useProgresso } from "@/lib/progresso";

export const Route = createFileRoute("/simulados")({
  head: () => ({
    meta: [
      { title: "Simulados do ENEM — Jovens Educadores GIYV Estudos" },
      {
        name: "description",
        content: "Monte simulados por área ou geral, escolha a quantidade e veja a nota estimada.",
      },
      { property: "og:title", content: "Simulados do ENEM — Jovens Educadores GIYV Estudos" },
      {
        property: "og:description",
        content: "Simulados cronometrados com correção e nota estimada.",
      },
    ],
  }),
  component: Simulados,
});

type Escopo = AreaId | "geral";

function Simulados() {
  const { estado, registrarSimulado } = useProgresso();
  const [escopo, setEscopo] = useState<Escopo>("geral");
  const [quantidade, setQuantidade] = useState(10);
  const [rodando, setRodando] = useState(false);

  const disponiveis = useMemo(
    () => (escopo === "geral" ? QUESTOES : QUESTOES.filter((q) => q.area === escopo)),
    [escopo],
  );
  const selecionadas = useMemo(
    () => disponiveis.slice(0, Math.min(quantidade, disponiveis.length)),
    [disponiveis, quantidade],
  );

  const nomeEscopo =
    escopo === "geral" ? "Simulado Geral" : AREAS.find((a) => a.id === escopo)!.nome;

  if (rodando) {
    return (
      <AppShell>
        <PageHeader titulo={nomeEscopo} subtitulo="Sem correção durante a prova. Boa sorte!" />
        <QuestionPlayer
          questoes={selecionadas}
          titulo={nomeEscopo}
          modo="simulado"
          onFinalizar={(acertos, total) => {
            registrarSimulado({ nome: nomeEscopo, acertos, total });
            toast.success(`Simulado concluído: ${acertos}/${total} acertos`);
          }}
        />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader titulo="Simulados" subtitulo="Escolha o formato e comece quando quiser." />

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <div className="panel p-5">
            <h2 className="text-lg font-bold">1. Escolha a prova</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {AREAS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setEscopo(a.id)}
                  className={`flex items-center gap-3 rounded-2xl border-2 border-[color:var(--ink)] p-4 text-left text-[color:var(--ink)] transition-transform ${areaBg[a.id]} ${
                    escopo === a.id ? "-translate-y-1 ring-4 ring-secondary" : ""
                  }`}
                >
                  <span className="text-3xl" aria-hidden>
                    {a.emoji}
                  </span>
                  <span>
                    <span className="block font-display font-bold">{a.nome}</span>
                    <span className="text-xs opacity-80">
                      {QUESTOES.filter((q) => q.area === a.id).length} questões
                    </span>
                  </span>
                </button>
              ))}
              <button
                onClick={() => setEscopo("geral")}
                className={`flex items-center gap-3 rounded-2xl border-2 border-[color:var(--ink)] bg-primary p-4 text-left text-primary-foreground transition-transform sm:col-span-2 ${
                  escopo === "geral" ? "-translate-y-1 ring-4 ring-secondary" : ""
                }`}
              >
                <span className="text-3xl" aria-hidden>
                  🧠
                </span>
                <span>
                  <span className="block font-display font-bold">Simulado Geral</span>
                  <span className="text-xs opacity-90">Todas as áreas misturadas</span>
                </span>
              </button>
            </div>
          </div>

          <div className="panel p-5">
            <h2 className="text-lg font-bold">2. Quantidade de questões</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {[5, 10, 15, 20, 24].map((n) => (
                <PopButton
                  key={n}
                  tone={quantidade === n ? "primary" : "neutral"}
                  onClick={() => setQuantidade(n)}
                >
                  {n}
                </PopButton>
              ))}
            </div>
          </div>

          <div className="panel p-5">
            <h2 className="text-lg font-bold">Meus simulados</h2>
            {estado.simulados.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                Você ainda não concluiu simulados. Comece pelo Simulado Geral de 10 questões.
              </p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {estado.simulados.map((s) => (
                  <li
                    key={s.id}
                    className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-muted/30 p-3"
                  >
                    <strong>{s.nome}</strong>
                    <span className="text-muted-foreground">
                      {new Date(s.data).toLocaleDateString("pt-BR")}
                    </span>
                    <span className="ml-auto font-bold">
                      {s.acertos}/{s.total} · nota {notaTriEstimada(s.acertos, s.total)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <aside className="panel-strong h-fit p-5">
          <h2 className="text-lg font-bold">Resumo</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Prova</dt>
              <dd className="font-bold">{nomeEscopo}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Questões</dt>
              <dd className="font-bold">{selecionadas.length}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Tempo estimado</dt>
              <dd className="font-bold">{selecionadas.length * 3} min</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Modo</dt>
              <dd className="font-bold">Correção ao final</dd>
            </div>
          </dl>
          <PopButton
            tone="success"
            size="block"
            className="mt-5"
            disabled={selecionadas.length === 0}
            onClick={() => setRodando(true)}
          >
            Começar simulado
          </PopButton>
          <p className="mt-3 text-xs text-muted-foreground">
            Durante o simulado a resposta correta só aparece no resultado final.
          </p>
        </aside>
      </div>
    </AppShell>
  );
}
