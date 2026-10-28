import React from 'react';

/**
 * CinematicLensOverlay
 * High-end cinematic optical realism layer (Crystal Clear & Grain-Free):
 * - Anamorphic Horizontal Lens Flare Streaks
 * - CRT Radial Vignette & Lens Barrel Dispersion
 * - Sub-pixel Chromatic Aberration Twitch on Surges / DEFCON
 */
export default function CinematicLensOverlay({
  isDefcon,
  isSurging,
  theme,
}) {
  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden select-none">
      {/* 1. Anamorphic Horizontal Optical Flare Streaks */}
      <div
        className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 transition-opacity duration-700"
        style={{
          opacity: isSurging ? 0.85 : isDefcon ? 0.7 : 0.35,
          background: isDefcon
            ? 'linear-gradient(90deg, transparent 0%, rgba(239, 68, 68, 0.4) 30%, rgba(255, 255, 255, 0.8) 50%, rgba(239, 68, 68, 0.4) 70%, transparent 100%)'
            : `linear-gradient(90deg, transparent 0%, ${theme.primary}55 35%, rgba(255, 255, 255, 0.9) 50%, ${theme.secondary}55 65%, transparent 100%)`,
          filter: 'blur(1.5px) drop-shadow(0 0 12px currentColor)',
        }}
      />

      {/* Secondary Soft Ambient Anamorphic Glow Bar */}
      <div
        className="absolute top-1/2 left-1/4 right-1/4 h-[8px] -translate-y-1/2 rounded-full transition-opacity duration-700"
        style={{
          opacity: isSurging ? 0.6 : 0.2,
          background: isDefcon
            ? 'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.6) 0%, transparent 80%)'
            : `radial-gradient(ellipse at center, ${theme.primary}66 0%, transparent 80%)`,
          filter: 'blur(6px)',
        }}
      />

      {/* 2. Radial Vignette & Lens Optical Falloff */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, transparent 60%, rgba(2, 4, 10, 0.55) 88%, rgba(1, 2, 6, 0.85) 100%)',
        }}
      />

      {/* 3. Chromatic Aberration Twitch (Triggered on DEFCON or Surge) */}
      {(isDefcon || isSurging) && (
        <div
          className="absolute inset-0 animate-pulse pointer-events-none"
          style={{
            boxShadow: isDefcon
              ? 'inset 0 0 45px rgba(239, 68, 68, 0.28)'
              : 'inset 0 0 35px rgba(0, 245, 212, 0.22)',
          }}
        />
      )}
    </div>
  );
}
