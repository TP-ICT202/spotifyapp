// ============================================================
// types/index.ts — Définitions de types partagés
// Membre 2 & 4 — Moteur de Lecture & Écran Now Playing
// ============================================================

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  audio_url: string;         // Lien direct vers le fichier MP3 hébergé
  cover_url?: string;        // Pochette d'album
  duration_sec: number;      // Durée totale en secondes
  play_count?: number;       // Mis à jour automatiquement par le trigger Supabase
  created_at?: string;
}

export interface PlayHistory {
  id?: string;
  song_id: string;
  duration_sec: number;      // Durée réellement écoutée
  played_at?: string;
}

export interface PlayerState {
  currentSong: Song | null;
  queue: Song[];
  isPlaying: boolean;
  isLoading: boolean;
  positionSec: number;
  durationSec: number;
  repeatMode: 'none' | 'one' | 'all';
  shuffleEnabled: boolean;
  volume: number;            // 0.0 → 1.0
}
