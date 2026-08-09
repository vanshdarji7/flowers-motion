import React from 'react';
import { Trash2, Settings, Flower2, Sparkles } from 'lucide-react';
import type { GestureType } from '../types/hand';

interface ControlsProps {
  flowerCount: number;
  activeGesture: GestureType;
  onClear: () => void;
  onOpenSettings: () => void;
  isUserInteracting: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  flowerCount,
  activeGesture,
  onClear,
  onOpenSettings,
  isUserInteracting,
}) => {
  const getGestureBadge = () => {
    switch (activeGesture) {
      case 'PALM_BOOM':
        return { label: 'PALM BOOM! Floral Blast', icon: '🖐️', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
      case 'PINCH':
        return { label: 'Pinch Burst!', icon: '🤌', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
      case 'OPEN_HAND':
        return { label: 'Open Palm Ready', icon: '🖐️', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
      case 'POINTING':
        return { label: 'Growing Flowers', icon: '👆', color: 'bg-pink-500/20 text-pink-300 border-pink-500/40' };
      default:
        return null;
    }
  };

  const gestureInfo = getGestureBadge();

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 md:p-6">
      <div className="flex items-center justify-between w-full pointer-events-auto">
        <div className="flex items-center gap-3 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl px-4 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            <Flower2 className="w-5 h-5 text-pink-400 animate-pulse" />
            <span className="font-extrabold text-sm md:text-base tracking-tight bg-gradient-to-r from-pink-300 via-purple-200 to-amber-200 bg-clip-text text-transparent">
              FLOWER MOTION
            </span>
          </div>

          <div className="h-4 w-px bg-slate-700 mx-1" />

          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
            <span className="text-pink-400 font-bold">{flowerCount}</span>
            <span className="text-slate-400">Flowers</span>
          </div>

          {gestureInfo && (
            <div
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-semibold ${gestureInfo.color} animate-fade-in`}
            >
              <span>{gestureInfo.icon}</span>
              <span>{gestureInfo.label}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClear}
            className="flex items-center gap-2 bg-slate-900/60 hover:bg-slate-800/80 backdrop-blur-md border border-slate-800 text-slate-200 hover:text-pink-300 px-3.5 py-2 rounded-2xl text-xs md:text-sm font-semibold transition-all duration-200 shadow-lg active:scale-95 cursor-pointer"
            aria-label="Clear Garden"
          >
            <Trash2 className="w-4 h-4 text-pink-400" />
            <span className="hidden sm:inline">Clear Garden</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 bg-slate-900/60 hover:bg-slate-800/80 backdrop-blur-md border border-slate-800 text-slate-200 hover:text-white rounded-2xl transition-all duration-200 shadow-lg active:scale-95 cursor-pointer"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-slate-300" />
          </button>
        </div>
      </div>

      <div
        className={`self-center transition-opacity duration-700 pointer-events-none mb-4 ${
          isUserInteracting ? 'opacity-20 hover:opacity-100' : 'opacity-90'
        }`}
      >
        <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800/80 px-5 py-2.5 rounded-full text-xs md:text-sm text-slate-200 font-medium shadow-xl flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          Move index finger(s) to draw • Push open palm for BOOM blast
        </div>
      </div>
    </div>
  );
};
