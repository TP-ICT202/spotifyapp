# Kabod Music (SpotifyRN)

Application mobile de streaming musical type Spotify, développée en **React Native** avec un backend **Supabase**. Projet de groupe (TP-ICT202).

## Fonctionnalités

- **Authentification** : inscription / connexion / déconnexion via Supabase Auth, session persistée localement (AsyncStorage).
- **Découverte** : flux d'accueil avec albums et titres.
- **Recherche** : recherche de morceaux par titre / artiste.
- **Lecture audio** : lecteur global (react-native-video) avec mini-lecteur et écran « Now Playing » (vinyle animé, progression, suivant / précédent).
- **Favoris** : like / unlike de titres, bibliothèque des morceaux aimés.
- **Mode hors-ligne** : 18 MP3 embarqués jouables sans réseau ; sinon streaming depuis Supabase Storage.
- **Historique d'écoute** : enregistrement automatique des lectures.

## Stack

- React Native `0.85.3`, React `19`
- TypeScript
- Supabase (`@supabase/supabase-js`) — Auth, Postgres, Storage
- `react-native-video` pour la lecture audio
- `@react-native-async-storage/async-storage` pour la persistance de session

## Prérequis

- Node.js `>= 22.11`
- JDK 17
- Android SDK (platform 36, build-tools 36.0.0, NDK 27.1.12297006) pour le build Android

## Installation

```bash
npm install
```

### Configuration Supabase

Les clés publiques (URL + anon key) sont renseignées dans [`src/config/env.ts`](src/config/env.ts).
Pour initialiser une base depuis zéro :

1. Exécuter [`supabase_schema.sql`](supabase_schema.sql) puis [`seed_data.sql`](seed_data.sql) dans l'éditeur SQL Supabase.
2. (Optionnel) Configurer le Storage avec [`storage_setup.sql`](storage_setup.sql) puis téléverser les MP3 :
   ```bash
   # nécessite SUPABASE_SERVICE_ROLE_KEY dans un fichier .env
   npm run sync:music
   ```

## Lancer l'app en développement

```bash
npm start          # démarre Metro
npm run android    # build + lance sur un appareil / émulateur Android
```

## Qualité du code

```bash
npm run lint       # ESLint
npx tsc --noEmit   # vérification TypeScript
npm test           # tests Jest
```

## Build de l'APK

### En local

```bash
cd android
./gradlew :app:assembleRelease
# APK généré : android/app/build/outputs/apk/release/app-release.apk
```

> L'APK release est signé avec la `debug.keystore` du dépôt (installable directement). Pour une publication, générez votre propre keystore — voir https://reactnative.dev/docs/signed-apk-android.

### Via GitHub Actions

À chaque push / pull request, le workflow [`.github/workflows/android-build.yml`](.github/workflows/android-build.yml) :

1. installe les dépendances, lance le lint, le typecheck et les tests ;
2. compile l'APK release ;
3. publie l'APK comme **artifact** (`KabodMusic-release-apk`), téléchargeable depuis l'onglet *Actions* de la PR ou du commit.

## Structure

```
App.tsx                  Point d'entrée, navigation entre écrans + état de lecture global
src/
  components/            Lecteur audio, mini-player, barre d'onglets, icônes
  config/env.ts          Clés Supabase (publiques)
  data/localMusicData.ts Catalogue MP3 embarqué (mode hors-ligne)
  screens/               Login, SignUp, Discover, Search, Library, NowPlaying, Offline
  services/              auth, catalog, music, favorites, network, audioResolver, supabaseClient
  types/                 Modèles TypeScript partagés
android/                 Projet Android natif
musiques/                Fichiers MP3 embarqués
*.sql                    Schéma, seed et configuration Storage Supabase
```
