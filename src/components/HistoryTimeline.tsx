import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText as Text } from './AppText';
import { HoverPressable as Pressable } from './HoverPressable';
import { Icon } from './Icon';
import { colors } from '../styles/theme';
import type { AuditRecord } from '../types/contract';

const tones = { blue: ['#DCECFF', '#175DA9'], indigo: ['#EBE8FF', '#5747A2'], green: ['#E7F6EF', '#207354'], gray: ['#EDF0F3', '#5F6B7A'] };
export function HistoryTimeline({ records, full = false }: { records: AuditRecord[]; full?: boolean }) {
  const [expanded, setExpanded] = useState<string[]>([]);
  if (!records.length) return <View style={s.empty}><Icon name="history" size={28} color={colors.muted} /><Text style={s.emptyText}>Nenhuma alteração registrada para este contrato.</Text></View>;
  return <View style={s.timeline}>{records.map((record, index) => {
    const open = full || expanded.includes(record.id);
    return <View key={record.id} style={[s.item, full && { paddingLeft: 62 }]}>
      {index < records.length - 1 && <View style={[s.line, full && { left: 20 }]} />}
      <View style={[s.avatar, full && { width: 40, height: 40 }, { backgroundColor: tones[record.tone][0] }]}><Text style={[s.initials, { color: tones[record.tone][1] }]}>{record.initials}</Text></View>
      <Text style={s.action}><Text style={s.name}>{record.name}</Text> {record.action}</Text>
      <View style={s.meta}><Text style={s.time}>{record.date}</Text>{!full && <Pressable accessibilityRole="button" accessibilityLabel={`${open ? 'Ocultar' : 'Ver'} detalhes de ${record.field}`} accessibilityState={{ expanded: open }} onPress={() => setExpanded(items => open ? items.filter(id => id !== record.id) : [...items, record.id])} style={s.expand}><Text style={s.expandText}>{open ? 'Ocultar detalhes' : 'Ver detalhes'}</Text><View style={open && { transform: [{ rotate: '180deg' }] }}><Icon name="chevron" size={14} color={colors.blue} /></View></Pressable>}</View>
      {open && <View style={s.detail}>
        <Text style={s.detailText}>{record.detail}</Text>
        {[['Campo alterado', record.field], ['Valor anterior', record.previousValue], ['Novo valor', record.currentValue]].map(([label, value]) => <View key={label} style={s.detailRow}><Text style={s.detailLabel}>{label}</Text><Text selectable style={s.detailValue}>{value}</Text></View>)}
      </View>}
    </View>;
  })}</View>;
}
const s = StyleSheet.create({
  timeline: { paddingTop: 29, paddingBottom: 10 }, item: { position: 'relative', paddingLeft: 53, paddingBottom: 31 },
  line: { position: 'absolute', top: 37, bottom: 0, left: 17, width: 1, backgroundColor: colors.border },
  avatar: { position: 'absolute', left: 0, top: 0, width: 35, height: 35, borderRadius: 20, borderWidth: 3, borderColor: colors.surface, alignItems: 'center', justifyContent: 'center', boxShadow: '0px 0px 0px 1px #E7EAF0' },
  initials: { fontSize: 10, fontWeight: '700' }, name: { fontSize: 12, fontWeight: '600' }, action: { fontSize: 12, color: colors.secondary, lineHeight: 18 },
  meta: { marginTop: 7, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }, time: { fontSize: 10, color: colors.muted },
  expand: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 5 }, expandText: { color: colors.blue, fontSize: 10, fontWeight: '600' },
  detail: { marginTop: 13, padding: 13, borderWidth: 1, borderColor: '#DCE6F4', borderRadius: 8, backgroundColor: '#F8FAFC', gap: 10 },
  detailText: { fontSize: 11, lineHeight: 16, color: colors.secondary, marginBottom: 2 }, detailRow: { flexDirection: 'row', gap: 9 }, detailLabel: { width: 92, color: colors.muted, fontSize: 11, lineHeight: 16 }, detailValue: { flex: 1, fontSize: 11, lineHeight: 16, fontWeight: '600' },
  empty: { paddingVertical: 38, alignItems: 'center', gap: 16 }, emptyText: { color: colors.muted, textAlign: 'center', fontSize: 13 },
});
