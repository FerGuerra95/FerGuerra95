/**
 * Pure M&A benchmark/oracle helpers aligned to Golden Dataset simple formulas.
 * Not the product DSS valuation engine (see useValuationEngine.js).
 */

function toFiniteNumber(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function requireFiniteNumbers(values) {
  const parsed = values.map((value) => toFiniteNumber(value));

  if (parsed.some((value) => value === null)) {
    return null;
  }

  return parsed;
}

export function calculateSimpleEnterpriseValue({ ebitda, multiple } = {}) {
  const numbers = requireFiniteNumbers([ebitda, multiple]);

  if (!numbers) {
    return null;
  }

  const [normalizedEbitda, normalizedMultiple] = numbers;

  if (normalizedEbitda < 0) {
    return null;
  }

  return normalizedEbitda * normalizedMultiple;
}

export function calculateNetDebt({ debt, cash } = {}) {
  const numbers = requireFiniteNumbers([debt, cash]);

  if (!numbers) {
    return null;
  }

  const [normalizedDebt, normalizedCash] = numbers;
  return normalizedDebt - normalizedCash;
}

export function calculateSimpleEquityValue({ enterpriseValue, netDebt } = {}) {
  const numbers = requireFiniteNumbers([enterpriseValue, netDebt]);

  if (!numbers) {
    return null;
  }

  const [normalizedEnterpriseValue, normalizedNetDebt] = numbers;
  return normalizedEnterpriseValue - normalizedNetDebt;
}

export function calculateWaterfallSimple({
  grossProceeds,
  transactionCosts,
  debtRepayment,
  sellerRollover
} = {}) {
  const numbers = requireFiniteNumbers([
    grossProceeds,
    transactionCosts,
    debtRepayment,
    sellerRollover
  ]);

  if (!numbers) {
    return null;
  }

  const [
    normalizedGrossProceeds,
    normalizedTransactionCosts,
    normalizedDebtRepayment,
    normalizedSellerRollover
  ] = numbers;

  return (
    normalizedGrossProceeds -
    normalizedTransactionCosts -
    normalizedDebtRepayment -
    normalizedSellerRollover
  );
}
