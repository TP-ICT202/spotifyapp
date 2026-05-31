// ============================================================
// services/trackPlayerService.ts
// Service de fond requis par react-native-track-player
// Doit être enregistré dans index.js AVANT AppRegistry
// ============================================================

import TrackPlayer, { Event } from 'react-native-track-player';

module.exports = async function () {
  // Bouton Play (notification / écran verrouillé)
  TrackPlayer.addEventListener(Event.RemotePlay,  () => TrackPlayer.play());
  // Bouton Pause
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  // Bouton Stop
  TrackPlayer.addEventListener(Event.RemoteStop,  () => TrackPlayer.stop());
  // Bouton Suivant
  TrackPlayer.addEventListener(Event.RemoteNext,  () => TrackPlayer.skipToNext());
  // Bouton Précédent
  TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());
  // Seek depuis la notification
  TrackPlayer.addEventListener(Event.RemoteSeek, ({ position }) =>
    TrackPlayer.seekTo(position),
  );
};
