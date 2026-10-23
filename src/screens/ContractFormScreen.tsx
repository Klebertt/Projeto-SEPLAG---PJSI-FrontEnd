import { useState, type ReactNode } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AppText as Text } from '../components/AppText';
import { Button } from '../components/Button';
import { FormField, SelectField } from '../components/FormField';
import { contractStatuses, modalities, units } from '../data/contracts';
import { useApp } from '../state/AppProvider';
import { colors } from '../styles/theme';
import { toDraft, validateDraft } from '../utils/contractForm';
import type { Contract, ContractDraft } from '../types/contract';
import { MissingContract } from './ContractDetailsScreen';

export function ContractFormScreen({ creating = false }: { creating?: boolean }) {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { contracts } = useApp();
  const contract = contracts.find(item => item.id === id);
  if (!creating && !contract) return <MissingContract />;
  return <ContractForm key={creating ? 'new' : id} contract={creating ? undefined : contract} />;
}

function Section({ number, title, subtitle, children }: { number: string; title: string; subtitle: string; children: ReactNode }) {
  const { width } = useWindowDimensions();
  return <View style={[s.section, width <= 760 && { paddingHorizontal: 18, paddingTop: 22 }]}><View style={s.sectionHeader}><View style={s.number}><Text style={s.numberText}>{number}</Text></View><View style={s.flex}><Text accessibilityRole="header" style={s.sectionTitle}>{title}</Text><Text style={s.sectionSubtitle}>{subtitle}</Text></View></View>{children}</View>;
}

function ContractForm({ contract }: { contract?: Contract }) {
  const { width } = useWindowDimensions();
  const mobile = width <= 760;
  const { contracts, save } = useApp();
  const [draft, setDraft] = useState(() => toDraft(contract));
  const [errors, setErrors] = useState<Partial<Record<keyof ContractDraft, string>>>({});
  const [formError, setFormError] = useState('');
  const set = (field: keyof ContractDraft, value: string) => { setDraft(previous => ({ ...previous, [field]: value })); setErrors(previous => ({ ...previous, [field]: undefined })); };
  const back = () => router.replace(`/contracts/${contract?.id ?? contracts[0].id}`);
  function submit() {
    const issues = validateDraft(draft, contracts, contract?.id);
    setErrors(issues);
    if (Object.keys(issues).length) { setFormError('Revise os campos indicados antes de salvar.'); return; }
    const savedId = save(draft, contract?.id);
    router.replace(`/contracts/${savedId}`);
  }
  const column = [s.flex, mobile && s.fullWidth];
  const dateColumn = [column, width <= 1050 && !mobile && { flexBasis: '45%' as const, flexGrow: 0, flexShrink: 0 }];
  return <>
    <View style={s.heading}><Text style={s.breadcrumb}>Contratos <Text style={s.slash}> / </Text> {contract ? 'Editar contrato' : 'Novo contrato'}</Text><Text accessibilityRole="header" style={[s.title, mobile && { fontSize: 25 }]}>{contract ? 'Editar contrato' : 'Cadastrar contrato'}</Text><Text style={s.subtitle}>{contract ? 'Atualize os dados cadastrais e as informações de vigência.' : 'Preencha os dados para incluir um novo contrato no sistema.'}</Text></View>
    <Section number="01" title="Informações gerais" subtitle="Dados de identificação e classificação do contrato.">
      <View style={[s.row, mobile && s.column]}>
        <FormField label="Empresa contratada" value={draft.title} onChangeText={value => set('title', value)} error={errors.title} placeholder="Razão social da empresa" containerStyle={column} maxLength={150} />
        <FormField label="Número do processo" value={draft.process} onChangeText={value => set('process', value)} error={errors.process} placeholder="00000.000000/0000-00" containerStyle={column} maxLength={20} autoCapitalize="none" />
      </View>
      <View style={[s.row, mobile && s.column]}>
        <SelectField label="Modalidade" value={draft.modality} onChange={value => set('modality', value)} options={modalities} placeholder="Selecione a modalidade" error={errors.modality} containerStyle={column} />
        <SelectField label="Situação" value={draft.status} onChange={value => set('status', value)} options={contractStatuses} placeholder="Selecione a situação" error={errors.status} containerStyle={column} />
      </View>
      <FormField label="Descrição do objeto" value={draft.description} onChangeText={value => set('description', value)} error={errors.description} placeholder="Descreva o objeto do contrato" multiline maxLength={4000} hint="Descreva de forma clara o objeto do contrato." />
    </Section>
    <Section number="02" title="Vigência e valores" subtitle="Período contratual, valor global e unidade responsável.">
      <View style={[s.row, width <= 1050 && s.wrap, mobile && s.column]}>
        <FormField label="Data de início" value={draft.startsAt} onChangeText={value => set('startsAt', value)} error={errors.startsAt} placeholder="DD/MM/AAAA" maxLength={10} trailingIcon="calendar" containerStyle={dateColumn} keyboardType="numbers-and-punctuation" />
        <FormField label="Data de encerramento" value={draft.endsAt} onChangeText={value => set('endsAt', value)} error={errors.endsAt} placeholder="DD/MM/AAAA" maxLength={10} trailingIcon="calendar" containerStyle={dateColumn} keyboardType="numbers-and-punctuation" />
        <FormField label="Valor global (R$)" value={draft.amount} onChangeText={value => set('amount', value)} error={errors.amount} placeholder="0,00" containerStyle={dateColumn} keyboardType="decimal-pad" maxLength={18} />
      </View>
      <SelectField label="Unidade responsável" value={draft.unit} onChange={value => set('unit', value)} options={units} placeholder="Selecione a unidade" error={errors.unit} containerStyle={width > 1050 ? { width: '66%' } : undefined} />
    </Section>
    {!!formError && <Text accessibilityRole="alert" style={s.error}>{formError}</Text>}
    <View style={[s.actions, mobile && s.mobileActions]}><Button label="Cancelar" onPress={back} variant="ghost" /><Button label={contract ? 'Atualizar contrato' : 'Cadastrar contrato'} icon={contract ? undefined : 'plus'} onPress={submit} /></View>
  </>;
}
const s = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 }, fullWidth: { flexBasis: 'auto', flexGrow: 0, flexShrink: 0, width: '100%' }, heading: { marginBottom: 28 }, breadcrumb: { color: colors.blue, fontSize: 11, fontWeight: '600', marginBottom: 9 }, slash: { color: colors.muted }, title: { color: colors.primary, fontSize: 32, lineHeight: 39, fontWeight: '700', letterSpacing: -1.1 }, subtitle: { color: colors.muted, fontSize: 13, lineHeight: 20, marginTop: 8 },
  section: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingVertical: 25, paddingHorizontal: 25, marginBottom: 15, gap: 21, boxShadow: '0px 1px 2px rgba(10,29,59,0.04), 0px 4px 12px rgba(10,29,59,0.03)' }, sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingBottom: 19, marginBottom: 4, borderBottomWidth: 1, borderColor: colors.border }, number: { width: 30, height: 30, borderRadius: 8, backgroundColor: colors.iconBackground, alignItems: 'center', justifyContent: 'center' }, numberText: { fontSize: 11, color: colors.blue, fontWeight: '700' }, sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.primary }, sectionSubtitle: { marginTop: 4, fontSize: 11, color: colors.muted, lineHeight: 16 },
  row: { flexDirection: 'row', gap: 22 }, column: { flexDirection: 'column', gap: 21 }, wrap: { flexWrap: 'wrap' }, actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 9 }, mobileActions: { flexDirection: 'column-reverse' }, error: { fontSize: 13, color: '#A43F45', marginVertical: 10 },
});
