import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  X,
  Copy,
  Check,
  Video,
  Terminal,
  ShieldAlert,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';
import { cyberAudio } from './audio';

// Deterministic Pseudo-Random Number Generator based on Seed String
function pseudoRandom(seed) {
  let h = 0xdeadbeef;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 2654435761);
  }
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

// Deterministic Linear Interpolation
function lerp(start, end, t) {
  return start + (end - start) * Math.max(0, Math.min(1, t));
}

// 4-Act Palette Definitions matching Prompt 0A
const ACT_PALETTES = {
  1: { primary: '#f59e0b', secondary: '#ec4899', accent: '#3b82f6', label: 'ACT I: KNOWLEDGE INGESTION' },
  2: { primary: '#00f5d4', secondary: '#10b981', accent: '#00bbf9', label: 'ACT II: NEURAL QUALIFICATION' },
  3: { primary: '#fcee0a', secondary: '#ff0055', accent: '#7b2cbf', label: 'ACT III: 8-THEME OVERDRIVE' },
  4: { primary: '#ff2a6d', secondary: '#05d9e8', accent: '#d90429', label: 'ACT IV: DEFCON 1 HUMAN GATE' },
};

export default function RemotionReelModal({ isOpen, onClose }) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [copiedCli, setCopiedCli] = useState(false);
  const [showCliSnippet, setShowCliSnippet] = useState(false);

  const canvasRef = useRef(null);
  const totalFrames = 900; // 15.0s @ 60fps
  const baseOffset = 9000;
  const displayFrame = baseOffset + currentFrame;

  // Current Act computation
  const currentAct =
    currentFrame < 181
      ? 1
      : currentFrame < 451
      ? 2
      : currentFrame < 721
      ? 3
      : 4;

  const activePalette = ACT_PALETTES[currentAct];

  // Deterministic 60fps playback loop
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const intervalMs = Math.round(1000 / (60 * playbackSpeed));
    const timer = setInterval(() => {
      setCurrentFrame((prev) => (prev >= totalFrames - 1 ? 0 : prev + 1));
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, playbackSpeed, totalFrames]);

  // Deterministic Typewriter CLI matching Section 0A
  const getCliCommand = (frame) => {
    if (frame < 181) {
      const full = '~/aether $ kb.load prices.md policies.md --rapl-monitor --ebpf-xdp';
      const typed = Math.floor(lerp(0, full.length, frame / 140));
      return full.slice(0, typed);
    } else if (frame < 451) {
      const full = '~/aether $ qualify --window 24h --out lead.json --model llama-3.1-8b';
      const typed = Math.floor(lerp(0, full.length, (frame - 180) / 180));
      return full.slice(0, typed);
    } else if (frame < 721) {
      const full = '~/aether $ overdrive --profile edgerunner --voltage 1.38V --clock 6.8GHz';
      const typed = Math.floor(lerp(0, full.length, (frame - 450) / 180));
      return full.slice(0, typed);
    } else {
      const full = '~/aether $ defcon --lockdown --xdp-drop 185.220.101.7 --gate human_approval';
      const typed = Math.floor(lerp(0, full.length, (frame - 720) / 120));
      return full.slice(0, typed);
    }
  };

  // Deterministic metrics purely calculated as a function of frame
  const raplWatts = Math.round(
    currentFrame < 181
      ? lerp(124, 182, currentFrame / 180)
      : currentFrame < 451
      ? 182 + Math.sin(currentFrame * 0.05) * 24
      : currentFrame < 721
      ? lerp(240, 642, (currentFrame - 450) / 270)
      : 310 + Math.sin(currentFrame * 0.08) * 45
  );

  const tokPerSec = Math.round(
    currentFrame < 181
      ? lerp(0, 48, currentFrame / 180)
      : currentFrame < 451
      ? 84 + Math.sin(currentFrame * 0.08) * 12
      : currentFrame < 721
      ? lerp(84, 128.4, (currentFrame - 450) / 270)
      : 96
  );

  const chunksIndexed = Math.min(232, Math.floor((currentFrame / 180) * 232));
  const qualifiedLeads = Math.min(240, Math.floor(((currentFrame - 180) / 270) * 240));
  const pClose = (0.712 + (currentFrame / totalFrames) * 0.164).toFixed(3);

  // Deterministic HTML5 Canvas Rendering (180 Additive-blended Bezier Splines & Particles)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Abyssal void background
    ctx.fillStyle = '#040406';
    ctx.fillRect(0, 0, width, height);

    // Subtle CRT Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const busY = height * 0.32;
    ctx.globalCompositeOperation = 'lighter';

    // Draw 180 deterministic Bezier Splines
    for (let i = 0; i < 180; i++) {
      const seed = `spline-${i}`;
      const startX = width * (0.05 + pseudoRandom(seed + '-sx') * 0.9);
      const startY = height * 0.12;
      const busX = width * (0.04 + ((i % 48) / 48) * 0.92);
      const endX = width * (0.08 + pseudoRandom(seed + '-ex') * 0.84);
      const endY = height * 0.72;

      const isActive = i % 3 === 0;
      ctx.strokeStyle = isActive
        ? activePalette.primary
        : 'rgba(140, 150, 175, 0.08)';
      ctx.globalAlpha = isActive ? 0.35 : 0.1;
      ctx.lineWidth = isActive ? 1.4 : 0.6;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.bezierCurveTo(startX, (startY + busY) * 0.5, busX, (startY + busY) * 0.5, busX, busY);
      ctx.bezierCurveTo(busX, (busY + endY) * 0.5, endX, (busY + endY) * 0.5, endX, endY);
      ctx.stroke();

      // Deterministic Particle Flow driven strictly by currentFrame
      if (isActive) {
        const speed = 0.007 + pseudoRandom(seed + '-spd') * 0.006;
        const t = (currentFrame * speed + pseudoRandom(seed + '-off')) % 1;

        const px =
          t < 0.5
            ? lerp(startX, busX, t * 2)
            : lerp(busX, endX, (t - 0.5) * 2);

        const py =
          t < 0.5
            ? lerp(startY, busY, t * 2)
            : lerp(busY, endY, (t - 0.5) * 2);

        ctx.globalAlpha = 0.9;
        ctx.fillStyle = i % 2 === 0 ? activePalette.primary : activePalette.secondary;
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Crossbar bus glow hit at t ≈ 0.5
        if (Math.abs(t - 0.5) < 0.03) {
          ctx.beginPath();
          ctx.arc(busX, busY, 4, 0, Math.PI * 2);
          ctx.fillStyle = activePalette.primary;
          ctx.fill();
        }
      }
    }

    ctx.globalCompositeOperation = 'source-over';
  }, [currentFrame, activePalette]);

  if (!isOpen) return null;

  const remotionCommand =
    'npx remotion render src/remotion/Root.jsx AetherReel out/aether-soc-reel.mp4 --codec=h264 --crf=18';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-3 sm:p-6 animate-workstation-enter">
      <div
        className="relative w-full max-w-6xl max-h-[96vh] rounded-2xl border flex flex-col overflow-hidden shadow-2xl bg-[#040406] text-slate-100 font-mono"
        style={{
          borderColor: activePalette.primary,
          boxShadow: `0 0 35px ${activePalette.primary}33`,
        }}
      >
        {/* =========================================================================
            HEADER BAR
            ========================================================================= */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-black/60">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
              <Video className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black tracking-wider text-white">
                  AETHER // PROGRAMMATIC 60FPS MOTION ENGINE
                </span>
                <span
                  className="text-[9px] px-2 py-0.5 rounded font-black tracking-widest uppercase border"
                  style={{
                    borderColor: activePalette.primary,
                    color: activePalette.primary,
                    backgroundColor: `${activePalette.primary}15`,
                  }}
                >
                  REMOTION COMPOSITION
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                100% Deterministic 60fps Execution · Zero Dropped Frames · Pure Math Function of <code className="text-cyan-400">useCurrentFrame()</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCliSnippet((prev) => !prev)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white transition-colors"
            >
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">RENDER CLI</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Remotion CLI Export Drawer */}
        {showCliSnippet && (
          <div className="bg-black/90 border-b border-white/10 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                HEADLESS LOSSLESS 60FPS MP4 RENDER COMMAND:
              </div>
              <code className="text-[11px] text-slate-300 bg-white/5 px-2 py-1 rounded border border-white/10 block font-mono">
                {remotionCommand}
              </code>
            </div>
            <button
              onClick={() => {
                cyberAudio.playChirp();
                navigator.clipboard.writeText(remotionCommand);
                setCopiedCli(true);
                setTimeout(() => setCopiedCli(false), 2000);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 text-[10px] font-bold transition-all shrink-0"
            >
              {copiedCli ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedCli ? 'COPIED TO CLIPBOARD' : 'COPY RENDER COMMAND'}
            </button>
          </div>
        )}

        {/* =========================================================================
            CINEMATIC 16:9 VIEWPORT (DETERMINISTIC MOTION ENGINE CANVAS & HUD)
            ========================================================================= */}
        <div className="relative flex-1 min-h-[460px] bg-black overflow-hidden flex flex-col justify-between p-4">
          {/* HTML5 Canvas with 180 Additive Bezier Splines */}
          <canvas
            ref={canvasRef}
            width={1120}
            height={500}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* Top HUD: Act Title & Day/Clock */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2 bg-black/40 backdrop-blur-sm px-2 rounded">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full animate-ping"
                style={{ backgroundColor: activePalette.primary }}
              />
              <span className="text-xs font-black tracking-widest text-white">
                {activePalette.label}
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">
                // 4-ACT CHOREOGRAPHY
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-400 font-mono">
                DAY 0{currentAct} &nbsp; 10:{String(Math.floor(currentFrame / 60)).padStart(2, '0')}:
                {String((currentFrame % 60) * 1.6 | 0).padStart(2, '0')}
              </span>
              <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded border border-white/10">
                FRAME {String(currentFrame).padStart(4, '0')} / {totalFrames}
              </span>
            </div>
          </div>

          {/* Center Stage: Layer 1 Ingestion Cards & 48-Port DMA Switch */}
          <div className="relative z-10 grid grid-cols-12 gap-3 my-auto py-2">
            {/* Top 5 Monospace Cards (Act I) */}
            <div className="col-span-12 grid grid-cols-2 sm:grid-cols-5 gap-2">
              {['brief', 'whatsapp.inbox', 'knowledge.index', 'sources', 'guardrails'].map((card, idx) => {
                const isActiveCard = currentFrame > idx * 25;
                return (
                  <div
                    key={card}
                    className={`p-2 rounded-lg border text-[10px] transition-all duration-300 ${
                      isActiveCard
                        ? 'bg-black/70 border-white/20 shadow-md'
                        : 'bg-black/40 border-white/5 opacity-40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-white/5">
                      <span className="font-bold">{card}</span>
                      <span className="text-[8px] text-emerald-400">● LIVE</span>
                    </div>
                    {/* Equalizer Bars */}
                    <div className="flex items-end gap-0.5 h-6 mt-1.5">
                      {Array.from({ length: 8 }).map((_, bIdx) => {
                        const barHeight = isActiveCard
                          ? Math.round(
                              20 +
                                pseudoRandom(`bar-${idx}-${bIdx}-${Math.floor(currentFrame / 5)}`) * 80
                            )
                          : 10;
                        return (
                          <div
                            key={bIdx}
                            className="flex-1 rounded-t transition-all duration-100"
                            style={{
                              height: `${barHeight}%`,
                              backgroundColor:
                                bIdx % 2 === 0
                                  ? activePalette.primary
                                  : activePalette.secondary,
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 48-Port Crossbar Switch Matrix (DMA Bus) */}
            <div className="col-span-12 bg-black/80 p-2.5 rounded-lg border border-white/10">
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                <span className="font-bold flex items-center gap-1.5">
                  <Layers className="w-3 h-3 text-cyan-400" />
                  48-PORT DMA CROSSBAR SWITCH MATRIX [00–47]
                </span>
                <span className="text-[9px] text-slate-500">
                  {currentFrame < 181
                    ? 'INGESTION BUS ACTIVE'
                    : currentFrame < 451
                    ? 'NEURAL QUALIFICATION STREAM'
                    : currentFrame < 721
                    ? 'GPU VRAM / OVERDRIVE SATURATED'
                    : 'DEFCON 1 FILTER ENGAGED'}
                </span>
              </div>
              <div className="grid grid-cols-12 sm:grid-cols-24 gap-1">
                {Array.from({ length: 48 }).map((_, portIdx) => {
                  const isFired =
                    (portIdx * 7 + currentFrame) % 18 === 0 ||
                    (currentAct === 4 && portIdx === 22);
                  return (
                    <div
                      key={portIdx}
                      className={`h-4 rounded-[2px] flex items-center justify-center text-[7px] font-mono transition-all duration-150 ${
                        isFired
                          ? currentAct === 4
                            ? 'bg-rose-500 text-black font-black shadow-[0_0_8px_#ff2a6d]'
                            : 'bg-emerald-400 text-black font-black shadow-[0_0_8px_#00f5d4]'
                          : 'bg-white/5 text-slate-500 border border-white/5'
                      }`}
                    >
                      {String(portIdx).padStart(2, '0')}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Middle Real-time Metrics Dashboard */}
            <div className="col-span-12 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-black/70 p-2.5 rounded-lg border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-400 block font-bold">RAPL SILICON</span>
                  <span className="text-base font-black text-white">{raplWatts} <span className="text-[10px]">W</span></span>
                </div>
                <Cpu className="w-5 h-5 text-amber-400 opacity-80" />
              </div>

              <div className="bg-black/70 p-2.5 rounded-lg border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-400 block font-bold">THROUGHPUT</span>
                  <span className="text-base font-black text-white">{tokPerSec} <span className="text-[10px]">tok/s</span></span>
                </div>
                <Sparkles className="w-5 h-5 text-cyan-400 opacity-80" />
              </div>

              <div className="bg-black/70 p-2.5 rounded-lg border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-400 block font-bold">CHUNKS / LEADS</span>
                  <span className="text-base font-black text-white">
                    {currentFrame < 181 ? `${chunksIndexed} / 232` : `${qualifiedLeads} / 240`}
                  </span>
                </div>
                <Terminal className="w-5 h-5 text-emerald-400 opacity-80" />
              </div>

              <div
                className={`p-2.5 rounded-lg border flex items-center justify-between transition-colors ${
                  currentAct === 4
                    ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse'
                    : 'bg-black/70 border-white/10'
                }`}
              >
                <div>
                  <span className="text-[9px] block font-bold">
                    {currentAct === 4 ? 'HUMAN GATE ASSERTION' : 'PROBABILITY CLOSE'}
                  </span>
                  <span className="text-base font-black">
                    {currentAct === 4 ? '[ PENDING REVIEW ]' : `p = ${pClose}`}
                  </span>
                </div>
                <ShieldAlert className="w-5 h-5 opacity-80" />
              </div>
            </div>
          </div>

          {/* Bottom HUD: Live Typewriter CLI & Viral Frame Counter */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-2 bg-black/60 px-2 rounded">
            <div className="flex items-center gap-1.5 text-xs">
              <span style={{ color: activePalette.secondary }} className="font-bold">
                ~/aether $
              </span>
              <span className="text-white font-mono">{getCliCommand(currentFrame)}</span>
              <span
                className="inline-block w-2 h-3.5 bg-white align-middle"
                style={{ opacity: currentFrame % 30 < 15 ? 1 : 0 }}
              />
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-3">
              <span>
                tok/s <b className="text-white">{tokPerSec}</b> · rapl <b style={{ color: activePalette.primary }}>{raplWatts}W</b>
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">
                cloud runtime · <b className="text-amber-300 font-bold">{displayFrame} frames</b>
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            BOTTOM TIMELINE & PLAYBACK CONTROLLER
            ========================================================================= */}
        <div className="p-4 bg-black/80 border-t border-white/10 flex flex-col gap-3">
          {/* 900-Frame Scrubber Slider */}
          <div className="relative w-full">
            <input
              type="range"
              min={0}
              max={totalFrames - 1}
              value={currentFrame}
              onChange={(e) => {
                cyberAudio.playChirp();
                setCurrentFrame(Number(e.target.value));
              }}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-pink-500 transition-all"
            />
            {/* Act Markers */}
            <div className="flex justify-between text-[9px] text-slate-500 mt-1 font-mono">
              <button
                onClick={() => setCurrentFrame(0)}
                className="hover:text-amber-400 transition-colors"
              >
                ACT I (0)
              </button>
              <button
                onClick={() => setCurrentFrame(181)}
                className="hover:text-cyan-400 transition-colors"
              >
                ACT II (181)
              </button>
              <button
                onClick={() => setCurrentFrame(451)}
                className="hover:text-yellow-400 transition-colors"
              >
                ACT III (451)
              </button>
              <button
                onClick={() => setCurrentFrame(721)}
                className="hover:text-rose-400 transition-colors"
              >
                ACT IV (721)
              </button>
              <span>END (900)</span>
            </div>
          </div>

          {/* Controls Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Play/Pause & Step Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  cyberAudio.playChirp();
                  setIsPlaying((prev) => !prev);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/50 font-bold transition-all shadow-md"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'PAUSE' : 'PLAY 60FPS'}</span>
              </button>

              <button
                onClick={() => {
                  cyberAudio.playChirp();
                  setCurrentFrame((prev) => Math.max(0, prev - 1));
                }}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                title="Step -1 frame"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  cyberAudio.playChirp();
                  setCurrentFrame((prev) => Math.min(totalFrames - 1, prev + 1));
                }}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                title="Step +1 frame"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Act Jump Pills */}
            <div className="hidden md:flex items-center gap-1.5 bg-white/5 p-1 rounded-lg border border-white/10 text-[10px]">
              {[
                { act: 1, start: 0, label: 'ACT I' },
                { act: 2, start: 181, label: 'ACT II' },
                { act: 3, start: 451, label: 'ACT III' },
                { act: 4, start: 721, label: 'ACT IV' },
              ].map((item) => (
                <button
                  key={item.act}
                  onClick={() => {
                    cyberAudio.playChirp();
                    setCurrentFrame(item.start);
                  }}
                  className={`px-2 py-0.5 rounded font-bold transition-all ${
                    currentAct === item.act
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Playback Speed */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10 text-[10px]">
              {[0.5, 1, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => {
                    cyberAudio.playChirp();
                    setPlaybackSpeed(spd);
                  }}
                  className={`px-2 py-0.5 rounded font-bold transition-all ${
                    playbackSpeed === spd
                      ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
