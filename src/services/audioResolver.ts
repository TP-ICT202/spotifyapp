import { ENV } from '../config/env';
import { getAudioSource as getBundledAudioSource } from '../data/localMusicData';
import type { Song } from '../types';

export type PlaybackSource = { uri: string } | number;

const slugify = (input: string) =>
  input
    .toLowerCase()
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * URL de streaming Supabase Storage (après npm run sync:music).
 */
function storageUrlFromFilename(fileName: string): string {
  const base = fileName.replace(/\.[^/.]+$/i, '');
  const objectPath = `raw/${slugify(base)}.mp3`;
  return `${ENV.SUPABASE_URL}/storage/v1/object/public/${ENV.STORAGE_BUCKET}/${objectPath}`;
}

/**
 * Source de lecture — en ligne : URL Supabase ; secours local si l’URL distante manque.
 */
export function resolvePlaybackSource(song: Song): PlaybackSource | null {
  const raw = song.audio_url?.trim() ?? '';
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return { uri: raw };
  }
  if (raw.length > 0) {
    return { uri: storageUrlFromFilename(raw) };
  }
  const bundled = getBundledAudioSource(song.id);
  return bundled ?? null;
}
