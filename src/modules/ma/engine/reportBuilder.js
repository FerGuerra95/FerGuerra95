import { clamp } from '../../../shared/utils/validators.js';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import { formatPercent } from '../../../shared/utils/formatPercent.js';
import { DEFAULT_SECTOR } from './valuationFormulas.js';

export function buildComparables(sector, adjustedMultiple) {
  const sectorPeers = {
    'Software / SaaS': ['CloudCore Systems', 'Recurring Stack Iberia', 'NextOps Digital'],
    Industria: ['MetalWorks Group', 'IberProcess Manufacturing', 'Prime Industrial Components'],
    Servicios: ['Atlas Business Services', 'Gestión Integral Partners', 'ServiceFlow España'],
    Retail: ['Urban Retail Concepts', 'IberMarket Stores', 'Consumer Point Group']
  };

  const peers = sectorPeers[sector] || sectorPeers[DEFAULT_SECTOR];
  return peers.map((name, index) => {
    const offset = index === 0 ? -0.35 : index === 1 ? 0 : 0.4;
    return {
      name,
      multiple: clamp(adjustedMultiple + offset, 1.5, 12),
      note: index === 0 ? 'Descuento por tamaño' : index === 1 ? 'Caso central' : 'Prima por liderazgo'
    };
  });
}

export function buildBuyerMatches({ sector, qualityScore, leverageRatio, recurringRevenue, ownerDependency, clientConcentration }) {
  const strategicFit = clamp(60 + recurringRevenue * 0.25 + qualityScore * 0.18 - ownerDependency * 0.15 - leverageRatio * 6, 45, 97);
  const peFit = clamp(55 + qualityScore * 0.22 - leverageRatio * 8 - ownerDependency * 0.12 + recurringRevenue * 0.12, 40, 93);
  const searchFundFit = clamp(58 + qualityScore * 0.16 - clientConcentration * 0.09 - leverageRatio * 4 - ownerDependency * 0.08, 38, 90);

  return [
    {
      type: 'Estratégico',
      title: sector === 'Industria' ? 'Industrial Leader' : sector === 'Software / SaaS' ? 'Vertical Software Buyer' : 'Corporate Consolidator',
      fit: Math.round(strategicFit),
      desc: 'Compradores del mismo sector buscando cuota de mercado y sinergias.'
    },
    {
      type: 'Private Equity',
      title: 'Mid-Market Fund',
      fit: Math.round(peFit),
      desc: 'Fondos enfocados en crecimiento, profesionalización y apalancamiento.'
    },
    {
      type: 'Search Fund',
      title: 'Individual Principal',
      fit: Math.round(searchFundFit),
      desc: 'Perfil ideal para relevo generacional y transición operativa.'
    }
  ];
}

export function buildNarrative({ financials, settings, derived }) {
  const thesis = [
    `EBITDA normalizado de ${formatCurrency(derived.normalizedEbitda, settings.reportCurrency)}.`,
    `Múltiplo de mercado ajustado a x${derived.adjustedMultiple.toFixed(2)} con ${formatPercent(derived.recurringRevenue)} de ingresos recurrentes.`,
    `Sinergias post-deal estimadas en ${formatCurrency(derived.totalSynergyValue, settings.reportCurrency)}.`,
    `Ajuste de working capital de ${formatCurrency(derived.wcAdjustment, settings.reportCurrency)} respecto al objetivo.`
  ];

  const execSummary = `${financials.name} opera en ${financials.sector}. Tras la normalización financiera, estimamos un Equity Value base de ${formatCurrency(derived.equityBase, settings.reportCurrency)} y unos Net Proceeds de ${formatCurrency(derived.netProceeds, settings.reportCurrency)}. La tesis se apoya en recurrencia, resiliencia operativa y potencial de sinergias post-transacción.`;

  return { thesis, execSummary };
}
