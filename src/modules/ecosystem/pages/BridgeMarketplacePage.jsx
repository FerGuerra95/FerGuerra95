import React from 'react';
import {
  CircleDollarSign,
  CheckCircle2,
  Globe2,
  Network,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { EcosystemBranchPage } from './EcosystemBranchPage.jsx';

const bridgeBranch = {
  title: 'The Bridge.',
  subtitle: 'Verified liquidity and transaction network.',
  copy:
    'Capa de red que conecta empresas validadas dentro de M&A y Funding con compradores, inversores, bancos, advisors y capital verificado. Es la evolución de SaaS a plataforma transaccional.',
  icon: Network,
  glow: 'rgba(16, 185, 129, 0.34)',
  soft: 'rgba(16, 185, 129, 0.14)',
  border: 'rgba(110, 231, 183, 0.24)',
  status: 'Strategic network layer',
  role: 'Liquidity connection',
  scale: 'Success fees',
  score: 'BRIDGE',
  signalTitle: 'Transaction network branch',
  signalCopy:
    'The Bridge queda integrada como capa estratégica futura para convertir datos validados en oportunidades reales de financiación, inversión o adquisición.',
  badges: ['Marketplace', 'Liquidity', 'Verified Network', 'Exponential Revenue'],
  snapshot: [
    { label: 'Native source', value: 'M&A + Funding' },
    { label: 'Buyer', value: 'Investors / Buyers / Banks' },
    { label: 'Revenue logic', value: 'SaaS + Success fee' }
  ],
  integrationTitle: 'Connected with M&A and Funding',
  integrationDescription:
    'The Bridge conecta oportunidades M&A y necesidades de capital con una red validada de compradores, inversores y financiadores, usando información ya estructurada dentro de CEO’s OS.',
  features: [
    {
      icon: CheckCircle2,
      title: 'Verified opportunities',
      text: 'Empresas y operaciones ya estructuradas con datos, riesgos, financiación, valoración y documentación base.',
      badge: 'Validated data'
    },
    {
      icon: Globe2,
      title: 'Investor and buyer network',
      text: 'Capa futura de conexión entre vendedores, compradores, inversores, bancos y advisors verificados.',
      badge: 'Network'
    },
    {
      icon: CircleDollarSign,
      title: 'Success fee economics',
      text: 'Permite pasar de licencias SaaS a ingresos por transacciones originadas o validadas dentro de la plataforma.',
      badge: 'Exponential upside'
    }
  ],
  thesisTitle: 'The exponential revenue layer',
  thesis:
    'Una sola transacción cerrada puede generar ingresos equivalentes a cientos de licencias mensuales. Esta rama convierte CEO’s OS en una plataforma de liquidez corporativa.',
  scaleRows: [
    { label: 'Churn profile', value: 'Network-driven' },
    { label: 'Pricing power', value: 'Success-based' },
    { label: 'Best client', value: 'Investor / Buyer / Seller' }
  ],
  primaryLink: {
    to: '/funding/dashboard',
    label: 'Open Funding'
  }
};

export function BridgeMarketplacePage() {
  return <EcosystemBranchPage branch={bridgeBranch} />;
}
