# SGC — SEPLAG Alagoas

Frontend React Native com Expo SDK 57, TypeScript e Expo Router. Implementação
das telas do projeto SGC enviado como ZIP do Figma Make.

## Executar

Use Node.js 24 (ou versão compatível com o SDK).

```powershell
cd "D:\vscode projetos\sgc-frontend"
npm install
npm start
```

Pressione `w` no terminal para abrir no navegador, ou execute `npm run web`.
No celular, use Expo Go compatível com o SDK 57 e a mesma rede do computador.
`npm run android` requer emulador configurado; o simulador iOS exige macOS.

## Demonstração

Na tela de login, use um e-mail fictício válido, qualquer senha não vazia e
selecione um setor. Nenhuma senha é armazenada ou enviada a um servidor.
O perfil Mariana Ribeiro é ilustrativo, conforme o protótipo.

Esta entrega contém login e saída, consulta, busca por empresa/processo,
filtros de situação combináveis, cadastro, edição, histórico lateral com
detalhes expansíveis e histórico completo por contrato. O menu do usuário
contém **Cadastrar contrato** e **Sair do sistema**.

O cadastro inclui o novo registro na lista; a edição atualiza os cartões e
registra campo, valor anterior e novo valor no histórico correspondente.
Cancelar não altera os dados. Processos duplicados, datas inválidas ou
invertidas e valores não positivos são rejeitados. Datas são digitadas como
DD/MM/AAAA; valores usam vírgula decimal, sem separadores de milhar.

Os quatro contratos e os registros iniciais são fictícios. Os prazos iniciais
reproduzem o snapshot do Figma; não representam a data atual. Ao cadastrar ou
alterar a vigência, o prazo é recalculado pela data local; a situação continua
sendo um campo selecionado pelo usuário, como no protótipo.

Todos os dados ficam em memória. Recarregar ou encerrar o aplicativo restaura
os exemplos e exige entrar novamente. Sair encerra apenas a sessão demonstrativa.
Autenticação real, autorização, persistência e auditoria confiável dependem do
backend. O controle de rotas do frontend não substitui essas proteções.

## Estrutura

- `src/app/`: rotas e layouts do Expo Router.
- `src/screens/`: login, detalhes, formulário de cadastro/edição e histórico.
- `src/components/`: botões, campos, menu, lista lateral, painéis e linha do tempo.
- `src/state/`: sessão demonstrativa, contratos e histórico compartilhados.
- `src/types/`: modelos TypeScript.
- `src/utils/`: pesquisa, formatação, validação e geração de registros de auditoria.
- `src/data/`: dados fictícios e opções dos formulários.
- `src/styles/`: cores e fontes derivadas do Figma; DM Sans embutida pelo pacote.
- `src/assets/` e `assets/`: recursos visuais e ícones de instalação.
- `src/services/`: reservado à integração com o backend.
- `tests/`: testes de regras dos formulários, pesquisa e auditoria.
- `legacy-web/`: painel React/Vite anterior preservado.

## Verificações

```powershell
npm run typecheck
npm run lint
npm test
npx expo-doctor
npx expo export --platform all
```

O ZIP original foi usado como referência, sem executar suas configurações de
deploy ou substituir a configuração Expo. Não há URLs temporárias do Figma nos
componentes. O backend pode ser integrado posteriormente em `src/services`.

## Pendências de dependências

A instalação de 23/10/2026 apontou 21 alertas transitivos no npm (3 moderados e
18 altos). O Expo passou nas verificações de compatibilidade. Não foi aplicado
`npm audit fix --force`, que pode trocar versões principais e quebrar o SDK.
