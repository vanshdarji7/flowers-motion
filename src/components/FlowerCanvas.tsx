import React, { useEffect, useRef, useCallback } from 'react';
import type { HandLandmarker } from '@mediapipe/tasks-vision';
import type { Flower, GardenConfig, SparkleParticle, Butterfly } from '../types/flower';
import type { GestureType, Point2D, TrackedHand } from '../types/hand';
import { PositionSmoother } from '../lib/smoothing';
import { processHandFrame } from '../lib/handTracking';
import { createRandomFlower, drawFlower } from '../lib/flowerSystem';
import { createSparkle, createBurstSparkles, updateSparkles, drawSparkles, drawFingerCursor } from '../lib/particles';
import { createButterfly, updateButterflies, drawButterfly } from '../lib/butterflies';

interface FlowerCanvasProps {
  landmarker: HandLandmarker | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  config: GardenConfig;
  onFlowerCountChange?: (count: number) => void;
  onGestureChange?: (gesture: GestureType) => void;
  onInteractionStart?: () => void;
  clearTrigger?: number;
}

export const FlowerCanvas: React.FC<FlowerCanvasProps> = ({
  landmarker,
  videoRef,
  config,
  onFlowerCountChange,
  onGestureChange,
  onInteractionStart,
  clearTrigger = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const flowersRef = useRef<Flower[]>([]);
  const sparklesRef = useRef<SparkleParticle[]>([]);
  const butterfliesRef = useRef<Butterfly[]>([]);

  // Smoothers for both hands (Hand 0 and Hand 1)
  const smoothersRef = useRef<PositionSmoother[]>([
    new PositionSmoother(config.smoothingFactor),
    new PositionSmoother(config.smoothingFactor),
  ]);

  const lastSpawnPosRef = useRef<(Point2D | null)[]>([null, null]);
  const pinchCooldownRef = useRef<number[]>([0, 0]);
  const boomCooldownRef = useRef<number>(0);
  const lastGestureRef = useRef<GestureType>('NONE');

  const animationFrameId = useRef<number | null>(null);
  const prevClearTrigger = useRef<number>(clearTrigger);

  useEffect(() => {
    smoothersRef.current.forEach((s) => s.setSmoothingFactor(config.smoothingFactor));
  }, [config.smoothingFactor]);

  const clearGarden = useCallback(() => {
    flowersRef.current.forEach((f) => {
      f.isDying = true;
      f.dieProgress = 0;
    });
    if (canvasRef.current) {
      const sparkles: SparkleParticle[] = [];
      flowersRef.current.slice(0, 40).forEach((f) => {
        sparkles.push(...createBurstSparkles(f.x, f.y, 3));
      });
      sparklesRef.current.push(...sparkles);
    }
  }, []);

  // Trigger Open Palm "BOOM" Explosion
  const triggerPalmBoom = useCallback((boomCenter: Point2D) => {
    flowersRef.current.forEach((f) => {
      const dx = f.x - boomCenter.x;
      const dy = f.y - boomCenter.y;
      const dist = Math.hypot(dx, dy) || 1;
      const force = Math.min(25, 4500 / dist) + 8 + Math.random() * 12;

      f.isExploding = true;
      f.vx = (dx / dist) * force;
      f.vy = (dy / dist) * force - (2 + Math.random() * 5);
      f.spinSpeed = (Math.random() - 0.5) * 0.3;

      sparklesRef.current.push(...createBurstSparkles(f.x, f.y, 4));
    });

    sparklesRef.current.push(...createBurstSparkles(boomCenter.x, boomCenter.y, 60));
  }, []);

  useEffect(() => {
    if (clearTrigger !== prevClearTrigger.current) {
      prevClearTrigger.current = clearTrigger;
      clearGarden();
    }
  }, [clearTrigger, clearGarden]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = (now: number) => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
      }

      ctx.clearRect(0, 0, width, height);

      let trackedHands: TrackedHand[] = [];
      if (landmarker && videoRef.current && videoRef.current.readyState >= 2) {
        trackedHands = processHandFrame(landmarker, videoRef.current, now, width, height);
      }

      const activeFingerPositions: Point2D[] = [];
      let dominantGesture: GestureType = 'NONE';
      const timeNow = Date.now();

      // Process up to 2 detected hands simultaneously
      trackedHands.forEach((hand, idx) => {
        if (idx >= 2) return;
        const gesture = hand.gesture;
        if (gesture !== 'NONE') dominantGesture = gesture;

        const targetPos = hand.indexFingerTip;
        const smoother = smoothersRef.current[idx] || smoothersRef.current[0];
        const fingerPos = smoother.update(targetPos);

        if (gesture === 'POINTING' || gesture === 'NONE' || gesture === 'PINCH') {
          activeFingerPositions.push(fingerPos);
        }

        if (onInteractionStart) onInteractionStart();

        // GESTURE INTERACTIONS
        if (gesture === 'PALM_BOOM') {
          if (timeNow - boomCooldownRef.current > 1000) {
            boomCooldownRef.current = timeNow;
            triggerPalmBoom(hand.palmCenter);
          }
        } else if (gesture === 'PINCH') {
          if (timeNow - (pinchCooldownRef.current[idx] || 0) > 700) {
            pinchCooldownRef.current[idx] = timeNow;
            const newFlowers: Flower[] = [];
            for (let i = 0; i < 14; i++) {
              const angle = (i / 14) * Math.PI * 2;
              const radius = 25 + Math.random() * 40;
              const fx = fingerPos.x + Math.cos(angle) * radius;
              const fy = fingerPos.y + Math.sin(angle) * radius;
              newFlowers.push(createRandomFlower(fx, fy, config.minFlowerSize, config.maxFlowerSize));
            }
            flowersRef.current.push(...newFlowers);
            sparklesRef.current.push(...createBurstSparkles(fingerPos.x, fingerPos.y, 35));
          }
        } else if (gesture === 'POINTING' || gesture === 'NONE') {
          const lastPos = lastSpawnPosRef.current[idx];
          let shouldSpawn = false;

          if (!lastPos) {
            shouldSpawn = true;
          } else {
            const dist = Math.hypot(fingerPos.x - lastPos.x, fingerPos.y - lastPos.y);
            if (dist >= config.spawnDistance) {
              shouldSpawn = true;
            }
          }

          if (shouldSpawn) {
            const newFlower = createRandomFlower(
              fingerPos.x,
              fingerPos.y,
              config.minFlowerSize,
              config.maxFlowerSize
            );
            flowersRef.current.push(newFlower);
            lastSpawnPosRef.current[idx] = { ...fingerPos };

            for (let s = 0; s < config.sparkleDensity; s++) {
              sparklesRef.current.push(createSparkle(fingerPos.x, fingerPos.y));
            }
          }
        }
      });

      for (let i = trackedHands.length; i < 2; i++) {
        smoothersRef.current[i].reset();
        lastSpawnPosRef.current[i] = null;
      }

      if (dominantGesture !== lastGestureRef.current) {
        lastGestureRef.current = dominantGesture;
        if (onGestureChange) onGestureChange(dominantGesture);
      }

      if (flowersRef.current.length > config.maxFlowers) {
        const overflow = flowersRef.current.length - config.maxFlowers;
        for (let i = 0; i < overflow; i++) {
          if (!flowersRef.current[i].isDying && !flowersRef.current[i].isExploding) {
            flowersRef.current[i].isDying = true;
            flowersRef.current[i].dieProgress = 0;
          }
        }
      }

      const aliveFlowers: Flower[] = [];
      const nowMs = Date.now();

      flowersRef.current.forEach((f) => {
        if (f.currentScale < f.targetScale && !f.isDying && !f.isExploding) {
          f.currentScale += (f.targetScale - f.currentScale) * 0.18;
          if (Math.abs(f.targetScale - f.currentScale) < 0.01) {
            f.currentScale = f.targetScale;
          }
        }

        if (f.isExploding) {
          f.x += f.vx || 0;
          f.y += f.vy || 0;
          if (f.vx) f.vx *= 0.95;
          if (f.vy) f.vy *= 0.95;
          f.rotation += f.spinSpeed || 0.1;
          f.currentScale *= 0.96;
          f.opacity *= 0.95;

          if (Math.random() < 0.3) {
            sparklesRef.current.push(createSparkle(f.x, f.y, 0.5));
          }

          if (f.currentScale > 0.05 && f.opacity > 0.05) {
            aliveFlowers.push(f);
          }
        } else if (f.isDying) {
          f.currentScale *= 0.92;
          f.opacity *= 0.92;
          if (f.currentScale > 0.02 && f.opacity > 0.02) {
            aliveFlowers.push(f);
          }
        } else {
          if (config.flowerLifetime > 0 && nowMs - f.createdAt > config.flowerLifetime) {
            f.isDying = true;
          }
          aliveFlowers.push(f);
        }
      });
      flowersRef.current = aliveFlowers;

      if (onFlowerCountChange && flowersRef.current.length % 5 === 0) {
        onFlowerCountChange(flowersRef.current.length);
      }

      if (config.enableButterflies) {
        if (flowersRef.current.length > 12 && butterfliesRef.current.length < 4 && Math.random() < 0.008) {
          butterfliesRef.current.push(createButterfly(width, height, flowersRef.current));
        }
        butterfliesRef.current = updateButterflies(butterfliesRef.current, width, height, flowersRef.current, now / 1000);
      } else {
        butterfliesRef.current = [];
      }

      sparklesRef.current = updateSparkles(sparklesRef.current);

      const timeSec = now / 1000;

      // 1. Flowers
      flowersRef.current.forEach((flower) => {
        drawFlower(ctx, flower, timeSec);
      });

      // 2. Butterflies
      butterfliesRef.current.forEach((b) => {
        drawButterfly(ctx, b);
      });

      // 3. Sparkle Particles
      drawSparkles(ctx, sparklesRef.current);

      // 4. Glowing Finger Cursors
      activeFingerPositions.forEach((pos) => {
        drawFingerCursor(ctx, pos.x, pos.y, timeSec, true);
      });

      // 5. Hand Landmarks Debug Overlay
      if (config.showLandmarks && trackedHands.length > 0) {
        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
        ctx.lineWidth = 2;
        trackedHands.forEach((hand) => {
          hand.landmarks.forEach((lm) => {
            const lx = (1 - lm.x) * width;
            const ly = lm.y * height;
            ctx.beginPath();
            ctx.arc(lx, ly, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#38BDF8';
            ctx.fill();
          });
        });
        ctx.restore();
      }

      animationFrameId.current = requestAnimationFrame(loop);
    };

    animationFrameId.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [
    landmarker,
    videoRef,
    config,
    onFlowerCountChange,
    onGestureChange,
    onInteractionStart,
    clearGarden,
    triggerPalmBoom,
  ]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />;
};
