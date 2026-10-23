import type { AuditRecord, Contract, ContractDraft, Session } from '../types/contract';
import { formatCurrency, formatDate, parseAmount } from './contracts.ts';

export function toDraft(contract?: Contract): ContractDraft {
  return contract ? { ...contract, startsAt: formatDate(contract.startsAt), endsAt: formatDate(contract.endsAt), amount: contract.amount.toFixed(2).replace('.', ',') }
    : { title: '', process: '', modality: '', status: '', description: '', startsAt: '', endsAt: '', amount: '', unit: '' };
}

export function parseDate(input: string): string | null {
  const parts = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(input.trim());
  if (!parts) return null;
  const [, day, month, year] = parts;
  const date = new Date(`${year}-${month}-${day}T12:00:00Z`);
  if (Number(year) < 1900 || !Number.isFinite(date.getTime()) || date.getUTCDate() !== Number(day) || date.getUTCMonth() + 1 !== Number(month)) return null;
  return `${year}-${month}-${day}`;
}

export function validateDraft(draft: ContractDraft, contracts: Contract[], id?: string) {
  const errors: Partial<Record<keyof ContractDraft, string>> = {};
  for (const field of ['title', 'description', 'modality', 'status', 'unit'] as const) if (!draft[field].trim()) errors[field] = 'Preencha este campo.';
  if (!/^\d{5}\.\d{6}\/\d{4}-\d{2}$/.test(draft.process.trim())) errors.process = 'Use o formato 00000.000000/0000-00.';
  else if (contracts.some(c => c.id !== id && c.process === draft.process.trim())) errors.process = 'Já existe um contrato com este processo.';
  const start = parseDate(draft.startsAt), end = parseDate(draft.endsAt);
  if (!start) errors.startsAt = 'Informe uma data válida no formato DD/MM/AAAA.';
  if (!end) errors.endsAt = 'Informe uma data válida no formato DD/MM/AAAA.';
  else if (start && end < start) errors.endsAt = 'O encerramento deve ser igual ou posterior ao início.';
  if (parseAmount(draft.amount) === null) errors.amount = 'Informe um valor positivo, como 1284500,00.';
  return errors;
}

export function buildContract(draft: ContractDraft, id: string, now: Date, previous?: Contract): Contract {
  const endsAt = parseDate(draft.endsAt)!;
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.round((Date.parse(`${endsAt}T00:00:00Z`) - today) / 86400000);
  return {
    id, title: draft.title.trim(), process: draft.process.trim(), modality: draft.modality,
    status: draft.status as Contract['status'], description: draft.description.trim(),
    startsAt: parseDate(draft.startsAt)!, endsAt, amount: parseAmount(draft.amount)!, unit: draft.unit,
    daysRemaining: previous && previous.endsAt === endsAt && previous.status === draft.status ? previous.daysRemaining : draft.status === 'Encerrado' ? 0 : days,
    updatedAt: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  };
}

const fieldLabels = { title: 'Empresa contratada', process: 'Número do processo', modality: 'Modalidade', status: 'Situação', description: 'Descrição do objeto', startsAt: 'Data de início', endsAt: 'Data de encerramento', amount: 'Valor global', unit: 'Unidade responsável' } as const;

export function buildAudit(before: Contract | undefined, after: Contract, now: Date): AuditRecord[] {
  const common = { contractId: after.id, initials: 'MR', name: 'Mariana Ribeiro', date: now.toLocaleString('pt-BR'), source: 'Atualização manual', tone: 'blue' as const };
  if (!before) return [{ ...common, id: `${now.getTime()}-${after.id}-created`, action: 'criou este contrato', detail: 'Registro inicial incluído no sistema.', field: 'Cadastro do contrato', previousValue: 'Não existente', currentValue: `Processo ${after.process}`, tone: 'gray' }];
  return (Object.keys(fieldLabels) as (keyof typeof fieldLabels)[]).filter(key => before[key] !== after[key]).map((key) => {
    const display = (contract: Contract) => key === 'amount' ? formatCurrency(contract.amount) : key === 'startsAt' || key === 'endsAt' ? formatDate(contract[key]) : String(contract[key]);
    return { ...common, id: `${now.getTime()}-${after.id}-${key}`, action: `alterou ${fieldLabels[key].toLowerCase()}`, detail: `${fieldLabels[key]} atualizado.`, field: fieldLabels[key], previousValue: display(before), currentValue: display(after) };
  });
}

export function validateLogin(email: string, password: string, sector: string): string {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Informe um e-mail válido.';
  if (!password.trim()) return 'Informe uma senha de demonstração.';
  if (!sector) return 'Selecione seu setor.';
  return '';
}

export function demoSession(email: string, sector: string): Session { return { email: email.trim(), sector }; }
