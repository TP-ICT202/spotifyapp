// ============================================================
// hooks/usePlayer.ts
// Membre 2 & 4 — Hook React encapsulant l'état du lecteur
// ============================================================

import { useEffect, useRef, useState, useCallback } from 'react';
import TrackPlayer, {
  Event,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import { Song, PlayerState } from '../types';
import * as musicService from '../services/musicService';

const EVENTS_WATCHED = [
  Event.PlaybackTrackChanged,
  Event.PlaybackState,
  Event.PlaybackError,
];

export function usePlayer() {
  const playbackState   = usePlaybackState();
  const { position, duration } = useProgress(500); // mise à jour toutes les 500ms

  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [queue,        setQueue]       = useState<Song[]>([]);
  const [repeatMode,   setRepeatModeState] = useState<PlayerState['repeatMode']>('none');
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [volume,       setVolumeState] = useState(1);

  // ─── Suivi de la durée d'écoute pour logPlayHistory ──────────────────────
  const listenStartRef  = useRef<number | null>(null);
  const currentSongRef  = useRef<Song | null>(null);

  const flushListenLog = useCallback(async (song: Song | null, endPosition: number) => {
    if (!song || listenStartRef.current === null) return;
    const listenedSec = Math.round(endPosition - listenStartRef.current);
    if (listenedSec > 0) {
      await musicService.logPlayHistory(song.id, listenedSec);
    }
    listenStartRef.current = null;
  }, []);

  // ─── Événements TrackPlayer ───────────────────────────────────────────────
  useTrackPlayerEvents(EVENTS_WATCHED, async (event) => {
    if (event.type === Event.PlaybackTrackChanged) {
      // Fin du morceau précédent → flush
      await flushListenLog(currentSongRef.current, event.position ?? 0);

      // Nouveau morceau
      const trackIndex = event.nextTrack;
      if (trackIndex !== null && trackIndex !== undefined) {
        const track = await TrackPlayer.getTrack(trackIndex);
        if (track) {
          // Retrouver le Song complet depuis la queue
          const song = queue.find(s => s.id === track.id) ?? null;
          setCurrentSong(song);
          currentSongRef.current = song;
          listenStartRef.current = 0; // démarre le compteur
        }
      }
    }

    if (event.type === Event.PlaybackError) {
      console.error('[usePlayer] Erreur de lecture:', event.message);
    }
  });

  // Démarre/arrête le compteur selon l'état de lecture
  useEffect(() => {
    if (playbackState === State.Playing && listenStartRef.current === null) {
      listenStartRef.current = position;
    }
    if (playbackState === State.Paused || playbackState === State.Stopped) {
      if (listenStartRef.current !== null) {
        flushListenLog(currentSongRef.current, position);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playbackState]);

  // ─── Actions exposées ─────────────────────────────────────────────────────
  const loadAndPlay = useCallback(async (songs: Song[], startIndex = 0) => {
    setQueue(songs);
    await musicService.loadQueue(songs, startIndex);
    setCurrentSong(songs[startIndex] ?? null);
    currentSongRef.current = songs[startIndex] ?? null;
    listenStartRef.current = 0;
  }, []);

  const togglePlay = useCallback(async () => {
    playbackState === State.Playing
      ? await musicService.pause()
      : await musicService.play();
  }, [playbackState]);

  const next = useCallback(() => musicService.skipToNext(),     []);
  const prev = useCallback(() => musicService.skipToPrevious(), []);
  const seek = useCallback((s: number) => musicService.seekTo(s), []);

  const cycleRepeat = useCallback(async () => {
    const next: PlayerState['repeatMode'] =
      repeatMode === 'none' ? 'all' : repeatMode === 'all' ? 'one' : 'none';
    setRepeatModeState(next);
    await musicService.setRepeatMode(next);
  }, [repeatMode]);

  const toggleShuffle = useCallback(() => setShuffleEnabled(v => !v), []);

  const changeVolume = useCallback(async (v: number) => {
    setVolumeState(v);
    await musicService.setVolume(v);
  }, []);

  return {
    // État
    currentSong,
    queue,
    isPlaying: playbackState === State.Playing,
    isLoading: playbackState === State.Buffering || playbackState === State.Connecting,
    positionSec: position,
    durationSec: duration,
    repeatMode,
    shuffleEnabled,
    volume,
    // Actions
    loadAndPlay,
    togglePlay,
    next,
    prev,
    seek,
    cycleRepeat,
    toggleShuffle,
    changeVolume,
  };
}
