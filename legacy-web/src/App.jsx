import React, { useState } from 'react';
import { mockContracts } from './data/contracts';
import { Search, FileText, Calendar, User, AlertTriangle, CheckCircle, Clock, Building, Tag } from 'lucide-react';

export default function App() {
  const [contracts] = useState(mockContracts);
  const [selectedContract, setSelectedContract] = useState(mockContracts[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');

  // Filtragem da lista
  const filteredContracts = contracts.filter((c) => {
    const matchesSearch = 
      c.objeto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.numeroOriginal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.siafe.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'TODOS' || c.status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Ativo':
        return <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Ativo</span>;
      case 'Renovar':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center gap-1"><Clock className="w-3 h-3"/> Renovar</span>;
      case 'Vencido':
        return <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Vencido</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex flex-col">
      {/* Cabeçalho */}
      <header className="bg-slate-800 text-white px-6 py-3 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-blue-400" />
          <h1 className="text-xl font-bold tracking-wide">Painel - CONTRATOS</h1>
        </div>
        <span className="text-xs bg-slate-700 px-3 py-1 rounded-full text-slate-300">SEPLAG Alagoas</span>
      </header>

      {/* Conteúdo Principal (2 Colunas) */}
      <main className="flex-1 flex overflow-hidden p-4 gap-4 max-w-[1600px] w-full mx-auto">
        
        {/* MENU LATERAL ESQUERDO: Filtros e Lista */}
        <aside className="w-1/3 min-w-[340px] max-w-[420px] bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-100 space-y-3">
            {/* Campo de Busca */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Pesquisar por código ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filtros rápidos por Status */}
            <div className="flex gap-1 overflow-x-auto pb-1 text-xs">
              {['TODOS', 'Ativo', 'Renovar', 'Vencido'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-md font-medium transition ${
                    statusFilter === st 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Lista Compacta de Contratos */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredContracts.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">Nenhum contrato encontrado.</p>
            ) : (
              filteredContracts.map((contract) => {
                const isSelected = selectedContract?.id === contract.id;
                return (
                  <button
                    key={contract.id}
                    onClick={() => setSelectedContract(contract)}
                    className={`w-full text-left p-3 transition flex flex-col gap-2 ${
                      isSelected ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700">{contract.numeroOriginal}</span>
                      {getStatusBadge(contract.status)}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {contract.objeto}
                    </p>
                    <div className="text-[10px] text-slate-400 flex justify-between">
                      <span>SIAFE: {contract.siafe}</span>
                      <span>Fim: {contract.dataFimAditivos}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* CARD CENTRAL/DIREITO: Ficha do Processo */}
        <section className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-y-auto p-6">
          {selectedContract ? (
            <div className="space-y-6">
              {/* Header da Ficha */}
              <div className="border-b border-slate-200 pb-4 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-bold text-slate-800">Ficha do Processo</h2>
                    {getStatusBadge(selectedContract.status)}
                  </div>
                  <p className="text-sm text-slate-500 font-mono">
                    {selectedContract.numeroOriginal} | SIAFE: {selectedContract.siafe} | Processo: {selectedContract.numeroProcesso}
                  </p>
                </div>
              </div>

              {/* Objeto do Contrato */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-slate-600" /> Descrição do Objeto
                </h3>
                <p className="text-sm text-slate-800 font-medium leading-relaxed">
                  {selectedContract.objeto}
                </p>
              </div>

              {/* Grid 1: Informações de Prazos e Vigência */}
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-600" /> Vigência e Aditivos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-slate-50 rounded border border-slate-100">
                    <span className="text-xs text-slate-400 block">Início da Vigência</span>
                    <span className="text-sm font-semibold text-slate-700">{selectedContract.dataInicio}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded border border-slate-100">
                    <span className="text-xs text-slate-400 block">Fim Vigência Original</span>
                    <span className="text-sm font-semibold text-slate-700">{selectedContract.dataFimOriginal}</span>
                  </div>
                  <div className="p-3 bg-blue-50 rounded border border-blue-100">
                    <span className="text-xs text-blue-600 font-medium block">Fim com Aditivos</span>
                    <span className="text-sm font-bold text-blue-900">{selectedContract.dataFimAditivos}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded border border-slate-100">
                    <span className="text-xs text-slate-400 block">Qtd. Aditivos</span>
                    <span className="text-sm font-semibold text-slate-700">{selectedContract.aditivosCount}</span>
                  </div>
                </div>
              </div>

              {/* Grid 2: Partes Envolvidas */}
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-slate-600" /> Partes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded border border-slate-100">
                    <span className="text-xs text-slate-400 block">Contratante</span>
                    <span className="text-sm font-semibold text-slate-700">{selectedContract.contratante}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded border border-slate-100">
                    <span className="text-xs text-slate-400 block">Contratado / Empresa</span>
                    <span className="text-sm font-semibold text-slate-700">{selectedContract.contratado}</span>
                  </div>
                </div>
              </div>

              {/* Grid 3: Gestão do Contrato */}
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-600" /> Gestão do Contrato
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-slate-50 rounded border border-slate-100">
                    <span className="text-xs text-slate-400 block">Gestor</span>
                    <span className="text-sm font-medium text-slate-700">{selectedContract.gestor}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded border border-slate-100">
                    <span className="text-xs text-slate-400 block">Subgestor</span>
                    <span className="text-sm font-medium text-slate-700">{selectedContract.subgestor}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded border border-slate-100">
                    <span className="text-xs text-slate-400 block">Fiscal</span>
                    <span className="text-sm font-medium text-slate-700">{selectedContract.fiscal}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded border border-slate-100">
                    <span className="text-xs text-slate-400 block">Substituto</span>
                    <span className="text-sm font-medium text-slate-700">{selectedContract.substituto}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
              Selecione um contrato na lista ao lado para ver os detalhes.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}