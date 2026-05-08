import { clamp } from '../../../shared/utils/validators.js';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import { formatPercent } from '../../../shared/utils/formatPercent.js';
import { DEFAULT_SECTOR } from './valuationFormulas.js';

const SOURCE_REFS = {
  normalizedEbitda: {
    sourceId: 'ma.financials.normalizedEbitda',
    label: 'Reported EBITDA plus validated add-backs'
  },
  adjustedMultiple: {
    sourceId: 'ma.formula.adjustedMultiple',
    label: 'Sector baseline multiple adjusted by risk mode and quality score'
  },
  synergyValue: {
    sourceId: 'ma.formula.synergyValue',
    label: 'Cost synergies capitalized at 4.5x and revenue synergies at 3.0x'
  },
  workingCapital: {
    sourceId: 'ma.financials.workingCapital',
    label: 'Actual working capital less target working capital'
  },
  dcf: {
    sourceId: 'ma.formula.dcf',
    label: 'Discounted free cash flow using WACC and terminal growth assumptions'
  }
};

export function buildComparables(sector, adjustedMultiple) {
  const sectorPeers = {
    'Software / SaaS': ['CloudCore Systems', 'Recurring Stack Iberia', 'NextOps Digital'],
    Industria: ['MetalWorks Group', 'IberProcess Manufacturing', 'Prime Industrial Components'],
    Servicios: ['Atlas Business Services', 'Gestion Integral Partners', 'ServiceFlow Espana'],
    Retail: ['Urban Retail Concepts', 'IberMarket Stores', 'Consumer Point Group']
  };

  const peers = sectorPeers[sector] || sectorPeers[DEFAULT_SECTOR];
  return peers.map((name, index) => {
    const offset = index === 0 ? -0.35 : index === 1 ? 0 : 0.4;
    return {
      name,
      multiple: clamp(adjustedMultiple + offset, 1.5, 12),
      note: index === 0 ? 'Descuento por tamano' : index === 1 ? 'Caso central' : 'Prima por liderazgo',
      sourceId: SOURCE_REFS.adjustedMultiple.sourceId
    };
  });
}

export function buildBuyerMatches({
  sector,
  qualityScore,
  leverageRatio,
  recurringRevenue,
  ownerDependency,
  clientConcentration
}) {
  const strategicFit = clamp(
    60 + recurringRevenue * 0.25 + qualityScore * 0.18 - ownerDependency * 0.15 - leverageRatio * 6,
    45,
    97
  );
  const peFit = clamp(
    55 + qualityScore * 0.22 - leverageRatio * 8 - ownerDependency * 0.12 + recurringRevenue * 0.12,
    40,
    93
  );
  const searchFundFit = clamp(
    58 + qualityScore * 0.16 - clientConcentration * 0.09 - leverageRatio * 4 - ownerDependency * 0.08,
    38,
    90
  );

  return [
    {
      type: 'Estrategico',
      title:
        sector === 'Industria'
          ? 'Industrial Leader'
          : sector === 'Software / SaaS'
            ? 'Vertical Software Buyer'
            : 'Corporate Consolidator',
      fit: Math.round(strategicFit),
      desc: 'Compradores del mismo sector buscando cuota de mercado y sinergias.',
      sourceId: 'ma.buyerFit.strategic'
    },
    {
      type: 'Private Equity',
      title: 'Mid-Market Fund',
      fit: Math.round(peFit),
      desc: 'Fondos enfocados en crecimiento, profesionalizacion y apalancamiento.',
      sourceId: 'ma.buyerFit.privateEquity'
    },
    {
      type: 'Search Fund',
      title: 'Individual Principal',
      fit: Math.round(searchFundFit),
      desc: 'Perfil ideal para relevo generacional y transicion operativa.',
      sourceId: 'ma.buyerFit.searchFund'
    }
  ];
}

export function buildNarrative({ financials, settings, derived }) {
  const currency = settings?.reportCurrency || financials?.currency || 'EUR';
  const thesis = [
    `EBITDA normalizado de ${formatCurrency(derived.normalizedEbitda, currency)}.`,
    `Multiplo de mercado ajustado a x${derived.adjustedMultiple.toFixed(2)} con ${formatPercent(derived.recurringRevenue)} de ingresos recurrentes.`,
    `Sinergias post-deal estimadas en ${formatCurrency(derived.totalSynergyValue, currency)}.`,
    `Ajuste de working capital de ${formatCurrency(derived.wcAdjustment, currency)} respecto al objetivo.`
  ];

  if (Number.isFinite(Number(derived.dcfEnterpriseValue))) {
    thesis.push(
      `DCF de control estimado en ${formatCurrency(derived.dcfEnterpriseValue, currency)}.`
    );
  }

  const thesisSources = [
    SOURCE_REFS.normalizedEbitda,
    SOURCE_REFS.adjustedMultiple,
    SOURCE_REFS.synergyValue,
    SOURCE_REFS.workingCapital
  ];

  if (Number.isFinite(Number(derived.dcfEnterpriseValue))) {
    thesisSources.push(SOURCE_REFS.dcf);
  }

  const execSummary = `${financials.name} opera en ${financials.sector}. Tras la normalizacion financiera, estimamos un Equity Value base de ${formatCurrency(derived.equityBase, currency)} y unos Net Proceeds de ${formatCurrency(derived.netProceeds, currency)}. La tesis se apoya en recurrencia, resiliencia operativa y potencial de sinergias post-transaccion.`;

  return {
    thesis,
    thesisSources,
    execSummary,
    execSummarySourceIds: thesisSources.map((source) => source.sourceId)
  };
}
