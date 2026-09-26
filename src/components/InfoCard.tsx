import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/theme';

type Props = { title: string; description: string };

export function InfoCard({ title, description }: Props) {
  return <View style={styles.card}><Text style={styles.title}>{title}</Text><Text style={styles.description}>{description}</Text></View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, padding: 20, borderRadius: 12, borderWidth: 1, borderColor: colors.border, gap: 8 },
  title: { color: colors.text, fontSize: 18, fontWeight: '600' },
  description: { color: colors.muted, fontSize: 16, lineHeight: 24 },
});
