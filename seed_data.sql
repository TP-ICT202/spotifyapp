-- Script SQL d'initialisation de données (Seed) pour Supabase
-- Exécutez ce script dans l'éditeur SQL de Supabase après avoir créé le schéma.
-- Il insère des genres, des artistes, des albums et des musiques de test.

-- 1. INSERTION DES GENRES
INSERT INTO public.genres (id, name, description) VALUES
('11111111-1111-1111-1111-111111111111', 'Synthwave', 'Musique électronique rétro-futuriste inspirée des années 80.'),
('22222222-2222-2222-2222-222222222222', 'Ambient', 'Musique calme et texturée idéale pour se concentrer ou se détendre.'),
('33333333-3333-3333-3333-333333333333', 'Indie Pop', 'Pop indépendante mélodique et entraînante.');

-- 2. INSERTION DES ARTISTES
INSERT INTO public.artists (id, name, bio, image_url) VALUES
('44444444-4444-4444-4444-444444444444', 'Aurora Wave', 'Pionnier de la synthwave mélodique avec des nappes de synthétiseurs rétro.', 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400'),
('55555555-5555-5555-5555-555555555555', 'Lux Ferre', 'Compositeur de paysages sonores ambient immersifs.', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400'),
('66666666-6666-6666-6666-666666666666', 'Kira Lo', 'Artiste pop alternant entre rythmes électroniques et mélodies vocales douces.', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400');

-- 3. INSERTION DES ALBUMS
INSERT INTO public.albums (id, title, release_date, cover_image_url, artist_id) VALUES
('77777777-7777-7777-7777-777777777777', 'Neon Pulse', '2026-01-15', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400', '44444444-4444-4444-4444-444444444444'),
('88888888-8888-8888-8888-888888888888', 'Midnight Echo', '2025-10-09', 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400', '55555555-5555-5555-5555-555555555555'),
('99999999-9999-9999-9999-999999999999', 'Rainwindow', '2026-04-20', 'https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?q=80&w=400', '66666666-6666-6666-6666-666666666666');

-- 4. INSERTION DES MUSIQUES (SONGS)
-- Les URLs de fichiers MP3 ci-dessous sont des exemples de test publics fonctionnels (hébergés de manière fiable)
INSERT INTO public.songs (id, title, duration_seconds, audio_url, album_id, artist_id, genre_id) VALUES
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Velvet Sky',
  372,
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  '77777777-7777-7777-7777-777777777777',
  '44444444-4444-4444-4444-444444444444',
  '11111111-1111-1111-1111-111111111111'
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Retro Runner',
  423,
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  '77777777-7777-7777-7777-777777777777',
  '44444444-4444-4444-4444-444444444444',
  '11111111-1111-1111-1111-111111111111'
),
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'Ambient Chill',
  302,
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  '88888888-8888-8888-8888-888888888888',
  '55555555-5555-5555-5555-555555555555',
  '22222222-2222-2222-2222-222222222222'
),
(
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'Soft Rain Drops',
  286,
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  '99999999-9999-9999-9999-999999999999',
  '66666666-6666-6666-6666-666666666666',
  '33333333-3333-3333-3333-333333333333'
);
