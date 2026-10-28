import React, { useRef, useEffect } from 'react';

// Pseudo-Random and Interpolation Helpers for Standalone or Remotion Execution
function pseudoRandom(seed) {
  let h = 0xdeadbeef;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 2654435761);
  }
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function lerp(start, end, t) {
  return start + (end - start) * Math.max(0, Math.min(1, t));
}

function interpolateColors(val, inputArr, colorArr) {
  if (val <= inputArr[0]) return colorArr[0];
  if (val >= inputArr[inputArr.length - 1]) return colorArr[colorArr.length - 1];
  for (let i = 0; i < inputArr.length - 1; i++) {
    if (val >= inputArr[i] && val <= inputArr[i + 1]) {
      const t = (val - inputArr[i]) / (inputArr[i + 1] - inputArr[i]);
      // Return simple stepped or hex color
      return t < 0.5 ? colorArr[i] : colorArr[i + 1];
    }
  }
  return colorArr[0];
}

export const AetherReelComposition = ({ frame = 0, width = 1920, height = 1080 }) => {
  const canvasRef = useRef(null);

  // 1. Exact Frame Counter matching viral reference ("cloud runtime · 9232 frames")
  const displayFrameCount = 9000 + frame;
  const simDay = Math.min(7, Math.floor(lerp(1, 7.99, frame / 900)));

  // 2. Deterministic Palette Morphing across frames (Acts I -> IV)
  const primaryColor = interpolateColors(
    frame,
    [0, 220, 450, 680, 900],
    ['#f59e0b', '#00f5d4', '#fcee0a', '#ccff00', '#ff0055']
  );
  const secondaryColor = interpolateColors(
    frame,
    [0, 220, 450, 680, 900],
    ['#ec4899', '#f72585', '#00ff66', '#7b2cbf', '#00ffff']
  );

  // 3. Deterministic CLI Typewriter Effect
  const cliCommand =
    frame < 300
      ? 'kb.load prices.md policies.md --rapl-hw --ebpf'
      : frame < 600
      ? 'qualify --window 24h --out lead.json --cuda 0'
      : 'deploy.live --gate human_approval --defcon 1';

  const localFrame = frame % 300;
  const typedChars = Math.floor(lerp(0, cliCommand.length, localFrame / 90));
  const visibleCli = cliCommand.slice(0, typedChars);

  // 4. Deterministic Telemetry Metrics driven purely by frame
  const chunksLoaded = Math.floor(lerp(0, 232, Math.max(0, Math.min(1, (frame - 20) / 240))));
  const tokPerSec = Math.floor(2100 + Math.sin(frame * 0.08) * 480 + (frame > 300 ? 620 : 0));
  const raplWatts = (142 + Math.sin(frame * 0.05) * 38 + (frame > 450 ? 190 : 0)).toFixed(0);
  const pClose = lerp(0.712, 0.876, frame / 900).toFixed(3);

  // 5. Deterministic 60fps Bipartite Neural Spline Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    const busY = height * 0.27;

    // Draw 180 background & active Bezier splines deterministically
    for (let i = 0; i < 180; i++) {
      const seed = `spline-${i}`;
      const startX = width * (0.06 + pseudoRandom(seed + '-sx') * 0.88);
      const startY = height * 0.16;
      const busX = width * (0.04 + ((i % 48) / 48) * 0.92);
      const endX = width * (0.08 + pseudoRandom(seed + '-ex') * 0.84);
      const endY = height * 0.42;

      const isActive = i % 3 === 0;
      ctx.strokeStyle = isActive ? primaryColor : 'rgba(140, 150, 175, 0.12)';
      ctx.globalAlpha = isActive ? 0.35 : 0.12;
      ctx.lineWidth = isActive ? 1.4 : 0.7;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.bezierCurveTo(startX, (startY + busY) * 0.5, busX, (startY + busY) * 0.5, busX, busY);
      ctx.bezierCurveTo(busX, (busY + endY) * 0.5, endX, (busY + endY) * 0.5, endX, endY);
      ctx.stroke();

      // Deterministic particle progress t in [0, 1) as a pure function of frame
      if (isActive) {
        const speed = 0.006 + pseudoRandom(seed + '-spd') * 0.008;
        const t = (frame * speed + pseudoRandom(seed + '-offset')) % 1;
        const px =
          t < 0.5
            ? lerp(startX, busX, t * 2)
            : lerp(busX, endX, (t - 0.5) * 2);
        const py =
          t < 0.5
            ? lerp(startY, busY, t * 2)
            : lerp(busY, endY, (t - 0.5) * 2);

        ctx.globalAlpha = 0.95;
        ctx.fillStyle = i % 2 === 0 ? primaryColor : secondaryColor;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [frame, width, height, primaryColor, secondaryColor]);

  return (
    <div
      style={{ width: `${width}px`, height: `${height}px` }}
      className="relative bg-[#040406] text-gray-200 font-mono p-6 flex flex-col justify-between overflow-hidden select-none"
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Top Bar */}
      <div className="relative z-10 flex justify-between items-center text-sm border-b border-white/10 pb-3">
        <span className="font-bold text-white tracking-widest uppercase">
          AETHER · DECISION &amp; TELEMETRY MODULE
        </span>
        <span style={{ color: primaryColor }} className="font-bold">
          ● kiosa · @aether_soc
        </span>
        <span className="text-gray-400">
          DAY 0{simDay} &nbsp; 10:{String(Math.floor(frame / 60)).padStart(2, '0')} &nbsp;|&nbsp;{' '}
          <b className="text-white">{String(displayFrameCount).padStart(4, '0')}</b>
        </span>
      </div>

      {/* Center 4-Column Stage */}
      <div className="relative z-10 grid grid-cols-4 gap-4 my-auto">
        <div className="p-4 rounded-xl border border-white/10 bg-black/60">
          <div className="text-xs text-slate-400 uppercase font-bold">KNOWLEDGE BASE INDEX</div>
          <div className="text-2xl font-black text-white mt-2">{chunksLoaded} / 232 Chunks</div>
          <div className="text-xs text-emerald-400 mt-1">● 0.94 Recall @ k=5</div>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-black/60">
          <div className="text-xs text-slate-400 uppercase font-bold">INFERENCE ENGINE</div>
          <div className="text-2xl font-black text-white mt-2">{tokPerSec.toLocaleString()} tok/s</div>
          <div className="text-xs text-cyan-400 mt-1">● Llama-3.1-8B-Q4_K_M</div>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-black/60">
          <div className="text-xs text-slate-400 uppercase font-bold">RAPL SILICON WATTAGE</div>
          <div className="text-2xl font-black text-amber-400 mt-2">{raplWatts} Watts</div>
          <div className="text-xs text-slate-400 mt-1">● MSR Energy uj Counter</div>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-black/60">
          <div className="text-xs text-slate-400 uppercase font-bold">QUALIFIED LEADS</div>
          <div className="text-2xl font-black text-white mt-2">p(close) = {pClose}</div>
          <div className="text-xs text-pink-400 mt-1">● 1,200 Chats Evaluated</div>
        </div>
      </div>

      {/* Bottom CLI & Exact Frame Counter Footer */}
      <div className="relative z-10 flex justify-between items-center text-sm border-t border-white/10 pt-3">
        <div>
          <span style={{ color: secondaryColor }} className="font-bold">
            ~/aether $&nbsp;
          </span>
          <span className="text-white font-bold">{visibleCli}</span>
          <span
            className="inline-block w-2.5 h-4 ml-1 bg-white align-middle"
            style={{ opacity: frame % 30 < 15 ? 1 : 0 }}
          />
        </div>
        <div className="text-gray-400 text-xs">
          tok/s <b className="text-white">{tokPerSec.toLocaleString()}</b> · rapl{' '}
          <b style={{ color: primaryColor }}>{raplWatts}W</b> · p(close){' '}
          <b className="text-emerald-400">{pClose}</b> · cloud runtime ·{' '}
          <b className="text-amber-300 font-bold">{displayFrameCount} frames</b>
        </div>
      </div>
    </div>
  );
};
export default AetherReelComposition;
