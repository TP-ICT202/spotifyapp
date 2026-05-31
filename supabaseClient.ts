// ============================================================
// components/MiniPlayer.tsx
// Membre 2 & 4 — Mini-lecteur persistant (barre en bas)
// ============================================================

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePlayer } from '../hooks/usePlayer';

const { width } = Dimensions.get('window');

export default function MiniPlayer() {
  const navigation = useNavigation<any>();
  const { currentSong, isPlaying, isLoading, togglePlay, next } = usePlayer();

  if (!currentSong) return null;

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.95}
      onPress={() => navigation.navigate('NowPlaying')}
    >
      {/* Pochette */}
      {currentSong.cover_url ? (
        <Image source={{ uri: currentSong.cover_url }} style={styles.cover} />
      ) : (
        <View style={[styles.cover, styles.coverPlaceholder]}>
          <Text style={styles.note}>♪</Text>
        </View>
      )}

      {/* Titre / Artiste */}
      <View style={styles.meta}>
        <Text style={styles.title} numberOfLines={1}>{currentSong.title}</Text>
        <Text style={styles.artist} numberOfLines={1}>{currentSong.artist}</Text>
      </View>

      {/* Bouton Play/Pause */}
      <TouchableOpacity
        onPress={togglePlay}
        style={styles.btn}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFF" size="small" />
        ) : (
          <Text style={styles.btnIcon}>{isPlaying ? '⏸' : '▶'}</Text>
        )}
      </TouchableOpacity>

      {/* Bouton Suivant */}
      <TouchableOpacity
        onPress={next}
        style={styles.btn}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.btnIcon}>⏭</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60,
    left: 8,
    right: 8,
    height: 64,
    backgroundColor: '#282828',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  cover: {
    width: 48,
    height: 48,
    borderRadius: 4,
    marginRight: 10,
  },
  coverPlaceholder: {
    backgroundColor: '#3E3E3E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  note: { color: '#B3B3B3', fontSize: 20 },
  meta: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  artist: {
    color: '#B3B3B3',
    fontSize: 12,
    marginTop: 2,
  },
  btn: {
    marginLeft: 12,
  },
  btnIcon: {
    color: '#FFFFFF',
    fontSize: 22,
  },
});
