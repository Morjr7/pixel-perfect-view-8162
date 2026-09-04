import { useMemo, useState } from "react";
import { CheckCircle2, XCircle, Lightbulb, MessageCircleQuestion, Flag } from "lucide-react";
import { PopButton } from "@/components/PopButton";
import { TutorChat } from "@/components/TutorChat";
import { Progress } from "@/components/ui/progress";
import { useProgresso } from "@/lib/progresso";
import { areaById, type Questao } from "@/lib/enem-data";

type Props = {
  questoes: Questao[];
  titulo: string;
  modo: "treino" | "simulado";
  onFinalizar?: (acertos: number, total: number) => void;
};

const LETRAS = ["A", "B", "C", "D", "E"];

export function QuestionPlayer({ questoes, titulo, modo, onFinalizar }: Props) {
  const { responder } = useProgresso();
  const [indice, setIndice] = useState(0);
  const [escolha, setEscolha] = useState<number | null>(null);
  const [confirmada, setConfirmada] = useState(false);
  const [respostas, setRespostas] = useState<Record<string, number>>({});
  const [pista, setPista] = useState(false);
  const [chat, setChat] = useState(false);
  const [terminou, setTerminou] = useState(false);

  const questao = questoes[indice];
  const area = areaById(questao.area);

  const acertos = useMemo(
    () => questoes.filter((qq) => respostas[qq.id] === qq.correta).length,
    [questoes, respostas],
  );

  const confirmar = () => {
    if (escolha === null) return;
    const correta = escolha === questao.correta;
    setRespostas((r) => ({ ...r, [questao.id]: escolha }));
    responder({ questaoId: questao.id, area: questao.area, alternativa: escolha, correta });
    if (modo === "treino") setConfirmada(true);
    else proximaApos(escolha);
  };

  const proximaApos = (_e: number) => {
    setEscolha(null);
    setConfirmada(false);
    setPista(false);
    if (indice + 1 < questoes.length) setIndice(indice + 1);
    else finalizar();
  };

  const finalizar = () => {
    setTerminou(true);
    const acertosFinais = questoes.filter((qq) => respostas[qq.id] === qq.correta).length;
    onFinalizar?.(acertosFinais, questoes.length);
  };

  if (terminou) {
    const aprov = Math.round((acertos / questoes.length) * 100);
    return (
      <div className="panel-strong p-8 text-center">
        <div className="text-5xl">{aprov >= 70 ? "🎉" : aprov >= 40 ? "💪" : "🌱"}</div>
        <h2 className="mt-3 text-2xl font-bold">Sessão finalizada!</h2>
        <p className="mt-1 text-sm text-muted-foreground">{titulo}</p>
        <div className="mx-auto mt-6 grid max-w-md grid-cols-3 gap-3">
          {[
            { l: "Acertos", v: acertos },
            { l: "Erros", v: questoes.length - acertos },
            { l: "Aproveitamento", v: `${aprov}%` },
          ].map((i) => (
            <div key={i.l} className="rounded-xl border border-border bg-muted/40 p-4">
              <div className="text-2xl font-bold">{i.v}</div>
              <div className="text-xs text-muted-foreground">{i.l}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-3 text-left">
          {questoes.map((qq, i) => {
            const marcada = respostas[qq.id];
            const ok = marcada === qq.correta;
            return (
              <div key={qq.id} className="rounded-xl border border-border bg-muted/25 p-4">
                <div className="flex items-center gap-2 text-sm font-bold">
                  {ok ? (
                    <CheckCircle2 className="size-4 text-success" aria-hidden />
                  ) : (
                    <XCircle className="size-4 text-destructive" aria-hidden />
                  )}
                  Questão {i + 1} — {ok ? "acertou" : "errou"}
                  <span className="ml-auto text-xs font-normal text-muted-foreground">
                    {qq.fonte}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Resposta correta: <strong>{LETRAS[qq.correta]}</strong> — {qq.explicacao}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="panel p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-full border-2 border-[color:var(--ink)] bg-secondary px-3 py-1 text-secondary-foreground">
            {area.nome}
          </span>
          <span className="rounded-full border border-border px-3 py-1 text-muted-foreground">
            {questao.disciplina} · {questao.assunto}
          </span>
          <span className="rounded-full border border-border px-3 py-1 capitalize text-muted-foreground">
            {questao.dificuldade}
          </span>
          <span className="ml-auto text-muted-foreground">
            {indice + 1} de {questoes.length}
          </span>
        </div>

        <Progress value={((indice + (confirmada ? 1 : 0)) / questoes.length) * 100} className="mt-4" />

        <p className="mt-5 text-base leading-relaxed sm:text-lg">{questao.enunciado}</p>

        <ul className="mt-5 space-y-2">
          {questao.alternativas.map((alt, i) => {
            const selecionada = escolha === i;
            const certa = confirmada && i === questao.correta;
            const errada = confirmada && selecionada && i !== questao.correta;
            return (
              <li key={i}>
                <button
                  onClick={() => !confirmada && setEscolha(i)}
                  disabled={confirmada}
                  className={`flex w-full items-start gap-3 rounded-xl border-2 p-3 text-left text-sm transition-colors ${
                    certa
                      ? "border-success bg-success/15"
                      : errada
                        ? "border-destructive bg-destructive/15"
                        : selecionada
                          ? "border-secondary bg-secondary/15"
                          : "border-border hover:bg-muted/50"
                  }`}
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-lg border border-border font-bold">
                    {LETRAS[i]}
                  </span>
                  <span className="pt-0.5">{alt}</span>
                  {certa && <CheckCircle2 className="ml-auto size-5 text-success" aria-hidden />}
                  {errada && <XCircle className="ml-auto size-5 text-destructive" aria-hidden />}
                </button>
              </li>
            );
          })}
        </ul>

        {pista && !confirmada && (
          <div className="mt-4 rounded-xl border border-warning/50 bg-warning/10 p-4 text-sm">
            <strong className="flex items-center gap-2">
              <Lightbulb className="size-4" aria-hidden /> Pista do tutor
            </strong>
            <p className="mt-1 text-muted-foreground">
              Releia o enunciado buscando o conceito de <strong>{questao.assunto}</strong> e elimine as
              alternativas que contradizem esse conceito. A resposta não é entregue aqui.
            </p>
          </div>
        )}

        {confirmada && (
          <div
            className={`mt-4 rounded-xl border-2 p-4 text-sm ${
              escolha === questao.correta
                ? "border-success bg-success/10"
                : "border-destructive bg-destructive/10"
            }`}
          >
            <strong className="block">
              {escolha === questao.correta ? "Boa! Você acertou." : "Não foi dessa vez."}
            </strong>
            <p className="mt-1 text-muted-foreground">{questao.explicacao}</p>
            <p className="mt-2 text-xs text-muted-foreground">Fonte: {questao.fonte}</p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          {!confirmada ? (
            <>
              <PopButton tone="success" onClick={confirmar} disabled={escolha === null}>
                {modo === "treino" ? "Responder" : "Confirmar e avançar"}
              </PopButton>
              <PopButton tone="neutral" onClick={() => setPista(true)}>
                <Lightbulb className="size-4" aria-hidden /> Pista
              </PopButton>
            </>
          ) : (
            <PopButton tone="action" onClick={() => proximaApos(escolha!)}>
              {indice + 1 < questoes.length ? "Próxima" : "Ver resultado"}
            </PopButton>
          )}
          <PopButton tone="neutral" onClick={() => setChat((c) => !c)}>
            <MessageCircleQuestion className="size-4" aria-hidden /> Quero tirar essa dúvida
          </PopButton>
          <PopButton
            tone="neutral"
            onClick={() => setIndice(Math.max(0, indice - 1))}
            disabled={indice === 0}
          >
            Anterior
          </PopButton>
          <PopButton tone="danger" className="ml-auto" onClick={finalizar}>
            <Flag className="size-4" aria-hidden /> Finalizar
          </PopButton>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="panel p-4">
          <h3 className="text-sm font-bold">Sessão atual</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Respondidas</dt>
              <dd className="font-bold">{Object.keys(respostas).length}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Acertos</dt>
              <dd className="font-bold text-success">{acertos}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Erros</dt>
              <dd className="font-bold text-destructive">
                {Object.keys(respostas).length - acertos}
              </dd>
            </div>
          </dl>
        </div>
        {chat && <TutorChat area={questao.area} contexto={questao.assunto} />}
      </aside>
    </div>
  );
}
