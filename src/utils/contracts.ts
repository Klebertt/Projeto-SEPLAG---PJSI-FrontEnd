import type { Contract, ContractStatus } from '../types/contract';

export type StatusFilter = ContractStatus | 'Todos';

export function normalizeSearch(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

export function filterContracts(contracts: Contract[], globalSearch: string, objectSearch: string, status: StatusFilter) {
  const global = normalizeSearch(globalSearch);
  const object = normalizeSearch(objectSearch);
  return contracts.filter((contract) => {
    const searchable = normalizeSearch([contract.title, contract.description, contract.process, contract.unit].join(' '));
    return searchable.includes(global)
      && normalizeSearch(`${contract.title} ${contract.description}`).includes(object)
      && (status === 'Todos' || contract.status === status);
  });
}

export function formatDate(value: string) {
  return value.split('-').reverse().join('/');
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function parseAmount(value: string): number | null {
  const text = value.trim();
  if (!/^\d+(,\d{1,2})?$/.test(text)) return null;
  const number = Number(text.replace(',', '.'));
  return Number.isFinite(number) && number > 0 ? number : null;
}
