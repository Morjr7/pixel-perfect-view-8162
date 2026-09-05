import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/AppShell";
import { PopButton } from "@/components/PopButton";
import { AREAS, QUESTOES, type AreaId } from "@/lib/enem-data";
import { useProgresso } from "@/lib/progresso";

export const Route = createFileRoute("/listas")({
  head: () => ({
    meta: [
      { title: "Listas personalizadas — Jovens Educadores GIYV Estudos" },
      {
        name: "description",
        content:
          "Monte listas de questões por área e quantidade e acompanhe o progresso de cada uma.",
      },
      { property: "og:title", content: "Listas personalizadas — Jovens Educadores GIYV Estudos" },
      {
        property: "og:description",
        content: "Crie listas de estudo sob medida e treine no seu ritmo.",
      },
    ],
  }),
  component: Listas,
});

function Listas() {
  const { estado, criarLista, removerLista } = useProgresso();
  const [nome, setNome] = useState("");
  const [areas, setAreas] = useState<AreaId[]>([]);
  const [quantidade, setQuantidade] = useState(10);

  const disponiveis = QUESTOES.filter((q) => areas.length === 0 || areas.includes(q.area)).length;

  const alternarArea = (id: AreaId) =>
    setAreas((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  const salvar = () => {
    if (!nome.trim()) {
      toast.error("Dê um nome para a sua lista.");
      return;
    }
    criarLista({
      nome: nome.trim(),
      areas: areas.length ? areas : AREAS.map((a) => a.id),
      quantidade,
    });
    setNome("");
    setAreas([]);
    toast.success("Lista criada!");
  };

  return (
    <AppShell>
      <PageHeader titulo="Listas" subtitulo="Monte listas de questões do jeito que você estuda." />

      <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
        <div className="panel h-fit p-5">
          <h2 className="text-lg font-bold">Montar lista personalizada</h2>
          <label className="mt-4 block text-sm">
            <span className="mb-1 block font-semibold">Nome da lista</span>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: Revisão de véspera"
              className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
            />
          </label>

          <fieldset className="mt-4">
            <legend className="mb-2 text-sm font-semibold">Áreas</legend>
            <div className="flex flex-wrap gap-2">
              {AREAS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => alternarArea(a.id)}
                  className={`rounded-full border-2 px-3 py-1.5 text-xs font-bold transition-colors ${
                    areas.includes(a.id)
                      ? "border-secondary bg-secondary/25"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  {a.emoji} {a.nome}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="mt-4 block text-sm">
            <span className="mb-1 block font-semibold">Quantidade: {quantidade} questões</span>
            <input
              type="range"
              min={5}
              max={24}
              step={1}
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              className="w-full accent-[color:var(--secondary)]"
            />
          </label>

          <p className="mt-3 text-xs text-muted-foreground">
            Prévia: {Math.min(quantidade, disponiveis)} de {disponiveis} questões disponíveis.
          </p>

          <PopButton tone="action" size="block" className="mt-4" onClick={salvar}>
            Criar lista
          </PopButton>
        </div>

        <div className="space-y-4">
          {estado.listas.length === 0 ? (
            <div className="panel p-8 text-center">
              <div className="text-4xl">🗂️</div>
              <p className="mt-3 font-bold">Você ainda não tem listas</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Crie a primeira ao lado — ela fica salva no seu navegador.
              </p>
            </div>
          ) : (
            estado.listas.map((l) => (
              <article key={l.id} className="panel flex flex-wrap items-center gap-4 p-5">
                <div>
                  <h3 className="text-lg font-bold">{l.nome}</h3>
                  <p className="text-xs text-muted-foreground">
                    {l.quantidade} questões ·{" "}
                    {l.areas.map((a) => AREAS.find((x) => x.id === a)!.nome).join(", ")} · criada em{" "}
                    {new Date(l.criadaEm).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <PopButton asChild tone="action" size="sm">
                    <Link to="/treinar/$area" params={{ area: l.areas[0]! }}>
                      Treinar
                    </Link>
                  </PopButton>
                  <PopButton
                    tone="danger"
                    size="sm"
                    aria-label={`Excluir lista ${l.nome}`}
                    onClick={() => {
                      removerLista(l.id);
                      toast("Lista removida");
                    }}
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </PopButton>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
