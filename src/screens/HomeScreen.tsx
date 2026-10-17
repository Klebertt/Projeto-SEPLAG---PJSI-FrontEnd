import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ContractCard } from '../components/ContractCard';
import { Dialog } from '../components/Dialog';
import { Icon } from '../components/Icon';
import { StatusBadge } from '../components/StatusBadge';
import { HoverPressable as Pressable } from '../components/HoverPressable';
import { initialContracts } from '../data/contracts';
import { colors } from '../styles/theme';
import type { Contract, HistoryEntry } from '../types/contract';
import { filterContracts, formatCurrency, formatDate, parseAmount, type StatusFilter } from '../utils/contracts';

type OpenDialog = 'contracts' | 'edit' | 'history' | 'notifications' | 'profile' | null;
type Draft = Pick<Contract, 'title' | 'description' | 'unit'> & { amount: string };
const statuses: StatusFilter[] = ['Todos', 'Vigente', 'A vencer', 'Vencido'];

export function HomeScreen() {
  const { width } = useWindowDimensions();
  const desktop = width >= 1200;
  const small = width < 820;
  const [contracts, setContracts] = useState(initialContracts);
  const [selectedId, setSelectedId] = useState(initialContracts[0].id);
  const [globalSearch, setGlobalSearch] = useState('');
  const [objectSearch, setObjectSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('Todos');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [dialog, setDialog] = useState<OpenDialog>(null);
  const [draft, setDraft] = useState<Draft>({ title: '', description: '', unit: '', amount: '' });
  const [error, setError] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [lastUpdate, setLastUpdate] = useState('09:42');
  const filtered = filterContracts(contracts, globalSearch, objectSearch, status);
  // A busca sempre mostra detalhes de um resultado visível, sem perder a seleção anterior.
  const selected = filtered.find((item) => item.id === selectedId) ?? filtered[0];
  const closeDialog = () => setDialog(null);

  function openEdit() {
    if (!selected) return;
    setDraft({ title: selected.title, description: selected.description, unit: selected.unit, amount: selected.amount.toFixed(2).replace('.', ',') });
    setError('');
    setDialog('edit');
  }

  function saveContract() {
    if (!selected) return;
    const amount = parseAmount(draft.amount);
    if (!draft.title.trim() || !draft.description.trim() || !draft.unit.trim()) {
      setError('Preencha o objeto, a descrição e a unidade responsável.');
      return;
    }
    if (amount === null) {
      setError('Informe um valor positivo, como 1284500,00, sem separador de milhar.');
      return;
    }
    const now = new Date();
    setContracts((previous) => previous.map((item) => item.id === selected.id ? {
      ...item, title: draft.title.trim(), description: draft.description.trim(), unit: draft.unit.trim(), amount,
    } : item));
    setHistory((previous) => [{ id: `${now.getTime()}-${selected.id}`, contractId: selected.id, title: 'Informações do contrato atualizadas por Marina Silva', timestamp: now.toLocaleString('pt-BR') }, ...previous]);
    setLastUpdate(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    setSelectedId(selected.id);
    setGlobalSearch('');
    setObjectSearch('');
    closeDialog();
  }

  function contractList() {
    return (
      <>
        <View style={s.sidebarHeading}>
          <Text style={s.eyebrow}>GESTÃO CONTRATUAL</Text>
          <Text accessibilityRole="header" style={s.sidebarTitle}>Contratos</Text>
          <View style={s.searchBox}>
            <Icon name="search" size={16} color={colors.muted} />
            <TextInput accessibilityLabel="Pesquisar objeto" placeholder="Pesquisar objeto" placeholderTextColor="#8A9FBA" value={objectSearch} onChangeText={setObjectSearch} style={s.searchInput} />
            {!!objectSearch && <Pressable accessibilityRole="button" accessibilityLabel="Limpar pesquisa de objeto" onPress={() => setObjectSearch('')} hitSlop={8}><Icon name="close" size={14} color={colors.muted} /></Pressable>}
          </View>
          <View style={s.listTools}>
            <Text accessibilityLiveRegion="polite" style={s.resultCount}>{filtered.length} {filtered.length === 1 ? 'objeto encontrado' : 'objetos encontrados'}</Text>
            <Pressable accessibilityRole="button" accessibilityState={{ expanded: filtersOpen }} onPress={() => setFiltersOpen(!filtersOpen)} style={s.filterButton}>
              <Text style={s.link}>{status === 'Todos' ? 'Filtrar' : status}</Text>
            </Pressable>
          </View>
          {filtersOpen && <View style={s.filterOptions}>{statuses.map((item) => (
            <Pressable key={item} accessibilityRole="button" accessibilityState={{ selected: item === status }} onPress={() => setStatus(item)} style={[s.filterChip, status === item && s.filterChipActive]}>
              <Text style={[s.filterChipText, status === item && s.filterChipTextActive]}>{item}</Text>
            </Pressable>
          ))}</View>}
        </View>
        <View style={s.contractList}>
          {filtered.map((contract) => (
            <Pressable key={contract.id} accessibilityRole="button" accessibilityLabel={`${contract.title}, ${contract.status}, processo ${contract.process}`} accessibilityState={{ selected: selected?.id === contract.id }} onPress={() => { setSelectedId(contract.id); if (!desktop) closeDialog(); }} style={({ pressed, hovered }) => [s.contractItem, selected?.id === contract.id && s.contractItemSelected, (pressed || hovered) && s.contractItemHover]}>
              {selected?.id === contract.id && <View style={s.selectionMark} />}
              <View style={s.contractText}>
                <Text style={s.contractTitle}>{contract.title}</Text>
                <Text style={s.contractProcess}>{contract.process}</Text>
              </View>
              <StatusBadge status={contract.status} />
            </Pressable>
          ))}
          {filtered.length === 0 && <Text style={s.sidebarEmpty}>Nenhum contrato encontrado. Tente outro termo ou filtro.</Text>}
        </View>
      </>
    );
  }

  return (
    <SafeAreaView style={s.safeArea} edges={['top', 'left', 'right']}>
      <View style={[s.topbar, !desktop && s.topbarCompact]}>
        <View style={[s.brand, desktop && s.brandDesktop]}>
          <View style={s.brandMark}><Text style={s.brandMarkText}>SGC</Text></View>
          <View><Text style={s.brandName}>SGC</Text><Text style={s.brandSubtitle}>SEPLAG</Text></View>
        </View>
        {desktop && <View style={[s.globalSearch, width < 1350 && s.globalSearchNarrow]}>
          <Icon name="search" size={16} color="#BED1E9" />
          <TextInput accessibilityLabel="Pesquisar processos, contratos ou unidades" placeholder="Pesquisar processos, contratos ou unidades" placeholderTextColor="#BED1E9" value={globalSearch} onChangeText={setGlobalSearch} style={[s.searchInput, s.globalSearchInput]} />
          {!!globalSearch && <Pressable accessibilityRole="button" accessibilityLabel="Limpar pesquisa geral" onPress={() => setGlobalSearch('')}><Icon name="close" size={16} color="#BED1E9" /></Pressable>}
        </View>}
        <View style={s.account}>
          <Pressable accessibilityRole="button" accessibilityLabel="Notificações" onPress={() => setDialog('notifications')} style={({ hovered }) => [s.notificationButton, hovered && s.headerHover]}>
            <Icon name="bell" size={20} color="#D3E2F5" /><View style={s.notificationDot} />
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Perfil de Marina Silva" onPress={() => setDialog('profile')} style={({ hovered }) => [s.profile, hovered && s.headerHover]}>
            <View style={s.avatar}><Text style={s.avatarText}>MS</Text></View>
            {!small && <View style={s.profileText}><Text style={s.profileName}>Marina Silva</Text><Text style={s.profileRole}>Gestora de contratos</Text></View>}
            <Icon name="chevron" size={14} color="#D3E2F5" />
          </Pressable>
        </View>
      </View>

      <View style={s.body}>
        {desktop && <View style={s.sidebar}>
          <ScrollView keyboardShouldPersistTaps="handled">{contractList()}</ScrollView>
          <View style={s.sidebarFooter}><View style={s.footerDot} /><Text style={s.sidebarFooterText}>Sistema de Gestão de Contratos</Text></View>
        </View>}
        <ScrollView style={s.main} contentContainerStyle={[s.mainContent, !desktop && s.mainContentCompact]} keyboardShouldPersistTaps="handled">
          <View style={s.content}>
            {!desktop && <View style={s.mobileSearch}>
              <Icon name="search" size={17} color={colors.muted} />
              <TextInput accessibilityLabel="Pesquisar processos, contratos ou unidades" placeholder="Pesquisar contratos ou unidades" placeholderTextColor={colors.muted} value={globalSearch} onChangeText={setGlobalSearch} style={s.searchInput} />
              {!!globalSearch && <Pressable accessibilityRole="button" accessibilityLabel="Limpar pesquisa geral" onPress={() => setGlobalSearch('')}><Icon name="close" size={16} /></Pressable>}
            </View>}
            <View style={s.breadcrumb}>
              <Pressable accessibilityRole="button" accessibilityLabel={desktop ? 'Mostrar todos os contratos' : 'Abrir lista de contratos'} onPress={() => { if (desktop) { setGlobalSearch(''); setObjectSearch(''); setStatus('Todos'); } else setDialog('contracts'); }} style={s.breadcrumbButton}>
                {!desktop && <Icon name="filter" size={15} />}<Text style={[s.breadcrumbText, !desktop && s.link]}>Contratos</Text>
              </Pressable>
              <Text style={s.breadcrumbText}>/</Text><Text style={s.breadcrumbProcess}>{selected?.process ?? 'Nenhum resultado'}</Text>
            </View>

            {selected ? <>
              <View style={[s.pageHeading, small && s.pageHeadingSmall]}>
                <View style={s.headingCopy}>
                  <View style={s.titleLine}><Text accessibilityRole="header" style={[s.pageTitle, small && s.pageTitleSmall]}>Detalhes do Contrato</Text><StatusBadge status={selected.status} /></View>
                  <Text style={s.pageSubtitle}>Consulte as principais informações e a vigência deste contrato.</Text>
                </View>
                <Pressable accessibilityRole="button" onPress={openEdit} style={({ hovered, pressed }) => [s.editButton, (hovered || pressed) && s.buttonHover]}><Icon name="edit" size={15} color="#405876" /><Text style={s.editButtonText}>Editar contrato</Text></Pressable>
              </View>

              <View style={s.cards}>
                <View style={[s.cardRow, small && s.cardColumn]}>
                  <ContractCard icon="file" label="Nº PROCESSO" style={[s.processCard, small && s.autoCard]}><Text selectable style={s.cardValue}>{selected.process}</Text></ContractCard>
                  <ContractCard icon="document" label="MODALIDADE" style={[s.modalityCard, small && s.autoCard]}><Text style={s.cardValue}>{selected.modality}</Text></ContractCard>
                  <ContractCard icon="clock" label={selected.daysRemaining < 0 ? 'DIAS DESDE O VENCIMENTO' : 'DIAS PARA VENCER'} style={[s.daysCard, small && s.autoCard]}>
                    <View style={s.daysValue}><Text style={[s.daysNumber, selected.status === 'Vencido' && s.overdueNumber]}>{Math.abs(selected.daysRemaining)}</Text><Text style={s.daysLabel}>dias</Text></View>
                  </ContractCard>
                </View>
                <View style={[s.cardRow, small && s.cardColumn]}>
                  <ContractCard icon="document" label="DESCRIÇÃO DO OBJETO" style={[s.descriptionCard, small && s.autoCard]}><Text style={s.description}>{selected.description}</Text></ContractCard>
                  <ContractCard icon="calendar" label="PERÍODO DE VIGÊNCIA" style={[s.periodCard, small && s.autoCard]}>
                    <View style={s.period}>
                      <View><Text style={s.dateLabel}>INÍCIO</Text><Text style={s.dateValue}>{formatDate(selected.startsAt)}</Text></View>
                      <View style={s.dateLine} />
                      <View style={s.endDate}><Text style={s.dateLabel}>TÉRMINO</Text><Text style={s.dateValue}>{formatDate(selected.endsAt)}</Text></View>
                    </View>
                  </ContractCard>
                </View>
                <View style={[s.cardRow, small && s.cardColumn]}>
                  <ContractCard icon="money" label="VALOR GLOBAL" style={[s.amountCard, small && s.autoCard]}><Text style={s.cardValue}>{formatCurrency(selected.amount)}</Text></ContractCard>
                  <ContractCard icon="building" label="UNIDADE RESPONSÁVEL" style={[s.unitCard, small && s.autoCard]}><Text style={s.cardValue}>{selected.unit}</Text></ContractCard>
                </View>
              </View>

              <View style={[s.updateBar, small && s.updateBarSmall]}>
                <View style={s.updateInfo}><View style={s.updateIcon}><Icon name="check" size={15} color="#00A67C" /></View><View><Text style={s.updateTitle}>Informações atualizadas</Text><Text accessibilityLiveRegion="polite" style={s.updateTime}>Última atualização às {lastUpdate}</Text></View></View>
                <Pressable accessibilityRole="button" onPress={() => setDialog('history')} style={s.historyButton}><Text style={s.link}>Ver histórico de alterações</Text></Pressable>
              </View>
            </> : <View style={s.emptyState}>
              <Icon name="search" size={32} color={colors.muted} /><Text style={s.emptyTitle}>Nenhum contrato encontrado</Text>
              <Text style={s.emptyDescription}>Altere os termos da pesquisa ou limpe os filtros para continuar.</Text>
              <Pressable accessibilityRole="button" onPress={() => { setGlobalSearch(''); setObjectSearch(''); setStatus('Todos'); }} style={s.primaryButton}><Text style={s.primaryButtonText}>Limpar filtros</Text></Pressable>
              {!desktop && <Pressable accessibilityRole="button" onPress={() => setDialog('contracts')} style={s.historyButton}><Text style={s.link}>Abrir lista e filtros</Text></Pressable>}
            </View>}
          </View>
        </ScrollView>
      </View>

      <Dialog visible={dialog === 'contracts'} title="Contratos" onClose={closeDialog}>{contractList()}</Dialog>
      <Dialog visible={dialog === 'edit'} title="Editar contrato" onClose={closeDialog}>
        <Text style={s.dialogDescription}>As alterações ficam disponíveis nesta sessão de demonstração e são descartadas ao recarregar.</Text>
        <View style={s.field}><Text style={s.fieldLabel}>Objeto</Text><TextInput accessibilityLabel="Objeto do contrato" value={draft.title} onChangeText={(title) => setDraft({ ...draft, title })} style={s.input} maxLength={100} /></View>
        <View style={s.field}><Text style={s.fieldLabel}>Descrição do objeto</Text><TextInput accessibilityLabel="Descrição do objeto" value={draft.description} onChangeText={(description) => setDraft({ ...draft, description })} style={[s.input, s.textarea]} multiline maxLength={2000} /></View>
        <View style={s.field}><Text style={s.fieldLabel}>Valor global (R$)</Text><TextInput accessibilityLabel="Valor global em reais" value={draft.amount} onChangeText={(amount) => setDraft({ ...draft, amount })} style={s.input} keyboardType="decimal-pad" placeholder="1284500,00" /></View>
        <View style={s.field}><Text style={s.fieldLabel}>Unidade responsável</Text><TextInput accessibilityLabel="Unidade responsável" value={draft.unit} onChangeText={(unit) => setDraft({ ...draft, unit })} style={s.input} maxLength={150} /></View>
        {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
        <View style={s.dialogActions}><Pressable accessibilityRole="button" onPress={closeDialog} style={s.secondaryButton}><Text style={s.secondaryButtonText}>Cancelar</Text></Pressable><Pressable accessibilityRole="button" onPress={saveContract} style={s.primaryButton}><Text style={s.primaryButtonText}>Salvar alterações</Text></Pressable></View>
      </Dialog>
      <Dialog visible={dialog === 'history'} title="Histórico de alterações" onClose={closeDialog}>
        <Text style={s.dialogDescription}>Processo {selected?.process}</Text>
        {history.filter((entry) => entry.contractId === selected?.id).map((entry) => <View style={s.historyEntry} key={entry.id}><View style={s.timelineDot} /><View style={s.flex}><Text style={s.historyTitle}>{entry.title}</Text><Text style={s.historyTime}>{entry.timestamp}</Text></View></View>)}
        <View style={s.historyEntry}><View style={s.timelineDot} /><View style={s.flex}><Text style={s.historyTitle}>Dados de exemplo carregados</Text><Text style={s.historyTime}>Referência visual do Figma</Text></View></View>
      </Dialog>
      <Dialog visible={dialog === 'notifications'} title="Notificações" onClose={closeDialog}>
        <Text style={s.dialogDescription}>Prazos do conjunto de demonstração.</Text>
        {contracts.filter((item) => item.status !== 'Vigente').map((contract) => <Pressable accessibilityRole="button" key={contract.id} onPress={() => { setStatus('Todos'); setGlobalSearch(''); setObjectSearch(''); setSelectedId(contract.id); closeDialog(); }} style={s.notice}><StatusBadge status={contract.status} /><Text style={s.historyTitle}>{contract.title}</Text><Text style={s.dialogDescription}>{contract.daysRemaining < 0 ? `Vencido há ${Math.abs(contract.daysRemaining)} dias` : `Vence em ${contract.daysRemaining} dias`}</Text></Pressable>)}
      </Dialog>
      <Dialog visible={dialog === 'profile'} title="Perfil" onClose={closeDialog}>
        <View style={s.profileDetails}><View style={s.profileAvatar}><Text style={s.profileAvatarText}>MS</Text></View><Text style={s.emptyTitle}>Marina Silva</Text><Text style={s.dialogDescription}>Gestora de contratos · SEPLAG</Text></View>
        <Text style={s.dialogDescription}>Perfil ilustrativo da demonstração.</Text>
      </Dialog>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primary, paddingBottom: 0 },
  topbar: { height: 67, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 29, zIndex: 2, boxShadow: '0px 2px 5px rgba(8,28,53,0.08)' },
  topbarCompact: { paddingHorizontal: 18 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandDesktop: { width: 313 },
  brandMark: { width: 36, height: 36, backgroundColor: colors.surface, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  brandMarkText: { fontSize: 13, fontWeight: '900', fontStyle: 'italic', letterSpacing: -1, color: colors.primary },
  brandName: { fontSize: 14, fontWeight: '800', color: colors.surface },
  brandSubtitle: { fontSize: 9, letterSpacing: 1.5, color: '#D8E7F9', marginTop: 1 },
  globalSearch: { flexDirection: 'row', alignItems: 'center', gap: 11, marginLeft: 136, width: 504, height: 40, borderWidth: 1, borderColor: '#3C5371', borderRadius: 11, paddingHorizontal: 14, backgroundColor: '#29415F' },
  globalSearchNarrow: { marginLeft: 15, flex: 1, maxWidth: 504 },
  globalSearchInput: { color: '#EDF4FF' },
  account: { flexDirection: 'row', gap: 15, alignItems: 'center', marginLeft: 'auto', paddingLeft: 20 },
  notificationButton: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 9 },
  notificationDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#FFBF40', position: 'absolute', right: 8, top: 7 },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 11, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 4 },
  avatar: { width: 30, height: 30, borderRadius: 8, backgroundColor: '#C4DFFF', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: colors.primary, fontWeight: '700', fontSize: 11 },
  profileText: { minWidth: 85, gap: 3 },
  profileName: { fontSize: 10, fontWeight: '700', color: colors.surface },
  profileRole: { fontSize: 9, color: '#DFEAF8' },
  headerHover: { backgroundColor: '#24415F' },
  body: { flex: 1, flexDirection: 'row', backgroundColor: colors.surface },
  sidebar: { width: 342, backgroundColor: colors.background, borderRightWidth: 1, borderColor: '#DDE5F0' },
  sidebarHeading: { paddingHorizontal: 22, paddingTop: 24 },
  eyebrow: { fontSize: 9, letterSpacing: 1.4, fontWeight: '700', color: colors.accent, marginBottom: 10 },
  sidebarTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 21 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: '#DEE7F3', backgroundColor: colors.surface, borderRadius: 12, height: 40, paddingHorizontal: 12 },
  searchInput: { flex: 1, minWidth: 0, fontSize: 13, color: colors.text, paddingVertical: 0, ...Platform.select({ web: { outlineWidth: 0 } }) },
  listTools: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 4 },
  resultCount: { color: colors.muted, fontSize: 11 },
  filterButton: { paddingVertical: 10, paddingLeft: 14 },
  link: { color: colors.accent, fontSize: 13 },
  filterOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingBottom: 14 },
  filterChip: { paddingVertical: 7, paddingHorizontal: 10, borderWidth: 1, borderColor: colors.border, borderRadius: 20, backgroundColor: colors.surface },
  filterChipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  filterChipText: { color: colors.muted, fontSize: 11 },
  filterChipTextActive: { color: colors.surface },
  contractList: { paddingHorizontal: 13, gap: 3, paddingBottom: 20 },
  contractItem: { minHeight: 64, paddingVertical: 13, paddingHorizontal: 12, flexDirection: 'row', gap: 10, alignItems: 'flex-start', borderWidth: 1, borderColor: 'transparent', borderRadius: 13 },
  contractItemSelected: { backgroundColor: colors.surface, borderColor: colors.border, boxShadow: '0px 3px 7px rgba(25,53,88,0.04)' },
  contractItemHover: { backgroundColor: '#EDF3FC' },
  selectionMark: { width: 3, backgroundColor: colors.accent, position: 'absolute', left: 0, top: 11, bottom: 11, borderRadius: 3 },
  contractText: { flex: 1, gap: 6, paddingTop: 2 },
  contractTitle: { fontSize: 12, lineHeight: 16, fontWeight: '700', color: colors.text },
  contractProcess: { fontSize: 9, color: colors.muted },
  sidebarEmpty: { padding: 16, fontSize: 13, color: colors.muted, lineHeight: 21 },
  sidebarFooter: { minHeight: 41, borderTopWidth: 1, borderColor: '#DDE5F0', paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerDot: { backgroundColor: '#93A8C1', width: 5, height: 5, borderRadius: 3 },
  sidebarFooterText: { color: '#8AA0BA', fontSize: 9 },
  main: { flex: 1 },
  mainContent: { paddingHorizontal: 40, paddingTop: 44, paddingBottom: 52, alignItems: 'center' },
  mainContentCompact: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 36 },
  content: { width: '100%', maxWidth: 976 },
  mobileSearch: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 13, gap: 9, height: 44, marginBottom: 20 },
  breadcrumb: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 15, flexWrap: 'wrap' },
  breadcrumbButton: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  breadcrumbText: { color: '#8CA0BB', fontSize: 11 },
  breadcrumbProcess: { color: colors.accent, fontSize: 10 },
  pageHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, marginBottom: 35 },
  pageHeadingSmall: { alignItems: 'flex-start', flexDirection: 'column', marginBottom: 24 },
  headingCopy: { flex: 1, gap: 9 },
  titleLine: { flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  pageTitle: { fontSize: 26, lineHeight: 32, fontWeight: '700', letterSpacing: -0.65, color: '#05172F' },
  pageTitleSmall: { fontSize: 25 },
  pageSubtitle: { color: colors.muted, fontSize: 12, lineHeight: 19 },
  editButton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 15, height: 37, borderWidth: 1, borderColor: '#DEE5EF', borderRadius: 11, backgroundColor: colors.surface, boxShadow: '0px 1px 2px rgba(8,28,53,0.13)' },
  editButtonText: { color: '#405876', fontSize: 13 },
  buttonHover: { backgroundColor: '#F0F5FF', borderColor: '#B9CFFF' },
  cards: { gap: 14 },
  cardRow: { flexDirection: 'row', alignItems: 'stretch', gap: 14 },
  cardColumn: { flexDirection: 'column' },
  processCard: { flex: 1.27, minHeight: 142 },
  modalityCard: { flex: 1, minHeight: 142 },
  daysCard: { flex: 0.74, minHeight: 142 },
  descriptionCard: { flex: 2.05, minHeight: 159 },
  periodCard: { flex: 1, minHeight: 159 },
  amountCard: { flex: 1.27, minHeight: 135 },
  unitCard: { flex: 1.8, minHeight: 135 },
  autoCard: { flexGrow: 0, flexShrink: 0, flexBasis: 'auto', width: '100%', minHeight: 132 },
  cardValue: { fontSize: 15, lineHeight: 21, color: colors.text, fontWeight: '700' },
  daysValue: { flexDirection: 'row', alignItems: 'baseline', gap: 5, marginTop: -2 },
  daysNumber: { fontSize: 27, lineHeight: 30, fontWeight: '700', color: colors.accent },
  overdueNumber: { color: '#D90646' },
  daysLabel: { color: '#8CA0BB', fontSize: 11 },
  description: { color: colors.text, fontSize: 13, lineHeight: 25, marginTop: -3 },
  period: { flexDirection: 'row', alignItems: 'flex-end', gap: 14, marginTop: -4 },
  dateLabel: { color: '#8CA0BB', fontSize: 9, marginBottom: 6 },
  dateValue: { color: colors.text, fontSize: 12, fontWeight: '700' },
  dateLine: { height: 1, backgroundColor: colors.border, flex: 1, minWidth: 8, marginBottom: 7 },
  endDate: { alignItems: 'flex-end' },
  updateBar: { minHeight: 63, marginTop: 27, borderWidth: 1, borderColor: colors.border, borderRadius: 15, backgroundColor: '#FAFBFD', paddingVertical: 12, paddingHorizontal: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  updateBarSmall: { flexDirection: 'column', alignItems: 'flex-start' },
  updateInfo: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  updateIcon: { width: 29, height: 29, backgroundColor: '#EAFBF4', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  updateTitle: { fontSize: 11, fontWeight: '500', color: colors.text, marginBottom: 5 },
  updateTime: { fontSize: 9, color: '#8CA0BB' },
  historyButton: { paddingVertical: 9 },
  emptyState: { paddingVertical: 80, alignItems: 'center', gap: 18 },
  emptyTitle: { fontSize: 20, color: colors.text, fontWeight: '700', textAlign: 'center' },
  emptyDescription: { fontSize: 14, color: colors.muted, textAlign: 'center', lineHeight: 22 },
  primaryButton: { minHeight: 44, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.accent },
  primaryButtonText: { color: colors.surface, fontSize: 14, fontWeight: '600' },
  secondaryButton: { minHeight: 44, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  secondaryButtonText: { color: colors.muted, fontSize: 14 },
  dialogDescription: { fontSize: 13, lineHeight: 21, color: colors.muted },
  field: { gap: 8 },
  fieldLabel: { fontSize: 13, color: colors.text, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#CBD8EB', borderRadius: 9, paddingHorizontal: 12, paddingVertical: 11, fontSize: 14, color: colors.text },
  textarea: { minHeight: 95, textAlignVertical: 'top' },
  error: { color: '#D90646', fontSize: 13, lineHeight: 20 },
  dialogActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, flexWrap: 'wrap' },
  historyEntry: { flexDirection: 'row', gap: 12, paddingVertical: 12, borderTopWidth: 1, borderColor: colors.border },
  timelineDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.accent, marginTop: 5 },
  flex: { flex: 1 },
  historyTitle: { fontSize: 14, lineHeight: 21, fontWeight: '600', color: colors.text },
  historyTime: { fontSize: 12, color: colors.muted, marginTop: 6 },
  notice: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 16, gap: 10 },
  profileDetails: { alignItems: 'center', gap: 12, paddingVertical: 12 },
  profileAvatar: { width: 64, height: 64, backgroundColor: '#DDEBFF', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  profileAvatarText: { fontSize: 22, fontWeight: '700', color: colors.primary },
});
