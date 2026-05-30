import { useState } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import NowPlayingScreen from './src/screens/NowPlayingScreen';
import DiscoverScreen from './src/screens/DiscoverScreen';

type Screen = 'nowplaying' | 'discover';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('discover');

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {currentScreen === 'nowplaying' ? (
          <NowPlayingScreen onNavigate={setCurrentScreen} />
        ) : (
          <DiscoverScreen onNavigate={setCurrentScreen} />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A12',
  } as ViewStyle,
});
