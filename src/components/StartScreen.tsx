import React from 'react';
import { Sparkles, Hand, Camera } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
  isLoading: boolean;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, isLoading }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-slate-950 text-white overflow-y-auto">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl w-full bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col items-center text-center">

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold uppercase tracking-wider mb-6 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-spin" />
          Dual-Hand Air Garden
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-pink-300 via-purple-200 to-amber-200 bg-clip-text text-transparent drop-shadow-sm">
          FLOWER MOTION
        </h1>

        <p className="text-lg md:text-xl text-slate-300 max-w-lg font-light mb-10 leading-relaxed">
          Move your finger(s) in front of your camera and grow a living floral garden in real time.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-10 text-left">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 flex flex-col items-start gap-2 hover:border-pink-500/40 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center font-bold text-lg">
              👐
            </div>
            <h3 className="font-semibold text-sm text-slate-100">Draw With Both Hands</h3>
            <p className="text-xs text-slate-400 leading-normal">
              Point your index finger(s) to paint twin streams of flowers simultaneously.
            </p>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 flex flex-col items-start gap-2 hover:border-rose-500/40 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold text-lg">
              🖐️
            </div>
            <h3 className="font-semibold text-sm text-slate-100">Palm Boom Blast</h3>
            <p className="text-xs text-slate-400 leading-normal">
              Push your open palm forward to blast and scatter all flowers into floating petals!
            </p>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 flex flex-col items-start gap-2 hover:border-purple-500/40 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-lg">
              🤌 🗑️
            </div>
            <h3 className="font-semibold text-sm text-slate-100">Pinch & Clear</h3>
            <p className="text-xs text-slate-400 leading-normal">
              Pinch for flower bursts; tap the Clear Garden button whenever you want to reset.
            </p>
          </div>
        </div>

        <button
          onClick={onStart}
          disabled={isLoading}
          className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-300 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none w-full md:w-auto cursor-pointer"
        >
          {isLoading ? (
            <span className="flex items-center gap-3">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Preparing your garden...
            </span>
          ) : (
            <span className="flex items-center gap-3">
              <Camera className="w-5 h-5 text-pink-100 group-hover:rotate-12 transition-transform" />
              Start Creating
            </span>
          )}
        </button>

        <p className="text-xs text-slate-500 mt-6 flex items-center gap-1.5 justify-center">
          <Hand className="w-3.5 h-3.5 text-slate-400" />
          Camera stream is processed 100% locally on your device. Zero video data is saved or recorded.
        </p>

      </div>
    </div>
  );
};
