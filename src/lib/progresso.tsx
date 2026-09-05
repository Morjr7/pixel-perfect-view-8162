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
  avaliacao?: {
    resumo: string;
    justificativas: Record<"c1" | "c2" | "c3" | "c4" | "c5", string>;
    recomendacoes: string[];
    marcacoes: { trecho: string; motivo: string; sugestao: string }[];
  };
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
  questoesIds?: string[];
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

const SESSAO_ATUAL = "giyv-sessao-atual";
const PREFIXO_CONTA = "giyv-conta-v1:";

const inicial: Estado = {
  nome: "",
  email: "",
  avatar: "🧑‍🎓",
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

const PALAVRAS_VAZIAS = new Set(
  "a ao aos as com da das de do dos e em entre na nas no nos o os para por que se um uma umas uns".split(
    " ",
  ),
);
const CONECTIVOS =
  /\b(além disso|portanto|contudo|porém|entretanto|assim|desse modo|dessa forma|porque|embora|logo|consequentemente|em primeiro lugar|por fim)\b/gi;
const AGENTES =
  /\b(governo|estado|escola|universidade|município|ministério|sociedade|família|mídia|empresas|ong|organizações)\b/gi;
const AÇÕES =
  /\b(deve|devem|criar|ampliar|promover|oferecer|fiscalizar|investir|garantir|implementar|realizar|combater|reduzir)\b/gi;

function avaliarRedacao(
  tema: string,
  texto: string,
): NonNullable<Redacao["avaliacao"]> & Pick<Redacao, "notas" | "total"> {
  const limpo = texto.trim();
  const palavras = limpo.toLocaleLowerCase("pt-BR").match(/[a-záàâãéêíóôõúç]{2,}/gi) ?? [];
  const minusculas = limpo.toLocaleLowerCase("pt-BR");
  const unicas = new Set(palavras).size;
  const paragrafos = limpo.split(/\n+/).filter(Boolean).length;
  const frases = limpo.split(/[.!?]+/).filter((x) => x.trim().length > 8).length;
  const conectivos = (minusculas.match(CONECTIVOS) ?? []).length;
  const agentes = (minusculas.match(AGENTES) ?? []).length;
  const acoes = (minusculas.match(AÇÕES) ?? []).length;
  const temaTermos = tema.toLocaleLowerCase("pt-BR").match(/[a-záàâãéêíóôõúç]{4,}/gi) ?? [];
  const termosRelevantes = temaTermos.filter((t) => !PALAVRAS_VAZIAS.has(t));
  const aderencia = termosRelevantes.filter((t) => minusculas.includes(t)).length;
  const semSentido =
    palavras.length < 40 ||
    unicas / Math.max(1, palavras.length) < 0.18 ||
    /([a-záàâãéêíóôõúç])\1{3,}/i.test(limpo) ||
    /[bcdfghjklmnpqrstvwxyz]{7,}/i.test(limpo);
  const faixa = (valor: number) => Math.max(0, Math.min(200, Math.round(valor / 40) * 40));
  const notas = {
    c1: faixa(
      semSentido ? 35 : 80 + (frases >= 4 ? 35 : 0) + (limpo.split(/[,.!?]/).length >= 4 ? 35 : 0),
    ),
    c2: faixa(
      semSentido
        ? 20
        : 40 +
            (aderencia >= 1 ? 45 : 0) +
            (aderencia >= 2 ? 45 : 0) +
            (palavras.length >= 120 ? 35 : 0),
    ),
    c3: faixa(
      semSentido
        ? 20
        : 40 +
            (paragrafos >= 3 ? 45 : 0) +
            (frases >= 5 ? 45 : 0) +
            (palavras.length >= 160 ? 35 : 0),
    ),
    c4: faixa(semSentido ? 20 : 40 + Math.min(120, conectivos * 25) + (paragrafos >= 3 ? 25 : 0)),
    c5: faixa(
      semSentido
        ? 20
        : 40 +
            (agentes > 0 ? 45 : 0) +
            (acoes > 0 ? 45 : 0) +
            (/(por meio de|a fim de|para que|com o objetivo de)/i.test(minusculas) ? 45 : 0),
    ),
  };
  const justificativas = {
    c1: semSentido
      ? "O texto não apresenta sequência linguística suficiente para avaliar o domínio formal."
      : "A nota considera extensão, frases completas e sinais de pontuação observados no texto.",
    c2: semSentido
      ? "Não foi possível confirmar compreensão da proposta em um texto sem sentido estável."
      : aderencia > 0
        ? "Há termos relacionados ao tema, mas a pertinência precisa ser desenvolvida com mais precisão."
        : "Faltam referências claras ao recorte temático proposto.",
    c3: semSentido
      ? "Não há argumentos identificáveis para avaliar projeto de texto."
      : paragrafos >= 3 && frases >= 5
        ? "O texto apresenta divisão em parágrafos e frases argumentativas identificáveis."
        : "Organize introdução, dois desenvolvimentos e conclusão para deixar o projeto de texto claro.",
    c4: semSentido
      ? "Não foi possível identificar relações lógicas entre as ideias."
      : conectivos >= 2
        ? "Foram identificados conectivos que ajudam no encadeamento das ideias."
        : "Use conectivos variados para explicitar causa, contraste, consequência e conclusão.",
    c5: semSentido
      ? "Não há proposta de intervenção identificável."
      : agentes > 0 && acoes > 0
        ? "A proposta contém agente e ação; acrescente meio, finalidade e detalhamento para fortalecê-la."
        : "Inclua agente, ação, meio, finalidade e detalhamento na proposta de intervenção.",
  };
  const recomendacoes = [
    notas.c1 <= notas.c2
      ? "Revise pontuação, concordância e a construção de frases completas."
      : "Delimite melhor a tese e mantenha o foco no recorte do tema.",
    notas.c5 <= notas.c4
      ? "Na conclusão, informe quem fará o quê, como, para qual finalidade e com qual detalhamento."
      : "Inclua conectivos e faça cada parágrafo avançar a argumentação.",
  ];
  const marcacoes = semSentido
    ? [
        {
          trecho: limpo.slice(0, 80),
          motivo: "Trecho sem unidade de sentido verificável",
          sugestao:
            "Reescreva com uma ideia completa, sujeito, verbo e relação explícita com o tema.",
        },
      ]
    : [];
  const total = Object.values(notas).reduce((s, n) => s + n, 0);
  return {
    notas,
    total,
    resumo: semSentido
      ? "A redação não atingiu os critérios mínimos de inteligibilidade e precisa ser reescrita."
      : "A redação foi avaliada por critérios de estrutura, tema, argumentação, coesão e intervenção.",
    justificativas,
    recomendacoes,
    marcacoes,
  };
}

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
  const [contaAtual, setContaAtual] = useState<string | null>(null);

  useEffect(() => {
    try {
      const id = localStorage.getItem(SESSAO_ATUAL);
      if (id) {
        const bruto = localStorage.getItem(`${PREFIXO_CONTA}${id}`);
        if (bruto) setEstado({ ...inicial, ...JSON.parse(bruto), logado: true });
        setContaAtual(id);
      }
    } catch {
      /* ignora leitura inválida */
    }
    setPronto(true);
  }, []);

  useEffect(() => {
    if (!pronto || !contaAtual || !estado.logado) return;
    localStorage.setItem(`${PREFIXO_CONTA}${contaAtual}`, JSON.stringify(estado));
  }, [estado, pronto, contaAtual]);

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
    const id = email.trim().toLocaleLowerCase("pt-BR");
    try {
      const salvo = localStorage.getItem(`${PREFIXO_CONTA}${id}`);
      const conta = salvo ? { ...inicial, ...JSON.parse(salvo) } : { ...inicial };
      const atual = { ...conta, logado: true, nome: nome.trim(), email: id };
      localStorage.setItem(SESSAO_ATUAL, id);
      localStorage.setItem(`${PREFIXO_CONTA}${id}`, JSON.stringify(atual));
      setContaAtual(id);
      setEstado(atual);
    } catch {
      setEstado((e) => ({ ...e, logado: true, nome: nome.trim(), email: id }));
    }
  }, []);

  const sair = useCallback(() => {
    setEstado((e) => {
      if (contaAtual) localStorage.setItem(`${PREFIXO_CONTA}${contaAtual}`, JSON.stringify(e));
      return { ...inicial, logado: false };
    });
    localStorage.removeItem(SESSAO_ATUAL);
    setContaAtual(null);
  }, [contaAtual]);

  const salvarRedacao = useCallback((tema: string, texto: string) => {
    const avaliacao = avaliarRedacao(tema, texto);
    const nova: Redacao = {
      id: `r-${Date.now()}`,
      tema,
      texto,
      data: new Date().toISOString(),
      notas: avaliacao.notas,
      total: avaliacao.total,
      avaliacao,
    };
    setEstado((e) => ({
      ...marcarDia(e),
      xp: e.xp + Math.max(5, Math.round(nova.total / 20)),
      redacoes: [nova, ...e.redacoes],
    }));
    return nova;
  }, []);

  const criarLista = useCallback(
    (l: Omit<ListaPersonalizada, "id" | "criadaEm" | "concluidas">) => {
      setEstado((e) => ({
        ...e,
        listas: [
          { ...l, id: `l-${Date.now()}`, criadaEm: new Date().toISOString(), concluidas: 0 },
          ...e.listas,
        ],
      }));
    },
    [],
  );

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

  const zerar = useCallback(
    () =>
      setEstado((e) => ({
        ...inicial,
        nome: e.nome,
        email: e.email,
        avatar: e.avatar,
        logado: true,
      })),
    [],
  );

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
