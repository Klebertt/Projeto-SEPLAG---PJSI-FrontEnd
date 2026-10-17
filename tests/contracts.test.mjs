import test from 'node:test';
import assert from 'node:assert/strict';
import { filterContracts, formatDate, formatCurrency, parseAmount } from '../src/utils/contracts.ts';

const contracts = [
  { id: '1', title: 'Serviços de tecnologia', description: 'Sustentação digital', process: '23000.012845/2024-18', unit: 'STI — Tecnologia', status: 'Vigente' },
  { id: '2', title: 'Manutenção predial', description: 'Reparos', process: '23000.018774/2023-52', unit: 'Patrimônio', status: 'A vencer' },
];

test('busca ignora acentos e combina objeto, unidade/processo e situação', () => {
  assert.deepEqual(filterContracts(contracts, '  STI ', 'servicos', 'Vigente').map(c => c.id), ['1']);
  assert.deepEqual(filterContracts(contracts, '018774', 'manutencao', 'A vencer').map(c => c.id), ['2']);
  assert.equal(filterContracts(contracts, 'STI', '', 'A vencer').length, 0);
  assert.equal(filterContracts(contracts, '', '', 'Todos').length, 2);
});

test('edição aceita reais positivos e rejeita valores ambíguos ou inválidos', () => {
  assert.equal(parseAmount('1284500,00'), 1284500);
  assert.equal(parseAmount(' 42,50 '), 42.5);
  for (const value of ['', '0', '-5', '1.284.500,00', '1e5', 'NaN', '12,123', 'Infinity']) assert.equal(parseAmount(value), null);
});

test('datas não sofrem deslocamento de fuso e valores usam formato brasileiro', () => {
  assert.equal(formatDate('2024-02-12'), '12/02/2024');
  assert.match(formatCurrency(1284500), /R\$\s1\.284\.500,00/);
});
