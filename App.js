import { StyleSheet, Text, View } from 'react-native';
import OnboardingScreen from './src/screens/Auth/OnboardingScreen';
export default function App() {
  return (
    <>
      <OnboardingScreen />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3f813f9b',
    alignItems: 'center',
    justifyContent: 'center',

  },
});
