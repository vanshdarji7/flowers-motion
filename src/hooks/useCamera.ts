import { useState, useCallback, useEffect, useRef } from 'react';

export type CameraState = 'idle' | 'requesting' | 'active' | 'denied' | 'error' | 'unsupported';

export interface UseCameraResult {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  cameraState: CameraState;
  errorMessage: string | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  stream: MediaStream | null;
}

export function useCamera(): UseCameraResult {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<CameraState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraState('idle');
  }, [stream]);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraState('unsupported');
      setErrorMessage('Camera access is not supported by your browser.');
      return;
    }

    setCameraState('requesting');
    setErrorMessage(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }

      setCameraState('active');
    } catch (err: any) {
      console.error('Webcam permission / initialization error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraState('denied');
        setErrorMessage('Camera permission was denied. Please enable camera access in your browser settings.');
      } else {
        setCameraState('error');
        setErrorMessage(err.message || 'Unable to access your webcam.');
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return {
    videoRef,
    cameraState,
    errorMessage,
    startCamera,
    stopCamera,
    stream,
  };
}
