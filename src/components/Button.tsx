import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { HoverPressable } from './HoverPressable';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';
import { colors } from '../styles/theme';

export function Button({ label, onPress, icon, variant = 'primary', disabled, style }: { label: string; onPress: () => void; icon?: IconName; variant?: 'primary' | 'ghost' | 'secondary'; disabled?: boolean; style?: StyleProp<ViewStyle> }) {
  const primary = variant === 'primary';
  return <HoverPressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled: !!disabled }} disabled={disabled} onPress={onPress} style={({ hovered, pressed }) => [s.button, primary ? s.primary : variant === 'secondary' ? s.secondary : undefined, (hovered || pressed) && (primary ? s.primaryHover : s.ghostHover), disabled && { opacity: 0.5 }, style]}>
    {icon && <Icon name={icon} size={18} color={primary ? colors.surface : colors.blue} />}
    <AppText style={[s.label, { color: primary ? colors.surface : colors.blue }]}>{label}</AppText>
  </HoverPressable>;
}
const s = StyleSheet.create({
  button: { minHeight: 44, borderRadius: 8, flexDirection: 'row', gap: 9, paddingHorizontal: 19, paddingVertical: 11, justifyContent: 'center', alignItems: 'center' },
  label: { fontSize: 14, fontWeight: '600' },
  primary: { backgroundColor: colors.accent, boxShadow: '0px 4px 10px rgba(29,87,167,0.18)' },
  primaryHover: { backgroundColor: colors.blue }, secondary: { borderWidth: 1, borderColor: colors.inputBorder, backgroundColor: colors.surface },
  ghostHover: { backgroundColor: colors.softBlue },
});
