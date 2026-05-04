import React from 'react';
import {
  Crown,
  FileText,
  Gem,
  LockKeyhole,
  ShieldCheck,
  Users
} from 'lucide-react';
import { EcosystemBranchPage } from './EcosystemBranchPage.jsx';

const heritageBranch = {
  title: 'Heritage & Legacy OS.',
  subtitle: 'Patrimony, family protocols and legacy infrastructure.',
  copy:
    'Rama de retención profunda para proteger el patrimonio que genera la empresa: estructura patrimonial, protocolos familiares, protección de activos, sucesión, family office y continuidad generacional.',
  icon: Gem,
  glow: 'rgba(212, 175, 55, 0.34)',
  soft: 'rgba(212, 175, 55, 0.13)',
  border: 'rgba(212, 175, 55, 0.25)',
  status: 'Locked for later',
  role: 'Lifetime retention',
  scale: 'Family office premium',
  score: 'LEGACY',
  signalTitle: 'Lifetime infrastructure branch',
  signalCopy:
    'Heritage & Legacy OS queda reservado como módulo de máxima fidelización: la capa donde el dueño protege patrimonio, familia, sucesión y continuidad.',
  badges: ['Heritage', 'Legacy', 'Family Office', 'Long-Term Roadmap'],
  snapshot: [
    { label: 'Native source', value: 'CEO wealth + company value' },
    { label: 'Buyer', value: 'Owners / Family Offices' },
    { label: 'Revenue logic', value: 'Premium retention' }
  ],
  integrationTitle: 'Connected with company value and owner legacy',
  integrationDescription:
    'Mientras CEO’s OS protege la empresa, Heritage & Legacy OS protege el patrimonio y la continuidad que esa empresa genera para el dueño, la familia o el holding.',
  features: [
    {
      icon: Crown,
      title: 'Owner patrimony map',
      text: 'Mapa visual futuro de activos, sociedades, participaciones, inmuebles, liquidez y exposición patrimonial.',
      badge: 'Patrimony'
    },
    {
      icon: Users,
      title: 'Family protocol and succession',
      text: 'Estructura futura para sucesión, gobierno familiar, protocolos, roles y continuidad generacional.',
      badge: 'Legacy'
    },
    {
      icon: LockKeyhole,
      title: 'Asset protection layer',
      text: 'Capa futura de protección, alertas, documentación crítica y visión integral de patrimonio empresarial y familiar.',
      badge: 'Protection'
    }
  ],
  thesisTitle: 'Infinite retention branch',
  thesis:
    'Cuando un cliente vuelca su estructura patrimonial, protocolos familiares y protección de activos, la plataforma deja de ser una herramienta y se convierte en infraestructura de vida.',
  scaleRows: [
    { label: 'Churn profile', value: 'Very low' },
    { label: 'Pricing power', value: 'Very high' },
    { label: 'Best client', value: 'Family Office / Owner' }
  ],
  primaryLink: {
    to: '/ma/dashboard',
    label: 'Open M&A'
  }
};

export function HeritageLegacyPage() {
  return <EcosystemBranchPage branch={heritageBranch} />;
}
