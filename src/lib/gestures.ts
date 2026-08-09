import type { HandLandmark, GestureType } from '../types/hand';

function distance3D(p1: HandLandmark, p2: HandLandmark): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const dz = (p1.z || 0) - (p2.z || 0);
  return Math.hypot(dx, dy, dz);
}

export function detectGesture(
  landmarks: HandLandmark[],
  prevPalmCenter?: { x: number; y: number }
): {
  gesture: GestureType;
  pinchDistance: number;
  handSize: number;
  movementVelocity: number;
} {
  if (!landmarks || landmarks.length < 21) {
    return { gesture: 'NONE', pinchDistance: 999, handSize: 1, movementVelocity: 0 };
  }

  const wrist = landmarks[0];
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const middleTip = landmarks[12];
  const ringTip = landmarks[16];
  const pinkyTip = landmarks[20];

  const indexMcp = landmarks[5];
  const middleMcp = landmarks[9];
  const ringMcp = landmarks[13];
  const pinkyMcp = landmarks[17];

  const handSize = distance3D(wrist, middleMcp);
  if (handSize === 0) return { gesture: 'NONE', pinchDistance: 999, handSize: 1, movementVelocity: 0 };

  const rawPinchDist = distance3D(thumbTip, indexTip);
  const normalizedPinchDist = rawPinchDist / handSize;

  const isIndexExtended = distance3D(indexTip, wrist) > distance3D(indexMcp, wrist) * 1.15;
  const isMiddleExtended = distance3D(middleTip, wrist) > distance3D(middleMcp, wrist) * 1.15;
  const isRingExtended = distance3D(ringTip, wrist) > distance3D(ringMcp, wrist) * 1.15;
  const isPinkyExtended = distance3D(pinkyTip, wrist) > distance3D(pinkyMcp, wrist) * 1.15;
  const isThumbExtended = distance3D(thumbTip, wrist) > distance3D(indexMcp, wrist) * 1.0;

  const palmCenter = {
    x: (wrist.x + middleMcp.x) / 2,
    y: (wrist.y + middleMcp.y) / 2,
  };

  let velocity = 0;
  if (prevPalmCenter) {
    velocity = Math.hypot(palmCenter.x - prevPalmCenter.x, palmCenter.y - prevPalmCenter.y);
  }

  // 1. PINCH Gesture: Thumb tip and index tip are very close
  if (normalizedPinchDist < 0.28) {
    return { gesture: 'PINCH', pinchDistance: rawPinchDist, handSize, movementVelocity: velocity };
  }

  // 2. PALM_BOOM Gesture: Open palm (all fingers extended)
  if (isIndexExtended && isMiddleExtended && isRingExtended && isPinkyExtended && isThumbExtended) {
    if (velocity > 0.03 || normalizedPinchDist > 0.6) {
      return { gesture: 'PALM_BOOM', pinchDistance: rawPinchDist, handSize, movementVelocity: velocity };
    }
    return { gesture: 'OPEN_HAND', pinchDistance: rawPinchDist, handSize, movementVelocity: velocity };
  }

  // 3. POINTING Gesture: Index finger extended, drawing mode
  if (isIndexExtended) {
    return { gesture: 'POINTING', pinchDistance: rawPinchDist, handSize, movementVelocity: velocity };
  }

  return { gesture: 'NONE', pinchDistance: rawPinchDist, handSize, movementVelocity: velocity };
}
