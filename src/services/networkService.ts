import { ENV } from '../config/env';

export class OfflineError extends Error {
  constructor(message = 'Connexion Internet requise.') {
    super(message);
    this.name = 'OfflineError';
  }
}

export async function isOnline(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(`${ENV.SUPABASE_URL}/auth/v1/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return response.status > 0;
  } catch {
    return false;
  }
}

export async function assertOnline(): Promise<void> {
  const online = await isOnline();
  if (!online) {
    throw new OfflineError();
  }
}
