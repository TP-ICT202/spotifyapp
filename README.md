# Spotify Clone (React Native + Supabase)

Ce projet est un clone de Spotify développé en React Native et propulsé par Supabase pour la base de données, l'authentification et le stockage de fichiers audio.

## 🚀 Intégration Supabase & Services (Validé ✅)

L'infrastructure backend et la communication API client ont été mises en place :
* [supabase_schema.sql](file:///home/skjuve/Vidéos/spotifyapp/supabase_schema.sql) : Schéma relationnel complet (Profils, Artistes, Albums, Morceaux, Playlists, Favoris, Historique).
* [seed_data.sql](file:///home/skjuve/Vidéos/spotifyapp/seed_data.sql) : Données d'essais SQL avec des morceaux et des fichiers audio MP3 hébergés en ligne.
* [repartition_taches.md](file:///home/skjuve/Vidéos/spotifyapp/repartition_taches.md) : Planification des tâches (8 membres) et guide d'utilisation des services de code.
* [src/config/env.ts](file:///home/skjuve/Vidéos/spotifyapp/src/config/env.ts) : Configuration de vos identifiants Supabase.
* [src/services/supabaseClient.ts](file:///home/skjuve/Vidéos/spotifyapp/src/services/supabaseClient.ts) : Client API avec persistance locale de session.
* [src/services/authService.ts](file:///home/skjuve/Vidéos/spotifyapp/src/services/authService.ts) : Inscription, connexion, déconnexion et profils.
* [src/services/musicService.ts](file:///home/skjuve/Vidéos/spotifyapp/src/services/musicService.ts) : CRUD musiques, recherche, favoris et historique d'écoutes.

### 🛠️ Configuration Initiale de l'Équipe :
1. **Dépendances** : Lancez `npm install` pour installer tous les modules (y compris `@supabase/supabase-js` et `@react-native-async-storage/async-storage` ajoutés par le membre 8).
2. **Identifiants** : Remplissez les clés de votre console Supabase dans [src/config/env.ts](file:///home/skjuve/Vidéos/spotifyapp/src/config/env.ts) (voir le modèle [.env.example](file:///home/skjuve/Vidéos/spotifyapp/.env.example)).
3. **Base de données** : Copiez-collez et exécutez le script [supabase_schema.sql](file:///home/skjuve/Vidéos/spotifyapp/supabase_schema.sql) puis [seed_data.sql](file:///home/skjuve/Vidéos/spotifyapp/seed_data.sql) dans l'éditeur SQL de votre projet Supabase.
4. **Feuille de route** : Lisez le guide [repartition_taches.md](file:///home/skjuve/Vidéos/spotifyapp/repartition_taches.md) pour récupérer les exemples de code pour votre tâche (Membres 1 à 7).

---

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
