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
estão implementados. O painel anterior não foi convertido para telas nativas:
esta entrega cobre a base Expo, a estrutura documentada e uma tela inicial.

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
