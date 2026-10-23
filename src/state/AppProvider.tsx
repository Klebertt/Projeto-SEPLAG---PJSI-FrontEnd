import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { initialContracts } from '../data/contracts';
import { initialAudit } from '../data/audit';
import type { AuditRecord, Contract, ContractDraft, Session } from '../types/contract';
import { buildAudit, buildContract, demoSession } from '../utils/contractForm';

type State = {
  session: Session | null; contracts: Contract[]; audit: AuditRecord[]; toast: string;
  login: (email: string, sector: string) => void; logout: () => void;
  save: (draft: ContractDraft, id?: string) => string;
};
const AppContext = createContext<State | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [contracts, setContracts] = useState(initialContracts);
  const [audit, setAudit] = useState(initialAudit);
  const [toast, setToast] = useState('');
  const counter = useRef(0);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 3500); return () => clearTimeout(timer); }, [toast]);
  function save(draft: ContractDraft, id?: string) {
    const previous = contracts.find(item => item.id === id);
    const now = new Date();
    const saved = buildContract(draft, id ?? `local-${now.getTime()}-${++counter.current}`, now, previous);
    const changes = buildAudit(previous, saved, now);
    setContracts(items => previous ? items.map(item => item.id === saved.id ? saved : item) : [saved, ...items]);
    setAudit(items => [...changes, ...items]);
    setToast(previous ? (changes.length ? 'Contrato atualizado com sucesso' : 'Nenhuma alteração realizada') : 'Contrato cadastrado com sucesso');
    return saved.id;
  }
  return <AppContext.Provider value={{ session, contracts, audit, toast, login: (email, sector) => setSession(demoSession(email, sector)), logout: () => { setSession(null); setToast(''); }, save }}>{children}</AppContext.Provider>;
}
export function useApp() { const state = useContext(AppContext); if (!state) throw new Error('AppProvider ausente'); return state; }
