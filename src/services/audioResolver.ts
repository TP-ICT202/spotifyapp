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

  // 1. Vraie URL distante : streaming direct (Supabase ou autre).
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return { uri: raw };
  }

  // 2. Asset embarqué : lecture fiable et hors-ligne (présent dans l'APK).
  const bundled = getBundledAudioSource(song.id);
  if (bundled != null) {
    return bundled;
  }

  // 3. Nom de fichier seul : URL Supabase Storage (après `npm run sync:music`).
  if (raw.length > 0) {
    return { uri: storageUrlFromFilename(raw) };
  }

  return null;
}
