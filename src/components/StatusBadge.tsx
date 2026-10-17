import { StyleSheet, Text, View } from 'react-native';
import type { ContractStatus } from '../types/contract';

const palette = {
  Vigente: { background: '#ECFCF5', border: '#B6EEDA', color: '#008766' },
  'A vencer': { background: '#FFFAED', border: '#FFE2A6', color: '#B85E00' },
  Vencido: { background: '#FFF1F4', border: '#FFC5D3', color: '#D90646' },
};

export function StatusBadge({ status }: { status: ContractStatus }) {
  const tone = palette[status];
  return (
    <View style={[styles.badge, { backgroundColor: tone.background, borderColor: tone.border }]}>
      <View style={[styles.dot, { backgroundColor: tone.color }]} />
      <Text style={[styles.label, { color: tone.color }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 5, borderWidth: 1, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  label: { fontSize: 10, fontWeight: '500' },
});
