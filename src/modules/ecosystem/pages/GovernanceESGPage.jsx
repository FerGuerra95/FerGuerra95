import React from 'react';
import {
  CheckCircle2,
  FileText,
  Landmark,
  Scale,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { EcosystemBranchPage } from './EcosystemBranchPage.jsx';

const governanceBranch = {
  title: 'Governance & ESG Strategy.',
  subtitle: 'Board control, sustainability and strategic compliance.',
  copy:
    'Rama enterprise para digitalizar gobernanza, seguimiento de decisiones estratégicas, actas de consejo, criterios ESG y reporting de sostenibilidad conectado de forma nativa con Compliance y Funding.',
  icon: Scale,
  glow: 'rgba(14, 165, 233, 0.34)',
  soft: 'rgba(14, 165, 233, 0.14)',
  border: 'rgba(125, 211, 252, 0.24)',
  status: 'Roadmap visual',
  role: 'Regulatory recurrence',
  scale: 'Enterprise mandatory layer',
  score: 'ESG',
  signalTitle: 'Governance layer prepared',
  signalCopy:
    'La rama queda posicionada como evolución natural de Compliance para reporting regulatorio, financiación bancaria, fondos públicos y gobierno corporativo.',
  badges: ['Governance', 'ESG Strategy', 'Board Control', 'Enterprise Roadmap'],
  snapshot: [
    { label: 'Native source', value: 'Compliance + Funding' },
    { label: 'Buyer', value: 'Boards / CFO / ESG' },
    { label: 'Revenue logic', value: 'Recurring compliance' }
  ],
  integrationTitle: 'Connected with Compliance and Funding',
  integrationDescription:
    'Governance & ESG utiliza la información validada de proveedores, riesgos, financiación y decisiones ejecutivas para convertir CEO’s OS en una capa continua de gobierno corporativo.',
  features: [
    {
      icon: ShieldCheck,
      title: 'ESG reporting from validated data',
      text: 'Convierte evidencias, riesgos de proveedores y métricas operativas en estructura base para reportes ESG.',
      badge: 'Compliance synergy'
    },
    {
      icon: FileText,
      title: 'Board decisions and minutes',
      text: 'Digitaliza actas, decisiones, responsables y seguimiento de compromisos estratégicos.',
      badge: 'Governance'
    },
    {
      icon: Landmark,
      title: 'Funding eligibility support',
      text: 'Alinea criterios ESG y gobierno con bancos, inversores, fondos públicos y financiación de gran volumen.',
      badge: 'Funding synergy'
    }
  ],
  thesisTitle: 'Recurring enterprise obligation',
  thesis:
    'Esta rama convierte CEO’s OS en una infraestructura de cumplimiento continuo para compañías que necesitan financiación, reporting regulatorio, trazabilidad de decisiones y gobierno defendible.',
  scaleRows: [
    { label: 'Churn profile', value: 'Low' },
    { label: 'Pricing power', value: 'High' },
    { label: 'Best client', value: 'SME enterprise / Board' }
  ],
  primaryLink: {
    to: '/compliance/dashboard',
    label: 'Open Compliance'
  }
};

export function GovernanceESGPage() {
  return <EcosystemBranchPage branch={governanceBranch} />;
}
