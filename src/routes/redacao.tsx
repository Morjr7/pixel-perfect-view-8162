import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/AppShell";
import { PopButton } from "@/components/PopButton";
import { TutorChat } from "@/components/TutorChat";
import { Progress } from "@/components/ui/progress";
import { TEMAS_REDACAO } from "@/lib/enem-data";
import { useProgresso } from "@/lib/progresso";

export const Route = createFileRoute("/redacao")({
  head: () => ({
    meta: [
      { title: "Redação ENEM com correção — Acelera ENEM" },
      {
        name: "description",
        content: "Escreva sua redação, salve o rascunho automaticamente e receba nota pelas 5 competências.",
      },
      { property: "og:title", content: "Redação ENEM com correção — Acelera ENEM" },
      { property: "og:description", content: "Temas atuais, contagem de linhas e devolutiva por competência." },
    ],
  }),
  component: Redacao,
});

const COMPETENCIAS = [
  { id: "c1", nome: "Domínio da norma culta" },
  { id: "c2", nome: "Compreensão do tema" },
  { id: "c3", nome: "Organização de argumentos" },
  { id: "c4", nome: "Coesão e coerência" },
  { id: "c5", nome: "Proposta de intervenção" },
] as const;

function Redacao() {
  const { estado, salvarRedacao } = useProgresso();
  const [tema, setTema] = useState(TEMAS_REDACAO[0]);
  const [texto, setTexto] = useState("");

  useEffect(() => {
    const rascunho = localStorage.getItem("acelera-rascunho");
    if (rascunho) setTexto(rascunho);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => localStorage.setItem("acelera-rascunho", texto), 600);
    return () => clearTimeout(t);
  }, [texto]);

  const palavras = texto.trim().split(/\s+/).filter(Boolean).length;
  const linhas = Math.ceil(texto.length / 80);
  const ultima = estado.redacoes[0];

  const enviar = () => {
    if (palavras < 40) {
      toast.error("Escreva pelo menos 40 palavras para enviar à correção.");
      return;
    }
    const r = salvarRedacao(tema, texto);
    setTexto("");
    localStorage.removeItem("acelera-rascunho");
    toast.success(`Redação corrigida: ${r.total} pontos`);
  };

  return (
    <AppShell>
      <PageHeader titulo="Redação" subtitulo="Treine com temas atuais e receba uma devolutiva por competência." />

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="panel p-5">
          <label className="block text-sm">
            <span className="mb-1 block font-semibold">Tema</span>
            <select
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
            >
              {TEMAS_REDACAO.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={16}
            aria-label="Texto da redação"
            placeholder="Comece sua introdução aqui…"
            className="mt-4 w-full rounded-xl border border-border bg-muted/20 p-4 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-ring"
          />

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span>{palavras} palavras</span>
            <span>~{linhas} linhas</span>
            <span>{texto.length} caracteres</span>
            <span className="ml-auto">Rascunho salvo automaticamente</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <PopButton tone="success" onClick={enviar}>
              Enviar para correção
            </PopButton>
            <PopButton
              tone="neutral"
              onClick={() => {
                setTexto("");
                localStorage.removeItem("acelera-rascunho");
              }}
            >
              Limpar
            </PopButton>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="panel p-5">
            <h2 className="text-lg font-bold">Última correção</h2>
            {!ultima ? (
              <p className="mt-2 text-sm text-muted-foreground">
                Envie uma redação para ver a nota por competência.
              </p>
            ) : (
              <>
                <div className="mt-3 text-center">
                  <div className="font-display text-4xl font-bold text-secondary">{ultima.total}</div>
                  <div className="text-xs text-muted-foreground">de 1000 pontos</div>
                </div>
                <ul className="mt-4 space-y-3">
                  {COMPETENCIAS.map((c) => {
                    const nota = ultima.notas[c.id];
                    return (
                      <li key={c.id}>
                        <div className="flex justify-between text-xs">
                          <span>{c.nome}</span>
                          <span className="font-bold">{nota}/200</span>
                        </div>
                        <Progress value={(nota / 200) * 100} className="mt-1 h-2" />
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
          <TutorChat area="redacao" contexto="proposta de intervenção" />
        </aside>
      </div>

      {estado.redacoes.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 text-xl font-bold">Minhas redações</h2>
          <ul className="space-y-2">
            {estado.redacoes.map((r) => (
              <li key={r.id} className="panel flex flex-wrap items-center gap-3 p-4 text-sm">
                <strong className="max-w-lg truncate">{r.tema}</strong>
                <span className="text-muted-foreground">
                  {new Date(r.data).toLocaleDateString("pt-BR")}
                </span>
                <span className="ml-auto font-bold text-secondary">{r.total} pontos</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </AppShell>
  );
}
