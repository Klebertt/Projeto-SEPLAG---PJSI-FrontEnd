import type { Contract, ContractStatus } from '../types/contract';

export const contractStatuses: ContractStatus[] = ['Vigente', 'A renovar', 'Vencido', 'Encerrado'];
export const modalities = ['Pregão eletrônico', 'Inexigibilidade', 'Concorrência'];
export const units = ['Diretoria de Infraestrutura', 'Tecnologia da Informação', 'Superintendência Administrativa', 'Coordenação de Logística'];
export const sectors = units.slice(0, 3);

// Snapshot fictício do protótipo. Os prazos originais não refletem a data atual.
export const initialContracts: Contract[] = [
  { id: '1', title: 'Nova Energia S.A.', process: '23080.014522/2024-17', status: 'Vigente', modality: 'Pregão eletrônico', daysRemaining: 127, description: 'Fornecimento contínuo de energia elétrica para as unidades administrativas e operacionais.', startsAt: '2024-01-15', endsAt: '2026-01-14', amount: 1284500, unit: units[0] },
  { id: '2', title: 'Alvorada Tecnologia', process: '23080.009871/2024-42', status: 'A renovar', modality: 'Inexigibilidade', daysRemaining: 18, description: 'Licenciamento e suporte técnico da plataforma integrada de gestão documental.', startsAt: '2024-05-02', endsAt: '2025-09-01', amount: 468900, unit: units[1] },
  { id: '3', title: 'Brasil Serviços Ltda.', process: '23080.032140/2023-09', status: 'Vigente', modality: 'Concorrência', daysRemaining: 243, description: 'Prestação de serviços especializados de manutenção predial preventiva e corretiva.', startsAt: '2024-03-01', endsAt: '2026-02-28', amount: 2115000, unit: units[2] },
  { id: '4', title: 'Ponto Certo Logística', process: '23080.002456/2023-81', status: 'Encerrado', modality: 'Pregão eletrônico', daysRemaining: 0, description: 'Transporte e distribuição de materiais entre as unidades regionais.', startsAt: '2023-02-10', endsAt: '2025-02-09', amount: 786240, unit: units[3] },
];
