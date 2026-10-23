import { StyleSheet, Text, type TextProps } from 'react-native';
import { colors, fonts } from '../styles/theme';

export function AppText({ style, ...props }: TextProps) {
  const weight = String(StyleSheet.flatten(style)?.fontWeight ?? '400');
  const fontFamily = ['bold', '700', '800', '900'].includes(weight) ? fonts.bold : weight === '600' ? fonts.semibold : weight === '500' ? fonts.medium : fonts.regular;
  return <Text {...props} style={[{ color: colors.text, fontSize: 14 }, style, { fontFamily, fontWeight: 'normal' }]} />;
}
