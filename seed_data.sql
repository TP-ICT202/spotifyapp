-- Script SQL de peuplement (Seed) complet pour la base de données du Spotify Clone.
-- Ce script insère les 18 vraies musiques et les 10 artistes réels de la bibliothèque locale.
-- Toutes les clés primaires utilisent des UUID valides.

-- 1. NETTOYAGE (Optionnel, à exécuter si vous voulez réinitialiser)
TRUNCATE public.songs, public.albums, public.artists, public.genres CASCADE;

-- 2. INSERTION DU GENRE LOUANGE / GOSPEL
INSERT INTO public.genres (id, name, description) VALUES
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Gospel & Louange', 'Chants de louange chrétienne, adoration profonde et rythmes spirituels africains et internationaux.');

-- 3. INSERTION DES 10 ARTISTES REELS
INSERT INTO public.artists (id, name, bio, image_url) VALUES
('00000000-0000-0000-0000-000000000001', 'Reach Worship', 'Groupe de louange contemporaine, mélodies profondes et puissantes.', NULL),
('00000000-0000-0000-0000-000000000002', 'Sylvain Kashila', 'Artiste de gospel et louange, voix puissante et anointing.', NULL),
('00000000-0000-0000-0000-000000000003', 'Faith Captain', 'Chantre puissant, style worship africain.', NULL),
('00000000-0000-0000-0000-000000000004', 'DANIEL BANAM', 'Artiste de louange, onction et adoration profonde.', NULL),
('00000000-0000-0000-0000-000000000005', 'JOSHUA BANJO', 'Worship leader, auteur de "When We Pray".', NULL),
('00000000-0000-0000-0000-000000000006', 'James Majila', 'Artiste congolais de gospel, style Kabod.', NULL),
('00000000-0000-0000-0000-000000000007', 'Michel Bakenda', 'Légende du gospel congolais.', NULL),
('00000000-0000-0000-0000-000000000008', 'Paul Cleverlee', 'Auteur-compositeur gospel, ancré dans la foi.', NULL),
('00000000-0000-0000-0000-000000000009', 'KayArchonn', 'Producteur et artiste, mélange de genres innovants.', NULL),
('00000000-0000-0000-0000-000000000010', 'Keenan TreVon', 'Artiste R&B/Pop, vibes urbaines.', NULL);

-- 4. INSERTION DES 4 ALBUMS
INSERT INTO public.albums (id, title, release_date, cover_image_url, artist_id) VALUES
('10000000-0000-0000-0000-000000000001', 'Kabod', '2024-01-01', NULL, '00000000-0000-0000-0000-000000000001'),
('10000000-0000-0000-0000-000000000002', 'Louange & Adoration', '2024-01-01', NULL, '00000000-0000-0000-0000-000000000002'),
('10000000-0000-0000-0000-000000000003', 'Singles', '2024-06-01', NULL, '00000000-0000-0000-0000-000000000003'),
('10000000-0000-0000-0000-000000000004', 'She Goes By', '2024-03-15', NULL, '00000000-0000-0000-0000-000000000009');

-- 5. INSERTION DES 18 MUSIQUES REELLES
-- La colonne audio_url peut contenir le nom de fichier ou l'URL locale.
INSERT INTO public.songs (id, title, duration_seconds, audio_url, album_id, artist_id, genre_id) VALUES
('90000000-0000-0000-0000-000000000001', 'Kabod', 695, 'Reach Worship - Kabod.mp3', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'),
('90000000-0000-0000-0000-000000000002', 'Coule À Flot', 322, 'Reach Worship - Coule À Flot.mp3', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'),
('90000000-0000-0000-0000-000000000003', 'Il Entend Les Cris', 521, 'Reach Worship - Il Entend Les Cris.mp3', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'),
('90000000-0000-0000-0000-000000000004', 'Ma Délivrance', 520, 'Reach Worship - Ma Délivrance.mp3', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'),
('90000000-0000-0000-0000-000000000005', 'Acclame ton Dieu', 294, 'Sylvain Kashila - Acclame ton Dieu.mp3', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'),
('90000000-0000-0000-0000-000000000006', 'Je Soupire Après Toi', 411, 'Sylvain Kashila - Je Soupire Apres Toi.mp3', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'),
('90000000-0000-0000-0000-000000000007', 'Jésus Prend Ta Place', 327, 'Sylvain Kashila - Jesus prend Ta place.mp3', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'),
('90000000-0000-0000-0000-000000000008', 'Yahweh Se Manifestera', 665, 'Sylvain Kashila - Yahweh Se Manifestera (feat. Ruth Pala).mp3', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'),
('90000000-0000-0000-0000-000000000009', 'Yamba Louange', 717, 'Sylvain Kashila - Yamba Louange.mp3', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'),
('90000000-0000-0000-0000-000000000010', 'Yeshua', 354, 'Sylvain Kashila - Yeshua.mp3', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'),
('90000000-0000-0000-0000-000000000011', 'Oshimiri Atata (Live)', 662, 'Faith Captain - Oshimiri Atata (Live).mp3', '10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'),
('90000000-0000-0000-0000-000000000012', 'Kabod Onction', 458, 'DANIEL BANAM - Kabod onction.mp3', NULL, '00000000-0000-0000-0000-000000000004', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'),
('90000000-0000-0000-0000-000000000013', 'When We Pray (Emmanuel)', 301, 'JOSHUA BANJO - When We Pray (Emmanuel).mp3', NULL, '00000000-0000-0000-0000-000000000005', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'),
('90000000-0000-0000-0000-000000000014', 'Kabod', 642, 'James Majila - Kabod.mp3', NULL, '00000000-0000-0000-0000-000000000006', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'),
('90000000-0000-0000-0000-000000000015', 'Merci Dieu De Faire Ton Entrée', 288, 'Michel_Bakenda_Merci_Dieu_De_Faire_Ton_Entrée_feat_Sylvain_K.mp3', NULL, '00000000-0000-0000-0000-000000000007', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'),
('90000000-0000-0000-0000-000000000016', 'Anchor of My Strength', 190, 'Paul Cleverlee - Anchor of My Strength.mp3', NULL, '00000000-0000-0000-0000-000000000008', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'),
('90000000-0000-0000-0000-000000000017', 'She Goes By (Remix)', 187, 'KayArchonn - She Goes by. (KayArchon Remix).mp3', '10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000009', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'),
('90000000-0000-0000-0000-000000000018', 'She Goes By Denver', 137, 'Keenan TreVon - She Goes By Denver.mp3', '10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000010', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d');
