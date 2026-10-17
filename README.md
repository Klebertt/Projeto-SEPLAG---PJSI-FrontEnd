# SGC — SEPLAG Alagoas

Base em React Native, Expo SDK 57 e TypeScript.

## Executar

Node.js 22.13 ou superior (configurado com Node 24).

```powershell
cd "D:\vscode projetos\sgc-frontend"
npm install
npm start
```

Abra o QR code no Expo Go compatível com SDK 57, usando a mesma rede do computador.
Para navegador: `npm run web`. Para emulador Android já configurado: `npm run android`.
O simulador iOS exige macOS; no Windows, use iPhone físico com Expo Go.

## Estrutura

- App.tsx: componente raiz e providers.
- index.ts: registro do aplicativo.
- app.json: configuração Expo.
- assets/: ícones de instalação.
- src/screens/: telas; HomeScreen é a tela inicial.
- src/components/: componentes reutilizáveis.
- src/assets/: imagens e fontes das telas.
- src/services/: integração futura com backend.
- src/data/: dados fictícios.
- src/styles/: cores e estilos compartilhados.
- legacy-web/: painel React/Vite anterior preservado.

A interface usa componentes React Native e StyleSheet. Não há navegação nesta
etapa; quando necessária, usar Expo Router. Backend e autenticação ainda não
estão implementados. A tela de detalhes foi implementada conforme o print do Figma:
inclui busca, filtros, seleção, edição em memória e histórico da sessão.

## Verificações

```powershell
npm run typecheck
npm run lint
npx expo-doctor
npx expo export --platform all
```

## Painel anterior

Para executar a versão web preservada:

```powershell
cd legacy-web
npm ci
npm run dev
```

Documentação: https://docs.expo.dev/versions/v57.0.0/

## Tela de detalhes do contrato

Layout baseado no print do Figma: cabeçalho, pesquisa geral, lista lateral,
indicadores de situação e cartões de processo, modalidade, prazo, objeto,
vigência, valor global e unidade responsável.

No celular, o botão Contratos abre a lista e os filtros; os cartões ficam
empilhados. No desktop, a lista permanece na lateral.

Os cinco contratos e o perfil Marina Silva são fictícios. Os prazos são um
snapshot da referência visual, sem relação com a data atual. Nenhuma API está
conectada. Editar contrato atualiza os dados e o histórico apenas em memória;
recarregar restaura os dados iniciais. Notificações exibem os alertas desse
conjunto fictício. Não há autenticação nem persistência nesta etapa.

Verificações de busca, formato de datas e validação monetária: `npm test`.

## Dependências

A auditoria de 15/10/2026 ainda aponta 22 alertas nas dependências transitivas
(7 moderados e 15 altos), ligados à cadeia Expo/Metro e suas ferramentas.
As atualizações compatíveis de shell-quote e source-map-js foram aplicadas.
Não foi feito downgrade forçado do Expo ou React Native sugerido pelo npm.
