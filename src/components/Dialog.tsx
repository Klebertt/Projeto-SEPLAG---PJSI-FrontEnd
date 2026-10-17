import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/theme';
import { Icon } from './Icon';

export function Dialog({ visible, title, onClose, children }: { visible: boolean; title: string; onClose: () => void; children: ReactNode }) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
        <Pressable accessibilityLabel="Fechar janela" onPress={onClose} style={StyleSheet.absoluteFill} />
        <View style={styles.dialog} accessibilityViewIsModal role="dialog" aria-modal accessibilityLabel={title}>
          <View style={styles.header}>
            <Text accessibilityRole="header" style={styles.title}>{title}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Fechar" onPress={onClose} style={styles.close}><Icon name="close" color={colors.muted} /></Pressable>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>{children}</ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(8,28,53,0.4)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  dialog: { width: '100%', maxWidth: 560, maxHeight: '90%', borderRadius: 18, backgroundColor: colors.surface, overflow: 'hidden', boxShadow: '0px 20px 80px rgba(8,28,53,0.15)' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 22, borderBottomWidth: 1, borderColor: colors.border, gap: 12 },
  title: { fontSize: 20, fontWeight: '700', color: colors.text, flex: 1 },
  close: { padding: 10 },
  content: { padding: 22, gap: 18 },
});
