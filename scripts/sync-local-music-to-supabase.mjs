import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const rootDir = process.cwd();
const musicDir = path.join(rootDir, 'musiques');
const bucket = 'songs-bucket';

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing env vars: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const slugify = (input) =>
  input
    .toLowerCase()
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const parseTrack = (fileName) => {
  const base = fileName.replace(/\.[^/.]+$/, '');
  const split = base.split(' - ');
  if (split.length < 2) {
    return { artist: 'Unknown Artist', title: base };
  }

  const artist = split.shift()?.trim() || 'Unknown Artist';
  const title = split.join(' - ').trim() || base;
  return { artist, title };
};

const ensureArtist = async (name) => {
  const { data: existing, error: findError } = await supabase
    .from('artists')
    .select('id')
    .eq('name', name)
    .limit(1)
    .maybeSingle();

  if (findError) throw findError;
  if (existing?.id) return existing.id;

  const { data: inserted, error: insertError } = await supabase
    .from('artists')
    .insert({ name })
    .select('id')
    .single();

  if (insertError) throw insertError;
  return inserted.id;
};

const ensureBucketExists = async () => {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) throw error;

  const exists = data.some((entry) => entry.name === bucket || entry.id === bucket);
  if (exists) return;

  const { error: createError } = await supabase.storage.createBucket(bucket, {
    public: true,
  });

  if (createError) throw createError;
};

const run = async () => {
  await ensureBucketExists();

  const entries = await fs.readdir(musicDir, { withFileTypes: true });
  const audioFiles = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => /\.(mp3|wav|ogg|m4a)$/i.test(name));

  if (audioFiles.length === 0) {
    console.log('No audio files found in musiques/.');
    return;
  }

  for (const fileName of audioFiles) {
    const { artist, title } = parseTrack(fileName);
    const fullPath = path.join(musicDir, fileName);
    const fileContent = await fs.readFile(fullPath);

    const ext = path.extname(fileName).toLowerCase() || '.mp3';
    const objectPath = `raw/${slugify(`${artist}-${title}`)}${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(objectPath, fileContent, {
        upsert: true,
        contentType: ext === '.ogg' ? 'audio/ogg' : ext === '.wav' ? 'audio/wav' : 'audio/mpeg',
      });

    if (uploadError) {
      console.error(`Upload failed for ${fileName}:`, uploadError.message);
      continue;
    }

    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(objectPath);
    const audioUrl = publicData.publicUrl;

    const artistId = await ensureArtist(artist);

    const { data: existingSong, error: findSongError } = await supabase
      .from('songs')
      .select('id')
      .eq('title', title)
      .eq('artist_id', artistId)
      .limit(1)
      .maybeSingle();

    if (findSongError) {
      console.error(`Lookup failed for ${title}:`, findSongError.message);
      continue;
    }

    const payload = {
      title,
      artist_id: artistId,
      duration_seconds: 180,
      audio_url: audioUrl,
    };

    if (existingSong?.id) {
      const { error: updateError } = await supabase
        .from('songs')
        .update(payload)
        .eq('id', existingSong.id);

      if (updateError) {
        console.error(`Update failed for ${title}:`, updateError.message);
        continue;
      }

      console.log(`Updated: ${artist} - ${title}`);
    } else {
      const { error: insertError } = await supabase.from('songs').insert(payload);
      if (insertError) {
        console.error(`Insert failed for ${title}:`, insertError.message);
        continue;
      }

      console.log(`Inserted: ${artist} - ${title}`);
    }
  }

  console.log('Music sync finished.');
};

run().catch((error) => {
  console.error('Sync failed:', error.message);
  process.exit(1);
});
