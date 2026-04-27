export function formatCurrency(value, currency = 'EUR') {
  const safeValue = Number.isFinite(value) ? value : 0;
  const symbol = currency === 'USD' ? '$' : '€';
  return `${new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 }).format(safeValue)}${symbol}`;
}
