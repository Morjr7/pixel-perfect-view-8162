export type AreaId = "linguagens" | "humanas" | "matematica" | "natureza";

import { QUESTOES_EXTRAS } from "./questoes/extras";

export type Area = {
  id: AreaId;
  nome: string;
  descricao: string;
  emoji: string;
  disciplinas: string[];
};

export const AREAS: Area[] = [
  {
    id: "linguagens",
    nome: "Linguagens",
    descricao: "Interpretação, gramática, literatura, arte e inglês.",
    emoji: "📚",
    disciplinas: ["Português", "Literatura", "Inglês", "Artes", "Educação Física"],
  },
  {
    id: "humanas",
    nome: "Ciências Humanas",
    descricao: "História, Geografia, Filosofia e Sociologia.",
    emoji: "🌍",
    disciplinas: ["História", "Geografia", "Filosofia", "Sociologia"],
  },
  {
    id: "matematica",
    nome: "Matemática",
    descricao: "Números, geometria, estatística e raciocínio.",
    emoji: "📐",
    disciplinas: ["Matemática"],
  },
  {
    id: "natureza",
    nome: "Ciências da Natureza",
    descricao: "Biologia, Física e Química no dia a dia.",
    emoji: "🧪",
    disciplinas: ["Biologia", "Física", "Química"],
  },
];

export const areaById = (id: AreaId) => AREAS.find((a) => a.id === id)!;

export const areaBg: Record<AreaId, string> = {
  linguagens: "bg-linguagens",
  humanas: "bg-humanas",
  matematica: "bg-matematica",
  natureza: "bg-natureza",
};

export type Dificuldade = "facil" | "media" | "dificil";

export type Questao = {
  id: string;
  area: AreaId;
  disciplina: string;
  assunto: string;
  fonte: string;
  dificuldade: Dificuldade;
  enunciado: string;
  alternativas: string[];
  correta: number;
  explicacao: string;
};

const q = (
  id: string,
  area: AreaId,
  disciplina: string,
  assunto: string,
  fonte: string,
  dificuldade: Dificuldade,
  enunciado: string,
  alternativas: string[],
  correta: number,
  explicacao: string,
): Questao => ({
  id,
  area,
  disciplina,
  assunto,
  fonte,
  dificuldade,
  enunciado,
  alternativas,
  correta,
  explicacao,
});

export const QUESTOES: Questao[] = [
  // Matemática
  q(
    "mat-1",
    "matematica",
    "Matemática",
    "Porcentagem",
    "ENEM 2022 — questão 137",
    "facil",
    "Um tênis custava R$ 250,00 e recebeu desconto de 18% em uma promoção. Qual é o novo preço?",
    ["R$ 195,00", "R$ 205,00", "R$ 212,50", "R$ 225,00", "R$ 232,00"],
    1,
    "18% de 250 = 45. Logo, 250 − 45 = R$ 205,00.",
  ),
  q(
    "mat-2",
    "matematica",
    "Matemática",
    "Funções",
    "ENEM 2021 — questão 144",
    "media",
    "O custo de produção é dado por C(x) = 40x + 1200. Quantas unidades produzem custo de R$ 4.000,00?",
    ["50", "60", "70", "80", "90"],
    2,
    "40x + 1200 = 4000 → 40x = 2800 → x = 70 unidades.",
  ),
  q(
    "mat-3",
    "matematica",
    "Matemática",
    "Estatística",
    "ENEM 2020 — questão 152",
    "facil",
    "As notas de um aluno foram 6, 7, 8, 9 e 10. Qual é a média aritmética?",
    ["7,0", "7,5", "8,0", "8,5", "9,0"],
    2,
    "A soma é 40 e há 5 notas: 40 ÷ 5 = 8,0.",
  ),
  q(
    "mat-4",
    "matematica",
    "Matemática",
    "Geometria",
    "ENEM 2023 — questão 160",
    "media",
    "Uma caixa cúbica tem aresta de 30 cm. Qual é o seu volume em litros?",
    ["9 L", "18 L", "27 L", "30 L", "54 L"],
    2,
    "V = 30³ = 27.000 cm³. Como 1 L = 1.000 cm³, o volume é 27 L.",
  ),
  q(
    "mat-5",
    "matematica",
    "Matemática",
    "Probabilidade",
    "ENEM 2019 — questão 149",
    "dificil",
    "Em uma urna há 4 bolas azuis e 6 vermelhas. Retirando uma bola ao acaso, qual a probabilidade de ser azul?",
    ["20%", "30%", "40%", "50%", "60%"],
    2,
    "São 4 bolas azuis em 10 no total: 4/10 = 40%.",
  ),
  // Linguagens
  q(
    "lin-1",
    "linguagens",
    "Português",
    "Funções da linguagem",
    "ENEM 2022 — questão 12",
    "facil",
    "Um cartaz diz: “Cuide da água. Feche a torneira!”. Qual função da linguagem predomina?",
    ["Emotiva", "Referencial", "Conativa", "Fática", "Poética"],
    2,
    "O texto usa verbos no imperativo para convencer o leitor a agir: função conativa (apelativa).",
  ),
  q(
    "lin-2",
    "linguagens",
    "Literatura",
    "Modernismo",
    "ENEM 2021 — questão 8",
    "media",
    "A Semana de Arte Moderna de 1922 caracterizou-se principalmente por:",
    [
      "Retomar os moldes clássicos portugueses",
      "Romper com o academicismo e valorizar temas nacionais",
      "Defender a poesia parnasiana",
      "Rejeitar a linguagem coloquial",
      "Copiar o Romantismo europeu",
    ],
    1,
    "O movimento buscou liberdade formal e a valorização da cultura brasileira, rompendo com o academicismo.",
  ),
  q(
    "lin-3",
    "linguagens",
    "Português",
    "Variação linguística",
    "ENEM 2020 — questão 3",
    "facil",
    "O uso de “tu” no Sul e “você” no Sudeste é um exemplo de variação:",
    ["Histórica", "Regional (diatópica)", "Social", "Situacional", "Estilística"],
    1,
    "Variação ligada ao lugar onde o falante vive é chamada de diatópica ou regional.",
  ),
  q(
    "lin-4",
    "linguagens",
    "Inglês",
    "Interpretação",
    "ENEM 2023 — questão 5",
    "media",
    "“Reading habits are declining among teenagers.” O texto afirma que os hábitos de leitura estão:",
    ["Crescendo", "Estáveis", "Em queda", "Sendo proibidos", "Sendo premiados"],
    2,
    "“Declining” significa diminuindo, em queda.",
  ),
  q(
    "lin-5",
    "linguagens",
    "Artes",
    "Arte e sociedade",
    "ENEM 2019 — questão 20",
    "media",
    "O grafite em muros urbanos é frequentemente analisado como manifestação que:",
    [
      "Nega qualquer valor estético",
      "Expressa vozes sociais e ocupa o espaço público",
      "Substitui a pintura acadêmica",
      "Existe apenas em museus",
      "Não dialoga com o contexto local",
    ],
    1,
    "O grafite é leitura crítica do espaço urbano e dá visibilidade a vozes sociais.",
  ),
  // Humanas
  q(
    "hum-1",
    "humanas",
    "História",
    "Era Vargas",
    "ENEM 2022 — questão 45",
    "media",
    "A CLT, criada em 1943, representou:",
    [
      "Fim dos sindicatos",
      "Consolidação de direitos trabalhistas sob controle do Estado",
      "Privatização do trabalho rural",
      "Abolição da escravidão",
      "Criação do voto feminino",
    ],
    1,
    "A CLT reuniu leis trabalhistas e vinculou os sindicatos ao Estado varguista.",
  ),
  q(
    "hum-2",
    "humanas",
    "Geografia",
    "Urbanização",
    "ENEM 2021 — questão 52",
    "facil",
    "As ilhas de calor em grandes cidades resultam principalmente de:",
    [
      "Aumento das áreas verdes",
      "Impermeabilização do solo e concentração de concreto",
      "Redução do trânsito",
      "Chuvas frequentes",
      "Ventos marítimos",
    ],
    1,
    "Concreto e asfalto retêm calor e a falta de vegetação impede o resfriamento.",
  ),
  q(
    "hum-3",
    "humanas",
    "Filosofia",
    "Filosofia política",
    "ENEM 2020 — questão 60",
    "dificil",
    "Para Thomas Hobbes, o Estado surge para:",
    [
      "Garantir a vontade geral",
      "Encerrar a guerra de todos contra todos",
      "Assegurar a propriedade divina",
      "Eliminar a desigualdade econômica",
      "Manter a democracia direta",
    ],
    1,
    "Em Hobbes, o contrato social supera o estado de natureza, marcado pelo conflito permanente.",
  ),
  q(
    "hum-4",
    "humanas",
    "Sociologia",
    "Trabalho",
    "ENEM 2023 — questão 41",
    "media",
    "A “uberização” do trabalho é caracterizada por:",
    [
      "Estabilidade e carteira assinada",
      "Vínculos flexíveis e transferência de riscos ao trabalhador",
      "Jornada fixa de 6 horas",
      "Ampliação de direitos previdenciários",
      "Redução do uso de aplicativos",
    ],
    1,
    "O modelo baseia-se em autonomia formal com perda de proteção social e riscos assumidos pelo trabalhador.",
  ),
  q(
    "hum-5",
    "humanas",
    "Geografia",
    "Energia",
    "ENEM 2019 — questão 57",
    "facil",
    "A principal fonte da matriz elétrica brasileira é:",
    ["Carvão mineral", "Hidrelétrica", "Nuclear", "Solar", "Petróleo"],
    1,
    "O Brasil tem forte presença de usinas hidrelétricas em sua matriz elétrica.",
  ),
  // Natureza
  q(
    "nat-1",
    "natureza",
    "Biologia",
    "Ecologia",
    "ENEM 2022 — questão 92",
    "facil",
    "Em uma cadeia alimentar, as plantas ocupam o nível dos:",
    [
      "Decompositores",
      "Produtores",
      "Consumidores primários",
      "Consumidores secundários",
      "Parasitas",
    ],
    1,
    "Plantas realizam fotossíntese e produzem matéria orgânica: são produtoras.",
  ),
  q(
    "nat-2",
    "natureza",
    "Física",
    "Cinemática",
    "ENEM 2021 — questão 99",
    "media",
    "Um carro percorre 180 km em 2 horas. Qual a velocidade média?",
    ["60 km/h", "80 km/h", "90 km/h", "100 km/h", "120 km/h"],
    2,
    "v = Δs/Δt = 180/2 = 90 km/h.",
  ),
  q(
    "nat-3",
    "natureza",
    "Química",
    "Soluções",
    "ENEM 2020 — questão 104",
    "media",
    "Dissolvendo 20 g de sal em água até completar 500 mL, a concentração comum é:",
    ["10 g/L", "20 g/L", "40 g/L", "50 g/L", "80 g/L"],
    2,
    "C = m/V = 20 g / 0,5 L = 40 g/L.",
  ),
  q(
    "nat-4",
    "natureza",
    "Biologia",
    "Genética",
    "ENEM 2023 — questão 110",
    "dificil",
    "No cruzamento entre dois indivíduos heterozigotos (Aa x Aa), a proporção esperada de recessivos é:",
    ["0%", "25%", "50%", "75%", "100%"],
    1,
    "A proporção genotípica é 1 AA : 2 Aa : 1 aa, ou seja, 25% de aa.",
  ),
  q(
    "nat-5",
    "natureza",
    "Física",
    "Energia",
    "ENEM 2019 — questão 118",
    "media",
    "Um chuveiro de 5.500 W ligado por 12 minutos consome aproximadamente:",
    ["0,55 kWh", "1,1 kWh", "2,2 kWh", "5,5 kWh", "11 kWh"],
    1,
    "5,5 kW × 0,2 h = 1,1 kWh.",
  ),
  // Extras
  q(
    "lin-6",
    "linguagens",
    "Português",
    "Coesão textual",
    "ENEM 2018 — questão 15",
    "media",
    "No trecho “Estudou muito; portanto, foi aprovado”, o conector “portanto” indica:",
    ["Oposição", "Conclusão", "Adição", "Tempo", "Condição"],
    1,
    "“Portanto” introduz a conclusão a partir de uma causa apresentada antes.",
  ),
  q(
    "mat-6",
    "matematica",
    "Matemática",
    "Razão e proporção",
    "ENEM 2018 — questão 133",
    "facil",
    "Uma receita para 4 pessoas usa 300 g de arroz. Para 10 pessoas, serão necessários:",
    ["600 g", "650 g", "700 g", "750 g", "800 g"],
    3,
    "300/4 = 75 g por pessoa; 75 × 10 = 750 g.",
  ),
  q(
    "hum-6",
    "humanas",
    "História",
    "Brasil Colônia",
    "ENEM 2018 — questão 50",
    "media",
    "O sistema de plantation colonial caracterizava-se por:",
    [
      "Pequenas propriedades e policultura",
      "Grande propriedade, monocultura e trabalho escravizado",
      "Produção voltada ao mercado interno",
      "Trabalho assalariado livre",
      "Cooperativas de camponeses",
    ],
    1,
    "A plantation unia latifúndio, monocultura de exportação e mão de obra escravizada.",
  ),
  q(
    "nat-6",
    "natureza",
    "Química",
    "Química ambiental",
    "ENEM 2018 — questão 115",
    "media",
    "A chuva ácida está associada principalmente à emissão de:",
    ["N₂ e He", "SO₂ e NOx", "O₂ e H₂", "CH₄ e Ar", "Ne e Kr"],
    1,
    "Óxidos de enxofre e de nitrogênio reagem com a água da atmosfera formando ácidos.",
  ),
  ...QUESTOES_EXTRAS,
];

export const questoesPorArea = (area: AreaId) => QUESTOES.filter((x) => x.area === area);

export type Tutor = {
  id: string;
  nome: string;
  area: AreaId | "redacao" | "geral";
  papel: string;
  emoji: string;
  estilo: string;
};

export const TUTORES: Tutor[] = [
  {
    id: "yasmin",
    nome: "Yasmin Drumond",
    area: "humanas",
    papel: "Tutora de Ciências Humanas",
    emoji: "🌍",
    estilo: "Explica com contexto histórico e exemplos do cotidiano.",
  },
  {
    id: "rafael",
    nome: "Guilherme Moreno",
    area: "matematica",
    papel: "Tutor de Matemática",
    emoji: "📐",
    estilo: "Resolve passo a passo, sem pular etapas.",
  },
  {
    id: "clara",
    nome: "Isabella Macedo",
    area: "linguagens",
    papel: "Tutora de Linguagens",
    emoji: "📚",
    estilo: "Foca em interpretação e pistas do enunciado.",
  },
  {
    id: "tiago",
    nome: "Tiago Aoki",
    area: "natureza",
    papel: "Tutor de Ciências da Natureza",
    emoji: "🧪",
    estilo: "Liga fórmulas a fenômenos do dia a dia.",
  },
  {
    id: "helena",
    nome: "Seu espaço de estudo",
    area: "redacao",
    papel: "Corretora de Redação",
    emoji: "✍️",
    estilo: "Avalia pelas 5 competências e sugere reescritas.",
  },
];

export type Video = {
  id: string;
  titulo: string;
  area: AreaId;
  duracao: string;
  professor: string;
  descricao: string;
};

export const VIDEOS: Video[] = [
  {
    id: "v1",
    titulo: "Porcentagem sem decoreba",
    area: "matematica",
    duracao: "12 min",
    professor: "Rafael Nunes",
    descricao: "Aumentos, descontos e fator multiplicativo em questões do ENEM.",
  },
  {
    id: "v2",
    titulo: "Funções da linguagem em 3 exemplos",
    area: "linguagens",
    duracao: "9 min",
    professor: "Clara Bittencourt",
    descricao: "Como identificar rapidamente a função predominante.",
  },
  {
    id: "v3",
    titulo: "Era Vargas: linha do tempo",
    area: "humanas",
    duracao: "15 min",
    professor: "Yasmin Drumond",
    descricao: "Do governo provisório ao Estado Novo com foco em provas.",
  },
  {
    id: "v4",
    titulo: "Genética: quadro de Punnett",
    area: "natureza",
    duracao: "11 min",
    professor: "Tiago Aoki",
    descricao: "Proporções genotípicas e fenotípicas resolvidas na prática.",
  },
  {
    id: "v5",
    titulo: "Estrutura da redação nota 1000",
    area: "linguagens",
    duracao: "18 min",
    professor: "Helena Prado",
    descricao: "Introdução, desenvolvimento e proposta de intervenção completa.",
  },
  {
    id: "v6",
    titulo: "Eletricidade: consumo de energia",
    area: "natureza",
    duracao: "10 min",
    professor: "Tiago Aoki",
    descricao: "kWh, conta de luz e questões clássicas do exame.",
  },
];

export const TEMAS_REDACAO = [
  "Perspectivas acerca do envelhecimento na sociedade brasileira",
  "Desafios para a valorização da herança africana no Brasil",
  "Desafios para o enfrentamento da invisibilidade do trabalho de cuidado realizado pela mulher no Brasil",
  "Desafios para a valorização de comunidades e povos tradicionais no Brasil",
  "Invisibilidade e registro civil: garantia de acesso à cidadania no Brasil",
  "O estigma associado às doenças mentais na sociedade brasileira",
  "Democratização do acesso ao cinema no Brasil",
  "Manipulação do comportamento do usuário pelo controle de dados na internet",
  "Desafios para a formação educacional de surdos no Brasil",
  "Caminhos para combater a intolerância religiosa no Brasil",
  "Caminhos para combater a desinformação nas redes sociais no Brasil",
  "Desafios para a valorização da saúde mental entre jovens estudantes",
  "O impacto da inteligência artificial no mundo do trabalho brasileiro",
  "Mobilidade urbana e o direito à cidade",
  "Preservação das línguas indígenas como patrimônio cultural",
  "Desafios para a inclusão digital de estudantes brasileiros",
  "Segurança alimentar e combate ao desperdício no Brasil",
  "A importância da educação financeira para a juventude",
  "Desafios para a proteção de biomas brasileiros",
  "O papel da ciência no enfrentamento de problemas sociais",
];

export type RankingItem = {
  pos: number;
  nome: string;
  xp: number;
  ofensiva: number;
  avatar: string;
  eu?: boolean;
};

export const RANKING: RankingItem[] = [];

export type Conquista = {
  id: string;
  titulo: string;
  descricao: string;
  emoji: string;
  meta: number;
  tipo: "questoes" | "acertos" | "ofensiva" | "redacoes" | "simulados";
};

export const CONQUISTAS: Conquista[] = [
  {
    id: "c1",
    titulo: "Primeiros passos",
    descricao: "Responda sua 1ª questão",
    emoji: "👟",
    meta: 1,
    tipo: "questoes",
  },
  {
    id: "c2",
    titulo: "Aquecendo",
    descricao: "Responda 10 questões",
    emoji: "🔥",
    meta: 10,
    tipo: "questoes",
  },
  {
    id: "c3",
    titulo: "Maratonista",
    descricao: "Responda 50 questões",
    emoji: "🏃",
    meta: 50,
    tipo: "questoes",
  },
  {
    id: "c4",
    titulo: "Pontaria boa",
    descricao: "Acerte 25 questões",
    emoji: "🎯",
    meta: 25,
    tipo: "acertos",
  },
  {
    id: "c5",
    titulo: "Semana consistente",
    descricao: "7 dias de ofensiva",
    emoji: "📅",
    meta: 7,
    tipo: "ofensiva",
  },
  {
    id: "c6",
    titulo: "Escritor treinado",
    descricao: "Envie 3 redações",
    emoji: "✍️",
    meta: 3,
    tipo: "redacoes",
  },
  {
    id: "c7",
    titulo: "Simulado na veia",
    descricao: "Conclua 2 simulados",
    emoji: "🧠",
    meta: 2,
    tipo: "simulados",
  },
  {
    id: "c8",
    titulo: "Mestre da revisão",
    descricao: "Acerte 60 questões",
    emoji: "👑",
    meta: 60,
    tipo: "acertos",
  },
  {
    id: "c9",
    titulo: "Constância de ferro",
    descricao: "Mantenha 14 dias de ofensiva",
    emoji: "🛡️",
    meta: 14,
    tipo: "ofensiva",
  },
  {
    id: "c10",
    titulo: "Voz autoral",
    descricao: "Conclua 10 redações",
    emoji: "🪶",
    meta: 10,
    tipo: "redacoes",
  },
  {
    id: "c11",
    titulo: "Ritmo de prova",
    descricao: "Conclua 5 simulados",
    emoji: "🏆",
    meta: 5,
    tipo: "simulados",
  },
  {
    id: "c12",
    titulo: "Precisão de elite",
    descricao: "Acerte 100 questões",
    emoji: "💎",
    meta: 100,
    tipo: "acertos",
  },
];

export type PostComunidade = {
  id: string;
  autor: string;
  avatar: string;
  tempo: string;
  texto: string;
  curtidas: number;
  comentarios: number;
  tag: string;
  curso?: string;
  comentariosLista?: { id: string; autor: string; avatar: string; texto: string }[];
};

export const POSTS: PostComunidade[] = [];

export const notaTriEstimada = (acertos: number, total: number) => {
  if (total === 0) return 0;
  const proporcao = acertos / total;
  return Math.round(380 + proporcao * 520);
};
