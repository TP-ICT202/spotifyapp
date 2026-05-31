import React, { useState, useEffect, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { authService } from './src/services/authService';
import { catalogService } from './src/services/catalogService';
import { favoritesService } from './src/services/favoritesService';
import type { Song } from './src/types';

import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import DiscoverScreen from './src/screens/DiscoverScreen';
import NowPlayingScreen from './src/screens/NowPlayingScreen';
import SearchScreen from './src/screens/SearchScreen';
import LibraryScreen from './src/screens/LibraryScreen';

type AuthScreen = 'loading' | 'login' | 'signup' | 'app';
type AppScreen = 'discover' | 'nowplaying' | 'search' | 'library';

export default function App() {
  const [authScreen, setAuthScreen] = useState<AuthScreen>('loading');
  const [appScreen, setAppScreen] = useState<AppScreen>('discover');
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [catalogReady, setCatalogReady] = useState(false);

  const refreshFavorites = useCallback(async () => {
    const ids = await favoritesService.getFavoriteIds();
    setFavoriteIds(ids);
  }, []);

  const toggleFavorite = useCallback(
    async (songId: string) => {
      await favoritesService.toggleFavorite(songId);
      await refreshFavorites();
    },
    [refreshFavorites],
  );

  const isFavorite = useCallback(
    (songId: string) => favoriteIds.includes(songId),
    [favoriteIds],
  );

  const setPlaybackFromDiscover = (song: Song, songs: Song[]) => {
    setQueue(songs);
    setCurrentSong(song);
    setIsPlaying(true);
    setPlaybackProgress(0);
    setAppScreen('nowplaying');
  };

  const togglePlay = () => {
    if (!currentSong) return;
    setIsPlaying(prev => !prev);
  };

  const goToAdjacentSong = (direction: -1 | 1) => {
    if (!currentSong || queue.length === 0) return;
    const index = queue.findIndex(song => song.id === currentSong.id);
    if (index < 0) return;
    const nextIndex = (index + direction + queue.length) % queue.length;
    setCurrentSong(queue[nextIndex]);
    setIsPlaying(true);
    setPlaybackProgress(0);
  };

  const goToNextSong = () => goToAdjacentSong(1);
  const goToPreviousSong = () => goToAdjacentSong(-1);

  const handleLogout = async () => {
    await authService.signOut();
    setAuthScreen('login');
    setCurrentSong(null);
    setIsPlaying(false);
  };

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

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (authScreen !== 'app') return;

    let cancelled = false;
    (async () => {
      await catalogService.loadCatalog();
      await refreshFavorites();
      if (!cancelled) setCatalogReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [authScreen, refreshFavorites]);

  if (authScreen === 'loading' || (authScreen === 'app' && !catalogReady)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  if (authScreen === 'login') {
    return (
      <LoginScreen
        onLoginSuccess={() => setAuthScreen('app')}
        onNavigateToSignUp={() => setAuthScreen('signup')}
      />
    );
  }

  if (authScreen === 'signup') {
    return (
      <SignUpScreen
        onSignUpSuccess={() => setAuthScreen('login')}
        onNavigateToLogin={() => setAuthScreen('login')}
      />
    );
  }

  const screenProps = {
    onNavigate: setAppScreen,
    currentSong,
    isPlaying,
    onPlaySong: setPlaybackFromDiscover,
    onTogglePlay: togglePlay,
    playbackProgress,
    favoriteIds,
    isFavorite,
    onToggleFavorite: toggleFavorite,
    onLogout: handleLogout,
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {appScreen === 'discover' && <DiscoverScreen {...screenProps} />}
        {appScreen === 'nowplaying' && (
          <NowPlayingScreen
            {...screenProps}
            onNext={goToNextSong}
            onPrevious={goToPreviousSong}
            onTrackEnded={goToNextSong}
            onProgressUpdate={setPlaybackProgress}
          />
        )}
        {appScreen === 'search' && <SearchScreen {...screenProps} />}
        {appScreen === 'library' && <LibraryScreen {...screenProps} />}
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
