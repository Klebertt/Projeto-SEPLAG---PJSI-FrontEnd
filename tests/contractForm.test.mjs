import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAudit, buildContract, parseDate, toDraft, validateDraft, validateLogin } from '../src/utils/contractForm.ts';

const original = { id: '1', title: 'Empresa A', process: '23080.014522/2024-17', status: 'Vigente', modality: 'Pregão eletrônico', daysRemaining: 127, description: 'Objeto original', startsAt: '2024-01-15', endsAt: '2026-01-14', amount: 1284500, unit: 'Diretoria de Infraestrutura' };
const now = new Date('2026-10-23T12:00:00Z');

test('datas rejeitam dias inexistentes e aceitam ano bissexto', () => {
  assert.equal(parseDate('29/02/2024'), '2024-02-29');
  for (const value of ['29/02/2025', '31/04/2026', '00/01/2026', '01/13/2026', '2026-01-01', '']) assert.equal(parseDate(value), null);
});
test('edição preserva dados originais e não acusa o próprio processo como duplicado', () => {
  const draft = toDraft(original);
  assert.equal(draft.startsAt, '15/01/2024');
  assert.equal(draft.amount, '1284500,00');
  assert.deepEqual(validateDraft(draft, [original], '1'), {});
  assert.ok(validateDraft(draft, [original]).process);
  assert.ok(validateDraft({ ...draft, endsAt: '14/01/2024' }, [original], '1').endsAt);
});
test('campos obrigatórios, valores e formato de processo são validados', () => {
  const errors = validateDraft(toDraft(), []);
  assert.equal(Object.keys(errors).length, 9);
  const draft = toDraft(original);
  assert.ok(validateDraft({ ...draft, amount: '-1', process: '123' }, [], '1').amount);
  assert.ok(validateDraft({ ...draft, process: '123' }, [], '1').process);
});
test('edição gera auditoria por campo e mantém snapshot de prazo quando vigência não muda', () => {
  const next = buildContract({ ...toDraft(original), title: 'Empresa B', amount: '1500000,50' }, '1', now, original);
  assert.equal(next.daysRemaining, 127);
  assert.equal(original.title, 'Empresa A');
  const records = buildAudit(original, next, now);
  assert.equal(records.length, 2);
  assert.ok(records.every(record => record.contractId === '1'));
  const valueRecord = records.find(record => record.field === 'Valor global');
  assert.match(valueRecord.previousValue, /1\.284\.500,00/);
  assert.match(valueRecord.currentValue, /1\.500\.000,50/);
  assert.deepEqual(buildAudit(original, { ...original }, now), []);
});
test('cadastro produz registro próprio, e atualização da vigência recalcula prazo', () => {
  const added = buildContract({ ...toDraft(original), endsAt: '25/10/2026' }, 'local-1', now);
  assert.equal(added.id, 'local-1');
  assert.equal(added.daysRemaining, 2);
  assert.equal(buildAudit(undefined, added, now)[0].action, 'criou este contrato');
  const closed = buildContract({ ...toDraft(original), status: 'Encerrado' }, 'local-2', now);
  assert.equal(closed.daysRemaining, 0);
});
test('login demonstrativo exige email, senha e setor', () => {
  assert.ok(validateLogin('invalido', 'demo', 'STI'));
  assert.ok(validateLogin('teste@example.com', '', 'STI'));
  assert.ok(validateLogin('teste@example.com', 'demo', ''));
  assert.equal(validateLogin('teste@example.com', 'demo', 'Tecnologia da Informação'), '');
});
