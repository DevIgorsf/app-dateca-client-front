import { ProvaStatus, ProvaVisibilidade } from 'src/app/interfaces/prova';

export function provaStatusClass(status: ProvaStatus): string {
  switch (status) {
    case 'Rascunho': return 'badge--rascunho';
    case 'Agendado': return 'badge--agendado';
    case 'Ativo': return 'badge--ativo';
    case 'Encerrado': return 'badge--encerrado';
  }
}

export function provaVisibilidadeLabel(visibilidade: ProvaVisibilidade): string {
  switch (visibilidade) {
    case 'AMIGOS': return 'Somente amigos';
    case 'GRUPO': return 'Grupo específico';
    default: return 'Todos os usuários';
  }
}
