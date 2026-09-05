import type { AreaId, Dificuldade, Questao } from "@/lib/enem-data";

/** [id, disciplina, assunto, dificuldade, enunciado, alternativas, correta, explicacao, fonte] */
export type Bruta = [string, string, string, Dificuldade, string, string[], number, string, string];

export const montar = (area: AreaId, brutas: Bruta[]): Questao[] =>
  brutas.map(
    ([
      id,
      disciplina,
      assunto,
      dificuldade,
      enunciado,
      alternativas,
      correta,
      explicacao,
      fonte,
    ]) => ({
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
    }),
  );
