import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import type { TrackedHand, HandLandmark } from '../types/hand';
import { detectGesture } from './gestures';

let landmarkerInstance: HandLandmarker | null = null;
let initPromise: Promise<HandLandmarker> | null = null;
const prevPalmCenters: Record<number, { x: number; y: number }> = {};

export async function getHandLandmarker(): Promise<HandLandmarker> {
  if (landmarkerInstance) return landmarkerInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      landmarkerInstance = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 2, // Track up to 2 hands simultaneously!
        minHandDetectionConfidence: 0.5,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      return landmarkerInstance;
    } catch (err) {
      console.error('Error initializing MediaPipe HandLandmarker:', err);
      initPromise = null;
      throw err;
    }
  })();

  return initPromise;
}

export function processHandFrame(
  landmarker: HandLandmarker,
  videoElement: HTMLVideoElement,
  timestamp: number,
  canvasWidth: number,
  canvasHeight: number
): TrackedHand[] {
  if (!videoElement || videoElement.readyState < 2) {
    return [];
  }

  const results = landmarker.detectForVideo(videoElement, timestamp);
  if (!results || !results.landmarks || results.landmarks.length === 0) {
    return [];
  }

  const trackedHands: TrackedHand[] = [];

  for (let i = 0; i < results.landmarks.length; i++) {
    const rawLandmarks = results.landmarks[i] as HandLandmark[];
    const wrist = rawLandmarks[0];
    const indexTipRaw = rawLandmarks[8];
    const thumbTipRaw = rawLandmarks[4];
    const middleMcp = rawLandmarks[9];

    // Mirrored coordinate mapping for selfie webcam:
    const indexFingerTip = {
      x: (1 - indexTipRaw.x) * canvasWidth,
      y: indexTipRaw.y * canvasHeight,
    };

    const thumbTip = {
      x: (1 - thumbTipRaw.x) * canvasWidth,
      y: thumbTipRaw.y * canvasHeight,
    };

    const rawPalmCenter = {
      x: (wrist.x + middleMcp.x) / 2,
      y: (wrist.y + middleMcp.y) / 2,
    };

    const palmCenter = {
      x: (1 - rawPalmCenter.x) * canvasWidth,
      y: rawPalmCenter.y * canvasHeight,
    };

    const prevCenter = prevPalmCenters[i];
    const { gesture, pinchDistance, handSize, movementVelocity } = detectGesture(rawLandmarks, prevCenter);
    prevPalmCenters[i] = rawPalmCenter;

    trackedHands.push({
      index: i,
      landmarks: rawLandmarks,
      indexFingerTip,
      thumbTip,
      palmCenter,
      gesture,
      pinchDistance,
      handSize,
      movementVelocity,
    });
  }

  return trackedHands;
}
