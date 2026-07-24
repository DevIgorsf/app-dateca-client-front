import { PointsEnum } from './pointsEnum';

export type ProvaStatus = 'Rascunho' | 'Agendado' | 'Ativo' | 'Encerrado';
export type ProvaVisibilidade = 'TODOS' | 'AMIGOS' | 'GRUPO';
export type ProvaAlternative = 'A' | 'B' | 'C' | 'D' | 'E';

export interface ProvaQuestaoForm {
  statement: string;
  alternativeA: string;
  alternativeB: string;
  alternativeC: string;
  alternativeD: string;
  alternativeE: string;
  correctAnswer: ProvaAlternative | '';
  comment: string | null;
}

export interface ProvaQuestaoDTO extends ProvaQuestaoForm {
  id: string;
  ordem: number;
}

/** Body de POST /prova e PUT /prova/:id */
export interface ProvaForm {
  titulo: string;
  descricao: string | null;
  disciplina: string;
  dificuldade: PointsEnum;
  capaUrl: string | null;
  questoes: ProvaQuestaoForm[];
  dataAbertura: string | null;
  horaAbertura: string | null;
  dataEncerramento: string | null;
  maxParticipantes: number | null;
  visibilidade: ProvaVisibilidade;
  /** 'Rascunho' salva sem publicar; null (ou qualquer outro valor) publica imediatamente */
  status: 'Rascunho' | null;
}

/** Itens de GET /prova/minhas e GET /prova/publicas */
export interface ProvaResumoDTO {
  id: string;
  titulo: string;
  disciplina: string;
  dificuldade: PointsEnum;
  capaUrl: string | null;
  status: ProvaStatus;
  participantes: number;
  rankingDisponivel: boolean;
  dataAbertura: string | null;
  horaAbertura: string | null;
  dataEncerramento: string | null;
  maxParticipantes: number | null;
  visibilidade: ProvaVisibilidade;
  criadaEm: string;
}

/** Retorno de GET /prova/:id, POST /prova e PUT /prova/:id */
export interface ProvaDetalheDTO extends ProvaResumoDTO {
  descricao: string | null;
  criadorId: string;
  questoes: ProvaQuestaoDTO[];
}

/** Itens de GET /prova/:id/ranking (ordenado pelo total de acertos) */
export interface ProvaRankingDTO {
  posicao: number;
  studentId: string;
  nomeAluno: string;
  pontuacao: number;
  acertos: number;
  respondidoEm: string;
}

export function novaQuestaoVazia(): ProvaQuestaoForm {
  return {
    statement: '',
    alternativeA: '',
    alternativeB: '',
    alternativeC: '',
    alternativeD: '',
    alternativeE: '',
    correctAnswer: '',
    comment: '',
  };
}
