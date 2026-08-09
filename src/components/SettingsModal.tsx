import React from 'react';
import { X, Sliders, RefreshCw, Eye, Bug } from 'lucide-react';
import { DEFAULT_CONFIG } from '../types/flower';
import type { GardenConfig } from '../types/flower';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GardenConfig;
  onChangeConfig: (newConfig: GardenConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig,
}) => {
  if (!isOpen) return null;

  const update = <K extends keyof GardenConfig>(key: K, value: GardenConfig[K]) => {
    onChangeConfig({ ...config, [key]: value });
  };

  const handleReset = () => {
    onChangeConfig(DEFAULT_CONFIG);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-pink-400" />
            <h2 className="text-lg font-bold text-slate-100">Garden Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 text-sm">
          <div>
            <div className="flex justify-between mb-1">
              <label className="font-medium text-slate-300">Spawn Distance</label>
              <span className="text-xs text-pink-400 font-mono">{config.spawnDistance}px</span>
            </div>
            <input
              type="range"
              min="15"
              max="70"
              step="1"
              value={config.spawnDistance}
              onChange={(e) => update('spawnDistance', Number(e.target.value))}
              className="w-full accent-pink-500 bg-slate-800 rounded-lg cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 mt-0.5">
              Distance finger must move before spawning a new flower.
            </p>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="font-medium text-slate-300">Maximum Flowers</label>
              <span className="text-xs text-purple-400 font-mono">{config.maxFlowers}</span>
            </div>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={config.maxFlowers}
              onChange={(e) => update('maxFlowers', Number(e.target.value))}
              className="w-full accent-purple-500 bg-slate-800 rounded-lg cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 mt-0.5">
              Cap on active flowers before older flowers fade out.
            </p>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="font-medium text-slate-300">Flower Visibility Duration</label>
              <span className="text-xs text-rose-400 font-mono">{Math.round(config.flowerLifetime / 1000)}s</span>
            </div>
            <input
              type="range"
              min="15000"
              max="300000"
              step="15000"
              value={config.flowerLifetime}
              onChange={(e) => update('flowerLifetime', Number(e.target.value))}
              className="w-full accent-rose-500 bg-slate-800 rounded-lg cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 mt-0.5">
              How long flowers stay visible in your garden before fading.
            </p>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="font-medium text-slate-300">Finger Smoothing</label>
              <span className="text-xs text-amber-400 font-mono">{Math.round(config.smoothingFactor * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.05"
              value={config.smoothingFactor}
              onChange={(e) => update('smoothingFactor', Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 mt-0.5">
              Lower values make movement silky-smooth; higher values reduce lag.
            </p>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="font-medium text-slate-300">Camera Feed Opacity</label>
              <span className="text-xs text-blue-400 font-mono">{Math.round(config.webcamOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={config.webcamOpacity}
              onChange={(e) => update('webcamOpacity', Number(e.target.value))}
              className="w-full accent-blue-500 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="font-medium text-slate-300">Camera Feed Blur</label>
              <span className="text-xs text-indigo-400 font-mono">{config.webcamBlur}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="1"
              value={config.webcamBlur}
              onChange={(e) => update('webcamBlur', Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="pt-2 space-y-3 border-t border-slate-800">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="flex items-center gap-2 font-medium text-slate-300">
                <Bug className="w-4 h-4 text-emerald-400" />
                Enable Butterflies
              </span>
              <input
                type="checkbox"
                checked={config.enableButterflies}
                onChange={(e) => update('enableButterflies', e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-500 bg-slate-800"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="flex items-center gap-2 font-medium text-slate-300">
                <Eye className="w-4 h-4 text-cyan-400" />
                Show Hand Landmarks (Debug)
              </span>
              <input
                type="checkbox"
                checked={config.showLandmarks}
                onChange={(e) => update('showLandmarks', e.target.checked)}
                className="w-4 h-4 rounded accent-cyan-500 bg-slate-800"
              />
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between pt-5 mt-5 border-t border-slate-800">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs rounded-xl shadow-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
