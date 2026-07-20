import { getAvatarColor, getInitials } from './avatar.util';

export interface RankingEntry {
  position: number;
  name: string;
  points: number;
  initials: string;
  color: string;
  isCurrentUser: boolean;
}

export function buildRankingEntries(raw: any[], currentStudentName?: string): RankingEntry[] {
  return (raw || []).map((entry, index) => {
    const name = entry?.student?.name ?? 'Aluno';
    return {
      position: index + 1,
      name,
      points: entry?.student?.points ?? 0,
      initials: getInitials(name),
      color: getAvatarColor(index),
      isCurrentUser: !!currentStudentName && name === currentStudentName,
    };
  });
}
