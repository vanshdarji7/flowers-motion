import type { SparkleParticle } from '../types/flower';

const SPARKLE_COLORS = [
  '#FDE047',
  '#F472B6',
  '#38BDF8',
  '#A855F7',
  '#4ADE80',
  '#FFFFFF',
];

export function createSparkle(x: number, y: number, speedMult: number = 1.0): SparkleParticle {
  const angle = Math.random() * Math.PI * 2;
  const speed = (0.5 + Math.random() * 2.5) * speedMult;
  return {
    id: `sparkle_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    x: x + (Math.random() - 0.5) * 10,
    y: y + (Math.random() - 0.5) * 10,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 0.3,
    size: 2 + Math.random() * 4,
    color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
    opacity: 0.9,
    life: 0,
    maxLife: 20 + Math.floor(Math.random() * 25),
    rotation: Math.random() * Math.PI,
    spin: (Math.random() - 0.5) * 0.1,
  };
}

export function createBurstSparkles(x: number, y: number, count: number = 25): SparkleParticle[] {
  const particles: SparkleParticle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push(createSparkle(x, y, 2.5));
  }
  return particles;
}

export function updateSparkles(particles: SparkleParticle[]): SparkleParticle[] {
  return particles.filter((p) => {
    p.life += 1;
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.96;
    p.vy *= 0.96;
    p.rotation += p.spin;
    p.opacity = 1 - p.life / p.maxLife;
    return p.life < p.maxLife;
  });
}

export function drawSparkles(ctx: CanvasRenderingContext2D, particles: SparkleParticle[]): void {
  ctx.save();
  for (const p of particles) {
    if (p.opacity <= 0) continue;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));

    ctx.fillStyle = p.color;
    ctx.beginPath();

    const s = p.size;
    ctx.moveTo(0, -s * 1.8);
    ctx.quadraticCurveTo(0, 0, s * 1.8, 0);
    ctx.quadraticCurveTo(0, 0, 0, s * 1.8);
    ctx.quadraticCurveTo(0, 0, -s * 1.8, 0);
    ctx.quadraticCurveTo(0, 0, 0, -s * 1.8);
    ctx.fill();

    ctx.restore();
  }
  ctx.restore();
}

export function drawFingerCursor(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  timeSec: number,
  isGenerating: boolean = true
): void {
  ctx.save();
  ctx.translate(x, y);

  const pulse = Math.sin(timeSec * 6) * 3;
  const radius = 16 + pulse;

  const outerGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, radius * 2.2);
  outerGrad.addColorStop(0, isGenerating ? 'rgba(253, 224, 71, 0.9)' : 'rgba(168, 85, 247, 0.8)');
  outerGrad.addColorStop(0.4, isGenerating ? 'rgba(244, 114, 182, 0.5)' : 'rgba(56, 189, 248, 0.4)');
  outerGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = outerGrad;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 2.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = isGenerating ? '#FDE047' : '#C084FC';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.rotate(timeSec * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}
