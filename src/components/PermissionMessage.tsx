import React from 'react';
import { CameraOff, RefreshCw } from 'lucide-react';

interface PermissionMessageProps {
  message: string;
  onRetry: () => void;
}

export const PermissionMessage: React.FC<PermissionMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-5">
          <CameraOff className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-bold text-slate-100 mb-2">Camera Access Required</h2>

        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          {message}
        </p>

        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 text-xs text-slate-400 text-left mb-6 w-full space-y-2">
          <p className="font-semibold text-slate-200">How to allow camera access:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Click the camera or lock icon in your browser address bar.</li>
            <li>Select <strong>Allow</strong> for Camera permissions.</li>
            <li>Click the button below to retry.</li>
          </ol>
        </div>

        <button
          onClick={onRetry}
          className="flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-sm rounded-2xl shadow-lg transition-all active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  );
};
