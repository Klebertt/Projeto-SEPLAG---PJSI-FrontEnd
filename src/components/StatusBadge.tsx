import { StyleSheet, View } from 'react-native';
import { AppText as Text } from './AppText';
import type { ContractStatus } from '../types/contract';
const palette = {
  Vigente: { background: '#E7F6EF', color: '#207354' },
  'A renovar': { background: '#FFF3D3', color: '#9A6400' },
  'A vencer': { background: '#FFF3D3', color: '#9A6400' },
  Vencido: { background: '#FBEAEC', color: '#A43F45' },
  Encerrado: { background: '#EDF0F3', color: '#5F6B7A' },
};
export function StatusBadge({ status }: { status: ContractStatus }) {
  const tone = palette[status];
  return <View style={[s.badge, { backgroundColor: tone.background }]}><View style={[s.dot, { backgroundColor: tone.color }]} /><Text style={[s.label, { color: tone.color }]}>{status}</Text></View>;
}
const s = StyleSheet.create({ badge: { minHeight: 23, flexDirection: 'row', gap: 5, borderRadius: 20, alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 8 }, dot: { width: 5, height: 5, borderRadius: 3 }, label: { fontSize: 10, fontWeight: '700' } });
