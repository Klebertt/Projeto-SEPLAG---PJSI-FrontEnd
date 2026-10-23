import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/theme';

export function SidePanel({ visible, title, side = 'right', onClose, children }: { visible: boolean; title: string; side?: 'left' | 'right'; onClose: () => void; children: ReactNode }) {
  return <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={[s.overlay, { alignItems: side === 'left' ? 'flex-start' : 'flex-end' }]}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Fechar ${title}`} onPress={onClose} style={StyleSheet.absoluteFill} />
      <SafeAreaView role="dialog" aria-modal accessibilityLabel={title} accessibilityViewIsModal style={[s.panel, { maxWidth: side === 'left' ? 344 : 470 }]}>{children}</SafeAreaView>
    </View>
  </Modal>;
}
const s = StyleSheet.create({ overlay: { flex: 1, backgroundColor: 'rgba(6,20,43,0.43)' }, panel: { flex: 1, width: '100%', backgroundColor: colors.surface, boxShadow: '-18px 0px 55px rgba(4,17,39,0.14)' } });
