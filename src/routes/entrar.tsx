import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PopButton } from "@/components/PopButton";
import { Logo } from "@/components/AppShell";
import { useProgresso } from "@/lib/progresso";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar na plataforma — Acelera ENEM" },
      { name: "description", content: "Acesse sua conta ou use a conta demonstrativa do Acelera ENEM." },
      { property: "og:title", content: "Entrar na plataforma — Acelera ENEM" },
      { property: "og:description", content: "Login rápido e conta demonstrativa para apresentar a plataforma." },
    ],
  }),
  component: Entrar,
});

function Entrar() {
  const { entrar } = useProgresso();
  const navigate = useNavigate();
  const [modo, setModo] = useState<"login" | "cadastro">("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const enviar = () => {
    if (!email.includes("@")) return setErro("Informe um e-mail válido.");
    if (senha.length < 4) return setErro("A senha precisa de pelo menos 4 caracteres.");
    if (modo === "cadastro" && !nome.trim()) return setErro("Diga como podemos te chamar.");
    setErro("");
    entrar(nome || "Estudante", email);
    toast.success(modo === "login" ? "Bem-vindo de volta!" : "Conta criada!");
    navigate({ to: "/" });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden flex-col justify-center gap-6 p-12 lg:flex">
        <Logo />
        <h1 className="max-w-md text-4xl font-bold leading-tight">
          Estude para o ENEM com um próximo passo sempre claro.
        </h1>
        <p className="max-w-md text-muted-foreground">
          Questões comentadas, simulados, redação com devolutiva, tutores por área, ofensiva de
          estudos e ranking. Tudo em um só lugar.
        </p>
        <ul className="space-y-2 text-sm">
          {[
            "24 questões demonstrativas com explicação",
            "Simulados por área e simulado geral",
            "Redação avaliada pelas 5 competências",
            "Estatísticas, medalhas e comunidade",
          ].map((i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="text-success">✔</span> {i}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex items-center justify-center p-6">
        <div className="panel-strong w-full max-w-md p-7">
          <div className="lg:hidden">
            <Logo />
          </div>
          <h2 className="mt-4 text-2xl font-bold">
            {modo === "login" ? "Entrar" : "Criar conta"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {modo === "login"
              ? "Use seu e-mail e senha para continuar."
              : "Leva menos de um minuto."}
          </p>

          <div className="mt-5 space-y-3">
            {modo === "cadastro" && (
              <label className="block text-sm">
                <span className="mb-1 block font-semibold">Nome</span>
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
            )}
            <label className="block text-sm">
              <span className="mb-1 block font-semibold">E-mail</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-semibold">Senha</span>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••"
                className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
          </div>

          {erro && (
            <p role="alert" className="mt-3 rounded-xl bg-destructive/15 px-3 py-2 text-sm text-destructive">
              {erro}
            </p>
          )}

          <PopButton tone="action" size="block" className="mt-5" onClick={enviar}>
            {modo === "login" ? "Entrar" : "Criar minha conta"}
          </PopButton>

          <PopButton
            tone="neutral"
            size="block"
            className="mt-2"
            onClick={() => {
              entrar("Estudante Demo", "demo@aceleraenem.app");
              toast.success("Você entrou na conta demonstrativa");
              navigate({ to: "/" });
            }}
          >
            Entrar com a conta demonstrativa
          </PopButton>

          <button
            onClick={() => setModo(modo === "login" ? "cadastro" : "login")}
            className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground"
          >
            {modo === "login" ? "Não tem conta? Cadastre-se" : "Já tem conta? Entrar"}
          </button>
        </div>
      </section>
    </div>
  );
}
