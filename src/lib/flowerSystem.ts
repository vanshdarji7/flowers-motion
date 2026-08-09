import type { Flower, FlowerType } from '../types/flower';

const FLOWER_TYPES: FlowerType[] = [
  'daisy',
  'pink_blossom',
  'sunflower',
  'white_wildflower',
  'purple_cosmos',
  'blue_hydrangea',
];

const FLOWER_PALETTES: Record<FlowerType, { petals: string[]; center: string; centerDetail?: string }> = {
  daisy: {
    petals: ['#FFFFFF', '#F0F4F8', '#E2E8F0'],
    center: '#F59E0B',
    centerDetail: '#D97706',
  },
  pink_blossom: {
    petals: ['#F472B6', '#F43F5E', '#FB7185'],
    center: '#991B1B',
    centerDetail: '#FDE047',
  },
  sunflower: {
    petals: ['#FBBF24', '#F59E0B', '#D97706'],
    center: '#451A03',
    centerDetail: '#78350F',
  },
  white_wildflower: {
    petals: ['#F8FAFC', '#E2E8F0', '#CBD5E1'],
    center: '#84CC16',
    centerDetail: '#65A30D',
  },
  purple_cosmos: {
    petals: ['#C084FC', '#A855F7', '#9333EA'],
    center: '#FDE047',
    centerDetail: '#CA8A04',
  },
  blue_hydrangea: {
    petals: ['#38BDF8', '#0284C7', '#60A5FA'],
    center: '#F0F9FF',
    centerDetail: '#BAE6FD',
  },
};

export function createRandomFlower(
  x: number,
  y: number,
  minSize: number = 0.8,
  maxSize: number = 1.2,
  forcedType?: FlowerType
): Flower {
  const type = forcedType || FLOWER_TYPES[Math.floor(Math.random() * FLOWER_TYPES.length)];
  const palette = FLOWER_PALETTES[type];

  let petalCount = 8;
  if (type === 'daisy') petalCount = 12;
  else if (type === 'sunflower') petalCount = 16;
  else if (type === 'pink_blossom' || type === 'white_wildflower') petalCount = 5;
  else if (type === 'purple_cosmos') petalCount = 8;
  else if (type === 'blue_hydrangea') petalCount = 4;

  const targetScale = (minSize + Math.random() * (maxSize - minSize)) * (type === 'blue_hydrangea' ? 1.2 : 1.0);

  return {
    id: `flower_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    x: x + (Math.random() - 0.5) * 8,
    y: y + (Math.random() - 0.5) * 8,
    targetScale,
    currentScale: 0.05,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.005,
    swayAmplitude: 0.05 + Math.random() * 0.08,
    swaySpeed: 1.5 + Math.random() * 1.5,
    swayOffset: Math.random() * Math.PI * 2,
    opacity: 1,
    createdAt: Date.now(),
    lifetime: 0,
    petalCount,
    colorScheme: palette,
  };
}

export function drawFlower(ctx: CanvasRenderingContext2D, flower: Flower, timeSec: number): void {
  const { x, y, currentScale, opacity, colorScheme, petalCount, type, swayAmplitude, swaySpeed, swayOffset } = flower;

  if (currentScale <= 0.01 || opacity <= 0.01) return;

  const swayAngle = Math.sin(timeSec * swaySpeed + swayOffset) * swayAmplitude;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(flower.rotation + swayAngle);
  ctx.scale(currentScale, currentScale);
  ctx.globalAlpha = Math.max(0, Math.min(1, opacity));

  // Shadow under flower
  ctx.save();
  ctx.beginPath();
  ctx.arc(2, 4, 18, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.fill();
  ctx.restore();

  // Render Petals
  const angleStep = (Math.PI * 2) / petalCount;

  for (let i = 0; i < petalCount; i++) {
    const angle = i * angleStep;
    ctx.save();
    ctx.rotate(angle);

    if (type === 'daisy') {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-6, -15, -4, -30, 0, -34);
      ctx.bezierCurveTo(4, -30, 6, -15, 0, 0);
      ctx.fillStyle = colorScheme.petals[i % colorScheme.petals.length];
      ctx.fill();
      ctx.strokeStyle = 'rgba(200, 210, 220, 0.4)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    } else if (type === 'pink_blossom') {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-10, -12, -12, -26, -4, -30);
      ctx.bezierCurveTo(0, -27, 0, -27, 4, -30);
      ctx.bezierCurveTo(12, -26, 10, -12, 0, 0);

      const grad = ctx.createLinearGradient(0, 0, 0, -30);
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.4, colorScheme.petals[0]);
      grad.addColorStop(1, colorScheme.petals[1]);
      ctx.fillStyle = grad;
      ctx.fill();
    } else if (type === 'sunflower') {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-9, -15, 0, -36);
      ctx.quadraticCurveTo(9, -15, 0, 0);

      const grad = ctx.createLinearGradient(0, 0, 0, -36);
      grad.addColorStop(0, colorScheme.petals[2]);
      grad.addColorStop(0.5, colorScheme.petals[0]);
      grad.addColorStop(1, colorScheme.petals[1]);
      ctx.fillStyle = grad;
      ctx.fill();
    } else if (type === 'white_wildflower') {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-12, -10, -10, -24, 0, -25);
      ctx.bezierCurveTo(10, -24, 12, -10, 0, 0);
      ctx.fillStyle = colorScheme.petals[i % colorScheme.petals.length];
      ctx.fill();
    } else if (type === 'purple_cosmos') {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-8, -18);
      ctx.lineTo(-6, -28);
      ctx.lineTo(0, -27);
      ctx.lineTo(6, -28);
      ctx.lineTo(8, -18);
      ctx.closePath();

      const grad = ctx.createRadialGradient(0, 0, 2, 0, -20, 25);
      grad.addColorStop(0, colorScheme.petals[0]);
      grad.addColorStop(1, colorScheme.petals[2]);
      ctx.fillStyle = grad;
      ctx.fill();
    } else if (type === 'blue_hydrangea') {
      ctx.beginPath();
      ctx.ellipse(0, -14, 8, 12, 0, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(0, -14, 1, 0, -14, 12);
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.6, colorScheme.petals[0]);
      grad.addColorStop(1, colorScheme.petals[1]);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    ctx.restore();
  }

  // Flower Center Disc
  const centerRadius = type === 'sunflower' ? 14 : type === 'daisy' ? 10 : 8;
  const centerGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, centerRadius);
  centerGrad.addColorStop(0, colorScheme.centerDetail || '#FFFFFF');
  centerGrad.addColorStop(0.8, colorScheme.center);
  centerGrad.addColorStop(1, colorScheme.centerDetail || colorScheme.center);

  ctx.beginPath();
  ctx.arc(0, 0, centerRadius, 0, Math.PI * 2);
  ctx.fillStyle = centerGrad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.lineWidth = 1;
  ctx.stroke();

  if (type === 'sunflower') {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    for (let r = 3; r < centerRadius - 2; r += 3) {
      const dots = Math.floor(r * 2.5);
      for (let d = 0; d < dots; d++) {
        const a = (d / dots) * Math.PI * 2;
        ctx.fillRect(Math.cos(a) * r, Math.sin(a) * r, 1.2, 1.2);
      }
    }
  } else if (type === 'pink_blossom' || type === 'purple_cosmos') {
    ctx.strokeStyle = '#FDE047';
    ctx.lineWidth = 1.2;
    for (let s = 0; s < 10; s++) {
      const sa = (s / 10) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(sa) * (centerRadius + 4), Math.sin(sa) * (centerRadius + 4));
      ctx.stroke();
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(Math.cos(sa) * (centerRadius + 4) - 1, Math.sin(sa) * (centerRadius + 4) - 1, 2, 2);
    }
  }

  ctx.restore();
}
