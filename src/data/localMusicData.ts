/**
 * Catalogue embarqué — 18 MP3 réels du dossier musiques/.
 * IDs alignés sur seed_data.sql pour Supabase (favoris, historique).
 */
import type { Song, Artist, Album } from '../types';

export const LOCAL_ARTISTS: Artist[] = [
  { id: '00000000-0000-0000-0000-000000000001', name: 'Reach Worship', bio: 'Groupe de louange contemporaine.', created_at: '2024-01-01T00:00:00Z' },
  { id: '00000000-0000-0000-0000-000000000002', name: 'Sylvain Kashila', bio: 'Artiste gospel et louange.', created_at: '2024-01-01T00:00:00Z' },
  { id: '00000000-0000-0000-0000-000000000003', name: 'Faith Captain', bio: 'Worship africain.', created_at: '2024-01-01T00:00:00Z' },
  { id: '00000000-0000-0000-0000-000000000004', name: 'DANIEL BANAM', bio: 'Louange et onction.', created_at: '2024-01-01T00:00:00Z' },
  { id: '00000000-0000-0000-0000-000000000005', name: 'JOSHUA BANJO', bio: 'Worship leader.', created_at: '2024-01-01T00:00:00Z' },
  { id: '00000000-0000-0000-0000-000000000006', name: 'James Majila', bio: 'Gospel congolais.', created_at: '2024-01-01T00:00:00Z' },
  { id: '00000000-0000-0000-0000-000000000007', name: 'Michel Bakenda', bio: 'Légende du gospel congolais.', created_at: '2024-01-01T00:00:00Z' },
  { id: '00000000-0000-0000-0000-000000000008', name: 'Paul Cleverlee', bio: 'Auteur-compositeur gospel.', created_at: '2024-01-01T00:00:00Z' },
  { id: '00000000-0000-0000-0000-000000000009', name: 'KayArchonn', bio: 'Producteur innovant.', created_at: '2024-01-01T00:00:00Z' },
  { id: '00000000-0000-0000-0000-000000000010', name: 'Keenan TreVon', bio: 'R&B / Pop urbain.', created_at: '2024-01-01T00:00:00Z' },
];

export const LOCAL_ALBUMS: Album[] = [
  { id: '10000000-0000-0000-0000-000000000001', title: 'Kabod', release_date: '2024-01-01', artist_id: '00000000-0000-0000-0000-000000000001', like_count: 0, created_at: '2024-01-01T00:00:00Z' },
  { id: '10000000-0000-0000-0000-000000000002', title: 'Louange & Adoration', release_date: '2024-01-01', artist_id: '00000000-0000-0000-0000-000000000002', like_count: 0, created_at: '2024-01-01T00:00:00Z' },
  { id: '10000000-0000-0000-0000-000000000003', title: 'Singles', release_date: '2024-06-01', artist_id: '00000000-0000-0000-0000-000000000003', like_count: 0, created_at: '2024-06-01T00:00:00Z' },
  { id: '10000000-0000-0000-0000-000000000004', title: 'She Goes By', release_date: '2024-03-15', artist_id: '00000000-0000-0000-0000-000000000009', like_count: 0, created_at: '2024-03-15T00:00:00Z' },
];

const audioFiles: Record<string, number> = {
  'reach-kabod': require('../../musiques/Reach Worship - Kabod.mp3'),
  'reach-coule': require('../../musiques/Reach Worship - Coule À Flot.mp3'),
  'reach-cris': require('../../musiques/Reach Worship - Il Entend Les Cris.mp3'),
  'reach-delivrance': require('../../musiques/Reach Worship - Ma Délivrance.mp3'),
  'sylvain-acclame': require('../../musiques/Sylvain Kashila - Acclame ton Dieu.mp3'),
  'sylvain-soupire': require('../../musiques/Sylvain Kashila - Je Soupire Apres Toi.mp3'),
  'sylvain-jesus': require('../../musiques/Sylvain Kashila - Jesus prend Ta place.mp3'),
  'sylvain-yahweh': require('../../musiques/Sylvain Kashila - Yahweh Se Manifestera (feat. Ruth Pala).mp3'),
  'sylvain-yamba': require('../../musiques/Sylvain Kashila - Yamba Louange.mp3'),
  'sylvain-yeshua': require('../../musiques/Sylvain Kashila - Yeshua.mp3'),
  'faith-oshimiri': require('../../musiques/Faith Captain - Oshimiri Atata (Live).mp3'),
  'daniel-kabod': require('../../musiques/DANIEL BANAM - Kabod onction.mp3'),
  'joshua-pray': require('../../musiques/JOSHUA BANJO - When We Pray (Emmanuel).mp3'),
  'james-kabod': require('../../musiques/James Majila - Kabod.mp3'),
  'michel-merci': require('../../musiques/Michel_Bakenda_Merci_Dieu_De_Faire_Ton_Entrée_feat_Sylvain_K.mp3'),
  'paul-anchor': require('../../musiques/Paul Cleverlee - Anchor of My Strength.mp3'),
  'kay-remix': require('../../musiques/KayArchonn - She Goes by. (KayArchon Remix).mp3'),
  'keenan-denver': require('../../musiques/Keenan TreVon - She Goes By Denver.mp3'),
};

const coverImages = [
  require('../assets/album-1.jpg'),
  require('../assets/album-2.jpg'),
  require('../assets/album-3.jpg'),
  require('../assets/album-4.jpg'),
  require('../assets/album-5.jpg'),
  require('../assets/album-6.jpg'),
];

export function getCoverForIndex(index: number) {
  return coverImages[index % coverImages.length];
}

const findArtist = (id: string) => LOCAL_ARTISTS.find(a => a.id === id);
const findAlbum = (id: string) => LOCAL_ALBUMS.find(a => a.id === id);

type SongSeed = Omit<Song, 'play_count' | 'like_count' | 'created_at' | 'audio_url'> & {
  audioKey: string;
  fileName: string;
};

const SONG_SEEDS: SongSeed[] = [
  { id: '90000000-0000-0000-0000-000000000001', title: 'Kabod', duration_seconds: 695, album_id: '10000000-0000-0000-0000-000000000001', artist_id: '00000000-0000-0000-0000-000000000001', audioKey: 'reach-kabod', fileName: 'Reach Worship - Kabod.mp3' },
  { id: '90000000-0000-0000-0000-000000000002', title: 'Coule À Flot', duration_seconds: 322, album_id: '10000000-0000-0000-0000-000000000001', artist_id: '00000000-0000-0000-0000-000000000001', audioKey: 'reach-coule', fileName: 'Reach Worship - Coule À Flot.mp3' },
  { id: '90000000-0000-0000-0000-000000000003', title: 'Il Entend Les Cris', duration_seconds: 521, album_id: '10000000-0000-0000-0000-000000000001', artist_id: '00000000-0000-0000-0000-000000000001', audioKey: 'reach-cris', fileName: 'Reach Worship - Il Entend Les Cris.mp3' },
  { id: '90000000-0000-0000-0000-000000000004', title: 'Ma Délivrance', duration_seconds: 520, album_id: '10000000-0000-0000-0000-000000000001', artist_id: '00000000-0000-0000-0000-000000000001', audioKey: 'reach-delivrance', fileName: 'Reach Worship - Ma Délivrance.mp3' },
  { id: '90000000-0000-0000-0000-000000000005', title: 'Acclame ton Dieu', duration_seconds: 294, album_id: '10000000-0000-0000-0000-000000000002', artist_id: '00000000-0000-0000-0000-000000000002', audioKey: 'sylvain-acclame', fileName: 'Sylvain Kashila - Acclame ton Dieu.mp3' },
  { id: '90000000-0000-0000-0000-000000000006', title: 'Je Soupire Après Toi', duration_seconds: 411, album_id: '10000000-0000-0000-0000-000000000002', artist_id: '00000000-0000-0000-0000-000000000002', audioKey: 'sylvain-soupire', fileName: 'Sylvain Kashila - Je Soupire Apres Toi.mp3' },
  { id: '90000000-0000-0000-0000-000000000007', title: 'Jésus Prend Ta Place', duration_seconds: 327, album_id: '10000000-0000-0000-0000-000000000002', artist_id: '00000000-0000-0000-0000-000000000002', audioKey: 'sylvain-jesus', fileName: 'Sylvain Kashila - Jesus prend Ta place.mp3' },
  { id: '90000000-0000-0000-0000-000000000008', title: 'Yahweh Se Manifestera', duration_seconds: 665, album_id: '10000000-0000-0000-0000-000000000002', artist_id: '00000000-0000-0000-0000-000000000002', audioKey: 'sylvain-yahweh', fileName: 'Sylvain Kashila - Yahweh Se Manifestera (feat. Ruth Pala).mp3' },
  { id: '90000000-0000-0000-0000-000000000009', title: 'Yamba Louange', duration_seconds: 717, album_id: '10000000-0000-0000-0000-000000000002', artist_id: '00000000-0000-0000-0000-000000000002', audioKey: 'sylvain-yamba', fileName: 'Sylvain Kashila - Yamba Louange.mp3' },
  { id: '90000000-0000-0000-0000-000000000010', title: 'Yeshua', duration_seconds: 354, album_id: '10000000-0000-0000-0000-000000000002', artist_id: '00000000-0000-0000-0000-000000000002', audioKey: 'sylvain-yeshua', fileName: 'Sylvain Kashila - Yeshua.mp3' },
  { id: '90000000-0000-0000-0000-000000000011', title: 'Oshimiri Atata (Live)', duration_seconds: 662, album_id: '10000000-0000-0000-0000-000000000003', artist_id: '00000000-0000-0000-0000-000000000003', audioKey: 'faith-oshimiri', fileName: 'Faith Captain - Oshimiri Atata (Live).mp3' },
  { id: '90000000-0000-0000-0000-000000000012', title: 'Kabod Onction', duration_seconds: 458, artist_id: '00000000-0000-0000-0000-000000000004', audioKey: 'daniel-kabod', fileName: 'DANIEL BANAM - Kabod onction.mp3' },
  { id: '90000000-0000-0000-0000-000000000013', title: 'When We Pray (Emmanuel)', duration_seconds: 301, artist_id: '00000000-0000-0000-0000-000000000005', audioKey: 'joshua-pray', fileName: 'JOSHUA BANJO - When We Pray (Emmanuel).mp3' },
  { id: '90000000-0000-0000-0000-000000000014', title: 'Kabod', duration_seconds: 642, artist_id: '00000000-0000-0000-0000-000000000006', audioKey: 'james-kabod', fileName: 'James Majila - Kabod.mp3' },
  { id: '90000000-0000-0000-0000-000000000015', title: "Merci Dieu De Faire Ton Entrée", duration_seconds: 288, artist_id: '00000000-0000-0000-0000-000000000007', audioKey: 'michel-merci', fileName: 'Michel_Bakenda_Merci_Dieu_De_Faire_Ton_Entrée_feat_Sylvain_K.mp3' },
  { id: '90000000-0000-0000-0000-000000000016', title: 'Anchor of My Strength', duration_seconds: 190, artist_id: '00000000-0000-0000-0000-000000000008', audioKey: 'paul-anchor', fileName: 'Paul Cleverlee - Anchor of My Strength.mp3' },
  { id: '90000000-0000-0000-0000-000000000017', title: 'She Goes By (Remix)', duration_seconds: 187, album_id: '10000000-0000-0000-0000-000000000004', artist_id: '00000000-0000-0000-0000-000000000009', audioKey: 'kay-remix', fileName: 'KayArchonn - She Goes by. (KayArchon Remix).mp3' },
  { id: '90000000-0000-0000-0000-000000000018', title: 'She Goes By Denver', duration_seconds: 137, album_id: '10000000-0000-0000-0000-000000000004', artist_id: '00000000-0000-0000-0000-000000000010', audioKey: 'keenan-denver', fileName: 'Keenan TreVon - She Goes By Denver.mp3' },
];

export const LOCAL_SONGS: Song[] = SONG_SEEDS.map(seed => {
  const artist = findArtist(seed.artist_id);
  const album = seed.album_id
    ? { ...findAlbum(seed.album_id)!, artist: findArtist(seed.artist_id) }
    : undefined;
  return {
    id: seed.id,
    title: seed.title,
    duration_seconds: seed.duration_seconds,
    audio_url: seed.fileName,
    album_id: seed.album_id,
    artist_id: seed.artist_id,
    play_count: 0,
    like_count: 0,
    created_at: '2024-01-01T00:00:00Z',
    artist,
    album,
  };
});

const songAudioMap: Record<string, string> = Object.fromEntries(
  SONG_SEEDS.map(s => [s.id, s.audioKey]),
);

export type CuratedPlaylist = {
  id: string;
  title: string;
  creator: string;
  isLikes?: boolean;
  songIds: string[];
};

export const CURATED_PLAYLISTS: CuratedPlaylist[] = [
  {
    id: 'pl-favorites',
    title: 'Titres likés',
    creator: 'Moi',
    isLikes: true,
    songIds: [],
  },
  {
    id: 'pl-louange',
    title: 'Louange & Adoration',
    creator: 'Kabod Music',
    songIds: [
      '90000000-0000-0000-0000-000000000001',
      '90000000-0000-0000-0000-000000000005',
      '90000000-0000-0000-0000-000000000008',
      '90000000-0000-0000-0000-000000000009',
      '90000000-0000-0000-0000-000000000010',
      '90000000-0000-0000-0000-000000000011',
    ],
  },
  {
    id: 'pl-gospel-hits',
    title: 'Gospel Hits',
    creator: 'Kabod Music',
    songIds: [
      '90000000-0000-0000-0000-000000000001',
      '90000000-0000-0000-0000-000000000002',
      '90000000-0000-0000-0000-000000000003',
      '90000000-0000-0000-0000-000000000004',
      '90000000-0000-0000-0000-000000000012',
      '90000000-0000-0000-0000-000000000014',
    ],
  },
  {
    id: 'pl-urban',
    title: 'Vibes Urbaines',
    creator: 'Kabod Music',
    songIds: [
      '90000000-0000-0000-0000-000000000016',
      '90000000-0000-0000-0000-000000000017',
      '90000000-0000-0000-0000-000000000018',
    ],
  },
];

export function getAudioSource(songId: string): number | null {
  const key = songAudioMap[songId];
  return key ? audioFiles[key] : null;
}

export function searchLocalSongs(query: string): Song[] {
  if (!query.trim()) return LOCAL_SONGS;
  const q = query.toLowerCase();
  return LOCAL_SONGS.filter(
    s =>
      s.title.toLowerCase().includes(q) ||
      (s.artist?.name ?? '').toLowerCase().includes(q) ||
      (s.album?.title ?? '').toLowerCase().includes(q),
  );
}

export function getSongsByArtist(artistId: string): Song[] {
  return LOCAL_SONGS.filter(s => s.artist_id === artistId);
}

export function getArtistsWithSongs(): (Artist & { songCount: number })[] {
  return LOCAL_ARTISTS.map(a => ({
    ...a,
    songCount: LOCAL_SONGS.filter(s => s.artist_id === a.id).length,
  }))
    .filter(a => a.songCount > 0)
    .sort((a, b) => b.songCount - a.songCount);
}
