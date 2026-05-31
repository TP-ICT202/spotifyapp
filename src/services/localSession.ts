import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Profile } from '../types';

/** Clé de session Supabase dans AsyncStorage (ref projet magdlyporbnfgmpytxdx). */
export const SUPABASE_AUTH_STORAGE_KEY = 'sb-magdlyporbnfgmpytxdx-auth-token';

type StoredAuthPayload = {
  access_token?: string;
  currentSession?: { user?: SessionUser; access_token?: string };
  session?: { user?: SessionUser; access_token?: string };
  user?: SessionUser;
};

type SessionUser = {
  id: string;
  email?: string;
  created_at?: string;
  user_metadata?: Record<string, unknown>;
};

function parseStoredSession(raw: string): SessionUser | null {
  try {
    const data = JSON.parse(raw) as StoredAuthPayload;
    const session = data.currentSession ?? data.session ?? data;
    const user = session?.user ?? data.user;
    if (!user?.id) return null;
    if (!session?.access_token && !data.access_token) return null;
    return user;
  } catch {
    return null;
  }
}

export async function hasStoredAuthSession(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(SUPABASE_AUTH_STORAGE_KEY);
  if (!raw) return false;
  return parseStoredSession(raw) !== null;
}

export async function getProfileFromLocalSession(): Promise<Profile | null> {
  const raw = await AsyncStorage.getItem(SUPABASE_AUTH_STORAGE_KEY);
  if (!raw) return null;

  const user = parseStoredSession(raw);
  if (!user) return null;

  const username =
    (user.user_metadata?.username as string | undefined) ||
    user.email?.split('@')[0] ||
    'Utilisateur';

  return {
    id: user.id,
    username,
    avatar_url: user.user_metadata?.avatar_url as string | undefined,
    created_at: user.created_at ?? new Date().toISOString(),
  };
}

export async function clearStoredAuthSession(): Promise<void> {
  await AsyncStorage.removeItem(SUPABASE_AUTH_STORAGE_KEY);
}
