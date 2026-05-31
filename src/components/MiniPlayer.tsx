import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { PlayIcon, PauseIcon, HeartIcon } from './Icons';
import { catalogService } from '../services/catalogService';
import type { Song } from '../types';

const SPOTIFY_GREEN = '#1DB954';

type Props = {
  currentSong: Song;
  isPlaying: boolean;
  isLiked: boolean;
  progressPercent?: number;
  onOpenNowPlaying: () => void;
  onTogglePlay: () => void;
  onToggleLike: () => void;
};

export default function MiniPlayer({
  currentSong,
  isPlaying,
  isLiked,
  progressPercent = 15,
  onOpenNowPlaying,
  onTogglePlay,
  onToggleLike,
}: Props) {
  const songs = catalogService.getSongsSync();
  const index = songs.findIndex(s => s.id === currentSong.id);

  return (
    <>
      <TouchableOpacity
        style={styles.miniPlayer}
        onPress={onOpenNowPlaying}
        activeOpacity={0.9}>
        <Image
          source={catalogService.getCoverForIndex(index >= 0 ? index : 0)}
          style={styles.miniCover}
        />
        <View style={styles.miniInfo}>
          <Text style={styles.miniTitle} numberOfLines={1}>
            {currentSong.title}
          </Text>
          <Text style={styles.miniArtist} numberOfLines={1}>
            {currentSong.artist?.name ?? 'Artiste inconnu'}
          </Text>
        </View>
        <TouchableOpacity onPress={onToggleLike} hitSlop={8}>
          <HeartIcon size={16} color={SPOTIFY_GREEN} fill={isLiked} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.miniPlayBtn} onPress={onTogglePlay}>
          {isPlaying ? (
            <PauseIcon size={16} color="#fff" />
          ) : (
            <PlayIcon size={16} color="#fff" />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
      <View style={styles.miniProgress}>
        <View style={[styles.miniProgressFill, { width: `${progressPercent}%` }]} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  miniPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 50, 0.92)',
    marginHorizontal: 12,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 10,
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  miniCover: {
    width: 42,
    height: 42,
    borderRadius: 8,
  },
  miniInfo: {
    flex: 1,
  },
  miniTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  miniArtist: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 1,
  },
  miniPlayBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: SPOTIFY_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniProgress: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 12,
    position: 'absolute',
    bottom: 76,
    left: 0,
    right: 0,
    borderRadius: 1,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    backgroundColor: SPOTIFY_GREEN,
    borderRadius: 1,
  },
});
