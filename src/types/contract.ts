export type ContractStatus = 'Vigente' | 'A vencer' | 'Vencido';

export type Contract = {
  id: string;
  title: string;
  process: string;
  modality: string;
  status: ContractStatus;
  daysRemaining: number;
  description: string;
  startsAt: string;
  endsAt: string;
  amount: number;
  unit: string;
};

export type HistoryEntry = { id: string; contractId: string; title: string; timestamp: string };
