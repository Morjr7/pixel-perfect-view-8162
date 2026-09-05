import { useEffect, useMemo, useState } from "react";
import { Send } from "lucide-react";
import { TUTORES, type AreaId } from "@/lib/enem-data";
import { PopButton } from "@/components/PopButton";

type Msg = { de: "tutor" | "eu"; texto: string };

const respostasPorPista = [
  "Comece identificando o comando principal da questão e destaque as palavras que limitam a resposta. Depois, elimine as alternativas que contradizem os dados apresentados.",
  "Uma boa estratégia é separar conceito, evidência e conclusão. O conceito explica o assunto; a evidência vem do enunciado; a conclusão responde exatamente ao que foi pedido.",
  "Leia novamente o contexto antes de escolher. Em questões do ENEM, a alternativa correta costuma relacionar o conteúdo estudado a uma situação social, histórica ou cotidiana.",
];

function criarResposta(pergunta: string, area: AreaId | "redacao" | "geral", contexto?: string) {
  const texto = pergunta.toLocaleLowerCase("pt-BR");
  if (area === "redacao" && /(tese|introdução|introducao)/.test(texto)) {
    return "Para construir a tese, apresente uma resposta direta ao problema do tema e antecipe dois recortes que serão desenvolvidos. Evite apenas repetir o título: indique a sua posição e os fatores que a sustentam.";
  }
  if (area === "redacao" && /(conclusão|conclusao|intervenção|intervencao)/.test(texto)) {
    return "Na conclusão, retome a tese e proponha uma intervenção completa: agente responsável, ação, meio de execução, finalidade e detalhamento. Verifique se a proposta é viável e respeita os direitos humanos.";
  }
  if (/(não entendi|nao entendi|explica|explicar|dúvida|duvida)/.test(texto)) {
    return `Vamos por partes. ${respostasPorPista[pergunta.length % respostasPorPista.length]}${contexto ? ` Como estamos trabalhando ${contexto}, use esse recorte como guia.` : ""}`;
  }
  if (/(resposta|alternativa|gabarito|acerto)/.test(texto)) {
    return "Não vou entregar apenas o resultado. Compare cada alternativa com o comando da questão, procure a evidência no texto ou nos dados e explique por que as outras opções não respondem ao problema.";
  }
  if (area === "matematica")
    return "Organize os dados, escolha a relação matemática adequada e só depois substitua os valores. Se quiser, envie a conta que você fez e eu aponto exatamente onde ela pode ser melhorada.";
  if (area === "humanas")
    return "Relacione o conceito ao contexto histórico e social apresentado. Procure identificar agentes, interesses, relações de poder e consequências antes de avaliar as alternativas.";
  if (area === "linguagens")
    return "Observe o gênero textual, o público e a finalidade da mensagem. Em seguida, relacione as escolhas linguísticas ao efeito de sentido produzido no contexto.";
  if (area === "natureza")
    return "Liste os fenômenos envolvidos, as grandezas e as unidades. Depois escolha a lei ou o conceito que conecta esses elementos ao resultado pedido.";
  return "Vamos analisar a sua pergunta com calma: identifique o conceito central, selecione as evidências disponíveis e formule uma conclusão curta antes de conferir a resposta.";
}

export function TutorChat({
  area,
  contexto,
  alto = false,
}: {
  area: AreaId | "redacao" | "geral";
  contexto?: string;
  alto?: boolean;
}) {
  const tutor = TUTORES.find((t) => t.area === area) ?? TUTORES[0]!;
  const storageKey = `acelera-chat-${area}`;
  const mensagemInicial = useMemo<Msg>(
    () => ({
      de: "tutor",
      texto: `Oi! Sou ${tutor.nome}, ${tutor.papel.toLowerCase()}. ${contexto ? `Podemos destravar “${contexto}” juntos.` : "Me conte onde você travou."} Faça uma pergunta e eu vou adaptar a explicação ao seu raciocínio.`,
    }),
    [contexto, tutor.nome, tutor.papel],
  );
  const [msgs, setMsgs] = useState<Msg[]>(() => {
    try {
      const salvo = localStorage.getItem(storageKey);
      return salvo ? (JSON.parse(salvo) as Msg[]) : [mensagemInicial];
    } catch {
      return [mensagemInicial];
    }
  });
  const [texto, setTexto] = useState("");
  const [respondendo, setRespondendo] = useState(false);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(msgs.slice(-30)));
  }, [msgs, storageKey]);

  const enviar = () => {
    const pergunta = texto.trim();
    if (!pergunta || respondendo) return;
    setTexto("");
    setRespondendo(true);
    setMsgs((m) => [...m, { de: "eu", texto: pergunta }]);
    window.setTimeout(() => {
      setMsgs((m) => [...m, { de: "tutor", texto: criarResposta(pergunta, area, contexto) }]);
      setRespondendo(false);
    }, 350);
  };

  return (
    <div className="panel flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-3">
        <span className="grid size-9 place-items-center rounded-xl bg-primary/30 text-lg">
          {tutor.emoji}
        </span>
        <div>
          <p className="text-sm font-bold leading-tight">{tutor.nome}</p>
          <p className="text-xs text-muted-foreground">{tutor.papel}</p>
        </div>
      </div>
      <div className={`space-y-3 overflow-y-auto p-4 ${alto ? "h-[420px]" : "max-h-72"}`}>
        {msgs.map((m, i) => (
          <div
            key={`${m.de}-${i}`}
            className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${m.de === "eu" ? "ml-auto bg-primary/30" : "bg-muted/60 text-muted-foreground"}`}
          >
            {m.texto}
          </div>
        ))}
        {respondendo && (
          <div className="max-w-[90%] rounded-xl bg-muted/60 px-3 py-2 text-sm text-muted-foreground">
            A preparar uma explicação…
          </div>
        )}
      </div>
      <div className="flex gap-2 border-t border-border p-3">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviar()}
          placeholder="Escreva sua dúvida…"
          aria-label="Mensagem para o tutor"
          className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <PopButton size="sm" onClick={enviar} disabled={respondendo} aria-label="Enviar mensagem">
          <Send className="size-4" aria-hidden />
        </PopButton>
      </div>
    </div>
  );
}
