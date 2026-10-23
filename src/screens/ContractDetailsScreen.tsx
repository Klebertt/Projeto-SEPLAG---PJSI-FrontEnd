import { useState, type ReactNode } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AppText as Text } from '../components/AppText';
import { Button } from '../components/Button';
import { Icon, type IconName } from '../components/Icon';
import { StatusBadge } from '../components/StatusBadge';
import { HistoryDrawer } from '../components/HistoryDrawer';
import { useApp } from '../state/AppProvider';
import { colors } from '../styles/theme';
import { formatDate, formatCurrency } from '../utils/contracts';

export function MissingContract() {
  const { contracts } = useApp();
  return <View style={s.missing}><Text style={s.title}>Contrato não encontrado</Text><Text style={s.subtitle}>Selecione um contrato na lista para continuar.</Text><Button label="Voltar aos contratos" variant="ghost" onPress={() => router.replace(`/contracts/${contracts[0].id}`)} /></View>;
}

function Card({ label, children, icon, prominent, style }: { label: string; children: ReactNode; icon?: IconName; prominent?: boolean; style?: object }) {
  const content = <><View style={s.labelRow}>{icon && <Icon name={icon} size={18} color={colors.accent} />}<Text style={s.label}>{label.toUpperCase()}</Text></View><View style={s.cardContent}>{children}</View></>;
  return prominent ? <LinearGradient colors={['#FFFFFF', '#F5F9FF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[s.card, s.prominent, style]}>{content}</LinearGradient> : <View style={[s.card, style]}>{content}</View>;
}

export function ContractDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { contracts } = useApp();
  const { width } = useWindowDimensions();
  const [history, setHistory] = useState(false);
  const [gridWidth, setGridWidth] = useState(0);
  const contract = contracts.find(item => item.id === id);
  if (!contract) return <MissingContract />;
  const columns = width > 1050 ? 3 : width > 760 ? 2 : 1;
  const cell = { width: gridWidth ? Math.floor((gridWidth - (columns - 1) * 16) / columns) : columns === 3 ? '32%' as const : columns === 2 ? '48%' as const : '100%' as const };
  return <>
    <View style={s.heading}>
      <View style={s.meta}><StatusBadge status={contract.status} /><Text style={s.updated}>Atualizado {contract.updatedAt ? `às ${contract.updatedAt}` : 'hoje às 09:42'}</Text></View>
      <Text accessibilityRole="header" style={[s.title, width <= 760 && { fontSize: 25, lineHeight: 31 }]}>{contract.title}</Text>
      <Text style={s.subtitle}>Visão geral e informações cadastrais do contrato.</Text>
    </View>
    <View style={s.grid} onLayout={event => setGridWidth(event.nativeEvent.layout.width)}>
      <Card label="Processo" style={cell}><Text selectable style={s.value}>{contract.process}</Text></Card>
      <Card label="Modalidade" style={cell}><Text style={s.value}>{contract.modality}</Text></Card>
      <Card label={contract.daysRemaining < 0 ? 'Dias desde o vencimento' : 'Dias restantes'} prominent style={cell}><View style={s.days}><Text style={s.dayNumber}>{Math.abs(contract.daysRemaining)}</Text><Text style={s.daySuffix}>dias</Text></View></Card>
      <Card label="Descrição" style={s.descriptionCard}><Text style={s.description}>{contract.description}</Text></Card>
      <Card icon="calendar" label="Data de início" style={cell}><Text style={s.value}>{formatDate(contract.startsAt)}</Text></Card>
      <Card icon="calendar" label="Data de encerramento" style={cell}><Text style={s.value}>{formatDate(contract.endsAt)}</Text></Card>
      <Card label="Valor global" style={cell}><Text style={s.amount}>{formatCurrency(contract.amount)}</Text></Card>
      <Card label="Unidade responsável" style={[cell, columns > 1 && { flexGrow: 0 }]}><Text style={s.value}>{contract.unit}</Text></Card>
    </View>
    <View style={[s.actions, width <= 760 && s.mobileActions]}>
      <Button label="Ver histórico de alterações" icon="history" variant="ghost" onPress={() => setHistory(true)} />
      <Button label="Editar contrato" icon="edit" onPress={() => router.push(`/contracts/${contract.id}/edit`)} />
    </View>
    <HistoryDrawer contract={contract} open={history} onClose={() => setHistory(false)} />
  </>;
}
const s = StyleSheet.create({
  heading: { marginBottom: 28 }, meta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 10 }, updated: { color: colors.muted, fontSize: 11 },
  title: { fontSize: 32, lineHeight: 39, letterSpacing: -1.1, fontWeight: '700', color: colors.primary }, subtitle: { fontSize: 13, color: colors.muted, lineHeight: 20, marginTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 }, card: { minHeight: 128, paddingVertical: 20, paddingHorizontal: 22, borderWidth: 1, borderColor: colors.border, borderRadius: 8, backgroundColor: colors.surface, boxShadow: '0px 1px 2px rgba(10,29,59,0.04), 0px 4px 12px rgba(10,29,59,0.03)', minWidth: 0 }, prominent: { borderColor: '#CDDFFF' }, labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 }, label: { color: colors.muted, fontSize: 11, letterSpacing: 0.4, fontWeight: '600', flexShrink: 1 }, cardContent: { marginTop: 20 }, value: { fontSize: 15, lineHeight: 22, fontWeight: '600' }, days: { flexDirection: 'row', alignItems: 'baseline', gap: 6 }, dayNumber: { fontSize: 26, lineHeight: 32, fontWeight: '700', letterSpacing: -1, color: colors.blue }, daySuffix: { fontSize: 11, color: colors.muted }, descriptionCard: { width: '100%', minHeight: 145 }, description: { color: colors.secondary, fontSize: 14, lineHeight: 24, maxWidth: 780, marginTop: -6 }, amount: { color: colors.navy, fontSize: 19, fontWeight: '600', letterSpacing: -0.4 }, actions: { marginTop: 24, flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }, mobileActions: { flexDirection: 'column-reverse', alignItems: 'stretch' }, missing: { paddingVertical: 50, gap: 18 },
});
