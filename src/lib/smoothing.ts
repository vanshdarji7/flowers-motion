import type { Point2D } from '../types/hand';

export class PositionSmoother {
  private currentPos: Point2D | null = null;
  private velocity: Point2D = { x: 0, y: 0 };
  private smoothingFactor: number;

  constructor(smoothingFactor: number = 0.2) {
    this.smoothingFactor = smoothingFactor;
  }

  public setSmoothingFactor(factor: number): void {
    this.smoothingFactor = Math.max(0.01, Math.min(1.0, factor));
  }

  public update(target: Point2D): Point2D {
    if (!this.currentPos) {
      this.currentPos = { ...target };
      return { ...this.currentPos };
    }

    const prevX = this.currentPos.x;
    const prevY = this.currentPos.y;

    const newX = prevX + (target.x - prevX) * this.smoothingFactor;
    const newY = prevY + (target.y - prevY) * this.smoothingFactor;

    this.velocity = {
      x: newX - prevX,
      y: newY - prevY,
    };

    this.currentPos = { x: newX, y: newY };
    return { ...this.currentPos };
  }

  public getPosition(): Point2D | null {
    return this.currentPos ? { ...this.currentPos } : null;
  }

  public getVelocity(): Point2D {
    return { ...this.velocity };
  }

  public getSpeed(): number {
    return Math.hypot(this.velocity.x, this.velocity.y);
  }

  public reset(): void {
    this.currentPos = null;
    this.velocity = { x: 0, y: 0 };
  }
}
