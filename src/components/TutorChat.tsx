import { useState } from "react";
import { Send } from "lucide-react";
import { TUTORES, type AreaId } from "@/lib/enem-data";
import { PopButton } from "@/components/PopButton";

type Msg = { de: "tutor" | "eu"; texto: string };

export function TutorChat({
  area,
  contexto,
  alto = false,
}: {
  area: AreaId | "redacao" | "geral";
  contexto?: string;
  alto?: boolean;
}) {
  const tutor = TUTORES.find((t) => t.area === area) ?? TUTORES[0];
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      de: "tutor",
      texto: `Oi! Sou ${tutor.nome}, ${tutor.papel.toLowerCase()}. ${
        contexto ? `Podemos destravar "${contexto}" juntos.` : "Me conte onde você travou."
      } Posso dar uma pista antes da resposta, se preferir.`,
    },
  ]);
  const [texto, setTexto] = useState("");

  const enviar = () => {
    const pergunta = texto.trim();
    if (!pergunta) return;
    setTexto("");
    setMsgs((m) => [...m, { de: "eu", texto: pergunta }]);
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        {
          de: "tutor",
          texto: `Vamos por partes. Primeiro, identifique o que o enunciado pede${
            contexto ? ` sobre ${contexto}` : ""
          }. Depois elimine as alternativas que contradizem o conceito. Por fim, confira se a alternativa restante responde exatamente à pergunta. Quer que eu resolva passo a passo?`,
        },
      ]);
    }, 550);
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
            key={i}
            className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${
              m.de === "eu"
                ? "ml-auto bg-primary/30"
                : "bg-muted/60 text-muted-foreground"
            }`}
          >
            {m.texto}
          </div>
        ))}
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
        <PopButton size="sm" onClick={enviar} aria-label="Enviar mensagem">
          <Send className="size-4" aria-hidden />
        </PopButton>
      </div>
    </div>
  );
}
