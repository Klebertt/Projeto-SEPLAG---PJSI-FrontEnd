import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import Svg, { Defs, Pattern, Path, Rect } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText as Text } from '../components/AppText';
import { Button } from '../components/Button';
import { FormField, SelectField } from '../components/FormField';
import { sectors } from '../data/contracts';
import { useApp } from '../state/AppProvider';
import { colors } from '../styles/theme';
import { validateLogin } from '../utils/contractForm';

export function LoginScreen() {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sector, setSector] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  function submit() {
    const message = validateLogin(email, password, sector);
    if (message) { setError(message); return; }
    setPassword('');
    login(email, sector);
  }
  return <LinearGradient colors={['#0A1D3B', '#18345B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.root}>
    <StatusBar style="light" />
    <Svg style={StyleSheet.absoluteFill} width="100%" height="100%"><Defs><Pattern id="login-grid" width={48} height={48} patternUnits="userSpaceOnUse"><Path d="M48 0H0V48" stroke="#FFFFFF" strokeOpacity={0.022} fill="none" /></Pattern></Defs><Rect width="100%" height="100%" fill="url(#login-grid)" /></Svg>
    <View style={[s.orb, s.orbOne]} /><View style={[s.orb, s.orbTwo]} />
    <SafeAreaView style={s.root}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.root}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <View style={s.card}>
            <View style={s.brand}><Text style={s.brandText}>SGC</Text></View>
            <Text style={s.eyebrow}>GESTÃO DE CONTRATOS</Text>
            <Text accessibilityRole="header" style={s.title}>Acessar Sistema</Text>
            <Text style={s.subtitle}>Entre com suas credenciais para continuar.</Text>
            <View style={s.form}>
              <FormField label="Email" placeholder="nome@empresa.com.br" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="off" />
              <FormField label="Senha" placeholder="Digite sua senha" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} autoCapitalize="none" autoComplete="off" trailingIcon="eye" onIconPress={() => setShowPassword(!showPassword)} iconLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'} onSubmitEditing={submit} />
              <SelectField label="Setor" value={sector} options={sectors} placeholder="Selecione seu setor" onChange={setSector} />
              {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
              <Button label="Entrar" onPress={submit} style={s.submit} />
              <Text style={s.demo}>Ambiente de demonstração. Use um e-mail fictício e qualquer senha.</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Text style={s.footer}>SGC · Sistema de Gestão de Contratos</Text>
    </SafeAreaView>
  </LinearGradient>;
}
const s = StyleSheet.create({
  root: { flex: 1 }, scroll: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 48 },
  orb: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(64,139,237,0.17)' }, orbOne: { width: 420, height: 420, top: -120, right: -100 }, orbTwo: { width: 300, height: 300, bottom: -100, left: -70 },
  card: { width: '100%', maxWidth: 440, paddingTop: 38, paddingHorizontal: 36, paddingBottom: 28, backgroundColor: '#FBFCFE', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.65)', boxShadow: '0px 24px 70px rgba(4,17,39,0.18)' },
  brand: { width: 64, height: 64, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.navy, marginBottom: 30, boxShadow: '0px 8px 20px rgba(16,42,82,0.2)' },
  brandText: { color: colors.surface, fontSize: 17, fontWeight: '700', letterSpacing: 1.7 },
  eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, color: colors.accent, marginBottom: 5 },
  title: { color: colors.primary, fontSize: 28, lineHeight: 34, letterSpacing: -0.7, fontWeight: '700', marginBottom: 8 },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 21 }, form: { marginTop: 28, gap: 18 },
  submit: { minHeight: 48, backgroundColor: colors.navy, marginTop: 5 }, demo: { color: colors.muted, fontSize: 10, lineHeight: 15 },
  footer: { textAlign: 'center', color: 'rgba(255,255,255,0.55)', fontSize: 11, paddingVertical: 16, letterSpacing: 0.3 },
  error: { color: '#A43F45', fontSize: 12, lineHeight: 18 },
});
