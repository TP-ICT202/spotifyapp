/**
 * Tests du cache audio intelligent et de la résolution des sources.
 */
import { resolveSources } from '../src/services/audioResolver';
import {
  cacheSong,
  getCachedUri,
  isCacheable,
  releaseAllExcept,
} from '../src/services/audioCacheService';
import { LOCAL_SONGS } from '../src/data/localMusicData';
import type { Song } from '../src/types';

const remoteSong: Song = {
  ...LOCAL_SONGS[0],
  id: 'remote-only-song',
  audio_url: 'https://example.com/audio/track.mp3',
};

describe('resolveSources', () => {
  it('renvoie un asset embarqué pour un morceau local', () => {
    const { bundled, remote } = resolveSources(LOCAL_SONGS[0]);
    expect(typeof bundled).toBe('number');
    expect(remote).toBeNull();
  });

  it('renvoie une URL distante pour un morceau en streaming', () => {
    const { bundled, remote } = resolveSources(remoteSong);
    expect(bundled).toBeNull();
    expect(remote).toEqual({ uri: 'https://example.com/audio/track.mp3' });
  });
});

describe('audioCacheService', () => {
  it('ne met en cache que les morceaux distants', () => {
    expect(isCacheable(remoteSong)).toBe(true);
    expect(isCacheable(LOCAL_SONGS[0])).toBe(false);
    expect(isCacheable(null)).toBe(false);
  });

  it('télécharge un morceau distant et renvoie un chemin local', async () => {
    const uri = await cacheSong(remoteSong);
    expect(uri).toContain('file://');
    expect(uri).toContain(`${remoteSong.id}.mp3`);
  });

  it('ne renvoie rien pour un morceau non distant', async () => {
    const uri = await cacheSong(LOCAL_SONGS[0]);
    expect(uri).toBeNull();
  });

  it('expose getCachedUri et releaseAllExcept sans planter', async () => {
    await expect(getCachedUri('whatever')).resolves.toBeNull();
    await expect(releaseAllExcept([remoteSong.id])).resolves.toBeUndefined();
  });
});
