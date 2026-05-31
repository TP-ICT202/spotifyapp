# 🎵 Spotify Clone - React Native CLI

Projet de groupe (8 développeurs) — clone Spotify en React Native CLI + Supabase.

---

# 🚀 Objectif du projet

Créer une application mobile type Spotify avec :

- Auth utilisateur
- Lecture musique complète
- Navigation fluide (Home / Search / Library / Player)
- Système de playlists
- Recherche de musique
- Expérience utilisateur fluide (UX Spotify)

---

# 🧱 Stack technique

## Frontend
- React Native CLI (TypeScript)
- React Navigation
- Zustand (state management)

## Backend
- Supabase
  - Auth
  - PostgreSQL Database
  - Storage (audio + images)

## Audio
- react-native-track-player

---

# 📱 Fonctionnalités MVP

## 🎧 Music Player
- Play / Pause
- Next / Previous
- Mini player
- Queue de lecture
- Background audio

## 🔎 Search
- Recherche musique
- Filtrage par artiste / titre

## 📚 Library
- Playlists utilisateur
- Musiques likées
- Recently played

## 👤 Auth
- Login / Register
- Profil utilisateur

---

# 🗂️ Architecture du projet
src/
├── assets/
├── components/
├── screens/
│ ├── HomeScreen/
│ ├── SearchScreen/
│ ├── LibraryScreen/
│ └── PlayerScreen/
├── navigation/
├── services/
│ ├── supabase/
│ ├── player/
│ ├── queue/
│ ├── history/
│ └── api/
├── store/
├── hooks/
├── utils/
├── constants/
└── theme/


---

# 👥 RÉPARTITION DÉTAILLÉE (8 DÉVELOPPEURS)

---

## 🧑‍💻 1 — LEAD FRONTEND / NAVIGATION

### 🎯 Rôle :
Structure globale de l’application + navigation

### 📂 Fichiers :

App.tsx
src/navigation/AppNavigator.tsx
src/navigation/TabNavigator.tsx
src/constants/


### 🧠 Tâches :
- navigation bottom tabs
- stack navigation player
- architecture globale
- liaison écrans

---

## 🔐 2 — AUTH + UTILISATEURS (SUPABASE AUTH)

### 📂 Fichiers :

src/services/supabase/auth.ts
src/store/useAuthStore.ts
src/screens/auth/


### 🧠 Tâches :
- login / register
- gestion session utilisateur
- profil utilisateur

---

## 🎧 3 — MUSIC PLAYER ENGINE

### 📂 Fichiers :

src/services/player/
src/store/usePlayerStore.ts
src/components/player/
src/screens/PlayerScreen/


### 🧠 Tâches :
- play / pause / next / prev
- mini player
- gestion audio globale
- background audio

---

## 🔎 4 — SEARCH SYSTEM

### 📂 Fichiers :

src/screens/SearchScreen/
src/services/api/
src/hooks/useSearch.ts


### 🧠 Tâches :
- recherche musique
- affichage résultats
- filtre artiste / titre

---

## 📚 5 — LIBRARY + PLAYLISTS

### 📂 Fichiers :

src/screens/LibraryScreen/
src/services/playlists/
src/store/useLibraryStore.ts


### 🧠 Tâches :
- playlists utilisateur
- liked songs
- gestion bibliothèque

---

## 🎨 6 — UI / DESIGN SYSTEM

### 📂 Fichiers :

src/components/common/
src/components/ui/
src/theme/
src/assets/


### 🧠 Tâches :
- design Spotify dark mode
- composants réutilisables
- boutons, cards, inputs
- cohérence UI

---

## ⚙️ 7 — BACKEND SUPABASE

### 📂 Fichiers :

src/services/supabase/client.ts
src/services/supabase/database.ts
database.sql


### 🧠 Tâches :
- base de données
- tables users / tracks / playlists
- storage audio/images
- sécurité (policies)

---

## ⚡ 8 — QUEUE + RECOMMANDATIONS + PERFORMANCE

### 📂 Fichiers :

src/services/queue/
src/services/history/
src/hooks/useRecentlyPlayed.ts
src/store/useQueueStore.ts
src/components/recommendations/
src/screens/HomeScreen/sections/


### 🧠 Tâches :
- queue musique (playlist dynamique)
- historique d’écoute
- recommandations Home
- optimisation performance app
- amélioration UX Spotify

---