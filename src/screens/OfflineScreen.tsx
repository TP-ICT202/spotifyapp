import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

type Props = {
  message?: string;
  onRetry: () => void;
  retrying?: boolean;
};

export default function OfflineScreen({ message, onRetry, retrying }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📡</Text>
      <Text style={styles.title}>Mode en ligne requis</Text>
      <Text style={styles.text}>
        {message ??
          'Kabod Music a besoin d’Internet et de Supabase pour le catalogue, la lecture et votre compte.'}
      </Text>
      <TouchableOpacity style={styles.btn} onPress={onRetry} disabled={retrying}>
        {retrying ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Réessayer</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  icon: { fontSize: 48, marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '700', color: '#fff', textAlign: 'center' },
  text: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    lineHeight: 22,
  },
  btn: {
    marginTop: 20,
    backgroundColor: '#1DB954',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 24,
    minWidth: 160,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
