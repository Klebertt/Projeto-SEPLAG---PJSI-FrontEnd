import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AppText as Text } from '../components/AppText';
import { Button } from '../components/Button';
import { HistoryTimeline } from '../components/HistoryTimeline';
import { useApp } from '../state/AppProvider';
import { colors } from '../styles/theme';
import { MissingContract } from './ContractDetailsScreen';

export function HistoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const { contracts, audit } = useApp();
  const contract = contracts.find(item => item.id === id);
  if (!contract) return <MissingContract />;
  const records = audit.filter(item => item.contractId === id);
  return <>
    <View style={[s.heading, width <= 760 && { flexDirection: 'column', alignItems: 'flex-start' }]}><View style={s.flex}><Button label="Voltar ao contrato" icon="arrow" variant="ghost" style={s.back} onPress={() => router.replace(`/contracts/${contract.id}`)} /><Text accessibilityRole="header" style={s.title}>Histórico de Alterações</Text><Text style={s.subtitle}>Registro completo de atividades do contrato de {contract.title}.</Text></View><View style={s.total}><Text style={s.totalNumber}>{records.length}</Text><Text style={s.totalLabel}>registros</Text></View></View>
    <View style={[s.card, width <= 760 && { paddingHorizontal: 16 }]}><View style={[s.header, width <= 760 && { flexDirection: 'column', alignItems: 'flex-start' }]}><View><Text style={s.eyebrow}>LINHA DO TEMPO</Text><Text accessibilityRole="header" style={s.sectionTitle}>Atividades do contrato</Text></View><Text style={s.process}>Processo {contract.process}</Text></View><View style={s.timeline}><HistoryTimeline records={records} full /></View></View>
  </>;
}
const s = StyleSheet.create({ flex: { flex: 1 }, heading: { flexDirection: 'row', alignItems: 'flex-end', gap: 20, marginBottom: 28 }, back: { alignSelf: 'flex-start', paddingHorizontal: 0, marginBottom: 4 }, title: { fontSize: 30, lineHeight: 38, fontWeight: '700', color: colors.primary, letterSpacing: -1 }, subtitle: { marginTop: 8, fontSize: 13, color: colors.muted, lineHeight: 20 }, total: { flexDirection: 'row', alignItems: 'baseline', gap: 6, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingVertical: 12, paddingHorizontal: 16 }, totalNumber: { fontSize: 22, fontWeight: '700', color: colors.navy }, totalLabel: { fontSize: 10, color: colors.muted }, card: { paddingTop: 26, paddingHorizontal: 30, paddingBottom: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 8, boxShadow: '0px 1px 2px rgba(10,29,59,0.04)' }, header: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, borderBottomWidth: 1, borderColor: colors.border, paddingBottom: 20 }, eyebrow: { fontSize: 11, fontWeight: '700', color: colors.accent, letterSpacing: 1.2, marginBottom: 5 }, sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.primary }, process: { fontSize: 11, color: colors.muted }, timeline: { maxWidth: 760, width: '100%' } });
