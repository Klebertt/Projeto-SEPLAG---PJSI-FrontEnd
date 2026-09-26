import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { InfoCard } from '../components/InfoCard';
import { colors } from '../styles/theme';

export function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.organization}>SEPLAG Alagoas</Text>
        <Text accessibilityRole="header" style={styles.title}>Gestão de Contratos</Text>
      </View>
      <ScrollView style={styles.body} contentContainerStyle={styles.content}>
        <InfoCard title="Bem-vindo ao SGC" description="Um espaço para acompanhar os contratos e suas informações." />
        <InfoCard title="Aplicativo em desenvolvimento" description="As funcionalidades de consulta e acompanhamento serão disponibilizadas nas próximas etapas." />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primary },
  header: { padding: 24, gap: 8 },
  organization: { color: '#CBD5E1', fontSize: 14 },
  title: { color: colors.surface, fontSize: 26, fontWeight: '700' },
  body: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 16, width: '100%', maxWidth: 760, alignSelf: 'center' },
});
