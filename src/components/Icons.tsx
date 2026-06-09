import { View, type ViewStyle } from 'react-native';

function icon(size: number): ViewStyle {
  return { width: size, height: size, alignItems: 'center', justifyContent: 'center' };
}

export function PlayIcon({ size = 24, color = '#fff' }: { size?: number; color?: string }) {
  const s = size * 0.4;
  return (
    <View style={icon(size)}>
      <View style={{
        width: 0, height: 0,
        borderLeftWidth: s, borderTopWidth: s * 0.6, borderBottomWidth: s * 0.6,
        borderLeftColor: color, borderTopColor: 'transparent', borderBottomColor: 'transparent',
        marginLeft: 2,
      }} />
    </View>
  );
}

export function PauseIcon({ size = 24, color = '#fff' }: { size?: number; color?: string }) {
  const w = size * 0.3;
  return (
    <View style={[icon(size), { flexDirection: 'row', gap: size * 0.2 }]}>
      <View style={{ width: w, height: size * 0.65, backgroundColor: color, borderRadius: 2 }} />
      <View style={{ width: w, height: size * 0.65, backgroundColor: color, borderRadius: 2 }} />
    </View>
  );
}

export function SkipBackIcon({ size = 24, color = '#fff' }: { size?: number; color?: string }) {
  const s = size * 0.35;
  return (
    <View style={[icon(size), { flexDirection: 'row', alignItems: 'center' }]}>
      <View style={{ width: size * 0.1, height: size * 0.5, backgroundColor: color, borderRadius: 1 }} />
      <View style={{
        width: 0, height: 0,
        borderRightWidth: s, borderTopWidth: s * 0.55, borderBottomWidth: s * 0.55,
        borderRightColor: color, borderTopColor: 'transparent', borderBottomColor: 'transparent',
      }} />
    </View>
  );
}

export function SkipForwardIcon({ size = 24, color = '#fff' }: { size?: number; color?: string }) {
  const s = size * 0.35;
  return (
    <View style={[icon(size), { flexDirection: 'row', alignItems: 'center' }]}>
      <View style={{
        width: 0, height: 0,
        borderLeftWidth: s, borderTopWidth: s * 0.55, borderBottomWidth: s * 0.55,
        borderLeftColor: color, borderTopColor: 'transparent', borderBottomColor: 'transparent',
      }} />
      <View style={{ width: size * 0.1, height: size * 0.5, backgroundColor: color, borderRadius: 1 }} />
    </View>
  );
}

export function ShuffleIcon({ size = 24, color = '#fff' }: { size?: number; color?: string }) {
  const s = size * 0.2;
  return (
    <View style={icon(size)}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 0 }}>
        <View style={{ width: s * 1.2, height: 2, backgroundColor: color, transform: [{ rotate: '-45deg' }] }} />
        <View style={{
          width: 0, height: 0,
          borderLeftWidth: s * 0.6, borderBottomWidth: s * 0.35, borderTopWidth: s * 0.35,
          borderLeftColor: color, borderBottomColor: 'transparent', borderTopColor: 'transparent',
          transform: [{ rotate: '-45deg' }],
        }} />
      </View>
      <View style={{ position: 'absolute', bottom: size * 0.15, right: size * 0.1, flexDirection: 'row', alignItems: 'center', gap: 0 }}>
        <View style={{
          width: 0, height: 0,
          borderRightWidth: s * 0.6, borderBottomWidth: s * 0.35, borderTopWidth: s * 0.35,
          borderRightColor: color, borderBottomColor: 'transparent', borderTopColor: 'transparent',
          transform: [{ rotate: '45deg' }],
        }} />
        <View style={{ width: s * 1.2, height: 2, backgroundColor: color, transform: [{ rotate: '45deg' }] }} />
      </View>
    </View>
  );
}

export function RepeatIcon({ size = 24, color = '#fff' }: { size?: number; color?: string }) {
  const r = size * 0.32;
  return (
    <View style={icon(size)}>
      <View style={{
        position: 'absolute',
        width: r * 1.6, height: r * 1.6,
        borderRadius: r * 0.8,
        borderWidth: 2,
        borderColor: color,
        borderLeftColor: 'transparent',
        transform: [{ rotate: '-45deg' }],
      }} />
      <View style={{
        position: 'absolute', top: 0, right: size * 0.05,
        width: 0, height: 0,
        borderBottomWidth: 4, borderLeftWidth: 3, borderRightWidth: 3,
        borderBottomColor: color, borderLeftColor: 'transparent', borderRightColor: 'transparent',
      }} />
    </View>
  );
}

export function HeartIcon({ size = 24, color = '#fff', fill = false }: { size?: number; color?: string; fill?: boolean }) {
  return (
    <View style={icon(size)}>
      <View style={{
        width: size * 0.65, height: size * 0.58,
        backgroundColor: fill ? color : 'transparent',
        borderWidth: fill ? 0 : 2,
        borderColor: color,
        borderTopLeftRadius: size * 0.35,
        borderTopRightRadius: size * 0.35,
        transform: [{ rotate: '-45deg' }],
        marginTop: size * 0.05,
      }} />
    </View>
  );
}

export function ChevronDownIcon({ size = 24, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <View style={icon(size)}>
      <View style={{
        width: 0, height: 0,
        borderLeftWidth: size * 0.2, borderRightWidth: size * 0.2, borderTopWidth: size * 0.2,
        borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: color,
        marginTop: size * 0.1,
      }} />
    </View>
  );
}

export function MoreHorizontalIcon({ size = 24, color = '#fff' }: { size?: number; color?: string }) {
  const d = size * 0.12;
  return (
    <View style={[icon(size), { flexDirection: 'row', gap: size * 0.1 }]}>
      <View style={{ width: d, height: d, borderRadius: d / 2, backgroundColor: color }} />
      <View style={{ width: d, height: d, borderRadius: d / 2, backgroundColor: color }} />
      <View style={{ width: d, height: d, borderRadius: d / 2, backgroundColor: color }} />
    </View>
  );
}

export function ListMusicIcon({ size = 24, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <View style={icon(size)}>
      <View style={{ position: 'absolute', left: size * 0.1, top: size * 0.15, width: 2, height: size * 0.6, backgroundColor: color, borderRadius: 1 }} />
      <View style={{ position: 'absolute', left: size * 0.1, top: size * 0.5, width: size * 0.4, height: 1.5, backgroundColor: color }} />
      <View style={{ position: 'absolute', left: size * 0.1, top: size * 0.62, width: size * 0.3, height: 1.5, backgroundColor: color }} />
      <View style={{ position: 'absolute', right: size * 0.05, top: size * 0.2, width: size * 0.35, height: size * 0.35, borderRadius: size * 0.05, borderWidth: 1.5, borderColor: color }} />
    </View>
  );
}

export function MicIcon({ size = 24, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <View style={icon(size)}>
      <View style={{ width: size * 0.28, height: size * 0.42, borderRadius: size * 0.14, borderWidth: 2, borderColor: color, marginTop: size * 0.05 }} />
      <View style={{ position: 'absolute', bottom: size * 0.08, width: size * 0.06, height: size * 0.25, backgroundColor: color, borderRadius: 1 }} />
    </View>
  );
}

export function SearchIcon({ size = 24, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <View style={icon(size)}>
      <View style={{ width: size * 0.4, height: size * 0.4, borderRadius: size * 0.2, borderWidth: 2, borderColor: color }} />
      <View style={{ position: 'absolute', bottom: size * 0.08, right: size * 0.08, width: size * 0.25, height: 2, backgroundColor: color, transform: [{ rotate: '45deg' }] }} />
    </View>
  );
}

export function HomeIcon({ size = 24, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <View style={icon(size)}>
      <View style={{ width: size * 0.5, height: size * 0.45, backgroundColor: color, borderTopLeftRadius: size * 0.05, borderTopRightRadius: size * 0.05, marginTop: size * 0.1 }} />
      <View style={{ width: size * 0.6, height: size * 0.25, backgroundColor: color, borderRadius: size * 0.03 }} />
    </View>
  );
}

export function LibraryIcon({ size = 24, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <View style={[icon(size), { flexDirection: 'row', gap: size * 0.08 }]}>
      <View style={{ width: size * 0.2, height: size * 0.6, backgroundColor: color, borderRadius: 1 }} />
      <View style={{ width: size * 0.2, height: size * 0.45, backgroundColor: color, borderRadius: 1, marginTop: size * 0.15 }} />
      <View style={{ width: size * 0.2, height: size * 0.5, backgroundColor: color, borderRadius: 1, marginTop: size * 0.1 }} />
    </View>
  );
}

export function Equalizer({ size = 16, color = '#fff' }: { size?: number; color?: string }) {
  const bars = [0.3, 0.7, 0.5, 0.9, 0.4];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: size, gap: 1.5 }}>
      {bars.map((h, i) => (
        <View key={i} style={{ width: 2.5, height: size * h, backgroundColor: color, borderRadius: 1, opacity: 0.7 }} />
      ))}
    </View>
  );
}
