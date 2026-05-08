const DEFAULT_LOCALE = 'es-ES';
const DEFAULT_CURRENCY = 'EUR';

function normalizeCurrency(currency) {
  const code = String(currency || DEFAULT_CURRENCY).trim().toUpperCase();

  return /^[A-Z]{3}$/.test(code) ? code : DEFAULT_CURRENCY;
}

function canFormatCurrency(currency) {
  try {
    new Intl.NumberFormat(DEFAULT_LOCALE, {
      style: 'currency',
      currency
    }).format(0);

    return true;
  } catch (_error) {
    return false;
  }
}

export function formatCurrency(value, currency = DEFAULT_CURRENCY, options = {}) {
  const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;
  const currencyCode = normalizeCurrency(currency);
  const maximumFractionDigits = Number.isInteger(options.maximumFractionDigits)
    ? options.maximumFractionDigits
    : 0;

  if (!canFormatCurrency(currencyCode)) {
    const amount = new Intl.NumberFormat(DEFAULT_LOCALE, {
      maximumFractionDigits
    }).format(safeValue);

    return `${amount} ${currencyCode}`;
  }

  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: 'currency',
    currency: currencyCode,
    currencyDisplay: options.currencyDisplay || 'narrowSymbol',
    maximumFractionDigits
  }).format(safeValue);
}
