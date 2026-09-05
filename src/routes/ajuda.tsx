import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/AppShell";
import { PopButton } from "@/components/PopButton";
import { TutorChat } from "@/components/TutorChat";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/ajuda")({
  head: () => ({
    meta: [
      { title: "Ajuda e suporte — Jovens Educadores GIYV Estudos" },
      {
        name: "description",
        content: "Perguntas frequentes, canal de suporte e dicas para usar a plataforma.",
      },
      { property: "og:title", content: "Ajuda e suporte — Jovens Educadores GIYV Estudos" },
      {
        property: "og:description",
        content: "Tire dúvidas sobre treinos, simulados, redação e ranking.",
      },
    ],
  }),
  component: Ajuda,
});

const FAQ = [
  {
    p: "Como o meu progresso é salvo?",
    r: "Tudo fica guardado no seu próprio navegador. Se você limpar os dados do navegador ou usar outro computador, o progresso recomeça.",
  },
  {
    p: "As questões são reais?",
    r: "São questões demonstrativas inspiradas em provas do ENEM, com a fonte indicada em cada item, criadas para o trabalho escolar.",
  },
  {
    p: "Como funciona a nota estimada?",
    r: "É um cálculo simplificado a partir do seu aproveitamento. Ele serve para mostrar a evolução, não substitui a nota oficial.",
  },
  {
    p: "Os tutores são inteligência artificial de verdade?",
    r: "Nesta versão eles respondem com orientações de estudo pré-definidas, simulando o comportamento de um tutor.",
  },
  {
    p: "Posso apresentar a plataforma no celular?",
    r: "Sim. O layout se adapta a celular, tablet e computador, com menu inferior nas telas pequenas.",
  },
];

function Ajuda() {
  const [mensagem, setMensagem] = useState("");

  return (
    <AppShell>
      <PageHeader titulo="Ajuda e suporte" subtitulo="Dúvidas frequentes e canal de contato." />

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <div className="panel p-5">
            <h2 className="text-lg font-bold">Perguntas frequentes</h2>
            <Accordion type="single" collapsible className="mt-2">
              {FAQ.map((f, i) => (
                <AccordionItem key={f.p} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-sm font-semibold">
                    {f.p}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {f.r}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="panel p-5">
            <h2 className="text-lg font-bold">Fale com o suporte</h2>
            <textarea
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              rows={4}
              aria-label="Mensagem para o suporte"
              placeholder="Descreva o que aconteceu…"
              className="mt-3 w-full rounded-xl border border-border bg-muted/25 p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <PopButton
              tone="action"
              className="mt-3"
              onClick={() => {
                if (!mensagem.trim()) {
                  toast.error("Escreva sua mensagem.");
                  return;
                }
                setMensagem("");
                toast.success("Mensagem enviada! Respondemos em até 1 dia útil.");
              }}
            >
              Enviar mensagem
            </PopButton>
          </div>

          <div className="panel p-5">
            <h2 className="text-lg font-bold">Primeiros passos</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
              <li>
                Escolha uma área em{" "}
                <Link to="/treinar" className="text-secondary hover:underline">
                  Treinar
                </Link>{" "}
                e responda 10 questões.
              </li>
              <li>
                Faça um{" "}
                <Link to="/simulados" className="text-secondary hover:underline">
                  simulado
                </Link>{" "}
                de 10 questões para medir seu nível.
              </li>
              <li>
                Escreva uma{" "}
                <Link to="/redacao" className="text-secondary hover:underline">
                  redação
                </Link>{" "}
                e veja a nota por competência.
              </li>
              <li>
                Acompanhe tudo em{" "}
                <Link to="/estatisticas" className="text-secondary hover:underline">
                  Estatísticas
                </Link>
                .
              </li>
            </ol>
          </div>
        </div>

        <TutorChat area="geral" alto />
      </div>
    </AppShell>
  );
}
