import { useState, useCallback, useRef } from 'react';
import { useCamera } from './hooks/useCamera';
import { useHandTracking } from './hooks/useHandTracking';
import { StartScreen } from './components/StartScreen';
import { CameraView } from './components/CameraView';
import { FlowerCanvas } from './components/FlowerCanvas';
import { Controls } from './components/Controls';
import { SettingsModal } from './components/SettingsModal';
import { PermissionMessage } from './components/PermissionMessage';
import { DEFAULT_CONFIG } from './types/flower';
import type { GardenConfig } from './types/flower';
import type { GestureType } from './types/hand';

export function App() {
  const [started, setStarted] = useState(false);
  const [config, setConfig] = useState<GardenConfig>(DEFAULT_CONFIG);
  const [flowerCount, setFlowerCount] = useState<number>(0);
  const [activeGesture, setActiveGesture] = useState<GestureType>('NONE');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [clearTrigger, setClearTrigger] = useState(0);

  const interactionTimeoutRef = useRef<number | null>(null);

  const { videoRef, cameraState, errorMessage, startCamera } = useCamera();
  const { status: trackingStatus, landmarker, initTracking } = useHandTracking();

  const handleStart = async () => {
    setStarted(true);
    await startCamera();
    await initTracking();
  };

  const handleClearGarden = () => {
    setClearTrigger((prev) => prev + 1);
    setFlowerCount(0);
  };

  const handleInteractionStart = useCallback(() => {
    setIsUserInteracting(true);
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
    interactionTimeoutRef.current = window.setTimeout(() => {
      setIsUserInteracting(false);
    }, 2500);
  }, []);

  const isLoading = cameraState === 'requesting' || trackingStatus === 'loading';
  const hasError = cameraState === 'denied' || cameraState === 'error' || cameraState === 'unsupported';

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none">
      {!started && (
        <StartScreen onStart={handleStart} isLoading={isLoading} />
      )}

      {started && (
        <>
          <CameraView videoRef={videoRef} config={config} />

          <FlowerCanvas
            landmarker={landmarker}
            videoRef={videoRef}
            config={config}
            onFlowerCountChange={setFlowerCount}
            onGestureChange={setActiveGesture}
            onInteractionStart={handleInteractionStart}
            clearTrigger={clearTrigger}
          />

          <Controls
            flowerCount={flowerCount}
            activeGesture={activeGesture}
            onClear={handleClearGarden}
            onOpenSettings={() => setIsSettingsOpen(true)}
            isUserInteracting={isUserInteracting}
          />

          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            config={config}
            onChangeConfig={setConfig}
          />
        </>
      )}

      {started && hasError && (
        <PermissionMessage
          message={errorMessage || 'Webcam permission is required to create your garden.'}
          onRetry={handleStart}
        />
      )}
    </div>
  );
}

export default App;
