import { ENV } from '../config/env';
import { getAudioSource as getBundledAudioSource } from '../data/localMusicData';
import type { Song } from '../types';

export type PlaybackSource = { uri: string } | number;

export type ResolvedSources = {
  /** Asset embarqué dans l'APK (lecture hors-ligne fiable), si disponible. */
  bundled: number | null;
  /** URL distante de streaming (Supabase Storage ou autre), si disponible. */
  remote: { uri: string } | null;
};

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
 * Décompose un morceau en ses sources possibles : asset embarqué (hors-ligne) et
 * URL distante (streaming via la plateforme). Le lecteur choisit ensuite la
 * meilleure selon la connectivité, avec repli automatique.
 */
export function resolveSources(song: Song): ResolvedSources {
  const raw = song.audio_url?.trim() ?? '';
  const bundled = getBundledAudioSource(song.id);

  let remote: { uri: string } | null = null;
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    remote = { uri: raw };
  } else if (raw.length > 0 && bundled == null) {
    // Nom de fichier seul, sans asset embarqué : URL Supabase Storage.
    remote = { uri: storageUrlFromFilename(raw) };
  }

  return { bundled, remote };
}

/**
 * Source de lecture par défaut — priorité au streaming distant (récupération
 * via la plateforme) puis repli sur l'asset embarqué hors-ligne.
 */
export function resolvePlaybackSource(song: Song): PlaybackSource | null {
  const { bundled, remote } = resolveSources(song);
  if (remote) return remote;
  if (bundled != null) return bundled;
  return null;
}
