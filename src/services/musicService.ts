import { supabase } from './supabaseClient';
import type { Song, Album, Artist, Playlist } from '../types';

export const musicService = {
  // =========================================================================
  // CATALOGUE (SONGS, ALBUMS, ARTISTS)
  // =========================================================================

  /**
   * Récupère la liste des morceaux avec jointure sur l'artiste et l'album
   */
  async getSongs(limit = 20): Promise<Song[]> {
    const { data, error } = await supabase
      .from('songs')
      .select('*, artist:artists(*), album:albums(*)')
      .limit(limit)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Song[];
  },

  /**
   * Recherche de morceaux par titre (Recherche simple)
   */
  async searchSongs(query: string): Promise<Song[]> {
    if (!query.trim()) return [];
    
    const { data, error } = await supabase
      .from('songs')
      .select('*, artist:artists(*), album:albums(*)')
      .ilike('title', `%${query}%`)
      .limit(30);

    if (error) throw error;
    return data as Song[];
  },

  /**
   * Récupère tous les albums d'un artiste ou l'ensemble des albums du catalogue
   */
  async getAlbums(artistId?: string): Promise<Album[]> {
    let queryBuilder = supabase
      .from('albums')
      .select('*, artist:artists(*)');
    
    if (artistId) {
      queryBuilder = queryBuilder.eq('artist_id', artistId);
    }

    const { data, error } = await queryBuilder.order('release_date', { ascending: false });
    if (error) throw error;
    return data as Album[];
  },

  /**
   * Récupère la liste des artistes populaires ou filtrés
   */
  async getArtists(): Promise<Artist[]> {
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data as Artist[];
  },

  // =========================================================================
  // GESTION DES PLAYLISTS
  // =========================================================================

  /**
   * Récupère les playlists de l'utilisateur connecté, ainsi que les playlists publiques
   */
  async getPlaylists(): Promise<Playlist[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('playlists')
      .select('*')
      .or(`user_id.eq.${user.id},is_private.eq.false`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Playlist[];
  },

  /**
   * Crée une nouvelle playlist personnalisée
   */
  async createPlaylist(name: string, isPrivate = false): Promise<Playlist> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Utilisateur non connecté.");

    const { data, error } = await supabase
      .from('playlists')
      .insert({
        name,
        is_private: isPrivate,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Playlist;
  },

  /**
   * Ajoute une musique à une playlist à une position donnée
   */
  async addSongToPlaylist(playlistId: string, songId: string, position = 0): Promise<void> {
    const { error } = await supabase
      .from('playlist_songs')
      .insert({
        playlist_id: playlistId,
        song_id: songId,
        position,
      });

    if (error) throw error;
  },

  /**
   * Retire une musique d'une playlist
   */
  async removeSongFromPlaylist(playlistId: string, songId: string): Promise<void> {
    const { error } = await supabase
      .from('playlist_songs')
      .delete()
      .match({ playlist_id: playlistId, song_id: songId });

    if (error) throw error;
  },

  /**
   * Récupère toutes les chansons d'une playlist donnée
   */
  async getPlaylistSongs(playlistId: string): Promise<Song[]> {
    const { data, error } = await supabase
      .from('playlist_songs')
      .select('song_id, song:songs(*, artist:artists(*), album:albums(*))')
      .eq('playlist_id', playlistId)
      .order('position', { ascending: true });

    if (error) throw error;
    return data.map(item => item.song) as unknown as Song[];
  },

  // =========================================================================
  // GESTION DES FAVORIS (LIKES)
  // =========================================================================

  /**
   * Ajoute ou supprime un titre des favoris de l'utilisateur
   */
  async toggleFavoriteSong(songId: string, shouldLike: boolean): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Utilisateur non connecté.");

    if (shouldLike) {
      const { error } = await supabase
        .from('favorite_songs')
        .insert({ user_id: user.id, song_id: songId });
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('favorite_songs')
        .delete()
        .match({ user_id: user.id, song_id: songId });
      if (error) throw error;
    }
  },

  /**
   * Récupère la liste des musiques favorites de l'utilisateur
   */
  async getFavoriteSongs(): Promise<Song[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('favorite_songs')
      .select('song:songs(*, artist:artists(*), album:albums(*))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(item => item.song) as unknown as Song[];
  },

  // =========================================================================
  // HISTORIQUE DE LECTURE (STATISTIQUES)
  // =========================================================================

  /**
   * Journalise une écoute (déclenche automatiquement l'incrémentation du play_count côté BD)
   */
  async logPlayHistory(songId: string, durationPlayedSeconds: number): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return; // Ignore si visiteur non connecté

    const { error } = await supabase
      .from('play_history')
      .insert({
        user_id: user.id,
        song_id: songId,
        duration_played_seconds: durationPlayedSeconds,
      });

    if (error) {
      console.error("Erreur lors de la journalisation de l'écoute :", error);
    }
  },
};
