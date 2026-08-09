export interface Point2D {
  x: number;
  y: number;
}

export interface Point3D extends Point2D {
  z: number;
}

export type GestureType = 'NONE' | 'POINTING' | 'PINCH' | 'FIST' | 'OPEN_HAND' | 'PALM_BOOM';

export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

export interface TrackedHand {
  index: number;
  landmarks: HandLandmark[];
  indexFingerTip: Point2D;
  thumbTip: Point2D;
  palmCenter: Point2D;
  gesture: GestureType;
  pinchDistance: number;
  handSize: number;
  movementVelocity: number;
}

export interface TrackingFrame {
  hands: TrackedHand[];
  timestamp: number;
}
