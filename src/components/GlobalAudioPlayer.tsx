import { useMemo, useRef } from 'react';
import type { OnLoadData, OnProgressData } from 'react-native-video';
import NativeAudioPlayer from './NativeAudioPlayer';
import { resolvePlaybackSource } from '../services/audioResolver';
import { musicService } from '../services/musicService';
import type { Song } from '../types';

type Props = {
  currentSong: Song | null;
  isPlaying: boolean;
  onProgress: (currentTime: number, duration: number) => void;
  onTrackEnded: () => void;
  onError: (message: string) => void;
};

export default function GlobalAudioPlayer({
  currentSong,
  isPlaying,
  onProgress,
  onTrackEnded,
  onError,
}: Props) {
  const loggedPlayRef = useRef(false);

  const playbackSource = useMemo(() => {
    if (!currentSong) return null;
    return resolvePlaybackSource(currentSong);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong?.id, currentSong?.audio_url]);

  if (!playbackSource || !currentSong) return null;

  const fallbackDuration = currentSong.duration_seconds ?? 0;

  const handleProgress = (data: OnProgressData) => {
    const total =
      data.seekableDuration || data.playableDuration || fallbackDuration || 0;
    onProgress(data.currentTime, total);

    if (!loggedPlayRef.current && data.currentTime >= 30) {
      loggedPlayRef.current = true;
      musicService.logPlayHistory(currentSong.id, Math.floor(data.currentTime)).catch(() => {});
    }
  };

  const handleLoad = (data: OnLoadData) => {
    loggedPlayRef.current = false;
    if (Number.isFinite(data.duration) && data.duration > 0) {
      onProgress(0, data.duration);
    }
  };

  return (
    <NativeAudioPlayer
      source={playbackSource}
      paused={!isPlaying}
      onProgress={handleProgress}
      onLoad={handleLoad}
      onEnd={onTrackEnded}
      onError={onError}
    />
  );
}
