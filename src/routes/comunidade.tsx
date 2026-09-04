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
      { title: "Comunidade de estudos — Acelera ENEM" },
      { name: "description", content: "Compartilhe dicas, tire dúvidas e acompanhe grupos de estudo demonstrativos." },
      { property: "og:title", content: "Comunidade de estudos — Acelera ENEM" },
      { property: "og:description", content: "Feed de dicas, dúvidas e conquistas entre estudantes." },
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
          <ul className="mt-3 space-y-3 text-sm">
            {[
              { nome: "Matemática do zero", membros: 312, emoji: "📐" },
              { nome: "Redação toda semana", membros: 208, emoji: "✍️" },
              { nome: "Humanas sem medo", membros: 174, emoji: "🌍" },
              { nome: "Plantão de dúvidas", membros: 429, emoji: "💬" },
            ].map((g) => (
              <li key={g.nome} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <span className="text-xl">{g.emoji}</span>
                <span>
                  <span className="block font-semibold">{g.nome}</span>
                  <span className="text-xs text-muted-foreground">{g.membros} membros</span>
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </AppShell>
  );
}
