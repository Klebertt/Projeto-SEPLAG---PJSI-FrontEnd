import { Link } from 'expo-router';
import { View } from 'react-native';
import { AppText as Text } from '../components/AppText';
export default function NotFound() { return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 }}><Text accessibilityRole="header" style={{ fontSize: 24 }}>Página não encontrada</Text><Link href="/">Voltar ao início</Link></View>; }
