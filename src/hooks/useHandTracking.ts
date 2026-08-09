import { useState, useCallback } from 'react';
import type { HandLandmarker } from '@mediapipe/tasks-vision';
import { getHandLandmarker } from '../lib/handTracking';

export type HandTrackingStatus = 'idle' | 'loading' | 'ready' | 'error';

export function useHandTracking() {
  const [status, setStatus] = useState<HandTrackingStatus>('idle');
  const [landmarker, setLandmarker] = useState<HandLandmarker | null>(null);
  const [error, setError] = useState<string | null>(null);

  const initTracking = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const hl = await getHandLandmarker();
      setLandmarker(hl);
      setStatus('ready');
    } catch (err: any) {
      console.error('Failed to load MediaPipe hand tracking:', err);
      setStatus('error');
      setError(err?.message || 'Failed to initialize AI hand tracking models.');
    }
  }, []);

  return {
    status,
    landmarker,
    error,
    initTracking,
  };
}
