import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/AppShell";
import { PopButton } from "@/components/PopButton";
import { POSTS, type PostComunidade } from "@/lib/enem-data";
import { useProgresso } from "@/lib/progresso";

export const Route = createFileRoute("/comunidade")({
  head: () => ({
    meta: [
      { title: "Comunidade de estudos — Jovens Educadores GIYV Estudos" },
      {
        name: "description",
        content: "Compartilhe dicas, tire dúvidas e acompanhe grupos de estudo demonstrativos.",
      },
      { property: "og:title", content: "Comunidade de estudos — Jovens Educadores GIYV Estudos" },
      {
        property: "og:description",
        content: "Feed de dicas, dúvidas e conquistas entre estudantes.",
      },
    ],
  }),
  component: Comunidade,
});

function Comunidade() {
  const { estado } = useProgresso();
  const [posts, setPosts] = useState<PostComunidade[]>(POSTS);
  const [curtidos, setCurtidos] = useState<string[]>([]);
  const [texto, setTexto] = useState("");

  const publicar = () => {
    if (!texto.trim()) return;
    setPosts((p) => [
      {
        id: `meu-${Date.now()}`,
        autor: estado.nome,
        avatar: estado.avatar,
        tempo: "agora",
        texto: texto.trim(),
        curtidas: 0,
        comentarios: 0,
        tag: "Estudo",
      },
      ...p,
    ]);
    setTexto("");
    toast.success("Publicado na comunidade!");
  };

  const curtir = (id: string) => {
    setCurtidos((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
    setPosts((p) =>
      p.map((x) =>
        x.id === id ? { ...x, curtidas: x.curtidas + (curtidos.includes(id) ? -1 : 1) } : x,
      ),
    );
  };

  return (
    <AppShell>
      <PageHeader titulo="Comunidade" subtitulo="Espaço para trocar dicas e pedir ajuda." />

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <div className="panel p-4">
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              rows={3}
              aria-label="Escrever publicação"
              placeholder="Compartilhe uma dica ou faça uma pergunta…"
              className="w-full rounded-xl border border-border bg-muted/25 p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <PopButton tone="action" size="sm" className="mt-3" onClick={publicar}>
              Publicar
            </PopButton>
          </div>

          {posts.length === 0 && (
            <div className="panel p-10 text-center">
              <h2 className="text-lg font-bold">A comunidade ainda está começando</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Não há publicações reais neste momento. Crie a primeira publicação acima.
              </p>
            </div>
          )}
          {posts.map((p) => (
            <article key={p.id} className="panel p-5">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-muted/50 text-xl">
                  {p.avatar}
                </span>
                <div>
                  <p className="font-bold leading-tight">{p.autor}</p>
                  <p className="text-xs text-muted-foreground">{p.tempo}</p>
                </div>
                <span className="ml-auto rounded-full border border-border px-3 py-1 text-xs font-semibold">
                  {p.tag}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed">{p.texto}</p>
              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <button
                  onClick={() => curtir(p.id)}
                  className={`flex items-center gap-1 ${curtidos.includes(p.id) ? "text-destructive" : ""}`}
                >
                  <Heart className="size-4" aria-hidden /> {p.curtidas}
                </button>
                <span className="flex items-center gap-1">
                  <MessageCircle className="size-4" aria-hidden /> {p.comentarios}
                </span>
                <button className="ml-auto flex items-center gap-1" aria-label="Salvar publicação">
                  <Bookmark className="size-4" aria-hidden /> Salvar
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside className="panel h-fit p-5">
          <h2 className="text-lg font-bold">Grupos de estudo</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Grupos serão exibidos quando houver infraestrutura real para criação e participação.
          </p>
        </aside>
      </div>
    </AppShell>
  );
}
