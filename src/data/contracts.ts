import type { Contract } from '../types/contract';

// Snapshot fictício do Figma. Prazos e situações não representam dados atuais.
export const initialContracts: Contract[] = [
  {
    id: 'technology', title: 'Serviços de tecnologia', process: '23000.012845/2024-18',
    modality: 'Pregão Eletrônico', status: 'Vigente', daysRemaining: 87,
    description: 'Contratação de serviços continuados de sustentação, manutenção e desenvolvimento de soluções digitais.',
    startsAt: '2024-02-12', endsAt: '2026-02-11', amount: 1284500,
    unit: 'STI — Tecnologia da Informação',
  },
  {
    id: 'maintenance', title: 'Manutenção predial', process: '23000.018774/2023-52',
    modality: 'Pregão Eletrônico', status: 'A vencer', daysRemaining: 24,
    description: 'Prestação de serviços de manutenção preventiva e corretiva das instalações prediais, incluindo materiais e mão de obra.',
    startsAt: '2023-12-11', endsAt: '2025-12-10', amount: 648000,
    unit: 'SUGEP — Gestão do Patrimônio',
  },
  {
    id: 'supplies', title: 'Fornecimento de materiais', process: '23000.004921/2022-09',
    modality: 'Pregão Eletrônico', status: 'Vencido', daysRemaining: -18,
    description: 'Aquisição de materiais de expediente para atendimento das unidades administrativas da Secretaria.',
    startsAt: '2022-11-01', endsAt: '2025-10-31', amount: 187350,
    unit: 'SUGA — Gestão Administrativa',
  },
  {
    id: 'consulting', title: 'Consultoria especializada', process: '23000.021533/2024-76',
    modality: 'Concorrência', status: 'Vigente', daysRemaining: 214,
    description: 'Contratação de consultoria especializada para apoio ao planejamento estratégico e à modernização da gestão pública.',
    startsAt: '2024-06-20', endsAt: '2026-06-19', amount: 925000,
    unit: 'SUPLAN — Planejamento e Gestão',
  },
  {
    id: 'security', title: 'Serviços de vigilância', process: '23000.009218/2024-31',
    modality: 'Pregão Eletrônico', status: 'Vigente', daysRemaining: 146,
    description: 'Prestação de serviços continuados de vigilância patrimonial nas instalações da Secretaria.',
    startsAt: '2024-04-13', endsAt: '2026-04-12', amount: 2160000,
    unit: 'SUGA — Gestão Administrativa',
  },
];
