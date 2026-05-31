import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { HomeIcon, SearchIcon, LibraryIcon } from './Icons';

export type TabId = 'discover' | 'search' | 'library';

type Props = {
  active: TabId;
  onNavigate: (screen: TabId) => void;
};

function TabBtn({
  icon,
  label,
  active,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.tabItem} onPress={onPress} activeOpacity={0.7}>
      {icon}
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function BottomTabBar({ active, onNavigate }: Props) {
  return (
    <View style={styles.tabBar}>
      <TabBtn
        icon={<HomeIcon size={20} color={active === 'discover' ? '#fff' : 'rgba(255,255,255,0.55)'} />}
        label="Home"
        active={active === 'discover'}
        onPress={() => onNavigate('discover')}
      />
      <TabBtn
        icon={<SearchIcon size={20} color={active === 'search' ? '#fff' : 'rgba(255,255,255,0.55)'} />}
        label="Search"
        active={active === 'search'}
        onPress={() => onNavigate('search')}
      />
      <TabBtn
        icon={<LibraryIcon size={20} color={active === 'library' ? '#fff' : 'rgba(255,255,255,0.55)'} />}
        label="Library"
        active={active === 'library'}
        onPress={() => onNavigate('library')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 35, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 12,
    paddingBottom: 24,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    alignItems: 'center',
    gap: 4,
  },
  tabLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
  },
  tabLabelActive: {
    color: '#fff',
  },
});
