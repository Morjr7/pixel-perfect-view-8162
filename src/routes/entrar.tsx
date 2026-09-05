import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, KeyRound, LockKeyhole, UserRound } from "lucide-react";
import { toast } from "sonner";
import { PopButton } from "@/components/PopButton";
import { Logo } from "@/components/AppShell";
import { authenticateUser, findUser, registerUser, resetUserPassword } from "@/lib/auth";
import { useProgresso } from "@/lib/progresso";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Acesso à plataforma — Acelera ENEM" },
      { name: "description", content: "Entre ou crie a sua conta no Acelera ENEM." },
    ],
  }),
  component: Entrar,
});

type Modo = "login" | "cadastro" | "recuperacao";

function Entrar() {
  const { entrar } = useProgresso();
  const navigate = useNavigate();
  const [modo, setModo] = useState<Modo>("login");
  const [etapaRecuperacao, setEtapaRecuperacao] = useState<1 | 2>(1);
  const [busy, setBusy] = useState(false);
  const [erro, setErro] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [bestFriend, setBestFriend] = useState("");
  const [firstPet, setFirstPet] = useState("");

  const limparErro = () => setErro("");
  const trocarModo = (novoModo: Modo) => {
    setModo(novoModo);
    setEtapaRecuperacao(1);
    limparErro();
  };

  const entrarNaPlataforma = (nome: string) => {
    entrar(nome, `${username.trim().toLocaleLowerCase("pt-BR")}@acelera.local`);
    toast.success("Bem-vindo de volta!");
    navigate({ to: "/" });
  };

  const enviarLogin = async () => {
    limparErro();
    if (!username.trim() || !password) return setErro("Informe o nome de usuário e a senha.");
    setBusy(true);
    try {
      const user = await authenticateUser(username, password);
      entrarNaPlataforma(user.username);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível entrar.");
    } finally {
      setBusy(false);
    }
  };

  const enviarCadastro = async () => {
    limparErro();
    if (password !== confirmPassword)
      return setErro("A confirmação da senha precisa ser igual à senha.");
    setBusy(true);
    try {
      const user = await registerUser({ username, password, birthDate, bestFriend, firstPet });
      entrar(user.username, `${user.username.toLocaleLowerCase("pt-BR")}@acelera.local`);
      toast.success("Conta criada com sucesso!");
      navigate({ to: "/" });
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível criar a conta.");
    } finally {
      setBusy(false);
    }
  };

  const iniciarRecuperacao = () => {
    limparErro();
    if (!username.trim()) return setErro("Informe primeiro o nome de usuário.");
    if (!findUser(username)) return setErro("Não encontramos uma conta com esse nome de usuário.");
    setEtapaRecuperacao(2);
  };

  const concluirRecuperacao = async () => {
    limparErro();
    if (password !== confirmPassword) return setErro("A confirmação da nova senha não confere.");
    setBusy(true);
    try {
      await resetUserPassword({ username, birthDate, bestFriend, firstPet, password });
      toast.success("Senha alterada com sucesso. Já pode entrar.");
      setPassword("");
      setConfirmPassword("");
      trocarModo("login");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível alterar a senha.");
    } finally {
      setBusy(false);
    }
  };

  const executar = () => {
    if (modo === "login") void enviarLogin();
    else if (modo === "cadastro") void enviarCadastro();
    else if (etapaRecuperacao === 1) iniciarRecuperacao();
    else void concluirRecuperacao();
  };

  const titulo =
    modo === "login" ? "Entrar" : modo === "cadastro" ? "Criar conta" : "Recuperar senha";
  const subtitulo =
    modo === "login"
      ? "Aceda ao seu espaço de estudo."
      : modo === "cadastro"
        ? "Crie a sua conta e comece a preparar-se."
        : etapaRecuperacao === 1
          ? "Confirme a sua conta para criar uma nova senha."
          : "Responda às perguntas cadastradas na sua conta.";

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 lg:p-10">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-pop-lg lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative flex min-h-[420px] flex-col justify-between overflow-hidden bg-[#17123f] p-7 text-white sm:p-10 lg:p-12">
          <img
            src="/acesso-giyv.jfif"
            alt="Jovens a aprender numa jornada educacional"
            className="absolute inset-0 h-full w-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#16113d]/95 via-[#17123f]/60 to-transparent" />
          <div className="relative z-10">
            <Logo />
          </div>
          <div className="relative z-10 max-w-xl pb-4">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-cyan-200">
              Jovens Educadores GIYV
            </p>
            <h1 className="max-w-lg text-4xl font-black leading-tight sm:text-5xl">
              Aprender hoje para transformar o amanhã.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/75 sm:text-base">
              Questões, redação, simulados e tutores num só espaço para tornar o seu próximo passo
              mais claro.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/85">
              {["Trilhas por área", "Redação guiada", "Progresso salvo"].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 backdrop-blur"
                >
                  <Check className="size-4 text-cyan-200" /> {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-7 lg:hidden">
              <Logo />
            </div>
            <div className="mb-6 flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl bg-primary/20 text-secondary">
                {modo === "recuperacao" ? (
                  <KeyRound className="size-5" />
                ) : modo === "cadastro" ? (
                  <UserRound className="size-5" />
                ) : (
                  <LockKeyhole className="size-5" />
                )}
              </span>
              <div>
                <h2 className="text-2xl font-bold">{titulo}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{subtitulo}</p>
              </div>
            </div>

            {modo === "recuperacao" && etapaRecuperacao === 2 && (
              <button
                onClick={() => setEtapaRecuperacao(1)}
                className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:underline"
              >
                <ArrowLeft className="size-4" /> Alterar usuário
              </button>
            )}

            <div className="space-y-3">
              {(modo !== "recuperacao" || etapaRecuperacao === 1) && (
                <label className="block text-sm">
                  <span className="mb-1 block font-semibold">Nome de usuário</span>
                  <input
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      limparErro();
                    }}
                    placeholder="ex.: maria.estudante"
                    autoComplete="username"
                    className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2.5 outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
              )}

              {modo === "cadastro" && (
                <>
                  <label className="block text-sm">
                    <span className="mb-1 block font-semibold">Data de nascimento</span>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2.5 outline-none focus:ring-2 focus:ring-ring"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block font-semibold">Nome do melhor amigo ou amiga</span>
                    <input
                      value={bestFriend}
                      onChange={(e) => setBestFriend(e.target.value)}
                      className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2.5 outline-none focus:ring-2 focus:ring-ring"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block font-semibold">
                      Nome do primeiro animal de estimação
                    </span>
                    <input
                      value={firstPet}
                      onChange={(e) => setFirstPet(e.target.value)}
                      className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2.5 outline-none focus:ring-2 focus:ring-ring"
                    />
                  </label>
                </>
              )}

              {(modo === "login" ||
                modo === "cadastro" ||
                (modo === "recuperacao" && etapaRecuperacao === 2)) && (
                <>
                  {modo === "recuperacao" && etapaRecuperacao === 2 && (
                    <p className="rounded-xl bg-primary/10 p-3 text-sm text-muted-foreground">
                      Qual era o nome do seu primeiro animal de estimação, a sua data de nascimento
                      e o nome do seu melhor amigo ou amiga?
                    </p>
                  )}
                  {modo !== "recuperacao" && (
                    <label className="block text-sm">
                      <span className="mb-1 block font-semibold">Senha</span>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo de 6 caracteres"
                        autoComplete={modo === "login" ? "current-password" : "new-password"}
                        className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2.5 outline-none focus:ring-2 focus:ring-ring"
                      />
                    </label>
                  )}
                  {modo === "recuperacao" && etapaRecuperacao === 2 && (
                    <>
                      <label className="block text-sm">
                        <span className="mb-1 block font-semibold">Data de nascimento</span>
                        <input
                          type="date"
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                          className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2.5 outline-none focus:ring-2 focus:ring-ring"
                        />
                      </label>
                      <label className="block text-sm">
                        <span className="mb-1 block font-semibold">Melhor amigo ou amiga</span>
                        <input
                          value={bestFriend}
                          onChange={(e) => setBestFriend(e.target.value)}
                          className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2.5 outline-none focus:ring-2 focus:ring-ring"
                        />
                      </label>
                      <label className="block text-sm">
                        <span className="mb-1 block font-semibold">
                          Primeiro animal de estimação
                        </span>
                        <input
                          value={firstPet}
                          onChange={(e) => setFirstPet(e.target.value)}
                          className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2.5 outline-none focus:ring-2 focus:ring-ring"
                        />
                      </label>
                      <label className="block text-sm">
                        <span className="mb-1 block font-semibold">Nova senha</span>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoComplete="new-password"
                          className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2.5 outline-none focus:ring-2 focus:ring-ring"
                        />
                      </label>
                    </>
                  )}
                  {modo !== "login" && (
                    <label className="block text-sm">
                      <span className="mb-1 block font-semibold">Confirmar senha</span>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2.5 outline-none focus:ring-2 focus:ring-ring"
                      />
                    </label>
                  )}
                </>
              )}
            </div>

            {erro && (
              <p
                role="alert"
                className="mt-4 rounded-xl bg-destructive/15 px-3 py-2 text-sm text-destructive"
              >
                {erro}
              </p>
            )}
            <PopButton
              tone="action"
              size="block"
              className="mt-5"
              onClick={executar}
              disabled={busy}
            >
              {busy
                ? "Aguarde…"
                : modo === "login"
                  ? "Entrar"
                  : modo === "cadastro"
                    ? "Criar minha conta"
                    : etapaRecuperacao === 1
                      ? "Continuar"
                      : "Alterar senha"}
            </PopButton>

            <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {modo === "login" && (
                <button
                  onClick={() => trocarModo("recuperacao")}
                  className="font-semibold text-secondary hover:underline"
                >
                  Esqueci minha senha
                </button>
              )}
              {modo !== "cadastro" && (
                <button
                  onClick={() => trocarModo("cadastro")}
                  className="font-semibold hover:text-foreground"
                >
                  Cadastrar
                </button>
              )}
              {modo !== "login" && (
                <button
                  onClick={() => trocarModo("login")}
                  className="font-semibold hover:text-foreground"
                >
                  Entrar
                </button>
              )}
            </div>
            <p className="mt-6 text-center text-xs text-muted-foreground">
              Os dados de acesso desta versão escolar ficam guardados localmente neste navegador.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
