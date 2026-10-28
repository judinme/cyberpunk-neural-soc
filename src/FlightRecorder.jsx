import React, { useState, useEffect } from 'react';
import { Play, Pause, FastForward, History, ShieldAlert } from 'lucide-react';
import { cyberAudio } from './audio';

export default function FlightRecorder({
  theme,
  historyBuffer,
  isPaused,
  playbackIndex,
  onSelectFrame,
  onTogglePause,
  onReturnToLive
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [frameTick, setFrameTick] = useState(9232); // Viral reference starting frame
  const [crossbarPorts, setCrossbarPorts] = useState(Array.from({ length: 48 }, (_, i) => i));

  const activeIndex = isPaused && playbackIndex !== null ? playbackIndex : historyBuffer.length - 1;

  // Frame tick counter matching Remotion deterministic viral spec
  useEffect(() => {
    const timer = setInterval(() => {
      setFrameTick((prev) => prev + 1);
      // Randomize a few active ports on crossbar switch
      if (Math.random() > 0.4) {
        setCrossbarPorts(Array.from({ length: 48 }, (_, i) => i));
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const handleBarClick = (idx) => {
    cyberAudio.playChirp();
    onSelectFrame(idx);
  };

  const offsetSeconds = historyBuffer.length > 0 && activeIndex !== null
    ? historyBuffer.length - 1 - activeIndex
    : 0;

  return (
    <div
      className="p-3 rounded-xl backdrop-blur-md border transition-all duration-300 flex flex-col gap-2.5 font-mono text-xs shadow-lg"
      style={{
        backgroundColor: theme.card,
        borderColor: isPaused ? '#f59e0b' : theme.cardBorder,
        boxShadow: isPaused ? '0 0 20px rgba(245,158,11,0.25)' : `0 0 15px ${theme.glow}`,
      }}
    >
      {/* Header with Controls & Time-Travel Status */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <History className={`w-4 h-4 ${isPaused ? 'text-amber-400 animate-spin' : 'text-cyan-400'}`} />
          <span className="text-[11px] font-bold font-orbitron tracking-wider text-slate-100 uppercase flex items-center gap-1.5">
            <span>60-STEP FLIGHT RECORDER &amp; 48-PORT CROSSBAR SWITCH</span>
          </span>
          {isPaused ? (
            <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/50 font-bold animate-pulse">
              TIME-TRAVEL: -{offsetSeconds}s REPLAY
            </span>
          ) : (
            <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold">
              LIVE 60FPS STREAM
            </span>
          )}
        </div>

        {/* Playback Controls & Human Approval Gate */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded bg-fuchsia-950/80 text-fuchsia-300 border border-fuchsia-500/40 font-bold">
            <ShieldAlert className="w-3 h-3 text-fuchsia-400" />
            HUMAN GATE: ASSERT READY
          </span>

          <button
            onClick={onTogglePause}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold border transition-all ${
              isPaused
                ? 'bg-amber-500/30 text-amber-300 border-amber-400/50'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/15'
            }`}
          >
            {isPaused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3 fill-current" />}
            {isPaused ? 'RESUME' : 'PAUSE'}
          </button>

          {isPaused && (
            <button
              onClick={onReturnToLive}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-500/30 text-cyan-300 border border-cyan-400/50 text-[10px] font-bold shadow-[0_0_8px_rgba(0,245,212,0.4)]"
            >
              <FastForward className="w-3 h-3 fill-current" />
              RETURN TO LIVE
            </button>
          )}
        </div>
      </div>

      {/* 48-Port Horizontal Crossbar Switch Indicator */}
      <div className="bg-black/70 p-2 rounded-lg border border-white/10 space-y-1">
        <div className="flex items-center justify-between text-[9px] text-slate-400">
          <span className="text-cyan-400 font-bold">48-PORT DMA CROSSBAR INTERRUPT BUS (00–47):</span>
          <span>p(close) = 0.876 • mem_pressure: 0.42 • gpu_eff: 94.2%</span>
        </div>
        <div className="grid grid-cols-24 sm:grid-cols-48 gap-0.5">
          {crossbarPorts.map((portIdx) => {
            const isActive = (portIdx + frameTick) % 7 === 0;
            const isHigh = (portIdx + frameTick) % 11 === 0;
            return (
              <div
                key={portIdx}
                className={`h-2.5 rounded-xs transition-colors duration-150 ${
                  isHigh
                    ? 'bg-amber-400 shadow-[0_0_4px_#f59e0b]'
                    : (isActive ? 'bg-cyan-400 shadow-[0_0_4px_#00f5d4]' : 'bg-slate-800')
                }`}
                title={`Port ${portIdx.toString().padStart(2, '0')}`}
              />
            );
          })}
        </div>
      </div>

      {/* 60-Bar Interactive Scrubber Timeline */}
      <div className="relative pt-1">
        {hoveredIndex !== null && historyBuffer[hoveredIndex] && (
          <div
            className="absolute -top-10 z-30 transform -translate-x-1/2 bg-black/90 px-2 py-1 rounded border border-cyan-400/50 text-[8px] text-slate-200 pointer-events-none shadow-lg whitespace-nowrap"
            style={{
              left: `${(hoveredIndex / Math.max(1, historyBuffer.length - 1)) * 100}%`,
            }}
          >
            <span>-{historyBuffer.length - 1 - hoveredIndex}s ago | </span>
            <span className="text-cyan-400">{(historyBuffer[hoveredIndex].cpuLoad || 40).toFixed(0)}% CPU | </span>
            <span className="text-fuchsia-400">{(historyBuffer[hoveredIndex].gpuWatts || 280).toFixed(0)}W TDP</span>
          </div>
        )}

        {/* The 60 Scrub Bars */}
        <div className="h-7 w-full flex items-end gap-[2px] bg-black/60 p-1 rounded border border-white/10 cursor-pointer overflow-hidden">
          {historyBuffer.map((frame, idx) => {
            const isSelected = activeIndex === idx;
            const cpuVal = frame.cpuLoad || 45;
            const barHeight = Math.max(15, Math.min(100, cpuVal));

            return (
              <div
                key={idx}
                onClick={() => handleBarClick(idx)}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`flex-1 rounded-t-xs transition-all relative group ${
                  isSelected
                    ? 'bg-amber-400 ring-2 ring-amber-300 shadow-[0_0_8px_#f59e0b]'
                    : (idx === historyBuffer.length - 1 && !isPaused
                      ? 'bg-cyan-400 shadow-[0_0_6px_rgba(0,245,212,0.8)]'
                      : 'bg-slate-700 hover:bg-slate-500')
                }`}
                style={{ height: `${barHeight}%` }}
              />
            );
          })}
        </div>

        {/* Timeline Axis & Viral FUI Runtime Counter */}
        <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono mt-1 px-0.5">
          <span>-60s BUFFER</span>
          <span>-30s</span>
          <span className="text-slate-500 hidden sm:inline">
            cloud runtime · <b className="text-cyan-300">{frameTick} frames</b>
          </span>
          <span className={!isPaused ? 'text-cyan-400 font-bold' : ''}>
            DAY 05 11:24 | <b className="text-white">{frameTick}</b>
          </span>
        </div>
      </div>
    </div>
  );
}
