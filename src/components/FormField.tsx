import { useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps, type StyleProp, type ViewStyle } from 'react-native';
import { AppText as Text } from './AppText';
import { colors, fonts } from '../styles/theme';
import { Icon, type IconName } from './Icon';
import { HoverPressable as Pressable } from './HoverPressable';
import { Dialog } from './Dialog';

type Props = TextInputProps & { label: string; error?: string; hint?: string; containerStyle?: StyleProp<ViewStyle>; trailingIcon?: IconName; onIconPress?: () => void; iconLabel?: string };
export function FormField({ label, error, hint, containerStyle, trailingIcon, onIconPress, iconLabel, style, ...props }: Props) {
  const [focused, setFocused] = useState(false);
  return <View style={[s.field, containerStyle]}>
    <Text style={s.label}>{label}</Text>
    <View style={[s.control, props.multiline && s.multiline, focused && s.focused, !!error && s.invalid]}>
      <TextInput {...props} accessibilityLabel={label} placeholderTextColor="#A0A9B8" onFocus={(event) => { setFocused(true); props.onFocus?.(event); }} onBlur={(event) => { setFocused(false); props.onBlur?.(event); }} style={[s.input, props.multiline && s.multilineInput, style]} />
      {trailingIcon && (onIconPress ? <Pressable accessibilityRole="button" accessibilityLabel={iconLabel} onPress={onIconPress} style={s.icon}><Icon name={trailingIcon} size={18} color={colors.muted} /></Pressable> : <View style={s.icon}><Icon name={trailingIcon} size={18} color={colors.muted} /></View>)}
    </View>
    {!!hint && <Text style={s.hint}>{hint}</Text>}
    {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
  </View>;
}

export function SelectField({ label, value, options, placeholder = 'Selecione', onChange, error, containerStyle }: { label: string; value: string; options: readonly string[]; placeholder?: string; onChange: (value: string) => void; error?: string; containerStyle?: StyleProp<ViewStyle> }) {
  const [open, setOpen] = useState(false);
  return <View style={[s.field, containerStyle]}>
    <Text style={s.label}>{label}</Text>
    <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityValue={{ text: value || placeholder }} accessibilityState={{ expanded: open }} onPress={() => setOpen(true)} style={({ hovered, pressed }) => [s.control, { paddingLeft: 14 }, (hovered || pressed) && s.focused, !!error && s.invalid]}>
      <Text numberOfLines={1} style={[s.selectedText, !value && { color: '#A0A9B8' }]}>{value || placeholder}</Text><View style={s.icon}><Icon name="chevron" size={18} color={colors.muted} /></View>
    </Pressable>
    {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
    <Dialog visible={open} title={label} onClose={() => setOpen(false)}>
      {options.map(option => <Pressable key={option} accessibilityRole="radio" accessibilityState={{ checked: option === value }} accessibilityLabel={option} onPress={() => { onChange(option); setOpen(false); }} style={({ hovered }) => [s.option, (option === value || hovered) && { backgroundColor: colors.softBlue }]}><Text style={s.optionText}>{option}</Text>{option === value && <Icon name="check" size={17} />}</Pressable>)}
    </Dialog>
  </View>;
}
const s = StyleSheet.create({
  field: { gap: 8, minWidth: 0 }, label: { color: '#344057', fontSize: 13, fontWeight: '600' },
  control: { minHeight: 46, borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 8, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface },
  input: { flex: 1, minWidth: 0, height: 44, paddingHorizontal: 14, paddingVertical: 10, fontFamily: fonts.regular, fontSize: 14, color: colors.text, outlineWidth: 0 },
  multiline: { minHeight: 112, alignItems: 'flex-start' }, multilineInput: { minHeight: 110, height: undefined, textAlignVertical: 'top', lineHeight: 22 },
  focused: { borderColor: colors.accent, boxShadow: '0px 0px 0px 3px rgba(36,104,197,0.08)' }, invalid: { borderColor: '#B3444C' },
  icon: { width: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }, selectedText: { flex: 1, fontSize: 14 },
  hint: { color: colors.muted, fontSize: 12 }, error: { color: '#A43F45', fontSize: 12, lineHeight: 18 },
  option: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: 8, minHeight: 46, alignItems: 'center', justifyContent: 'space-between' }, optionText: { flex: 1 },
});
