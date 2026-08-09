import type { Butterfly, Flower } from '../types/flower';

const BUTTERFLY_COLORS = [
  { primary: '#F472B6', secondary: '#FDE047' },
  { primary: '#38BDF8', secondary: '#A855F7' },
  { primary: '#FB923C', secondary: '#FACC15' },
  { primary: '#C084FC', secondary: '#F472B6' },
];

export function createButterfly(canvasWidth: number, canvasHeight: number, flowers: Flower[]): Butterfly {
  const colors = BUTTERFLY_COLORS[Math.floor(Math.random() * BUTTERFLY_COLORS.length)];
  const startX = Math.random() < 0.5 ? -20 : canvasWidth + 20;
  const startY = Math.random() * canvasHeight * 0.8;

  let targetX = canvasWidth / 2;
  let targetY = canvasHeight / 2;

  if (flowers.length > 0) {
    const targetFlower = flowers[Math.floor(Math.random() * flowers.length)];
    targetX = targetFlower.x + (Math.random() - 0.5) * 40;
    targetY = targetFlower.y + (Math.random() - 0.5) * 40;
  }

  return {
    id: `butterfly_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    x: startX,
    y: startY,
    targetX,
    targetY,
    vx: 0,
    vy: 0,
    scale: 0.7 + Math.random() * 0.4,
    wingAngle: 0,
    wingSpeed: 10 + Math.random() * 6,
    colorPrimary: colors.primary,
    colorSecondary: colors.secondary,
    opacity: 0,
    createdAt: Date.now(),
    lifetime: 18000 + Math.random() * 12000,
  };
}

export function updateButterflies(
  butterflies: Butterfly[],
  canvasWidth: number,
  canvasHeight: number,
  flowers: Flower[],
  timeSec: number
): Butterfly[] {
  const now = Date.now();

  return butterflies.filter((b) => {
    const age = now - b.createdAt;
    if (age > b.lifetime) return false;

    if (age < 1500) {
      b.opacity = age / 1500;
    } else if (b.lifetime - age < 2000) {
      b.opacity = (b.lifetime - age) / 2000;
    } else {
      b.opacity = 1;
    }

    const dx = b.targetX - b.x;
    const dy = b.targetY - b.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 30 || Math.random() < 0.015) {
      if (flowers.length > 0 && Math.random() < 0.7) {
        const randFlower = flowers[Math.floor(Math.random() * flowers.length)];
        b.targetX = randFlower.x + (Math.random() - 0.5) * 60;
        b.targetY = randFlower.y + (Math.random() - 0.5) * 60;
      } else {
        b.targetX = Math.random() * canvasWidth;
        b.targetY = Math.random() * canvasHeight;
      }
    }

    const speed = 1.8 * b.scale;
    b.vx += (dx / Math.max(dist, 1) - b.vx) * 0.05;
    b.vy += (dy / Math.max(dist, 1) - b.vy) * 0.05;

    b.x += b.vx * speed;
    b.y += b.vy * speed + Math.sin(timeSec * 3 + b.x * 0.01) * 0.5;

    b.wingAngle = Math.sin(timeSec * b.wingSpeed);

    return true;
  });
}

export function drawButterfly(ctx: CanvasRenderingContext2D, b: Butterfly): void {
  if (b.opacity <= 0.01) return;

  const angle = Math.atan2(b.vy, b.vx);
  const flapScale = Math.max(0.15, Math.abs(b.wingAngle));

  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.rotate(angle + Math.PI / 2);
  ctx.scale(b.scale, b.scale);
  ctx.globalAlpha = Math.max(0, Math.min(1, b.opacity));

  ctx.save();
  ctx.scale(flapScale, 1);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-22, -18, -25, 4, -12, 14);
  ctx.bezierCurveTo(-6, 18, 0, 8, 0, 0);
  ctx.fillStyle = b.colorPrimary;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(-10, -2, 5, 0, Math.PI * 2);
  ctx.fillStyle = b.colorSecondary;
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.scale(-flapScale, 1);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-22, -18, -25, 4, -12, 14);
  ctx.bezierCurveTo(-6, 18, 0, 8, 0, 0);
  ctx.fillStyle = b.colorPrimary;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(-10, -2, 5, 0, Math.PI * 2);
  ctx.fillStyle = b.colorSecondary;
  ctx.fill();
  ctx.restore();

  ctx.beginPath();
  ctx.ellipse(0, 2, 2.5, 12, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#1E293B';
  ctx.fill();

  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-1, -8);
  ctx.quadraticCurveTo(-6, -14, -8, -16);
  ctx.moveTo(1, -8);
  ctx.quadraticCurveTo(6, -14, 8, -16);
  ctx.stroke();

  ctx.restore();
}
