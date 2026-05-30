-- Configuration des Buckets de Stockage (Storage) dans Supabase
-- Exécutez ce script dans l'éditeur SQL de votre console Supabase.
-- Il va créer les dossiers (buckets) nécessaires et configurer les droits d'accès.

-- =========================================================================
-- 1. CRÉATION DES BUCKETS
-- =========================================================================

-- A. Bucket pour les fichiers audio (MP3) - Public
INSERT INTO storage.buckets (id, name, public)
VALUES ('songs-bucket', 'songs-bucket', true)
ON CONFLICT (id) DO NOTHING;

-- B. Bucket pour les pochettes d'albums et photos d'artistes - Public
INSERT INTO storage.buckets (id, name, public)
VALUES ('covers-bucket', 'covers-bucket', true)
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- 2. CONFIGURATION DES POLITIQUES DE SÉCURITÉ (STORAGE POLICIES)
-- =========================================================================

-- Autoriser la lecture publique pour tout le monde sur les fichiers audio
CREATE POLICY "Accès public en lecture pour les musiques"
ON storage.objects FOR SELECT
USING (bucket_id = 'songs-bucket');

-- Autoriser la lecture publique pour tout le monde sur les pochettes d'albums
CREATE POLICY "Accès public en lecture pour les pochettes"
ON storage.objects FOR SELECT
USING (bucket_id = 'covers-bucket');

-- Autoriser l'upload de fichiers audio uniquement pour les utilisateurs connectés
CREATE POLICY "Téléversement de musiques réservé aux connectés"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'songs-bucket');

-- Autoriser l'upload de pochettes uniquement pour les utilisateurs connectés
CREATE POLICY "Téléversement de pochettes réservé aux connectés"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'covers-bucket');

-- Autoriser la modification/suppression de ses propres fichiers (si nécessaire)
CREATE POLICY "Modification de ses propres fichiers"
ON storage.objects FOR UPDATE
TO authenticated
USING (auth.uid() = owner);

CREATE POLICY "Suppression de ses propres fichiers"
ON storage.objects FOR DELETE
TO authenticated
USING (auth.uid() = owner);
