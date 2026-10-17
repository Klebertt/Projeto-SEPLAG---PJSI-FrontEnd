import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '../styles/theme';
import { Icon, type IconName } from './Icon';

export function ContractCard({ icon, label, children, style }: { icon: IconName; label: string; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.icon}><Icon name={icon} /></View>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 18, borderRadius: 15, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, minWidth: 0 },
  icon: { width: 33, height: 33, backgroundColor: colors.iconBackground, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  label: { fontSize: 10, letterSpacing: 1.1, color: colors.muted, marginBottom: 10 },
});
