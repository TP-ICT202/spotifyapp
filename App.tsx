import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { authService } from './src/services/authService';

import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import DiscoverScreen from './src/screens/DiscoverScreen';
import NowPlayingScreen from './src/screens/NowPlayingScreen';

type AuthScreen = 'loading' | 'login' | 'signup' | 'app';
type AppScreen = 'discover' | 'nowplaying';

export default function App() {
  const [authScreen, setAuthScreen] = useState<AuthScreen>('loading');
  const [appScreen, setAppScreen] = useState<AppScreen>('discover');

  useEffect(() => {
    authService.getCurrentProfile().then(profile => {
      if (profile) {
        setAuthScreen('app');
      } else {
        setAuthScreen('login');
      }
    });

    const subscription = authService.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setAuthScreen('app');
      } else if (event === 'SIGNED_OUT') {
        setAuthScreen('login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // LOADING
  if (authScreen === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="###3aed4f" />
      </View>
    );
  }

  // LOGIN
  if (authScreen === 'login') {
    return (
      <LoginScreen
        onLoginSuccess={() => setAuthScreen('app')}
        onNavigateToSignUp={() => setAuthScreen('signup')}
      />
    );
  }

  // SIGNUP
  if (authScreen === 'signup') {
    return (
      <SignUpScreen
        onSignUpSuccess={() => setAuthScreen('login')}
        onNavigateToLogin={() => setAuthScreen('login')}
      />
    );
  }

  // APRES LOGIN
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {appScreen === 'discover' ? (
          <DiscoverScreen onNavigate={setAppScreen} />
        ) : (
          <NowPlayingScreen onNavigate={setAppScreen} />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A12',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0A0A0F',
    alignItems: 'center',
    justifyContent: 'center',
  },
});