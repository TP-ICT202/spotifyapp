import { useState } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, ScrollView,
  type ViewStyle, type ImageStyle,
} from 'react-native';
import {
  PlayIcon, PauseIcon, SearchIcon, HeartIcon, HomeIcon, LibraryIcon,
} from '../components/Icons';

const SPOTIFY_GREEN = '#1DB954';
const GRADIENT_GREEN = ['#1DB954', '#169C46'];

const albums = [
  { id: 'a1', src: require('../assets/album-1.jpg'), title: 'Neon Pulse', artist: 'Aurora Wave' },
  { id: 'a2', src: require('../assets/album-2.jpg'), title: 'Midnight Echo', artist: 'Lux Ferre' },
  { id: 'a3', src: require('../assets/album-3.jpg'), title: 'Liquid Chrome', artist: 'Nyx' },
  { id: 'a4', src: require('../assets/album-4.jpg'), title: 'Sunset Vector', artist: 'Halo Drive' },
  { id: 'a5', src: require('../assets/album-5.jpg'), title: 'Rainwindow', artist: 'Kira Lo' },
  { id: 'a6', src: require('../assets/album-6.jpg'), title: 'Smoke Stage', artist: 'The Quartet' },
];

type ScreenProps = { onNavigate: (screen: 'nowplaying' | 'discover') => void };

export default function DiscoverScreen({ onNavigate }: ScreenProps) {
  const [tab, setTab] = useState<'home' | 'search' | 'library'>('search');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.bgGrad} />

      {/* status bar */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>9:41</Text>
        <Text style={styles.statusText}>●●● ▮▮▮</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSub}>Made for you</Text>
            <Text style={styles.headerTitle}>Discover Weekly</Text>
          </View>
          <TouchableOpacity style={styles.searchBtn}>
            <SearchIcon size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* hero card */}
        <View style={styles.heroCard}>
          <Image source={albums[3].src} style={styles.heroBg} />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>Weekly mix</Text>
            </View>
            <View style={styles.heroTextGroup}>
              <Text style={styles.heroText}>Your soundtrack{'\n'}for this week</Text>
              <Text style={styles.heroMeta}>30 songs · 1 hr 42 min · Updated Monday</Text>
            </View>
            <TouchableOpacity style={styles.heroPlayBtn}>
              <PlayIcon size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* in rotation grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>In rotation</Text>
          <Text style={styles.sectionSeeAll}>SEE ALL</Text>
        </View>

        <View style={styles.grid}>
          {albums.map((a) => (
            <View key={a.id} style={styles.gridCard}>
              <Image source={a.src} style={styles.gridImage} />
              <View style={styles.gridInfo}>
                <Text style={styles.gridTitle} numberOfLines={1}>{a.title}</Text>
                <Text style={styles.gridArtist} numberOfLines={1}>{a.artist}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* mini player */}
      <TouchableOpacity style={styles.miniPlayer} onPress={() => onNavigate('nowplaying')}>
        <Image source={albums[0].src} style={styles.miniCover} />
        <View style={styles.miniInfo}>
          <Text style={styles.miniTitle} numberOfLines={1}>Velvet Sky</Text>
          <Text style={styles.miniArtist} numberOfLines={1}>Aurora Wave</Text>
        </View>
        <HeartIcon size={16} color={SPOTIFY_GREEN} fill />
        <TouchableOpacity style={styles.miniPlayBtn}>
          <PauseIcon size={16} color="#fff" />
        </TouchableOpacity>
      </TouchableOpacity>
      <View style={styles.miniProgress}>
        <View style={[styles.miniProgressFill, { width: '42%' }]} />
      </View>

      {/* tab bar */}
      <View style={styles.tabBar}>
        <TabBtn icon={<HomeIcon size={20} color={tab === 'home' ? '#fff' : 'rgba(255,255,255,0.55)'} />} label="Home" active={tab === 'home'} onPress={() => setTab('home')} />
        <TabBtn icon={<SearchIcon size={20} color={tab === 'search' ? '#fff' : 'rgba(255,255,255,0.55)'} />} label="Search" active={tab === 'search'} onPress={() => setTab('search')} />
        <TabBtn icon={<LibraryIcon size={20} color={tab === 'library' ? '#fff' : 'rgba(255,255,255,0.55)'} />} label="Library" active={tab === 'library'} onPress={() => setTab('library')} />
      </View>
    </View>
  );
}

function TabBtn({ icon, label, active, onPress }: {
  icon: React.ReactNode; label: string; active: boolean; onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.tabItem} onPress={onPress}>
      {icon}
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A12',
  } as ViewStyle,

  bgGrad: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0A0A12',
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

  scroll: {
    flex: 1,
  } as ViewStyle,

  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as ViewStyle,
  headerSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  } as ViewStyle,
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: '#fff',
    marginTop: 2,
  } as ViewStyle,
  searchBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  } as ViewStyle,

  heroCard: {
    marginHorizontal: 24,
    marginTop: 16,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
  } as ViewStyle,
  heroBg: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  } as ImageStyle,
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
  } as ViewStyle,
  heroContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  } as ViewStyle,
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  } as ViewStyle,
  heroBadgeText: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#fff',
  } as ViewStyle,
  heroTextGroup: {
    position: 'absolute',
    bottom: 16,
    left: 16,
  } as ViewStyle,
  heroText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 26,
  } as ViewStyle,
  heroMeta: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  } as ViewStyle,
  heroPlayBtn: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: SPOTIFY_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: SPOTIFY_GREEN,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  } as ViewStyle,

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 12,
  } as ViewStyle,
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  } as ViewStyle,
  sectionSeeAll: {
    fontSize: 10,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.55)',
  } as ViewStyle,

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 10,
  } as ViewStyle,
  gridCard: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 6,
    gap: 8,
  } as ViewStyle,
  gridImage: {
    width: 44,
    height: 44,
    borderRadius: 6,
  } as ImageStyle,
  gridInfo: {
    flex: 1,
  } as ViewStyle,
  gridTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  } as ViewStyle,
  gridArtist: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 1,
  } as ViewStyle,

  miniPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 50, 0.85)',
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
  } as ViewStyle,
  miniCover: {
    width: 40,
    height: 40,
    borderRadius: 8,
  } as ImageStyle,
  miniInfo: {
    flex: 1,
  } as ViewStyle,
  miniTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  } as ViewStyle,
  miniArtist: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
  } as ViewStyle,
  miniPlayBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: SPOTIFY_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

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
  } as ViewStyle,
  miniProgressFill: {
    height: '100%',
    backgroundColor: SPOTIFY_GREEN,
    borderRadius: 1,
  } as ViewStyle,

  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 50, 0.85)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingTop: 12,
    paddingBottom: 24,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  } as ViewStyle,
  tabItem: {
    alignItems: 'center',
    gap: 4,
  } as ViewStyle,
  tabLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
  } as ViewStyle,
  tabLabelActive: {
    color: '#fff',
  } as ViewStyle,
});
