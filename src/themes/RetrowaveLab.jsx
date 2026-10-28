import React, { useState, useEffect, useRef } from 'react';
import { Disc, Music, Play, Pause, Rewind, FastForward } from 'lucide-react';
import { cyberAudio } from '../audio';

export default function RetrowaveLab() {
  const horizonCanvasRef = useRef(null);
  const scopeCanvasRef = useRef(null);

  // Cassette Tape Deck state
  const [tapeState, setTapeState] = useState('PLAYING'); // 'PLAYING' | 'PAUSED' | 'REWIND'
  const [tapeCounter, setTapeCounter] = useState(1984);

  // Vector Oscilloscope state
  const [waveFreqA, setWaveFreqA] = useState(3);
  const [waveFreqB, setWaveFreqB] = useState(4);
  const wavePhase = 1.57;

  // Playable Synth Keyboard Notes
  const SYNTH_KEYS = [
    { note: 'C4', freq: 261.63 },
    { note: 'D4', freq: 293.66 },
    { note: 'E4', freq: 329.63 },
    { note: 'F4', freq: 349.23 },
    { note: 'G4', freq: 392.00 },
    { note: 'A4', freq: 440.00 },
    { note: 'B4', freq: 493.88 },
    { note: 'C5', freq: 523.25 },
  ];

  // Tape Counter Incrementer
  useEffect(() => {
    let interval;
    if (tapeState === 'PLAYING') {
      interval = setInterval(() => {
        setTapeCounter((prev) => prev + 1);
      }, 500);
    } else if (tapeState === 'REWIND') {
      interval = setInterval(() => {
        setTapeCounter((prev) => Math.max(0, prev - 4));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [tapeState]);

  // Outrun 3D Perspective Road Canvas Render Loop
  useEffect(() => {
    const canvas = horizonCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let offset = 0;

    const render = () => {
      offset = (offset + 1.2) % 35;
      const w = canvas.width = canvas.offsetWidth;
      const h = canvas.height = canvas.offsetHeight;

      // Dark synth night sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.55);
      skyGrad.addColorStop(0, '#03045e');
      skyGrad.addColorStop(0.5, '#7209b7');
      skyGrad.addColorStop(1, '#ff0055');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h * 0.55);

      // Striped 80s Neon Sun on Horizon
      const sunX = w * 0.5;
      const sunY = h * 0.52;
      const sunRadius = Math.min(w * 0.16, 65);

      ctx.save();
      const sunGrad = ctx.createLinearGradient(0, sunY - sunRadius, 0, sunY);
      sunGrad.addColorStop(0, '#ffea00');
      sunGrad.addColorStop(1, '#ff0055');
      ctx.fillStyle = sunGrad;
      ctx.shadowColor = '#ff0055';
      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius, Math.PI, 0, false);
      ctx.fill();

      // Horizontal retro sun Venetian blind cuts
      ctx.fillStyle = '#03045e';
      for (let y = sunY - sunRadius * 0.6; y < sunY; y += 6) {
        ctx.fillRect(sunX - sunRadius, y, sunRadius * 2, 2.5);
      }
      ctx.restore();

      // Perspective Grid Floor (Outrun road)
      const floorY = h * 0.55;
      ctx.fillStyle = '#010206';
      ctx.fillRect(0, floorY, w, h - floorY);

      // Perspective radial lines
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 1.2;
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 4;

      const vpX = w * 0.5;
      for (let x = -w * 0.6; x <= w * 1.6; x += 40) {
        ctx.beginPath();
        ctx.moveTo(vpX, floorY);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Moving horizontal grid lines
      ctx.strokeStyle = '#ff0055';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#ff0055';

      for (let i = 1; i <= 10; i++) {
        const stepProg = ((i * 10 + offset) % 100) / 100;
        const lineY = floorY + Math.pow(stepProg, 2.4) * (h - floorY);
        ctx.beginPath();
        ctx.moveTo(0, lineY);
        ctx.lineTo(w, lineY);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  // Lissajous Scope Render Loop
  useEffect(() => {
    const canvas = scopeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let t = 0;

    const render = () => {
      t += 0.03;
      const w = canvas.width = canvas.offsetWidth;
      const h = canvas.height = canvas.offsetHeight;

      ctx.fillStyle = 'rgba(2, 4, 15, 0.25)';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = '#00ffff';
      ctx.shadowColor = '#ff0055';
      ctx.shadowBlur = 10;
      ctx.lineWidth = 2;

      const cx = w * 0.5;
      const cy = h * 0.5;
      const ampX = w * 0.38;
      const ampY = h * 0.38;

      ctx.beginPath();
      for (let i = 0; i <= 400; i++) {
        const theta = (i / 400) * Math.PI * 2;
        const x = cx + ampX * Math.sin(waveFreqA * theta + t);
        const y = cy + ampY * Math.sin(waveFreqB * theta + wavePhase);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [waveFreqA, waveFreqB, wavePhase]);

  const handlePlayKey = (freq) => {
    cyberAudio.playSynthNote(freq);
  };

  return (
    <div className="grid grid-cols-12 gap-3 w-full font-mono text-slate-100">
      {/* =========================================================================
          LEFT WIDGET: OUTRUN WIREFRAME HORIZON & CASSETTE DECK
          ========================================================================= */}
      <div className="col-span-12 lg:col-span-6 flex flex-col gap-3">
        {/* Outrun Canvas */}
        <div
          className="h-64 rounded-xl border border-[#ff0055]/50 relative overflow-hidden flex flex-col shadow-2xl"
          style={{
            backgroundColor: '#010206',
            boxShadow: '0 0 25px rgba(255, 0, 85, 0.35)',
          }}
        >
          <canvas ref={horizonCanvasRef} className="w-full h-full block" />
          <div className="absolute top-2 left-3 text-[10px] font-black uppercase tracking-widest text-[#00ffff] bg-black/60 px-2 py-0.5 rounded border border-[#00ffff]/40">
            OUTRUN VECTOR HORIZON // 1984.LOG
          </div>
        </div>

        {/* Dual-Spool Cassette Tape Cyber-Deck */}
        <div
          className="p-4 rounded-xl border border-[#00ffff]/50 relative overflow-hidden flex flex-col gap-3"
          style={{
            backgroundColor: 'rgba(8, 15, 35, 0.88)',
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.25)',
          }}
        >
          <div className="flex items-center justify-between border-b border-[#00ffff]/30 pb-2">
            <div className="flex items-center gap-2">
              <Disc className="w-4 h-4 text-[#ff0055] animate-spin" />
              <span className="font-bold text-xs font-orbitron tracking-widest text-[#00ffff]">
                MAGNETIC TAPE FLIGHT LOGGER // C-90 CHROME
              </span>
            </div>
            <span className="text-sm font-black font-mono text-[#ff0055] bg-black/70 px-2.5 py-0.5 rounded border border-[#ff0055]/40">
              COUNTER: {tapeCounter.toString().padStart(4, '0')}
            </span>
          </div>

          {/* Cassette Tape Realistic Graphic Body */}
          <div className="bg-slate-950 p-3 rounded-lg border border-white/15 flex flex-col items-center gap-2 relative overflow-hidden">
            <div className="text-[9px] font-bold tracking-widest text-[#00ffff] uppercase bg-black/60 px-3 py-0.5 rounded border border-white/10">
              AUDIO CASSETTE // AETHER HIGH-BIAS TAPE
            </div>

            {/* Twin Spools Window */}
            <div className="w-56 h-14 bg-black/80 rounded-md border border-white/20 p-2 flex items-center justify-around relative">
              {/* Left Spool */}
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div
                  className={`w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center transition-all ${
                    tapeState === 'PLAYING' ? 'animate-spin-tape-3' : (tapeState === 'REWIND' ? 'animate-spin-ccw-7' : '')
                  }`}
                >
                  <div className="w-8 h-8 rounded-full border border-dashed border-[#ff0055] flex items-center justify-center">
                    <div className="w-3 h-3 bg-white/20 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Tape Center Window */}
              <div className="w-16 h-5 bg-amber-950/40 rounded border border-white/10 flex items-center justify-center">
                <div className="w-12 h-1 bg-[#ff0055]/80 rounded-full" />
              </div>

              {/* Right Spool */}
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div
                  className={`w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center transition-all ${
                    tapeState === 'PLAYING' ? 'animate-spin-tape-3' : (tapeState === 'REWIND' ? 'animate-spin-ccw-7' : '')
                  }`}
                >
                  <div className="w-8 h-8 rounded-full border border-dashed border-[#00ffff] flex items-center justify-center">
                    <div className="w-3 h-3 bg-white/20 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tape Controls */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              onClick={() => {
                cyberAudio.playChirp('click');
                setTapeState('REWIND');
              }}
              className={`p-2 rounded border transition-all ${
                tapeState === 'REWIND'
                  ? 'bg-[#00ffff] text-black shadow-[0_0_10px_#00ffff]'
                  : 'bg-black/60 text-[#00ffff] border-[#00ffff]/40 hover:bg-[#00ffff]/20'
              }`}
              title="Rewind"
            >
              <Rewind className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                cyberAudio.playChirp('click');
                setTapeState(tapeState === 'PLAYING' ? 'PAUSED' : 'PLAYING');
              }}
              className={`p-2.5 rounded-full border transition-all ${
                tapeState === 'PLAYING'
                  ? 'bg-[#ff0055] text-white shadow-[0_0_15px_#ff0055]'
                  : 'bg-black/60 text-[#ff0055] border-[#ff0055]/40 hover:bg-[#ff0055]/20'
              }`}
              title="Play / Pause"
            >
              {tapeState === 'PLAYING' ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            <button
              onClick={() => {
                cyberAudio.playChirp('click');
                setTapeState('PLAYING');
              }}
              className="p-2 rounded bg-black/60 text-[#00ffff] border border-[#00ffff]/40 hover:bg-[#00ffff]/20 transition-all"
              title="Fast Forward"
            >
              <FastForward className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          RIGHT WIDGET: LISSAJOUS VECTOR OSCILLOSCOPE & PLAYABLE SYNTH KEYBOARD
          ========================================================================= */}
      <div className="col-span-12 lg:col-span-6 flex flex-col gap-3">
        <div
          className="p-4 rounded-xl border border-[#ff0055]/50 relative overflow-hidden flex flex-col gap-3 h-full"
          style={{
            backgroundColor: 'rgba(8, 15, 35, 0.88)',
            boxShadow: '0 0 25px rgba(255, 0, 85, 0.25)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#ff0055]/30 pb-2">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-[#00ffff]" />
              <span className="font-bold text-xs font-orbitron tracking-widest text-[#ff0055]">
                LISSAJOUS OSCILLOSCOPE &amp; 8-KEY RETRO SYNTH
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-pink-950 text-[#ff0055] border border-[#ff0055]/40 font-bold">
              FM SYNTHESIS
            </span>
          </div>

          {/* Lissajous Vector Scope Screen */}
          <div className="h-44 w-full rounded-lg overflow-hidden border border-white/10 relative bg-black/80">
            <canvas ref={scopeCanvasRef} className="w-full h-full block" />
            <div className="absolute bottom-2 left-2 text-[9px] text-slate-400 font-mono bg-black/60 px-2 py-0.5 rounded border border-white/10">
              HARMONIC RATIO: {waveFreqA}:{waveFreqB}
            </div>
          </div>

          {/* Oscilloscope Frequency Sliders */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-black/50 p-2.5 rounded border border-white/10">
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>FREQUENCY A:</span>
                <span className="text-[#00ffff] font-bold">{waveFreqA}x</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={waveFreqA}
                onChange={(e) => setWaveFreqA(parseInt(e.target.value, 10))}
                className="w-full accent-[#00ffff]"
              />
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>FREQUENCY B:</span>
                <span className="text-[#ff0055] font-bold">{waveFreqB}x</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={waveFreqB}
                onChange={(e) => setWaveFreqB(parseInt(e.target.value, 10))}
                className="w-full accent-[#ff0055]"
              />
            </div>
          </div>

          {/* Playable 8-Key Neon Synth Keyboard */}
          <div className="mt-auto space-y-1.5 pt-2 border-t border-white/10">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>PLAYABLE SYNTHESIZER PADS (WEB AUDIO)</span>
              <span className="text-[#00ffff]">CLICK KEYS TO PLAY</span>
            </div>

            <div className="grid grid-cols-8 gap-1.5 h-16">
              {SYNTH_KEYS.map((k) => (
                <button
                  key={k.note}
                  onClick={() => handlePlayKey(k.freq)}
                  className="rounded bg-gradient-to-t from-[#ff0055]/30 to-[#00ffff]/30 hover:from-[#ff0055] hover:to-[#00ffff] border border-white/20 hover:border-white text-white font-black text-xs flex flex-col items-center justify-end pb-1.5 shadow-[0_0_8px_rgba(255,0,85,0.3)] active:scale-95 transition-all"
                >
                  <span className="text-[11px]">{k.note}</span>
                  <span className="text-[7px] text-slate-300">{Math.round(k.freq)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
