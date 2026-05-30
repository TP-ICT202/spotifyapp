-- Schema SQL pour Supabase - Système de Streaming Spotify Clone
-- Ce fichier définit la structure de base de données dans le schéma 'public',
-- s'intègre avec le service d'authentification Supabase (auth.users),
-- met en place les politiques de sécurité (RLS) et des déclencheurs (triggers) 
-- automatiques pour la synchronisation et l'optimisation des compteurs.

-- =========================================================================
-- 0. EXTENSIONS & PRÉPARATION
-- =========================================================================
create extension if not exists "uuid-ossp";

-- Nettoyage des anciennes tables s'il y a lieu (décommenter si nécessaire pour repartir à zéro)
-- drop table if exists public.play_history cascade;
-- drop table if exists public.favorite_artists cascade;
-- drop table if exists public.favorite_albums cascade;
-- drop table if exists public.favorite_songs cascade;
-- drop table if exists public.playlist_songs cascade;
-- drop table if exists public.playlists cascade;
-- drop table if exists public.songs cascade;
-- drop table if exists public.albums cascade;
-- drop table if exists public.artists cascade;
-- drop table if exists public.genres cascade;
-- drop table if exists public.profiles cascade;

-- =========================================================================
-- 1. TABLES PRINCIPALES (SCHEMA PUBLIC)
-- =========================================================================

-- Table Profils : Liée 1:1 avec la table d'authentification interne de Supabase (auth.users)
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    username text unique not null check (char_length(username) >= 3),
    avatar_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Genres musicaux
create table public.genres (
    id uuid default gen_random_uuid() primary key,
    name text not null unique,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Artistes
create table public.artists (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    bio text,
    image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Albums
create table public.albums (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    release_date date,
    cover_image_url text,
    artist_id uuid references public.artists(id) on delete cascade not null,
    like_count bigint default 0 not null check (like_count >= 0),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Musiques / Titres
create table public.songs (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    duration_seconds integer not null check (duration_seconds > 0),
    audio_url text not null,
    album_id uuid references public.albums(id) on delete cascade,
    artist_id uuid references public.artists(id) on delete cascade not null,
    genre_id uuid references public.genres(id) on delete set null,
    play_count bigint default 0 not null check (play_count >= 0),
    like_count bigint default 0 not null check (like_count >= 0),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Listes de lecture (Playlists)
create table public.playlists (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    is_private boolean default false not null,
    user_id uuid references auth.users(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================
-- 2. TABLES D'ASSOCIATION (FAVORIS, CONTENU & HISTORIQUE)
-- =========================================================================

-- Titres dans les Playlists (relation N:N)
create table public.playlist_songs (
    playlist_id uuid references public.playlists(id) on delete cascade,
    song_id uuid references public.songs(id) on delete cascade,
    position integer not null check (position >= 0),
    primary key (playlist_id, song_id)
);

-- Titres favoris (Likes de chansons)
create table public.favorite_songs (
    user_id uuid references auth.users(id) on delete cascade,
    song_id uuid references public.songs(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (user_id, song_id)
);

-- Albums favoris
create table public.favorite_albums (
    user_id uuid references auth.users(id) on delete cascade,
    album_id uuid references public.albums(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (user_id, album_id)
);

-- Artistes favoris
create table public.favorite_artists (
    user_id uuid references auth.users(id) on delete cascade,
    artist_id uuid references public.artists(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (user_id, artist_id)
);

-- Historique de lecture (essentiel pour l'algorithme de recommandation)
create table public.play_history (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    song_id uuid references public.songs(id) on delete cascade not null,
    listened_at timestamp with time zone default timezone('utc'::text, now()) not null,
    duration_played_seconds integer not null check (duration_played_seconds >= 0)
);

-- =========================================================================
-- 3. INDEXATION POUR L'OPTIMISATION DES PERFORMANCES (FUZZY SEARCH / JOINTURES)
-- =========================================================================

-- Index de recherche textuelle pour la recherche floue
create index if not exists idx_songs_title on public.songs(title);
create index if not exists idx_artists_name on public.artists(name);
create index if not exists idx_albums_title on public.albums(title);

-- Index pour accélérer les jointures fréquentes
create index if not exists idx_songs_artist_id on public.songs(artist_id);
create index if not exists idx_songs_album_id on public.songs(album_id);
create index if not exists idx_songs_genre_id on public.songs(genre_id);
create index if not exists idx_albums_artist_id on public.albums(artist_id);

-- Index composites sur les relations de favoris pour un accès ultra-rapide
create index if not exists idx_fav_songs_composite on public.favorite_songs(user_id, song_id);
create index if not exists idx_fav_albums_composite on public.favorite_albums(user_id, album_id);
create index if not exists idx_fav_artists_composite on public.favorite_artists(user_id, artist_id);

-- Index chronologique sur l'historique d'écoute
create index if not exists idx_play_history_user_time on public.play_history(user_id, listened_at desc);

-- =========================================================================
-- 4. FONCTIONS ET DÉCLENCHEURS AUTOMATIQUES (TRIGGERS)
-- =========================================================================

-- A. Création automatique d'un profil public après inscription dans Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- B. Incrémentation/Décrémentation des compteurs de likes de chansons
create or replace function public.update_song_like_count()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update public.songs set like_count = like_count + 1 where id = new.song_id;
    return new;
  elsif (TG_OP = 'DELETE') then
    update public.songs set like_count = greatest(0, like_count - 1) where id = old.song_id;
    return old;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create or replace trigger on_favorite_song_changed
  after insert or delete on public.favorite_songs
  for each row execute procedure public.update_song_like_count();

-- C. Incrémentation/Décrémentation des compteurs de likes d'albums
create or replace function public.update_album_like_count()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update public.albums set like_count = like_count + 1 where id = new.album_id;
    return new;
  elsif (TG_OP = 'DELETE') then
    update public.albums set like_count = greatest(0, like_count - 1) where id = old.album_id;
    return old;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create or replace trigger on_favorite_album_changed
  after insert or delete on public.favorite_albums
  for each row execute procedure public.update_album_like_count();

-- D. Incrémentation des écoutes d'une chanson à l'insertion de l'historique
create or replace function public.increment_song_play_count()
returns trigger as $$
begin
  update public.songs set play_count = play_count + 1 where id = new.song_id;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_play_history_inserted
  after insert on public.play_history
  for each row execute procedure public.increment_song_play_count();

-- =========================================================================
-- 5. POLITIQUES DE SÉCURITÉ AU NIVEAU DES LIGNES (ROW LEVEL SECURITY - RLS)
-- =========================================================================

-- Activation de la sécurité RLS sur toutes les tables
alter table public.profiles enable row level security;
alter table public.genres enable row level security;
alter table public.artists enable row level security;
alter table public.albums enable row level security;
alter table public.songs enable row level security;
alter table public.playlists enable row level security;
alter table public.playlist_songs enable row level security;
alter table public.favorite_songs enable row level security;
alter table public.favorite_albums enable row level security;
alter table public.favorite_artists enable row level security;
alter table public.play_history enable row level security;

-- Politiques pour PROFILES
create policy "Les profils publics sont lisibles par tous." on public.profiles
  for select using (true);

create policy "Les utilisateurs modifient leur propre profil." on public.profiles
  for update using (auth.uid() = id);

-- Politiques pour le CATALOGUE (Lecture seule pour tous, modifications admin uniquement)
create policy "Les genres sont lisibles par tous." on public.genres for select using (true);
create policy "Les artistes sont lisibles par tous." on public.artists for select using (true);
create policy "Les albums sont lisibles par tous." on public.albums for select using (true);
create policy "Les chansons sont lisibles par tous." on public.songs for select using (true);

-- Politiques pour PLAYLISTS
create policy "Les playlists sont lisibles par leur propriétaire ou si elles sont publiques." on public.playlists
  for select using (auth.uid() = user_id or is_private = false);

create policy "Les utilisateurs peuvent créer des playlists." on public.playlists
  for insert with check (auth.uid() = user_id);

create policy "Les utilisateurs peuvent modifier leurs playlists." on public.playlists
  for update using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent supprimer leurs playlists." on public.playlists
  for delete using (auth.uid() = user_id);

-- Politiques pour PLAYLIST_SONGS (Chansons dans les playlists)
create policy "Les chansons de playlists publiques/propres sont lisibles." on public.playlist_songs
  for select using (
    exists (
      select 1 from public.playlists
      where playlists.id = playlist_songs.playlist_id and (playlists.is_private = false or playlists.user_id = auth.uid())
    )
  );

create policy "Les propriétaires de playlist peuvent gérer leurs chansons." on public.playlist_songs
  for all using (
    exists (
      select 1 from public.playlists
      where playlists.id = playlist_songs.playlist_id and playlists.user_id = auth.uid()
    )
  );

-- Politiques pour FAVORITES (FAVORITE_SONGS, FAVORITE_ALBUMS, FAVORITE_ARTISTS)
-- Chansons favorites
create policy "Les favoris chansons sont lisibles par leur utilisateur." on public.favorite_songs
  for select using (auth.uid() = user_id);
create policy "Les utilisateurs ajoutent leurs favoris chansons." on public.favorite_songs
  for insert with check (auth.uid() = user_id);
create policy "Les utilisateurs retirent leurs favoris chansons." on public.favorite_songs
  for delete using (auth.uid() = user_id);

-- Albums favoris
create policy "Les favoris albums sont lisibles par leur utilisateur." on public.favorite_albums
  for select using (auth.uid() = user_id);
create policy "Les utilisateurs ajoutent leurs favoris albums." on public.favorite_albums
  for insert with check (auth.uid() = user_id);
create policy "Les utilisateurs retirent leurs favoris albums." on public.favorite_albums
  for delete using (auth.uid() = user_id);

-- Artistes favoris
create policy "Les favoris artistes sont lisibles par leur utilisateur." on public.favorite_artists
  for select using (auth.uid() = user_id);
create policy "Les utilisateurs ajoutent leurs favoris artistes." on public.favorite_artists
  for insert with check (auth.uid() = user_id);
create policy "Les utilisateurs retirent leurs favoris artistes." on public.favorite_artists
  for delete using (auth.uid() = user_id);

-- Politiques pour PLAY_HISTORY (Historique d'écoute)
create policy "L'historique de lecture est lisible par son utilisateur." on public.play_history
  for select using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent journaliser leur historique." on public.play_history
  for insert with check (auth.uid() = user_id);
