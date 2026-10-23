import { useState, type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { router, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText as Text } from './AppText';
import { HoverPressable as Pressable } from './HoverPressable';
import { ContractSidebar } from './ContractSidebar';
import { Icon } from './Icon';
import { SidePanel } from './SidePanel';
import { Dialog } from './Dialog';
import { StatusBadge } from './StatusBadge';
import { useApp } from '../state/AppProvider';
import { colors } from '../styles/theme';

export function Workspace({ children }: { children: ReactNode }) {
  const { width } = useWindowDimensions();
  const mobile = width <= 760;
  const { session, logout, toast, contracts } = useApp();
  const [menu, setMenu] = useState(false), [sidebar, setSidebar] = useState(false), [notifications, setNotifications] = useState(false);
  const pathname = usePathname();

  return <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={s.root}>
    <View style={[s.topbar, mobile && s.topbarMobile]}>
      {mobile && <Pressable accessibilityRole="button" accessibilityLabel="Abrir contratos" onPress={() => setSidebar(true)} style={s.menuButton}><Icon name="menu" size={22} color={colors.surface} /></Pressable>}
      <Text style={[s.brand, mobile && { fontSize: 18 }]}>SGC</Text>
      <View style={s.headerSpacer} />
      <View style={s.account}>
        <Pressable accessibilityRole="button" accessibilityLabel="Notificações" onPress={() => { setMenu(false); setNotifications(true); }} style={s.notification}><Icon name="bell" size={20} color="#D4DCE9" /><View style={s.notificationDot} /></Pressable>
        {width > 1050 && <View style={s.profileText}><Text style={s.profileName}>Mariana Ribeiro</Text><Text style={s.profileRole}>Administradora</Text></View>}
        <View style={s.avatar}><Text style={s.avatarText}>MR</Text></View>
        <Pressable accessibilityRole="button" accessibilityLabel="Abrir menu do usuário" accessibilityState={{ expanded: menu }} onPress={() => setMenu(!menu)} style={({ hovered }) => [s.menuTrigger, (hovered || menu) && { backgroundColor: 'rgba(255,255,255,0.1)' }]}><Icon name="chevron" size={16} color="#C1CBD9" /></Pressable>
      </View>
    </View>
    <View style={s.body}>
      {!mobile && <View style={[s.sidebar, width <= 1050 && { width: 300 }]}><ContractSidebar /></View>}
      <KeyboardAvoidingView style={s.main} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView key={pathname} contentContainerStyle={[s.mainScroll, { paddingHorizontal: mobile ? 18 : Math.min(64, Math.max(28, width * 0.04)), paddingTop: mobile ? 27 : 36 }]} keyboardShouldPersistTaps="handled"><View style={s.content}>{children}</View></ScrollView>
      </KeyboardAvoidingView>
    </View>
    {menu && <View style={s.menuOverlay}>
      <Pressable accessibilityRole="button" accessibilityLabel="Fechar menu do usuário" onPress={() => setMenu(false)} style={StyleSheet.absoluteFill} />
      <View style={[s.profileMenu, mobile && { right: 16, top: 61 }]}>
        <View style={s.profileMenuHeader}><Text style={s.profileMenuName}>Mariana Ribeiro</Text><Text style={s.profileEmail}>{session?.email}</Text></View>
        <Pressable accessibilityRole="button" accessibilityLabel="Cadastrar contrato" onPress={() => { setMenu(false); router.push('/contracts/new'); }} style={({ hovered }) => [s.profileAction, hovered && { backgroundColor: colors.softBlue }]}><View style={s.actionIcon}><Icon name="plus" size={17} color={colors.blue} /></View><View style={s.flex}><Text style={s.profileActionTitle}>Cadastrar contrato</Text><Text style={s.profileActionSubtitle}>Adicionar um novo registro</Text></View></Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Sair do sistema" onPress={() => { setMenu(false); logout(); }} style={({ hovered }) => [s.profileAction, s.logout, hovered && { backgroundColor: '#FFF6F6' }]}><View style={[s.actionIcon, { backgroundColor: '#FBEAEC' }]}><Icon name="logout" size={17} color="#9E3F45" /></View><View style={s.flex}><Text style={[s.profileActionTitle, { color: '#9E3F45' }]}>Sair do sistema</Text><Text style={s.profileActionSubtitle}>Encerrar sessão atual</Text></View></Pressable>
      </View>
    </View>}
    <SidePanel visible={sidebar && mobile} title="lista de contratos" side="left" onClose={() => setSidebar(false)}><ContractSidebar onClose={() => setSidebar(false)} /></SidePanel>
    <Dialog visible={notifications} title="Notificações" onClose={() => setNotifications(false)}>
      <Text style={s.notificationIntro}>Alertas do conjunto de demonstração.</Text>
      {contracts.filter(item => ['A renovar', 'Vencido'].includes(item.status)).map(item => <Pressable accessibilityRole="button" accessibilityLabel={`Abrir ${item.title}`} key={item.id} onPress={() => { setNotifications(false); router.navigate(`/contracts/${item.id}`); }} style={s.notice}><StatusBadge status={item.status} /><Text style={s.noticeTitle}>{item.title}</Text><Text style={s.notificationIntro}>Processo {item.process}</Text></Pressable>)}
      {!contracts.some(item => ['A renovar', 'Vencido'].includes(item.status)) && <Text style={s.notificationIntro}>Nenhum alerta no momento.</Text>}
    </Dialog>
    {!!toast && <View pointerEvents="none" style={s.toastWrapper}><View style={s.toast}><View style={s.toastCheck}><Icon name="check" color={colors.primary} size={14} /></View><Text accessibilityLiveRegion="polite" style={s.toastText}>{toast}</Text></View></View>}
  </SafeAreaView>;
}
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primary }, topbar: { height: 68, paddingHorizontal: 26, flexDirection: 'row', alignItems: 'center', gap: 24, backgroundColor: colors.primary, zIndex: 2 }, topbarMobile: { height: 60, paddingHorizontal: 16, gap: 14 }, brand: { color: colors.surface, fontSize: 21, fontWeight: '700', letterSpacing: 2.5 }, headerSpacer: { flex: 1 }, account: { flexDirection: 'row', alignItems: 'center', gap: 8 }, notification: { minWidth: 40, minHeight: 40, alignItems: 'center', justifyContent: 'center', marginRight: 11 }, notificationDot: { position: 'absolute', top: 7, right: 9, width: 6, height: 6, borderRadius: 3, backgroundColor: '#65A5FF' }, profileText: { minWidth: 118 }, profileName: { color: colors.surface, fontSize: 12, fontWeight: '600' }, profileRole: { color: 'rgba(255,255,255,0.5)', fontSize: 10, marginTop: 2 }, avatar: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: '#DCEAFF', marginLeft: 3 }, avatarText: { color: colors.primary, fontSize: 11, fontWeight: '700' }, menuTrigger: { width: 30, height: 40, borderRadius: 6, alignItems: 'center', justifyContent: 'center' }, menuButton: { minWidth: 30, minHeight: 44, justifyContent: 'center' },
  body: { flex: 1, flexDirection: 'row', backgroundColor: colors.background }, sidebar: { width: 344, borderRightWidth: 1, borderColor: colors.border }, main: { flex: 1 }, mainScroll: { flexGrow: 1, paddingBottom: 42, alignItems: 'center' }, content: { width: '100%', maxWidth: 1152 },
  menuOverlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 30 }, profileMenu: { position: 'absolute', top: 69, right: 26, width: 270, borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 7, backgroundColor: colors.surface, boxShadow: '0px 18px 45px rgba(4,17,39,0.2)' }, profileMenuHeader: { paddingHorizontal: 11, paddingTop: 10, paddingBottom: 12, borderBottomWidth: 1, borderColor: colors.border }, profileMenuName: { fontSize: 12, fontWeight: '700', color: colors.primary }, profileEmail: { fontSize: 10, color: colors.muted, marginTop: 3 }, profileAction: { minHeight: 54, flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4, paddingVertical: 8, paddingHorizontal: 9, borderRadius: 7 }, actionIcon: { width: 31, height: 31, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.iconBackground }, profileActionTitle: { color: colors.secondary, fontSize: 12, fontWeight: '600' }, profileActionSubtitle: { color: colors.muted, fontSize: 10, marginTop: 2 }, logout: { borderTopWidth: 1, borderColor: colors.border }, flex: { flex: 1 },
  notificationIntro: { color: colors.muted, fontSize: 13, lineHeight: 20 }, notice: { padding: 15, borderWidth: 1, borderColor: colors.border, borderRadius: 8, gap: 10 }, noticeTitle: { fontWeight: '600' },
  toastWrapper: { position: 'absolute', left: 16, right: 16, bottom: 24, alignItems: 'center', zIndex: 40 }, toast: { flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: colors.primary, paddingVertical: 11, paddingHorizontal: 17, borderRadius: 8, boxShadow: '0px 24px 70px rgba(4,17,39,0.18)' }, toastText: { color: colors.surface, fontSize: 12, fontWeight: '600', flexShrink: 1 }, toastCheck: { width: 19, height: 19, borderRadius: 10, backgroundColor: '#99E2C5', alignItems: 'center', justifyContent: 'center' },
});
