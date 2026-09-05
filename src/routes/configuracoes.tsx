import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/AppShell";
import { PopButton } from "@/components/PopButton";
import { Switch } from "@/components/ui/switch";
import { useProgresso } from "@/lib/progresso";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações da conta — Jovens Educadores GIYV Estudos" },
      {
        name: "description",
        content: "Ajuste meta diária, lembretes de estudo e preferências de acessibilidade.",
      },
      { property: "og:title", content: "Configurações da conta — Jovens Educadores GIYV Estudos" },
      { property: "og:description", content: "Personalize sua rotina de estudos na plataforma." },
    ],
  }),
  component: Configuracoes,
});

function Configuracoes() {
  const { estado, atualizarPerfil, zerar } = useProgresso();
  const [meta, setMeta] = useState(estado.metaDiaria);

  return (
    <AppShell>
      <PageHeader titulo="Configurações" subtitulo="Ajuste a plataforma ao seu jeito de estudar." />

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="panel p-5">
          <h2 className="text-lg font-bold">Meta diária</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Quantas questões você quer responder por dia?
          </p>
          <input
            type="range"
            min={5}
            max={60}
            step={5}
            value={meta}
            onChange={(e) => setMeta(Number(e.target.value))}
            aria-label="Meta diária de questões"
            className="mt-4 w-full accent-[color:var(--secondary)]"
          />
          <p className="mt-2 text-2xl font-bold">{meta} questões por dia</p>
          <PopButton
            tone="action"
            className="mt-4"
            onClick={() => {
              atualizarPerfil({ metaDiaria: meta });
              toast.success("Meta atualizada");
            }}
          >
            Salvar meta
          </PopButton>
        </section>

        <section className="panel p-5">
          <h2 className="text-lg font-bold">Preferências</h2>
          <ul className="mt-4 space-y-4 text-sm">
            {[
              { l: "Lembrete diário de estudo", d: "Aviso quando a ofensiva estiver em risco" },
              { l: "Sons de acerto e erro", d: "Feedback sonoro ao responder questões" },
              { l: "Mostrar explicação automática", d: "Abrir o comentário logo após responder" },
              { l: "Reduzir animações", d: "Bom para quem prefere menos movimento na tela" },
            ].map((p, i) => (
              <li key={p.l} className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="font-semibold">{p.l}</p>
                  <p className="text-xs text-muted-foreground">{p.d}</p>
                </div>
                <Switch defaultChecked={i < 2} aria-label={p.l} />
              </li>
            ))}
          </ul>
        </section>

        <section className="panel p-5 lg:col-span-2">
          <h2 className="text-lg font-bold">Dados do estudo</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Seu progresso fica salvo apenas neste navegador. Você pode recomeçar do zero quando
            quiser — útil antes de apresentar o trabalho.
          </p>
          <PopButton
            tone="danger"
            className="mt-4"
            onClick={() => {
              zerar();
              toast("Progresso reiniciado");
            }}
          >
            Zerar meu progresso
          </PopButton>
        </section>
      </div>
    </AppShell>
  );
}
