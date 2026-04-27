export function formatDate(dateLike) {
  const date = new Date(dateLike);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('es-ES');
}

export function formatDateTime(dateLike) {
  const date = new Date(dateLike);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('es-ES');
}
