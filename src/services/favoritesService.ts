import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@kabod_favorite_songs';

export const favoritesService = {
  async getFavoriteIds(): Promise<string[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as string[]) : [];
    } catch {
      return [];
    }
  },

  async isFavorite(songId: string): Promise<boolean> {
    const ids = await this.getFavoriteIds();
    return ids.includes(songId);
  },

  async toggleFavorite(songId: string): Promise<boolean> {
    const ids = await this.getFavoriteIds();
    const isLiked = ids.includes(songId);
    const next = isLiked ? ids.filter(id => id !== songId) : [...ids, songId];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));

    try {
      const { musicService } = await import('./musicService');
      await musicService.toggleFavoriteSong(songId, !isLiked);
    } catch {
      // Catalogue local fonctionne sans Supabase
    }

    return !isLiked;
  },
};
