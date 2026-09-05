import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpenText, Check, FileText, Save, Send, Shuffle, Trash2 } from "lucide-react";
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
      { title: "Redação ENEM — Jovens Educadores GIYV Estudos" },
      {
        name: "description",
        content: "Escolha um tema, escreva numa folha pautada e acompanhe a sua evolução.",
      },
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

const requiredThemes = new Set(TEMAS_REDACAO.slice(0, 10));
const themeContext = (tema: string) => ({
  proposta: `Analise os fatores que sustentam o problema de “${tema.toLocaleLowerCase("pt-BR")}" e discuta caminhos de enfrentamento no contexto brasileiro.`,
  motivadores: [
    `O debate sobre ${tema.toLocaleLowerCase("pt-BR")} exige observar desigualdades, responsabilidades públicas e participação social.`,
    "A Constituição Federal reconhece direitos fundamentais e orienta a construção de uma sociedade livre, justa e solidária.",
    "Uma boa proposta de intervenção deve indicar agente, ação, meio de execução, finalidade e respeito aos direitos humanos.",
  ],
});

function Redacao() {
  const { estado, salvarRedacao } = useProgresso();
  const [tema, setTema] = useState(TEMAS_REDACAO[0]!);
  const [texto, setTexto] = useState("");
  const [aba, setAba] = useState<"temas" | "escrever" | "textos">("temas");
  const [salvoEm, setSalvoEm] = useState<string | null>(null);
  const [corrigindo, setCorrigindo] = useState(false);
  const detalhes = useMemo(() => themeContext(tema), [tema]);
  const chaveRascunho = `giyv-redacao-${estado.email || "visitante"}-${tema}`;

  useEffect(() => {
    const draft = localStorage.getItem(chaveRascunho);
    setTexto(draft ?? "");
    setSalvoEm(draft ? "Rascunho recuperado" : null);
  }, [chaveRascunho]);

  useEffect(() => {
    if (!texto) return;
    const timer = window.setTimeout(() => {
      localStorage.setItem(chaveRascunho, texto);
      setSalvoEm(
        `Salvo às ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`,
      );
    }, 600);
    return () => window.clearTimeout(timer);
  }, [chaveRascunho, texto]);

  const palavras = texto.trim().split(/\s+/).filter(Boolean).length;
  const linhas = texto ? texto.split(/\n/).length : 0;
  const ultima = estado.redacoes[0];
  const media = estado.redacoes.length
    ? Math.round(estado.redacoes.reduce((s, r) => s + r.total, 0) / estado.redacoes.length)
    : 0;
  const melhor = estado.redacoes.length ? Math.max(...estado.redacoes.map((r) => r.total)) : 0;
  const mediaCompetencias = COMPETENCIAS.map((c) => ({
    ...c,
    nota: estado.redacoes.length
      ? Math.round(estado.redacoes.reduce((s, r) => s + r.notas[c.id], 0) / estado.redacoes.length)
      : 0,
  }));

  const selecionarTema = (novoTema: string) => {
    setTema(novoTema);
    setAba("escrever");
  };

  const limpar = () => {
    setTexto("");
    localStorage.removeItem(chaveRascunho);
    setSalvoEm(null);
    toast.success("Rascunho limpo.");
  };

  const enviar = async () => {
    if (corrigindo) return;
    if (palavras < 40) {
      toast.error("Escreva pelo menos 40 palavras para enviar à correção.");
      return;
    }
    setCorrigindo(true);
    for (const mensagem of [
      "A analisar a estrutura…",
      "A verificar os argumentos…",
      "A preparar a sua devolutiva…",
    ]) {
      toast(mensagem);
      await new Promise((resolve) => window.setTimeout(resolve, 1600));
    }
    const r = salvarRedacao(tema, texto);
    localStorage.removeItem(chaveRascunho);
    setTexto("");
    setSalvoEm(null);
    setCorrigindo(false);
    toast.success(`Correção concluída: ${r.total}/1000. Consulte a devolutiva por competência.`);
  };

  return (
    <AppShell>
      <PageHeader
        titulo="Redação"
        subtitulo="Escolha um tema, escreva com orientação e acompanhe a sua evolução."
        acao={
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-2 text-sm font-semibold text-secondary">
            <span className="grid size-7 place-items-center rounded-full bg-primary/30">✍️</span>
            {estado.nome || "Seu espaço de estudo"}
          </span>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {[
          { id: "temas", label: "Temas", icon: BookOpenText },
          { id: "escrever", label: "Novo texto", icon: FileText },
          { id: "textos", label: "Meus textos", icon: Check },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setAba(id as typeof aba)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${aba === id ? "bg-primary text-primary-foreground shadow-pop-sm" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
          >
            <Icon className="size-4" /> {label}
          </button>
        ))}
        <Link
          to="/ajuda"
          className="inline-flex items-center rounded-xl bg-muted/50 px-4 py-2.5 text-sm font-bold text-muted-foreground hover:bg-muted"
        >
          Orientações
        </Link>
      </div>

      {aba === "temas" && (
        <section>
          <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Redações corrigidas", estado.redacoes.length || "—"],
              ["Nota média", estado.redacoes.length ? `${media}/1000` : "—"],
              ["Melhor nota", estado.redacoes.length ? `${melhor}/1000` : "—"],
              ["Última correção", ultima ? new Date(ultima.data).toLocaleDateString("pt-BR") : "—"],
            ].map(([label, value]) => (
              <div key={label} className="panel p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  {label}
                </p>
                <p className="mt-2 text-2xl font-black text-secondary">{value}</p>
              </div>
            ))}
          </div>
          <div className="panel mb-5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-bold">Média por competência</h2>
                <p className="text-xs text-muted-foreground">
                  Sem redações corrigidas, nenhuma nota é inventada.
                </p>
              </div>
              <button
                className="inline-flex items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-sm font-bold text-secondary-foreground transition hover:opacity-90"
                onClick={() =>
                  selecionarTema(TEMAS_REDACAO[Math.floor(Math.random() * TEMAS_REDACAO.length)]!)
                }
              >
                <Shuffle className="size-4" /> Sortear tema aleatório
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {mediaCompetencias.map((c) => (
                <div key={c.id} className="rounded-xl bg-muted/40 p-3 text-center">
                  <p className="text-xs font-bold text-muted-foreground">{c.id.toUpperCase()}</p>
                  <p className="mt-1 text-lg font-black">{c.nota || "—"}</p>
                  <Progress value={(c.nota / 200) * 100} className="mt-2 h-1.5" />
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">Temas de redação</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Escolha um tema para abrir a proposta, os textos motivadores e a folha de escrita.
              </p>
            </div>
            <span className="rounded-full bg-secondary/15 px-3 py-1.5 text-sm font-bold text-secondary">
              {TEMAS_REDACAO.length} temas
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TEMAS_REDACAO.map((item, index) => (
              <button
                key={item}
                onClick={() => selecionarTema(item)}
                className="panel group text-left transition hover:-translate-y-0.5 hover:border-secondary/60 hover:shadow-pop-sm"
              >
                <div className="flex items-start justify-between gap-3 p-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/20 text-sm font-black text-secondary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="rounded-full bg-muted/60 px-2 py-1 text-[11px] font-bold text-muted-foreground">
                    {requiredThemes.has(item) ? "ENEM" : "Treino"}
                  </span>
                </div>
                <div className="px-4 pb-4">
                  <h3 className="font-bold leading-snug group-hover:text-secondary">{item}</h3>
                  <p className="mt-3 text-xs text-muted-foreground">Abrir proposta e escrever</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {aba === "escrever" && (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <section className="space-y-5">
            <div className="panel p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">
                    Proposta selecionada
                  </p>
                  <h2 className="mt-2 text-2xl font-black leading-tight">{tema}</h2>
                </div>
                <button
                  onClick={() => setAba("temas")}
                  className="text-sm font-semibold text-secondary hover:underline"
                >
                  Trocar tema
                </button>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{detalhes.proposta}</p>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {detalhes.motivadores.map((motivador, index) => (
                  <article key={motivador} className="rounded-xl bg-muted/35 p-3 text-sm leading-5">
                    <p className="mb-2 text-xs font-bold text-secondary">
                      Texto motivador {index + 1}
                    </p>
                    {motivador}
                  </article>
                ))}
              </div>
              <div className="mt-5 rounded-xl border border-secondary/30 bg-secondary/10 p-4 text-sm">
                <strong>Orientações:</strong> redija um texto dissertativo-argumentativo formal,
                organize uma tese e dois argumentos, e apresente uma intervenção detalhada que
                respeite os direitos humanos.
              </div>
            </div>
            <div className="panel p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">Folha de redação</h2>
                  <p className="text-sm text-muted-foreground">
                    Até 30 linhas recomendadas para o treino.
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {salvoEm ?? "Comece a escrever"}
                </span>
              </div>
              <textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                rows={16}
                aria-label="Texto da redação"
                placeholder="Comece a sua introdução aqui…"
                className="mt-4 w-full resize-y rounded-xl border border-border bg-[linear-gradient(transparent_31px,hsl(var(--border)/0.65)_32px)] bg-[length:100%_32px] p-3 text-sm leading-8 outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                <span>{palavras} palavras</span>
                <span>{linhas} linhas</span>
                <span>{texto.length} caracteres</span>
                <span className="inline-flex items-center gap-1 text-success">
                  <Save className="size-3" /> salvamento automático
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <PopButton tone="success" onClick={enviar} disabled={corrigindo}>
                  <Send className="mr-2 size-4" />
                  {corrigindo ? "Corrigindo…" : "Enviar redação"}
                </PopButton>
                <PopButton
                  tone="neutral"
                  onClick={() => {
                    localStorage.setItem(chaveRascunho, texto);
                    setSalvoEm("Rascunho salvo agora");
                    toast.success("Rascunho salvo.");
                  }}
                >
                  <Save className="mr-2 size-4" />
                  Salvar
                </PopButton>
                <PopButton tone="neutral" onClick={limpar}>
                  <Trash2 className="mr-2 size-4" />
                  Limpar
                </PopButton>
              </div>
            </div>
          </section>
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
                    <div className="font-display text-4xl font-bold text-secondary">
                      {ultima.total}
                    </div>
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
                  {ultima.avaliacao && (
                    <div className="mt-5 space-y-3 border-t border-border pt-4">
                      <p className="text-sm leading-6 text-muted-foreground">
                        {ultima.avaliacao.resumo}
                      </p>
                      <div className="rounded-xl bg-secondary/10 p-3">
                        <p className="text-sm font-bold">Como melhorar na próxima redação</p>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
                          {ultima.avaliacao.recomendacoes.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            <TutorChat area="redacao" contexto="tese, repertório e proposta de intervenção" alto />
          </aside>
        </div>
      )}

      {aba === "textos" && (
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold">Minhas redações</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Continue os seus textos e compare a evolução pelas competências.
            </p>
          </div>
          {estado.redacoes.length === 0 ? (
            <div className="panel p-8 text-center">
              <FileText className="mx-auto size-10 text-muted-foreground" />
              <p className="mt-3 font-semibold">Ainda não há redações concluídas.</p>
              <button
                onClick={() => setAba("temas")}
                className="mt-3 text-sm font-bold text-secondary hover:underline"
              >
                Escolher um tema
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {estado.redacoes.map((r) => (
                <li key={r.id} className="panel flex flex-wrap items-center gap-3 p-4">
                  <div className="grid size-10 place-items-center rounded-xl bg-primary/20 text-secondary">
                    <FileText className="size-5" />
                  </div>
                  <div>
                    <strong className="block max-w-2xl">{r.tema}</strong>
                    <span className="text-xs text-muted-foreground">
                      {new Date(r.data).toLocaleDateString("pt-BR")} ·{" "}
                      {r.texto.trim().split(/\s+/).filter(Boolean).length} palavras
                    </span>
                  </div>
                  <span className="ml-auto font-bold text-secondary">{r.total} pontos</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </AppShell>
  );
}
