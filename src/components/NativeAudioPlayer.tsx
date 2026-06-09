import { useEffect, useRef, useState } from 'react';
import { NativeModules, Platform, UIManager } from 'react-native';
import Video, {
  type OnLoadData,
  type OnProgressData,
  type ReactVideoSource,
} from 'react-native-video';

type Props = {
  source: number | { uri: string };
  paused: boolean;
  onProgress: (data: OnProgressData) => void;
  onLoad: (data: OnLoadData) => void;
  onEnd: () => void;
  onError: (message: string) => void;
  onNativeMissing?: () => void;
};

function isRctVideoAvailable(): boolean {
  if (Platform.OS === 'web') return false;

  const viewConfig =
    UIManager.getViewManagerConfig?.('RCTVideo') ??
  // @ts-expect-error legacy RN API
    UIManager.RCTVideo;

  if (viewConfig) return true;

  return Boolean(NativeModules.VideoManager || NativeModules.RCTVideo);
}

export default function NativeAudioPlayer({
  source,
  paused,
  onProgress,
  onLoad,
  onEnd,
  onError,
  onNativeMissing,
}: Props) {
  const [nativeReady] = useState(isRctVideoAvailable);
  const reportedRef = useRef(false);

  useEffect(() => {
    if (nativeReady || reportedRef.current) return;
    reportedRef.current = true;
    onNativeMissing?.();
    onError(
      'Module audio natif absent. Fermez l’app puis lancez : cd android && ./gradlew clean && cd .. && npm run android',
    );
  }, [nativeReady, onNativeMissing, onError]);

  if (!nativeReady) {
    return null;
  }

  // Un asset embarqué (require) est un nombre ; react-native-video l'accepte
  // au runtime mais ses types n'exposent que ReactVideoSource.
  const videoSource = source as unknown as ReactVideoSource;

  return (
    <Video
      source={videoSource}
      paused={paused}
      playInBackground
      playWhenInactive
      ignoreSilentSwitch="ignore"
      onProgress={onProgress}
      onLoad={onLoad}
      onEnd={onEnd}
      onError={event => {
        onError(event.error?.errorString ?? 'Erreur de lecture audio.');
      }}
      style={{ width: 0, height: 0, opacity: 0 }}
    />
  );
}

export { isRctVideoAvailable };
