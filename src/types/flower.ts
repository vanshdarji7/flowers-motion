export type FlowerType =
  | 'daisy'
  | 'pink_blossom'
  | 'sunflower'
  | 'white_wildflower'
  | 'purple_cosmos'
  | 'blue_hydrangea';

export interface Flower {
  id: string;
  type: FlowerType;
  x: number;
  y: number;
  targetScale: number;
  currentScale: number;
  rotation: number;
  rotationSpeed: number;
  swayAmplitude: number;
  swaySpeed: number;
  swayOffset: number;
  opacity: number;
  createdAt: number;
  lifetime: number;
  petalCount: number;
  colorScheme: {
    petals: string[];
    center: string;
    centerDetail?: string;
    stem?: string;
  };
  isDying?: boolean;
  dieProgress?: number;
  // Explosion properties for Palm Boom Blast
  isExploding?: boolean;
  vx?: number;
  vy?: number;
  spinSpeed?: number;
}

export interface SparkleParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
  rotation: number;
  spin: number;
}

export interface Butterfly {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  scale: number;
  wingAngle: number;
  wingSpeed: number;
  colorPrimary: string;
  colorSecondary: string;
  opacity: number;
  createdAt: number;
  lifetime: number;
}

export interface GardenConfig {
  spawnDistance: number;       // min distance (px) between flower spawns
  minFlowerSize: number;       // min scale multiplier
  maxFlowerSize: number;       // max scale multiplier
  maxFlowers: number;          // max flowers in canvas before pruning
  flowerLifetime: number;      // lifetime in ms (0 = infinite until pruned)
  smoothingFactor: number;     // 0.05 to 0.5 (lower = smoother/slower)
  showWebcamBg: boolean;       // show webcam feed
  webcamOpacity: number;       // 0.1 to 1.0
  webcamBlur: number;          // 0 to 20px
  sparkleDensity: number;      // 1 to 5
  enableButterflies: boolean;  // toggle butterflies
  showLandmarks: boolean;      // toggle debug skeleton overlay
}

export const DEFAULT_CONFIG: GardenConfig = {
  spawnDistance: 30,
  minFlowerSize: 0.7,
  maxFlowerSize: 1.4,
  maxFlowers: 650,
  flowerLifetime: 120000,
  smoothingFactor: 0.2,
  showWebcamBg: true,
  webcamOpacity: 0.85,
  webcamBlur: 0,
  sparkleDensity: 3,
  enableButterflies: true,
  showLandmarks: false,
};
