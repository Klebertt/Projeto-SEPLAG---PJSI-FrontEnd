export type ContractStatus = 'Vigente' | 'A renovar' | 'Vencido' | 'Encerrado' | 'A vencer';
export type Contract = {
  id: string; title: string; process: string; status: ContractStatus; modality: string;
  daysRemaining: number; description: string; startsAt: string; endsAt: string;
  amount: number; unit: string; updatedAt?: string;
};
export type AuditRecord = {
  id: string; contractId: string; initials: string; name: string; action: string;
  detail: string; field: string; previousValue: string; currentValue: string;
  source: string; date: string; tone: 'blue' | 'indigo' | 'green' | 'gray';
};
export type HistoryEntry = { id: string; contractId: string; title: string; timestamp: string };
export type Session = { email: string; sector: string };
export type ContractDraft = {
  title: string; process: string; modality: string; status: string; description: string;
  startsAt: string; endsAt: string; amount: string; unit: string;
};
