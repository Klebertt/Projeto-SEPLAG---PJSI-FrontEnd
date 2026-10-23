import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { DMSans_400Regular } from '@expo-google-fonts/dm-sans/400Regular';
import { DMSans_500Medium } from '@expo-google-fonts/dm-sans/500Medium';
import { DMSans_600SemiBold } from '@expo-google-fonts/dm-sans/600SemiBold';
import { DMSans_700Bold } from '@expo-google-fonts/dm-sans/700Bold';
import { AppProvider, useApp } from '../state/AppProvider';
import { colors } from '../styles/theme';

function Routes() {
  const { session } = useApp();
  return <Stack screenOptions={{ headerShown: false, animation: 'none', contentStyle: { backgroundColor: colors.background } }}>
    <Stack.Screen name="index" />
    <Stack.Protected guard={!!session}><Stack.Screen name="(workspace)" /></Stack.Protected>
  </Stack>;
}
export default function RootLayout() {
  const [loaded, error] = useFonts({ DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSans_700Bold });
  if (!loaded && !error) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary }}><ActivityIndicator color={colors.surface} accessibilityLabel="Carregando o sistema" /></View>;
  return <SafeAreaProvider><AppProvider><StatusBar style="light" /><Routes /></AppProvider></SafeAreaProvider>;
}
