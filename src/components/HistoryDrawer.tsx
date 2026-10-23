import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { AppText as Text } from './AppText';
import { HoverPressable as Pressable } from './HoverPressable';
import { Icon } from './Icon';
import { Button } from './Button';
import { HistoryTimeline } from './HistoryTimeline';
import { SidePanel } from './SidePanel';
import { useApp } from '../state/AppProvider';
import { colors } from '../styles/theme';
import type { Contract } from '../types/contract';

export function HistoryDrawer({ contract, open, onClose }: { contract: Contract; open: boolean; onClose: () => void }) {
  const { audit } = useApp();
  const records = audit.filter(item => item.contractId === contract.id);
  return <SidePanel visible={open} title="Histórico de alterações" onClose={onClose}>
    <View style={s.header}><View style={s.flex}><Text style={s.eyebrow}>AUDITORIA DO CONTRATO</Text><Text accessibilityRole="header" style={s.title}>Histórico de Alterações</Text></View><Pressable accessibilityRole="button" accessibilityLabel="Fechar histórico" onPress={onClose} style={s.close}><Icon name="close" color={colors.secondary} /></Pressable></View>
    <ScrollView contentContainerStyle={s.content}>
      <View style={s.summary}><View style={s.summaryIcon}><Icon name="history" size={20} color={colors.blue} /></View><View style={s.flex}><Text style={s.company}>{contract.title}</Text><Text style={s.count}>{records.length} {records.length === 1 ? 'alteração registrada' : 'alterações registradas'}</Text></View></View>
      <HistoryTimeline records={records} />
      <Button label="Expandir e ver todos os registros" icon="history" variant="ghost" style={s.expand} onPress={() => { onClose(); router.push(`/contracts/${contract.id}/history`); }} />
      <View style={s.footer}><Icon name="user" size={18} color={colors.muted} /><Text style={s.footerText}>O histórico completo é mantido para fins de auditoria e não pode ser editado.</Text></View>
    </ScrollView>
  </SidePanel>;
}
const s = StyleSheet.create({
  flex: { flex: 1 }, header: { minHeight: 104, paddingHorizontal: 28, flexDirection: 'row', gap: 15, alignItems: 'center', borderBottomWidth: 1, borderColor: colors.border }, eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, color: colors.accent, marginBottom: 5 }, title: { fontSize: 21, fontWeight: '700', color: colors.primary, letterSpacing: -0.5 },
  close: { width: 40, height: 40, borderRadius: 8, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }, content: { paddingHorizontal: 28, flexGrow: 1 },
  summary: { marginTop: 24, padding: 15, borderWidth: 1, borderColor: '#DBE8FB', borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.softBlue }, summaryIcon: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: colors.iconBackground }, company: { fontSize: 13, fontWeight: '700', color: colors.primary }, count: { fontSize: 11, color: colors.muted, marginTop: 3 }, expand: { borderWidth: 1, borderColor: '#DBE8FB', backgroundColor: colors.softBlue, marginBottom: 18 }, footer: { marginTop: 'auto', paddingTop: 20, paddingBottom: 25, flexDirection: 'row', gap: 10, borderTopWidth: 1, borderColor: colors.border }, footerText: { flex: 1, color: colors.muted, fontSize: 10, lineHeight: 15 },
});
