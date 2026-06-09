import { useEffect, useRef, useState } from 'react';
import type { OnLoadData, OnProgressData } from 'react-native-video';
import NativeAudioPlayer from './NativeAudioPlayer';
import {
  resolveSources,
  type PlaybackSource,
} from '../services/audioResolver';
import {
  cacheSong,
  getCachedUri,
  isCacheable,
  releaseAllExcept,
} from '../services/audioCacheService';
import { musicService } from '../services/musicService';
import type { Song } from '../types';

type Props = {
  currentSong: Song | null;
  nextSong?: Song | null;
  isPlaying: boolean;
  onProgress: (currentTime: number, duration: number) => void;
  onTrackEnded: () => void;
  onError: (message: string) => void;
  onCacheStatus?: (status: { ratio: number; cached: boolean }) => void;
};

export default function GlobalAudioPlayer({
  currentSong,
  nextSong,
  isPlaying,
  onProgress,
  onTrackEnded,
  onError,
  onCacheStatus,
}: Props) {
  const loggedPlayRef = useRef(false);
  const [source, setSource] = useState<PlaybackSource | null>(null);

  // Repli hors-ligne pour le morceau courant (asset embarqué), + garde anti-boucle.
  const fallbackRef = useRef<{ songId: string; bundled: number | null }>({
    songId: '',
    bundled: null,
  });
  const usingFallbackRef = useRef(false);

  const songId = currentSong?.id ?? null;
  const songUrl = currentSong?.audio_url ?? null;

  // Choix de la source + lecture intelligente avec cache progressif.
  useEffect(() => {
    let cancelled = false;

    if (!currentSong) {
      setSource(null);
      return;
    }

    const { bundled, remote } = resolveSources(currentSong);
    fallbackRef.current = { songId: currentSong.id, bundled };
    usingFallbackRef.current = false;
    loggedPlayRef.current = false;

    if (remote) {
      // En ligne : on récupère le morceau via la plateforme (streaming) et on
      // le télécharge progressivement dans le cache de l'appareil.
      onCacheStatus?.({ ratio: 0, cached: false });
      (async () => {
        const cached = await getCachedUri(currentSong.id);
        if (cancelled) return;

        if (cached) {
          // Déjà en cache : lecture locale (instantanée, hors-ligne possible).
          setSource({ uri: cached });
          onCacheStatus?.({ ratio: 1, cached: true });
          return;
        }

        setSource(remote);
        if (isCacheable(currentSong)) {
          cacheSong(currentSong, (id, ratio) => {
            if (!cancelled && id === currentSong.id) {
              onCacheStatus?.({ ratio, cached: ratio >= 1 });
            }
          }).catch(() => {});
        }
      })();
    } else if (bundled != null) {
      // Pas de source distante : asset embarqué (hors-ligne).
      setSource(bundled);
      onCacheStatus?.({ ratio: 1, cached: true });
    } else {
      setSource(null);
      onError('Aucune source audio disponible pour ce titre.');
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songId, songUrl]);

  // Pré-chargement du suivant + purge du cache (« suppression lorsqu'on traverse »).
  // On ne conserve que le morceau courant et le suivant.
  useEffect(() => {
    const keep = [currentSong?.id, nextSong?.id].filter(
      (id): id is string => Boolean(id),
    );
    releaseAllExcept(keep).catch(() => {});

    if (nextSong && isCacheable(nextSong)) {
      cacheSong(nextSong).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songId, nextSong?.id]);

  if (!source || !currentSong) return null;

  const fallbackDuration = currentSong.duration_seconds ?? 0;

  const handleProgress = (data: OnProgressData) => {
    const total =
      data.seekableDuration || data.playableDuration || fallbackDuration || 0;
    onProgress(data.currentTime, total);

    if (!loggedPlayRef.current && data.currentTime >= 30) {
      loggedPlayRef.current = true;
      musicService
        .logPlayHistory(currentSong.id, Math.floor(data.currentTime))
        .catch(() => {});
    }
  };

  const handleLoad = (data: OnLoadData) => {
    if (Number.isFinite(data.duration) && data.duration > 0) {
      onProgress(0, data.duration);
    }
  };

  // En cas d'échec du streaming (réseau coupé), repli automatique sur le fichier
  // local : cache déjà téléchargé, sinon asset embarqué. C'est le mode hors-ligne.
  const handleError = (message: string) => {
    const songIdAtError = currentSong.id;
    if (usingFallbackRef.current) {
      onError(message);
      return;
    }

    (async () => {
      const cached = await getCachedUri(songIdAtError);
      if (currentSong.id !== songIdAtError) return;

      const fallback: PlaybackSource | null = cached
        ? { uri: cached }
        : fallbackRef.current.songId === songIdAtError
          ? fallbackRef.current.bundled
          : null;

      if (fallback != null) {
        usingFallbackRef.current = true;
        setSource(fallback);
        onCacheStatus?.({ ratio: 1, cached: true });
      } else {
        onError(message);
      }
    })();
  };

  return (
    <NativeAudioPlayer
      source={source}
      paused={!isPlaying}
      onProgress={handleProgress}
      onLoad={handleLoad}
      onEnd={onTrackEnded}
      onError={handleError}
    />
  );
}
