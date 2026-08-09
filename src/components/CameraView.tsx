import React from 'react';
import type { GardenConfig } from '../types/flower';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  config: GardenConfig;
}

export const CameraView: React.FC<CameraViewProps> = ({ videoRef, config }) => {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-500"
      style={{
        opacity: config.showWebcamBg ? config.webcamOpacity : 0,
        filter: config.webcamBlur > 0 ? `blur(${config.webcamBlur}px)` : 'none',
      }}
    >
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className="w-full h-full object-cover transform scale-x-[-1]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />
    </div>
  );
};
