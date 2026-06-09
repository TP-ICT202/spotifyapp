import { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Easing,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  type ViewStyle,
  type ImageStyle,
} from 'react-native';
import {
  ChevronDownIcon,
  MoreHorizontalIcon,
  PlayIcon,
  PauseIcon,
  SkipBackIcon,
  SkipForwardIcon,
  ShuffleIcon,
  RepeatIcon,
  HeartIcon,
  ListMusicIcon,
  MicIcon,
  Equalizer,
} from '../components/Icons';
import { catalogService } from '../services/catalogService';
import type { Song } from '../types';

const { width: SCREEN_W } = Dimensions.get('window');
const VINYL_SIZE = SCREEN_W * 0.68;
const SPOTIFY_GREEN = '#1DB954';

type ScreenProps = {
  onNavigate: (screen: 'nowplaying' | 'discover' | 'search' | 'library') => void;
  currentSong: Song | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  position: number;
  duration: number;
  audioError: string | null;
  isFavorite: (songId: string) => boolean;
  onToggleFavorite: (songId: string) => void;
};

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
};

export default function NowPlayingScreen({
  onNavigate,
  currentSong,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrevious,
  position,
  duration,
  audioError,
  isFavorite,
  onToggleFavorite,
}: ScreenProps) {
  const spinAnim = useRef(new Animated.Value(0)).current;

  // Animation vinyle
  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 6000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();
    } else {
      spinAnim.stopAnimation();
    }

    return () => spinAnim.stopAnimation();
  }, [isPlaying, spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressPercent = useMemo(() => {
    if (!duration) return 0;
    return Math.max(0, Math.min(100, (position / duration) * 100));
  }, [position, duration]);

  // Trouver l'index du morceau pour la couverture
  const songIndex = useMemo(() => {
    if (!currentSong) return 0;
    const idx = catalogService.getSongsSync().findIndex(s => s.id === currentSong.id);
    return idx >= 0 ? idx : 0;
  }, [currentSong]);

  const currentCover = useMemo(() => catalogService.getCoverForIndex(songIndex), [songIndex]);

  if (!currentSong) {
    return (
      <View style={styles.emptyContainer}>
        <StatusBar barStyle="light-content" />
        <View style={styles.emptyIconWrap}>
          <Text style={styles.emptyIcon}>🎵</Text>
        </View>
        <Text style={styles.emptyTitle}>Aucun titre en lecture</Text>
        <Text style={styles.emptyText}>
          Choisis une musique depuis Discover pour lancer la lecture.
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate('discover')}>
          <Text style={styles.backButtonText}>Retour au catalogue</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background */}
      <View style={styles.backgroundGrad} />
      <View style={styles.ambientBlobTop} />
      <View style={styles.ambientBlobBottom} />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => onNavigate('discover')}>
          <ChevronDownIcon size={18} color="#fff" />
        </TouchableOpacity>
        <View style={styles.topBarCenter}>
          <Text style={styles.topBarSub}>En lecture</Text>
          <Text style={styles.topBarTitle} numberOfLines={1}>
            {currentSong.album?.title ?? currentSong.artist?.name ?? ''}
          </Text>
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          <MoreHorizontalIcon size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Vinyl Disc */}
      <View style={styles.vinylWrapper}>
        <View style={styles.vinylGlow} />
        <Animated.View
          style={[styles.vinyl, { transform: [{ rotate: spin }] }]}>
          <View style={styles.groove1} />
          <View style={styles.groove2} />
          <View style={styles.groove3} />
          <View style={styles.albumArtContainer}>
            <Image source={currentCover} style={styles.albumArt} />
          </View>
          <View style={styles.spindle} />
        </Animated.View>
      </View>

      {/* Track Info */}
      <View style={styles.trackMeta}>
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {currentSong.title}
          </Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {currentSong.artist?.name ?? 'Artiste inconnu'}
            {currentSong.album?.title ? ` · ${currentSong.album.title}` : ''}
          </Text>
        </View>
        <TouchableOpacity onPress={() => currentSong && onToggleFavorite(currentSong.id)}>
          <HeartIcon
            size={26}
            color={currentSong && isFavorite(currentSong.id) ? SPOTIFY_GREEN : 'rgba(255,255,255,0.7)'}
            fill={currentSong ? isFavorite(currentSong.id) : false}
          />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${progressPercent}%` }]}
          />
          <View
            style={[styles.progressThumb, { left: `${progressPercent}%` }]}
          />
        </View>
        <View style={styles.progressTimes}>
          <Text style={styles.progressTime}>{formatTime(position)}</Text>
          <Text style={styles.progressTime}>
            {formatTime(duration || currentSong.duration_seconds)}
          </Text>
        </View>
      </View>

      {/* Error */}
      {audioError ? (
        <Text style={styles.audioError}>{audioError}</Text>
      ) : null}

      {/* Controls */}
      <View style={styles.controls}>
        <ShuffleIcon size={22} color="rgba(255,255,255,0.7)" />
        <TouchableOpacity onPress={onPrevious}>
          <SkipBackIcon size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.playBtn} onPress={onTogglePlay}>
          {isPlaying ? (
            <PauseIcon size={30} color="#fff" />
          ) : (
            <PlayIcon size={30} color="#fff" />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={onNext}>
          <SkipForwardIcon size={28} color="#fff" />
        </TouchableOpacity>
        <RepeatIcon size={22} color={SPOTIFY_GREEN} />
      </View>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomItem}>
          <ListMusicIcon size={16} color="rgba(255,255,255,0.7)" />
          <Text style={styles.bottomText}>Queue</Text>
        </View>
        <View style={styles.bottomItem}>
          <MicIcon size={16} color="rgba(255,255,255,0.7)" />
          <Text style={styles.bottomText}>Paroles</Text>
        </View>
        <Equalizer size={16} color={SPOTIFY_GREEN} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    backgroundColor: '#0A0A12',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  } as ViewStyle,
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(29, 185, 84, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  } as ViewStyle,
  emptyIcon: {
    fontSize: 36,
  } as ViewStyle,
  emptyTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  } as ViewStyle,
  emptyText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  } as ViewStyle,
  backButton: {
    marginTop: 16,
    backgroundColor: SPOTIFY_GREEN,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: SPOTIFY_GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  } as ViewStyle,
  backButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  } as ViewStyle,

  container: {
    flex: 1,
    backgroundColor: '#0A0A12',
  } as ViewStyle,
  backgroundGrad: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0A0A12',
  } as ViewStyle,
  ambientBlobTop: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: 'rgba(29, 185, 84, 0.08)',
  } as ViewStyle,
  ambientBlobBottom: {
    position: 'absolute',
    bottom: -120,
    right: -120,
    width: 460,
    height: 460,
    borderRadius: 230,
    backgroundColor: 'rgba(29, 185, 84, 0.06)',
  } as ViewStyle,

  topBar: {
    height: 56,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  } as ViewStyle,
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  } as ViewStyle,
  topBarCenter: { alignItems: 'center', maxWidth: '70%' } as ViewStyle,
  topBarSub: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.6)',
  } as ViewStyle,
  topBarTitle: { fontSize: 13, fontWeight: '600', color: '#fff' } as ViewStyle,

  vinylWrapper: {
    alignItems: 'center',
    marginTop: 24,
  } as ViewStyle,
  vinylGlow: {
    position: 'absolute',
    width: VINYL_SIZE + 40,
    height: VINYL_SIZE + 40,
    borderRadius: (VINYL_SIZE + 40) / 2,
    backgroundColor: 'rgba(29, 185, 84, 0.12)',
    top: -20,
  } as ViewStyle,
  vinyl: {
    width: VINYL_SIZE,
    height: VINYL_SIZE,
    borderRadius: VINYL_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a2e',
  } as ViewStyle,
  groove1: {
    position: 'absolute',
    width: VINYL_SIZE - 24,
    height: VINYL_SIZE - 24,
    borderRadius: (VINYL_SIZE - 24) / 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  } as ViewStyle,
  groove2: {
    position: 'absolute',
    width: VINYL_SIZE - 48,
    height: VINYL_SIZE - 48,
    borderRadius: (VINYL_SIZE - 48) / 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  } as ViewStyle,
  groove3: {
    position: 'absolute',
    width: VINYL_SIZE - 80,
    height: VINYL_SIZE - 80,
    borderRadius: (VINYL_SIZE - 80) / 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  } as ViewStyle,
  albumArtContainer: {
    width: VINYL_SIZE * 0.54,
    height: VINYL_SIZE * 0.54,
    borderRadius: VINYL_SIZE * 0.27,
    overflow: 'hidden',
  } as ViewStyle,
  albumArt: {
    width: '100%',
    height: '100%',
  } as ImageStyle,
  spindle: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  } as ViewStyle,

  trackMeta: {
    paddingHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 28,
  } as ViewStyle,
  trackInfo: { flex: 1, marginRight: 12 } as ViewStyle,
  trackTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  } as ViewStyle,
  trackArtist: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  } as ViewStyle,

  progressSection: {
    paddingHorizontal: 28,
    marginTop: 20,
  } as ViewStyle,
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    position: 'relative',
  } as ViewStyle,
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: SPOTIFY_GREEN,
    borderRadius: 2,
  } as ViewStyle,
  progressThumb: {
    position: 'absolute',
    top: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  } as ViewStyle,
  progressTimes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  } as ViewStyle,
  progressTime: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
  } as ViewStyle,

  audioError: {
    color: '#f87171',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 28,
  } as ViewStyle,

  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: 'rgba(30, 30, 50, 0.65)',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  } as ViewStyle,
  playBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: SPOTIFY_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: SPOTIFY_GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  } as ViewStyle,

  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 34,
    left: 20,
    right: 20,
  } as ViewStyle,
  bottomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  } as ViewStyle,
  bottomText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  } as ViewStyle,
});
