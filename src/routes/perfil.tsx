import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/AppShell";
import { PopButton } from "@/components/PopButton";
import { CONQUISTAS, RANKING, notaTriEstimada } from "@/lib/enem-data";
import { useEstatisticas, useProgresso } from "@/lib/progresso";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Meu perfil de estudos — Acelera ENEM" },
      { name: "description", content: "Resumo do seu desempenho, medalhas, ofensiva e dados da conta." },
      { property: "og:title", content: "Meu perfil de estudos — Acelera ENEM" },
      { property: "og:description", content: "Seu histórico de estudos em um só lugar." },
    ],
  }),
  component: Perfil,
});

const AVATARES = ["🧑‍🚀", "🦉", "🚀", "🌟", "⚡", "🎯", "🐝", "🍀"];

function Perfil() {
  const { estado, atualizarPerfil, sair } = useProgresso();
  const stats = useEstatisticas();
  const [nome, setNome] = useState(estado.nome);
  const posicao = RANKING.filter((r) => r.xp > estado.xp).length + 1;
  const medalhas = CONQUISTAS.filter((c) =>
    c.tipo === "questoes"
      ? stats.total >= c.meta
      : c.tipo === "acertos"
        ? stats.acertos >= c.meta
        : c.tipo === "ofensiva"
          ? estado.ofensiva >= c.meta
          : c.tipo === "redacoes"
            ? estado.redacoes.length >= c.meta
            : estado.simulados.length >= c.meta,
  );

  return (
    <AppShell>
      <PageHeader titulo="Perfil" subtitulo="Seus dados e sua evolução na plataforma." />

      <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
        <div className="panel-strong h-fit p-6 text-center">
          <div className="mx-auto grid size-24 place-items-center rounded-3xl border-2 border-[color:var(--ink)] bg-primary/40 text-5xl">
            {estado.avatar}
          </div>
          <h2 className="mt-4 text-xl font-bold">{estado.nome}</h2>
          <p className="text-sm text-muted-foreground">{estado.email}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {AVATARES.map((a) => (
              <button
                key={a}
                onClick={() => atualizarPerfil({ avatar: a })}
                aria-label={`Escolher avatar ${a}`}
                className={`grid size-9 place-items-center rounded-xl border text-lg ${
                  estado.avatar === a ? "border-secondary bg-secondary/20" : "border-border"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            aria-label="Nome de exibição"
            className="mt-4 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <PopButton
            tone="action"
            size="block"
            className="mt-3"
            onClick={() => {
              atualizarPerfil({ nome });
              toast.success("Perfil atualizado");
            }}
          >
            Salvar alterações
          </PopButton>
          <PopButton
            tone="neutral"
            size="block"
            className="mt-2"
            onClick={() => {
              sair();
              toast("Você saiu da conta demonstrativa");
            }}
          >
            Sair da conta
          </PopButton>
        </div>

        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { l: "Questões", v: stats.total },
              { l: "Aproveitamento", v: `${stats.aproveitamento}%` },
              { l: "Ofensiva", v: `${estado.ofensiva} dias` },
              { l: "XP", v: estado.xp },
              { l: "Ranking", v: `#${posicao}` },
              { l: "Nota estimada", v: notaTriEstimada(stats.acertos, stats.total) },
            ].map((c) => (
              <div key={c.l} className="panel p-4">
                <div className="text-2xl font-bold">{c.v}</div>
                <div className="text-xs text-muted-foreground">{c.l}</div>
              </div>
            ))}
          </div>

          <div className="panel p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Medalhas</h2>
              <Link to="/conquistas" className="text-sm font-semibold text-secondary hover:underline">
                Ver todas
              </Link>
            </div>
            {medalhas.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                Responda questões para desbloquear suas primeiras medalhas.
              </p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-3">
                {medalhas.map((m) => (
                  <span
                    key={m.id}
                    className="flex items-center gap-2 rounded-xl border border-warning/60 bg-warning/15 px-3 py-2 text-sm font-semibold"
                  >
                    {m.emoji} {m.titulo}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="panel p-5">
            <h2 className="text-lg font-bold">Histórico recente</h2>
            {estado.respostas.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">Nenhuma atividade ainda.</p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {estado.respostas
                  .slice(-8)
                  .reverse()
                  .map((r, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 rounded-xl border border-border bg-muted/25 p-3"
                    >
                      <span>{r.correta ? "✅" : "❌"}</span>
                      <span className="capitalize">{r.area}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {new Date(r.data).toLocaleString("pt-BR")}
                      </span>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
