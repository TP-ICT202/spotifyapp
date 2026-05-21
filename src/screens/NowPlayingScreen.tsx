import { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Image, Animated, Easing, TouchableOpacity, StatusBar,
  Dimensions, type ViewStyle, type ImageStyle,
} from 'react-native';
import {
  ChevronDownIcon, MoreHorizontalIcon, PlayIcon, PauseIcon,
  SkipBackIcon, SkipForwardIcon, ShuffleIcon, RepeatIcon,
  HeartIcon, ListMusicIcon, MicIcon, Equalizer,
} from '../components/Icons';

const { width: SCREEN_W } = Dimensions.get('window');
const VINYL_SIZE = SCREEN_W * 0.74;
const GRADIENT_GREEN = ['#1DB954', '#169C46'];
const SPOTIFY_GREEN = '#1DB954';

type ScreenProps = { onNavigate: (screen: 'nowplaying' | 'discover') => void };

const albumImages: Record<string, any> = {
  album1: require('../assets/album-1.jpg'),
  album2: require('../assets/album-2.jpg'),
  album3: require('../assets/album-3.jpg'),
  album4: require('../assets/album-4.jpg'),
  album5: require('../assets/album-5.jpg'),
  album6: require('../assets/album-6.jpg'),
};

export default function NowPlayingScreen({ onNavigate }: ScreenProps) {
  const [playing, setPlaying] = useState(true);
  const [liked, setLiked] = useState(true);
  const [progress] = useState(42);

  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (playing) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 6000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinAnim.stopAnimation();
    }
    return () => spinAnim.stopAnimation();
  }, [playing, spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.backgroundGrad} />
      <View style={styles.ambientBlobTop} />
      <View style={styles.ambientBlobBottom} />

      {/* status bar */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>9:41</Text>
        <Text style={styles.statusText}>●●● ▮▮▮</Text>
      </View>

      {/* top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => onNavigate('discover')}>
          <ChevronDownIcon size={18} color="#fff" />
        </TouchableOpacity>
        <View style={styles.topBarCenter}>
          <Text style={styles.topBarSub}>Playing from album</Text>
          <Text style={styles.topBarTitle}>Neon Pulse</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          <MoreHorizontalIcon size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* vinyl */}
      <View style={styles.vinylWrapper}>
        <View style={styles.vinylGlow} />
        <Animated.View style={[styles.vinyl, { transform: [{ rotate: spin }] }]}>
          <View style={styles.groove1} />
          <View style={styles.groove2} />
          <View style={styles.groove3} />
          <View style={styles.albumArtContainer}>
            <Image source={albumImages.album1} style={styles.albumArt} />
          </View>
          <View style={styles.spindle} />
        </Animated.View>
      </View>

      {/* track meta */}
      <View style={styles.trackMeta}>
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle}>Velvet Sky</Text>
          <Text style={styles.trackArtist}>Aurora Wave · Neon Pulse</Text>
        </View>
        <TouchableOpacity onPress={() => setLiked(v => !v)}>
          <HeartIcon size={26} color={liked ? SPOTIFY_GREEN : 'rgba(255,255,255,0.7)'} fill={liked} />
        </TouchableOpacity>
      </View>

      {/* progress */}
      <View style={styles.progressSection}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` as any }]} />
          <View style={[styles.progressThumb, { left: `${progress}%` as any }]} />
        </View>
        <View style={styles.progressTimes}>
          <Text style={styles.progressTime}>1:21</Text>
          <Text style={styles.progressTime}>3:14</Text>
        </View>
      </View>

      {/* controls */}
      <View style={styles.controls}>
        <ShuffleIcon size={22} color="rgba(255,255,255,0.7)" />
        <SkipBackIcon size={28} color="#fff" />
        <TouchableOpacity
          style={styles.playBtn}
          onPress={() => setPlaying(v => !v)}
        >
          {playing
            ? <PauseIcon size={30} color="#fff" />
            : <PlayIcon size={30} color="#fff" />}
        </TouchableOpacity>
        <SkipForwardIcon size={28} color="#fff" />
        <RepeatIcon size={22} color={SPOTIFY_GREEN} />
      </View>

      {/* bottom bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomItem}>
          <ListMusicIcon size={16} color="rgba(255,255,255,0.7)" />
          <Text style={styles.bottomText}>Up next</Text>
        </View>
        <View style={styles.bottomItem}>
          <MicIcon size={16} color="rgba(255,255,255,0.7)" />
          <Text style={styles.bottomText}>Lyrics</Text>
        </View>
        <Equalizer size={16} color="rgba(255,255,255,0.7)" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A12',
  } as ViewStyle,
  backgroundGrad: {
    ...StyleSheet.absoluteFill,
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

  statusBar: {
    height: 44,
    paddingHorizontal: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as ViewStyle,
  statusText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    letterSpacing: 1,
  } as ViewStyle,

  topBar: {
    height: 52,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as ViewStyle,
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  } as ViewStyle,
  topBarCenter: { alignItems: 'center' } as ViewStyle,
  topBarSub: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.6)',
  } as ViewStyle,
  topBarTitle: { fontSize: 12, fontWeight: '600', color: '#fff' } as ViewStyle,

  vinylWrapper: {
    alignItems: 'center',
    marginTop: 32,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 30 },
    shadowOpacity: 0.7,
    shadowRadius: 60,
    elevation: 30,
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
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
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
    marginTop: 32,
  } as ViewStyle,
  trackInfo: { flex: 1, marginRight: 12 } as ViewStyle,
  trackTitle: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: '#fff',
  } as ViewStyle,
  trackArtist: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  } as ViewStyle,

  progressSection: {
    paddingHorizontal: 28,
    marginTop: 24,
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
    backgroundColor: GRADIENT_GREEN[0],
    borderRadius: 2,
  } as unknown as ViewStyle,
  progressThumb: {
    position: 'absolute',
    top: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  } as ViewStyle,
  progressTimes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  } as ViewStyle,
  progressTime: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
    fontVariant: ['tabular-nums'],
  } as ViewStyle,

  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 28,
    marginHorizontal: 20,
    backgroundColor: 'rgba(30, 30, 50, 0.65)',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  } as ViewStyle,
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: GRADIENT_GREEN[0],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: SPOTIFY_GREEN,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
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
