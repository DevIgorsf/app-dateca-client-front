import { PointsEnum } from './pointsEnum';

export type ProvaStatus = 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'CLOSED';
export type ProvaVisibility = 'EVERYONE' | 'FRIENDS' | 'GROUP';
export type ProvaAlternative = 'A' | 'B' | 'C' | 'D' | 'E';

export interface ProvaQuestao {
  id?: string;
  statement: string;
  alternativeA: string;
  alternativeB: string;
  alternativeC: string;
  alternativeD: string;
  alternativeE: string;
  correctAnswer: ProvaAlternative | '';
  comment: string;
}

export interface ProvaSummary {
  id: string;
  titulo: string;
  disciplina: string;
  status: ProvaStatus;
  participantes: number;
  dataAbertura: string | null;
  dataEncerramento: string | null;
  rankingDisponivel: boolean;
}

export interface Prova extends ProvaSummary {
  descricao: string;
  dificuldade: PointsEnum;
  capaUrl: string | null;
  questoes: ProvaQuestao[];
  horaAbertura: string | null;
  maxParticipantes: number | null;
  visibilidade: ProvaVisibility;
  criadorId: string;
  criadaEm: string;
}

export interface ProvaRequest {
  titulo: string;
  descricao: string;
  disciplina: string;
  dificuldade: PointsEnum;
  capaUrl: string | null;
  questoes: ProvaQuestao[];
  dataAbertura: string | null;
  horaAbertura: string | null;
  dataEncerramento: string | null;
  maxParticipantes: number | null;
  visibilidade: ProvaVisibility;
  /** true = publicar imediatamente (Agendado/Ativo conforme a data); false = salvar como rascunho */
  publicar: boolean;
}

export function novaQuestaoVazia(): ProvaQuestao {
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
