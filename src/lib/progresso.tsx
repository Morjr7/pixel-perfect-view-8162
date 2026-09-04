import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AREAS, type AreaId } from "./enem-data";

export type Resposta = {
  questaoId: string;
  area: AreaId;
  alternativa: number;
  correta: boolean;
  data: string;
};

export type Redacao = {
  id: string;
  tema: string;
  texto: string;
  data: string;
  notas: { c1: number; c2: number; c3: number; c4: number; c5: number };
  total: number;
};

export type ListaPersonalizada = {
  id: string;
  nome: string;
  areas: AreaId[];
  quantidade: number;
  criadaEm: string;
  concluidas: number;
};

export type SimuladoFeito = {
  id: string;
  nome: string;
  acertos: number;
  total: number;
  data: string;
};

export type Estado = {
  nome: string;
  email: string;
  avatar: string;
  logado: boolean;
  xp: number;
  ofensiva: number;
  melhorOfensiva: number;
  ultimoDia: string | null;
  respostas: Resposta[];
  redacoes: Redacao[];
  listas: ListaPersonalizada[];
  simulados: SimuladoFeito[];
  metaDiaria: number;
  conquistasVistas: string[];
};

const CHAVE = "acelera-enem-v1";

const inicial: Estado = {
  nome: "Estudante Demo",
  email: "demo@aceleraenem.app",
  avatar: "🧑‍🚀",
  logado: false,
  xp: 0,
  ofensiva: 0,
  melhorOfensiva: 0,
  ultimoDia: null,
  respostas: [],
  redacoes: [],
  listas: [],
  simulados: [],
  metaDiaria: 20,
  conquistasVistas: [],
};

const hoje = () => new Date().toISOString().slice(0, 10);

type Ctx = {
  estado: Estado;
  pronto: boolean;
  responder: (r: Omit<Resposta, "data">) => void;
  entrar: (nome: string, email: string) => void;
  sair: () => void;
  salvarRedacao: (tema: string, texto: string) => Redacao;
  criarLista: (l: Omit<ListaPersonalizada, "id" | "criadaEm" | "concluidas">) => void;
  removerLista: (id: string) => void;
  registrarSimulado: (s: Omit<SimuladoFeito, "id" | "data">) => void;
  atualizarPerfil: (dados: Partial<Estado>) => void;
  zerar: () => void;
};

const ProgressoContext = createContext<Ctx | null>(null);

export function ProgressoProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<Estado>(inicial);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    try {
      const bruto = localStorage.getItem(CHAVE);
      if (bruto) setEstado({ ...inicial, ...JSON.parse(bruto) });
    } catch {
      /* ignora leitura inválida */
    }
    setPronto(true);
  }, []);

  useEffect(() => {
    if (!pronto) return;
    localStorage.setItem(CHAVE, JSON.stringify(estado));
  }, [estado, pronto]);

  const marcarDia = (e: Estado): Estado => {
    const d = hoje();
    if (e.ultimoDia === d) return e;
    const ontem = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const ofensiva = e.ultimoDia === ontem ? e.ofensiva + 1 : 1;
    return { ...e, ultimoDia: d, ofensiva, melhorOfensiva: Math.max(e.melhorOfensiva, ofensiva) };
  };

  const responder = useCallback((r: Omit<Resposta, "data">) => {
    setEstado((e) => {
      const base = marcarDia(e);
      return {
        ...base,
        xp: base.xp + (r.correta ? 15 : 5),
        respostas: [...base.respostas, { ...r, data: new Date().toISOString() }],
      };
    });
  }, []);

  const entrar = useCallback((nome: string, email: string) => {
    setEstado((e) => ({ ...e, logado: true, nome: nome || e.nome, email: email || e.email }));
  }, []);

  const sair = useCallback(() => setEstado((e) => ({ ...e, logado: false })), []);

  const salvarRedacao = useCallback((tema: string, texto: string) => {
    const palavras = texto.trim().split(/\s+/).filter(Boolean).length;
    const paragrafos = texto.split(/\n{1,}/).filter((p) => p.trim().length > 0).length;
    const base = Math.min(200, 80 + Math.round(palavras / 3));
    const bonus = paragrafos >= 4 ? 20 : 0;
    const nota = (extra: number) => Math.max(40, Math.min(200, base + bonus + extra));
    const notas = { c1: nota(0), c2: nota(-20), c3: nota(-10), c4: nota(10), c5: nota(-30) };
    const nova: Redacao = {
      id: `r-${Date.now()}`,
      tema,
      texto,
      data: new Date().toISOString(),
      notas,
      total: notas.c1 + notas.c2 + notas.c3 + notas.c4 + notas.c5,
    };
    setEstado((e) => ({ ...marcarDia(e), xp: e.xp + 60, redacoes: [nova, ...e.redacoes] }));
    return nova;
  }, []);

  const criarLista = useCallback((l: Omit<ListaPersonalizada, "id" | "criadaEm" | "concluidas">) => {
    setEstado((e) => ({
      ...e,
      listas: [
        { ...l, id: `l-${Date.now()}`, criadaEm: new Date().toISOString(), concluidas: 0 },
        ...e.listas,
      ],
    }));
  }, []);

  const removerLista = useCallback((id: string) => {
    setEstado((e) => ({ ...e, listas: e.listas.filter((l) => l.id !== id) }));
  }, []);

  const registrarSimulado = useCallback((s: Omit<SimuladoFeito, "id" | "data">) => {
    setEstado((e) => ({
      ...marcarDia(e),
      xp: e.xp + s.acertos * 20,
      simulados: [{ ...s, id: `s-${Date.now()}`, data: new Date().toISOString() }, ...e.simulados],
    }));
  }, []);

  const atualizarPerfil = useCallback((dados: Partial<Estado>) => {
    setEstado((e) => ({ ...e, ...dados }));
  }, []);

  const zerar = useCallback(() => setEstado({ ...inicial, logado: true }), []);

  const valor = useMemo(
    () => ({
      estado,
      pronto,
      responder,
      entrar,
      sair,
      salvarRedacao,
      criarLista,
      removerLista,
      registrarSimulado,
      atualizarPerfil,
      zerar,
    }),
    [
      estado,
      pronto,
      responder,
      entrar,
      sair,
      salvarRedacao,
      criarLista,
      removerLista,
      registrarSimulado,
      atualizarPerfil,
      zerar,
    ],
  );

  return <ProgressoContext.Provider value={valor}>{children}</ProgressoContext.Provider>;
}

export function useProgresso() {
  const ctx = useContext(ProgressoContext);
  if (!ctx) throw new Error("useProgresso precisa estar dentro de ProgressoProvider");
  return ctx;
}

export function useEstatisticas() {
  const { estado } = useProgresso();
  return useMemo(() => {
    const total = estado.respostas.length;
    const acertos = estado.respostas.filter((r) => r.correta).length;
    const porArea = AREAS.map((a) => {
      const rs = estado.respostas.filter((r) => r.area === a.id);
      const ac = rs.filter((r) => r.correta).length;
      return {
        area: a,
        total: rs.length,
        acertos: ac,
        aproveitamento: rs.length ? Math.round((ac / rs.length) * 100) : 0,
      };
    });
    return {
      total,
      acertos,
      erros: total - acertos,
      aproveitamento: total ? Math.round((acertos / total) * 100) : 0,
      porArea,
      tempoEstudo: Math.round(total * 1.6),
    };
  }, [estado.respostas]);
}
