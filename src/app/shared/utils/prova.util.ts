import { ProvaStatus, ProvaVisibility } from 'src/app/interfaces/prova';

export function provaStatusLabel(status: ProvaStatus): string {
  switch (status) {
    case 'DRAFT': return 'Rascunho';
    case 'SCHEDULED': return 'Agendado';
    case 'ACTIVE': return 'Ativo';
    case 'CLOSED': return 'Encerrado';
  }
}

export function provaStatusClass(status: ProvaStatus): string {
  switch (status) {
    case 'DRAFT': return 'badge--rascunho';
    case 'SCHEDULED': return 'badge--agendado';
    case 'ACTIVE': return 'badge--ativo';
    case 'CLOSED': return 'badge--encerrado';
  }
}

export function provaVisibilityLabel(visibilidade: ProvaVisibility): string {
  switch (visibilidade) {
    case 'FRIENDS': return 'Somente amigos';
    case 'GROUP': return 'Grupo específico';
    default: return 'Todos os usuários';
  }
}
