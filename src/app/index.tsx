import { Redirect } from 'expo-router';
import { useApp } from '../state/AppProvider';
import { LoginScreen } from '../screens/LoginScreen';
export default function Index() {
  const { session, contracts } = useApp();
  return session ? <Redirect href={`/contracts/${contracts[0].id}`} /> : <LoginScreen />;
}
