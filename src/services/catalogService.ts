import {
  LOCAL_SONGS,
  LOCAL_ARTISTS,
  LOCAL_ALBUMS,
  CURATED_PLAYLISTS,
  getAudioSource,
  getCoverForIndex,
  searchLocalSongs,
  getSongsByArtist,
  getArtistsWithSongs,
} from '../data/localMusicData';
import { musicService } from './musicService';
import type { Song, Artist, Album } from '../types';

let catalogCache: Song[] | null = null;

function mergeWithLocal(remote: Song[]): Song[] {
  return LOCAL_SONGS.map(local => {
    const match = remote.find(
      r =>
        r.title.toLowerCase() === local.title.toLowerCase() &&
        (r.artist?.name ?? '').toLowerCase() === (local.artist?.name ?? '').toLowerCase(),
    );
    if (!match) return local;
    return {
      ...local,
      play_count: match.play_count ?? local.play_count,
      like_count: match.like_count ?? local.like_count,
      audio_url: match.audio_url || local.audio_url,
    };
  });
}

export const catalogService = {
  /** Charge le catalogue (local + enrichissement Supabase si disponible). */
  async loadCatalog(): Promise<Song[]> {
    if (catalogCache) return catalogCache;

    try {
      const remote = await musicService.getSongs(50);
      if (remote.length > 0) {
        catalogCache = mergeWithLocal(remote);
        return catalogCache;
      }
    } catch {
      // Supabase vide ou hors ligne : catalogue local embarqué
    }

    catalogCache = LOCAL_SONGS;
    return catalogCache;
  },

  getSongsSync(): Song[] {
    return catalogCache ?? LOCAL_SONGS;
  },

  getArtists(): Artist[] {
    return LOCAL_ARTISTS;
  },

  getAlbums(): Album[] {
    return LOCAL_ALBUMS;
  },

  getPlaylists() {
    return CURATED_PLAYLISTS;
  },

  searchSongs(query: string): Song[] {
    return searchLocalSongs(query);
  },

  getSongsByArtist(artistId: string): Song[] {
    return getSongsByArtist(artistId);
  },

  getArtistsWithSongs() {
    return getArtistsWithSongs();
  },

  getAudioSource,
  getCoverForIndex,

  getSongById(songId: string): Song | undefined {
    return this.getSongsSync().find(s => s.id === songId);
  },

  getPlaylistSongs(playlistId: string, favoriteIds: string[] = []): Song[] {
    const pl = CURATED_PLAYLISTS.find(p => p.id === playlistId);
    if (!pl) return [];
    if (pl.id === 'pl-favorites') {
      const songs = this.getSongsSync();
      return favoriteIds
        .map(id => songs.find(s => s.id === id))
        .filter((s): s is Song => Boolean(s));
    }
    const songs = this.getSongsSync();
    return pl.songIds
      .map(id => songs.find(s => s.id === id))
      .filter((s): s is Song => Boolean(s));
  },
};
