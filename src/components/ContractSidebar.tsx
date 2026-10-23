import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { router, useGlobalSearchParams } from 'expo-router';
import { AppText as Text } from './AppText';
import { HoverPressable as Pressable } from './HoverPressable';
import { Icon } from './Icon';
import { StatusBadge } from './StatusBadge';
import { contractStatuses } from '../data/contracts';
import { useApp } from '../state/AppProvider';
import { colors, fonts } from '../styles/theme';
import { normalizeSearch } from '../utils/contracts';

export function ContractSidebar({ onClose }: { onClose?: () => void }) {
  const { contracts } = useApp();
  const { id } = useGlobalSearchParams<{ id: string }>();
  const [query, setQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState(contractStatuses);
  const filtered = contracts.filter(item => selectedStatuses.includes(item.status) && normalizeSearch(`${item.title} ${item.process}`).includes(normalizeSearch(query)));
  return <View style={s.root}>
    <View style={s.header}><View><Text style={s.eyebrow}>GESTÃO</Text><Text accessibilityRole="header" style={s.title}>Contratos</Text></View><View style={s.count}><Text style={s.countText}>{contracts.length}</Text></View>{onClose && <Pressable accessibilityRole="button" accessibilityLabel="Fechar lista de contratos" onPress={onClose} style={s.close}><Icon name="close" color={colors.muted} /></Pressable>}</View>
    <View style={s.tools}>
      <View style={s.search}><Icon name="search" size={17} color={colors.muted} /><TextInput accessibilityLabel="Buscar na lista" placeholder="Buscar na lista..." placeholderTextColor="#9AA4B4" value={query} onChangeText={setQuery} style={s.input} />{!!query && <Pressable accessibilityRole="button" accessibilityLabel="Limpar busca" onPress={() => setQuery('')}><Icon name="close" size={14} color={colors.muted} /></Pressable>}</View>
      <Pressable accessibilityRole="button" accessibilityLabel="Filtrar contratos" accessibilityState={{ expanded: filtersOpen }} onPress={() => setFiltersOpen(!filtersOpen)} style={s.filter}><Icon name="filter" size={17} color={colors.blue} /><Text style={s.filterText}>Filtrar contratos</Text><View style={[s.chevron, filtersOpen && { transform: [{ rotate: '180deg' }] }]}><Icon name="chevron" size={15} color={colors.blue} /></View></Pressable>
      {filtersOpen && <View style={s.filterGrid}>{contractStatuses.map(status => { const selected = selectedStatuses.includes(status); return <Pressable key={status} accessibilityRole="checkbox" accessibilityLabel={status} accessibilityState={{ checked: selected }} onPress={() => setSelectedStatuses(items => selected ? items.filter(item => item !== status) : [...items, status])} style={[s.filterOption, selected && s.filterSelected]}><View style={[s.checkbox, selected && s.checked]}>{selected && <Icon name="check" size={12} color={colors.surface} />}</View><Text style={[s.filterLabel, selected && { color: colors.blue }]}>{status}</Text></Pressable>; })}</View>}
    </View>
    <ScrollView keyboardShouldPersistTaps="handled">
      {filtered.map(item => <Pressable accessibilityRole="button" accessibilityLabel={`${item.title}, ${item.status}, processo ${item.process}`} accessibilityState={{ selected: id === item.id }} key={item.id} onPress={() => { router.navigate(`/contracts/${item.id}`); onClose?.(); }} style={({ hovered, pressed }) => [s.item, id === item.id && s.selected, (hovered || pressed) && { backgroundColor: '#FAFBFD' }]}>
        {id === item.id && <View style={s.activeMark} />}
        <View style={s.top}><Text style={s.company}>{item.title}</Text><StatusBadge status={item.status} /></View>
        <Text style={s.process}>Processo {item.process}</Text><Text numberOfLines={2} style={s.description}>{item.description}</Text>
      </Pressable>)}
      {!filtered.length && <View style={s.empty}><Icon name="search" size={22} color={colors.muted} /><Text style={s.emptyText}>Nenhum contrato encontrado.</Text><Pressable accessibilityRole="button" onPress={() => { setQuery(''); setSelectedStatuses(contractStatuses); }} style={s.filter}><Text style={s.filterText}>Limpar filtros</Text></Pressable></View>}
    </ScrollView>
  </View>;
}
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface }, header: { paddingTop: 26, paddingHorizontal: 24, paddingBottom: 19, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }, eyebrow: { fontSize: 11, color: colors.accent, letterSpacing: 1.2, fontWeight: '700', marginBottom: 5 }, title: { fontSize: 21, fontWeight: '700', letterSpacing: -0.4, color: colors.primary }, count: { minWidth: 28, height: 28, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.iconBackground, marginLeft: 'auto' }, countText: { fontSize: 12, fontWeight: '700', color: colors.blue }, close: { padding: 7 },
  tools: { paddingHorizontal: 18, paddingBottom: 14, borderBottomWidth: 1, borderColor: colors.border }, search: { height: 40, paddingHorizontal: 12, borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 8 }, input: { flex: 1, minWidth: 0, fontSize: 13, fontFamily: fonts.regular, color: colors.text, outlineWidth: 0 },
  filter: { marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 7, minHeight: 25 }, filterText: { color: colors.blue, fontSize: 12, fontWeight: '600' }, chevron: { marginLeft: 'auto' }, filterGrid: { marginTop: 11, padding: 6, borderWidth: 1, borderColor: colors.border, borderRadius: 8, flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#FAFBFD', gap: 3 }, filterOption: { width: '48%', minHeight: 34, paddingHorizontal: 7, borderRadius: 6, flexDirection: 'row', alignItems: 'center', gap: 7 }, filterSelected: { backgroundColor: colors.surface, boxShadow: '0px 1px 3px rgba(10,29,59,0.08)' }, checkbox: { width: 16, height: 16, borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 4, alignItems: 'center', justifyContent: 'center' }, checked: { backgroundColor: colors.accent, borderColor: colors.accent }, filterLabel: { fontSize: 11, color: colors.secondary, fontWeight: '600' },
  item: { paddingHorizontal: 20, paddingVertical: 18, borderBottomWidth: 1, borderColor: colors.border }, selected: { backgroundColor: colors.softBlue }, activeMark: { position: 'absolute', top: 0, bottom: 0, left: 0, width: 3, backgroundColor: colors.accent }, top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }, company: { flex: 1, fontSize: 13, lineHeight: 18, fontWeight: '700' }, process: { marginTop: 7, fontSize: 10, color: colors.muted }, description: { marginTop: 8, fontSize: 11, lineHeight: 16, color: colors.secondary }, empty: { paddingVertical: 40, paddingHorizontal: 20, alignItems: 'center', gap: 12 }, emptyText: { color: colors.muted, fontSize: 12 },
});
