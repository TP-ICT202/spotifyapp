import { supabase } from './supabaseClient';
import type { Profile } from '../types';

export const authService = {
  /**
   * Inscrit un nouvel utilisateur avec email, mot de passe et métadonnées
   */
  async signUp(email: string, password: string, username: string, avatarUrl?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          avatar_url: avatarUrl || '',
        },
      },
    });

    if (error) throw error;
    return data;
  },

  /**
   * Connecte un utilisateur existant
   */
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Déconnecte l'utilisateur actuel
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Récupère le profil de l'utilisateur connecté actuellement
   */
  async getCurrentProfile(): Promise<Profile | null> {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) return null;

    const { data: profile, error: dbError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (dbError) {
      console.error('Erreur lors de la récupération du profil :', dbError);
      return null;
    }

    return profile as Profile;
  },

  /**
   * Écouteur pour s'abonner aux changements d'état d'authentification
   * @param callback Fonction appelée lors d'une connexion/déconnexion
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
    return subscription;
  },
};
