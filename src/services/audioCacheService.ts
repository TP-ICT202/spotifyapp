/**
 * Cache audio intelligent.
 *
 * Objectif : pour un morceau diffusé depuis la plateforme (URL distante), on
 * télécharge **progressivement** le fichier dans le cache de l'appareil pendant
 * la lecture, puis on le **supprime dès qu'on le traverse** (passage au morceau
 * suivant/précédent). Le cache ne conserve donc que le morceau courant et, au
 * besoin, le suivant pré-chargé — jamais d'accumulation sur le téléphone.
 *
 * Les fichiers ainsi mis en cache permettent aussi la lecture hors-ligne tant
 * qu'ils n'ont pas été traversés.
 */
import {
  CachesDirectoryPath,
  downloadFile,
  exists,
  mkdir,
  moveFile,
  readDir,
  stopDownload,
  unlink,
} from '@dr.pogodin/react-native-fs';
import type { Song } from '../types';

const CACHE_DIR = `${CachesDirectoryPath}/kabod-audio`;

export type CacheProgressListener = (songId: string, ratio: number) => void;

type Job = {
  jobId: number;
  promise: Promise<string | null>;
};

const inFlight = new Map<string, Job>();

function isRemoteUrl(url?: string | null): boolean {
  const u = url?.trim() ?? '';
  return u.startsWith('http://') || u.startsWith('https://');
}

/** Indique si un morceau est éligible au cache (source distante uniquement). */
export function isCacheable(song: Song | null): boolean {
  return Boolean(song && isRemoteUrl(song.audio_url));
}

/** Chemin disque local (sans schéma) pour un morceau donné. */
function filePathFor(songId: string): string {
  return `${CACHE_DIR}/${songId}.mp3`;
}

async function ensureDir(): Promise<void> {
  try {
    if (!(await exists(CACHE_DIR))) {
      await mkdir(CACHE_DIR);
    }
  } catch {
    // Création best-effort : un échec ne doit jamais bloquer la lecture.
  }
}

/** Renvoie l'URI `file://` si le morceau est déjà entièrement en cache. */
export async function getCachedUri(songId: string): Promise<string | null> {
  try {
    const path = filePathFor(songId);
    if (await exists(path)) {
      return `file://${path}`;
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * Télécharge le morceau dans le cache (idempotent). Renvoie l'URI `file://`
 * une fois le fichier complet disponible, ou `null` si non applicable/échec.
 * Le téléchargement passe par un fichier `.part` puis renommage atomique afin
 * qu'un fichier présent dans le cache soit toujours complet et lisible.
 */
export async function cacheSong(
  song: Song,
  onProgress?: CacheProgressListener,
): Promise<string | null> {
  if (!isCacheable(song)) return null;

  const dest = filePathFor(song.id);

  const already = await getCachedUri(song.id);
  if (already) {
    onProgress?.(song.id, 1);
    return already;
  }

  const existing = inFlight.get(song.id);
  if (existing) return existing.promise;

  const fromUrl = song.audio_url!.trim();
  const tmp = `${dest}.part`;

  const job: Job = { jobId: -1, promise: Promise.resolve(null) };
  job.promise = (async () => {
    try {
      await ensureDir();
      try {
        if (await exists(tmp)) await unlink(tmp);
      } catch {
        // ignore
      }

      const task = downloadFile({
        fromUrl,
        toFile: tmp,
        background: false,
        cacheable: false,
        progressInterval: 400,
        progressDivider: 5,
        begin: res => {
          job.jobId = res.jobId;
        },
        progress: res => {
          if (onProgress && res.contentLength > 0) {
            onProgress(
              song.id,
              Math.max(0, Math.min(1, res.bytesWritten / res.contentLength)),
            );
          }
        },
      });
      job.jobId = task.jobId;

      const result = await task.promise;
      const ok = result.statusCode >= 200 && result.statusCode < 300;
      if (!ok) {
        try {
          if (await exists(tmp)) await unlink(tmp);
        } catch {
          // ignore
        }
        return null;
      }

      try {
        if (await exists(dest)) await unlink(dest);
      } catch {
        // ignore
      }
      await moveFile(tmp, dest);
      onProgress?.(song.id, 1);
      return `file://${dest}`;
    } catch {
      try {
        if (await exists(tmp)) await unlink(tmp);
      } catch {
        // ignore
      }
      return null;
    } finally {
      inFlight.delete(song.id);
    }
  })();

  inFlight.set(song.id, job);
  return job.promise;
}

async function removeSong(songId: string): Promise<void> {
  const job = inFlight.get(songId);
  if (job) {
    try {
      if (job.jobId >= 0) stopDownload(job.jobId);
    } catch {
      // ignore
    }
    inFlight.delete(songId);
  }
  for (const path of [filePathFor(songId), `${filePathFor(songId)}.part`]) {
    try {
      if (await exists(path)) await unlink(path);
    } catch {
      // ignore
    }
  }
}

/**
 * Supprime du cache tout ce qui n'est pas dans `keepSongIds` : c'est l'étape
 * « suppression lorsqu'on traverse ». Annule aussi les téléchargements obsolètes.
 */
export async function releaseAllExcept(keepSongIds: string[]): Promise<void> {
  const keep = new Set(keepSongIds.filter(Boolean));

  for (const songId of Array.from(inFlight.keys())) {
    if (!keep.has(songId)) {
      const job = inFlight.get(songId);
      try {
        if (job && job.jobId >= 0) stopDownload(job.jobId);
      } catch {
        // ignore
      }
      inFlight.delete(songId);
    }
  }

  try {
    if (!(await exists(CACHE_DIR))) return;
    const entries = await readDir(CACHE_DIR);
    await Promise.all(
      entries.map(async entry => {
        const id = entry.name.replace(/\.mp3(\.part)?$/i, '');
        if (!keep.has(id)) {
          try {
            await unlink(entry.path);
          } catch {
            // ignore
          }
        }
      }),
    );
  } catch {
    // ignore
  }
}

/** Vide entièrement le cache audio (déconnexion / nettoyage). */
export async function clearCache(): Promise<void> {
  for (const songId of Array.from(inFlight.keys())) {
    await removeSong(songId);
  }
  try {
    if (await exists(CACHE_DIR)) {
      const entries = await readDir(CACHE_DIR);
      await Promise.all(
        entries.map(entry => unlink(entry.path).catch(() => undefined)),
      );
    }
  } catch {
    // ignore
  }
}
