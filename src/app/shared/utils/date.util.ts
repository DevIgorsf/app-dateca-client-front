const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export function formatarDataBr(data: string | null | undefined, hora?: string | null): string {
  if (!data) {
    return '—';
  }
  const [ano, mes, dia] = data.split('-').map((n) => parseInt(n, 10));
  const texto = `${String(dia).padStart(2, '0')} ${MESES[mes - 1]} ${ano}`;
  return hora ? `${texto}, ${hora}` : texto;
}
