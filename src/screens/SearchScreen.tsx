import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SearchIcon } from '../components/Icons';
import BottomTabBar from '../components/BottomTabBar';
import MiniPlayer from '../components/MiniPlayer';
import { catalogService } from '../services/catalogService';
import type { Song } from '../types';

type AppScreen = 'discover' | 'nowplaying' | 'search' | 'library';

type ScreenProps = {
  onNavigate: (screen: AppScreen) => void;
  currentSong: Song | null;
  isPlaying: boolean;
  onPlaySong: (song: Song, queue: Song[]) => void;
  onTogglePlay: () => void;
  playbackProgress: number;
  isFavorite: (songId: string) => boolean;
  onToggleFavorite: (songId: string) => void;
};

const QUICK_CATEGORIES = [
  { label: 'Gospel', color: '#E91E63', emoji: '🙏' },
  { label: 'Louange', color: '#1DB954', emoji: '🎶' },
  { label: 'Worship', color: '#FF9800', emoji: '🕊️' },
  { label: 'Kabod', color: '#2196F3', emoji: '✨' },
  { label: 'Remix', color: '#9C27B0', emoji: '🎧' },
  { label: 'Live', color: '#00BCD4', emoji: '🎸' },
];

export default function SearchScreen({
  onNavigate,
  currentSong,
  isPlaying,
  onPlaySong,
  onTogglePlay,
  playbackProgress,
  isFavorite,
  onToggleFavorite,
}: ScreenProps) {
  const [query, setQuery] = useState('');
  const allSongs = catalogService.getSongsSync();
  const results = useMemo(() => catalogService.searchSongs(query), [query, allSongs]);
  const hasQuery = query.trim().length > 0;
  const displayList = hasQuery ? results : allSongs;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Rechercher</Text>
        </View>

        <View style={styles.searchBar}>
          <SearchIcon size={18} color="rgba(255,255,255,0.5)" />
          <TextInput
            style={styles.searchInput}
            placeholder="Titre, artiste, album..."
            placeholderTextColor="rgba(255,255,255,0.35)"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {hasQuery ? (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {!hasQuery ? (
          <>
            <Text style={styles.sectionTitle}>Explorer</Text>
            <View style={styles.categoriesGrid}>
              {QUICK_CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat.label}
                  style={[styles.categoryCard, { backgroundColor: cat.color }]}
                  onPress={() => setQuery(cat.label)}
                  activeOpacity={0.8}>
                  <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                  <Text style={styles.categoryLabel}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.sectionTitle}>Parcourir tout</Text>
          </>
        ) : (
          <Text style={styles.sectionTitle}>
            {results.length} résultat{results.length !== 1 ? 's' : ''}
          </Text>
        )}

        <View style={styles.songList}>
          {displayList.map((song, index) => {
            const globalIndex = allSongs.findIndex(s => s.id === song.id);
            const isCurrentSong = currentSong?.id === song.id;
            return (
              <TouchableOpacity
                key={song.id}
                style={[styles.songRow, isCurrentSong && styles.songRowActive]}
                onPress={() => onPlaySong(song, displayList)}
                activeOpacity={0.7}>
                <Image
                  source={catalogService.getCoverForIndex(globalIndex >= 0 ? globalIndex : index)}
                  style={styles.songCover}
                />
                <View style={styles.songInfo}>
                  <Text
                    style={[styles.songTitle, isCurrentSong && styles.songTitleActive]}
                    numberOfLines={1}>
                    {song.title}
                  </Text>
                  <Text style={styles.songArtist} numberOfLines={1}>
                    {song.artist?.name ?? 'Artiste inconnu'}
                  </Text>
                </View>
                <Text style={styles.songDuration}>
                  {Math.floor(song.duration_seconds / 60)}:
                  {String(Math.floor(song.duration_seconds % 60)).padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 140 }} />
      </ScrollView>

      {currentSong ? (
        <MiniPlayer
          currentSong={currentSong}
          isPlaying={isPlaying}
          isLiked={isFavorite(currentSong.id)}
          progressPercent={playbackProgress}
          onOpenNowPlaying={() => onNavigate('nowplaying')}
          onTogglePlay={onTogglePlay}
          onToggleLike={() => onToggleFavorite(currentSong.id)}
        />
      ) : null}

      <BottomTabBar active="search" onNavigate={onNavigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A12' },
  scroll: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 16 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#fff', letterSpacing: -0.5 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    marginHorizontal: 24,
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  searchInput: { flex: 1, fontSize: 15, color: '#fff', padding: 0 },
  clearBtn: { fontSize: 16, color: 'rgba(255,255,255,0.5)', padding: 4 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 14,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 10,
  },
  categoryCard: {
    width: '47%',
    height: 90,
    borderRadius: 14,
    padding: 14,
    justifyContent: 'space-between',
  },
  categoryEmoji: { fontSize: 24 },
  categoryLabel: { fontSize: 14, fontWeight: '700', color: '#fff' },
  songList: { paddingHorizontal: 24, gap: 4 },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 12,
  },
  songRowActive: { backgroundColor: 'rgba(29, 185, 84, 0.1)' },
  songCover: { width: 48, height: 48, borderRadius: 8 },
  songInfo: { flex: 1 },
  songTitle: { fontSize: 14, fontWeight: '600', color: '#fff' },
  songTitleActive: { color: '#1DB954' },
  songArtist: { fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 2 },
  songDuration: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
});
