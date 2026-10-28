import React, { useEffect, useRef } from 'react';
import { Flame, Cpu, Gauge, Zap, AlertTriangle } from 'lucide-react';

export default function ReactorCore({ theme, telemetry, isDefcon }) {
  const plasmaCanvasRef = useRef(null);

  // Calculate total system power: RAPL CPU + NVML GPU + DRAM + 45W VRM/base
  const cpuWatts = telemetry.cpuWatts || 125.4;
  const gpuWatts = telemetry.gpuWatts || 285.0;
  const dramWatts = telemetry.dramWatts || 18.2;
  const totalWatts = Math.round(cpuWatts + gpuWatts + dramWatts + 45.0);

  // Maximum scale 750W
  const maxWatts = 750;
  const wattagePct = Math.min(100, Math.max(10, (totalWatts / maxWatts) * 100));

  // Heatmap: 16 cores ($2 \times 8$ matrix)
  const defaultCores = [
    { load: 42, temp: 58.2 }, { load: 55, temp: 62.4 }, { load: 78, temp: 72.1 }, { load: 84, temp: 76.5 },
    { load: 38, temp: 56.0 }, { load: 45, temp: 59.8 }, { load: 92, temp: 81.3 }, { load: 64, temp: 66.7 },
    { load: 51, temp: 61.5 }, { load: 48, temp: 60.1 }, { load: 72, temp: 69.8 }, { load: 61, temp: 65.4 },
    { load: 39, temp: 57.2 }, { load: 44, temp: 58.9 }, { load: 88, temp: 79.4 }, { load: 58, temp: 64.2 },
  ];
  const cores = telemetry.cpuCores && telemetry.cpuCores.length >= 16 ? telemetry.cpuCores.slice(0, 16) : defaultCores;
  const peakTemp = Math.max(...cores.map((c) => c.temp));

  // Core color function based on temperature
  const getCoreColor = (temp) => {
    if (temp >= 78) return { bg: 'bg-rose-500/25', text: 'text-rose-400', border: 'border-rose-500/60' };
    if (temp >= 65) return { bg: 'bg-amber-500/25', text: 'text-amber-400', border: 'border-amber-500/60' };
    return { bg: 'bg-cyan-500/15', text: 'text-cyan-300', border: 'border-cyan-500/40' };
  };

  // SVG Concentric Arc parameters
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (wattagePct / 100) * (circumference * 0.75); // 270 degree arc

  // =========================================================================
  // REAL-TIME PLASMA CORE & ELECTRIC MICRO-ARC CANVAS SIMULATION
  // =========================================================================
  useEffect(() => {
    const canvas = plasmaCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let t = 0;

    const renderPlasma = () => {
      t += 0.04;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w * 0.5;
      const cy = h * 0.5;

      ctx.clearRect(0, 0, w, h);

      // Multi-layer rotating magnetic flux filaments
      const filamentCount = isDefcon ? 14 : 9;
      const plasmaColor = isDefcon ? '#ff2a6d' : theme.primary;
      const secondaryPlasma = isDefcon ? '#ef4444' : theme.secondary;

      ctx.globalCompositeOperation = 'lighter';

      for (let i = 0; i < filamentCount; i++) {
        const angleOffset = (i / filamentCount) * Math.PI * 2 + t * 0.8;
        const waveR = 26 + Math.sin(t * 2 + i * 1.5) * 6;

        const x1 = cx + Math.cos(angleOffset) * waveR;
        const y1 = cy + Math.sin(angleOffset) * waveR;
        const x2 = cx + Math.cos(angleOffset + Math.PI) * (waveR * 0.85);
        const y2 = cy + Math.sin(angleOffset + Math.PI) * (waveR * 0.85);

        // Control point turbulence
        const cpX = cx + Math.sin(t * 3 + i) * 12;
        const cpY = cy + Math.cos(t * 3 + i) * 12;

        ctx.strokeStyle = i % 2 === 0 ? plasmaColor : secondaryPlasma;
        ctx.lineWidth = 1.6;
        ctx.shadowColor = plasmaColor;
        ctx.shadowBlur = isDefcon ? 12 : 8;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(cpX, cpY, x2, y2);
        ctx.stroke();
      }

      // Random stochastic high-voltage electric spark discharges
      if (Math.random() < (isDefcon ? 0.65 : 0.35)) {
        const startAngle = Math.random() * Math.PI * 2;
        const endAngle = startAngle + (Math.PI * 0.6 + Math.random() * 0.8);
        const r1 = 18 + Math.random() * 8;
        const r2 = 34 + Math.random() * 8;

        let curX = cx + Math.cos(startAngle) * r1;
        let curY = cy + Math.sin(startAngle) * r1;
        const targetX = cx + Math.cos(endAngle) * r2;
        const targetY = cy + Math.sin(endAngle) * r2;

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.moveTo(curX, curY);

        const steps = 4;
        for (let s = 1; s <= steps; s++) {
          const frac = s / steps;
          const nextX = curX + (targetX - curX) * frac + (Math.random() - 0.5) * 8;
          const nextY = curY + (targetY - curY) * frac + (Math.random() - 0.5) * 8;
          ctx.lineTo(nextX, nextY);
        }
        ctx.stroke();
      }

      ctx.globalCompositeOperation = 'source-over';
      animId = requestAnimationFrame(renderPlasma);
    };

    renderPlasma();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isDefcon, theme]);

  return (
    <div
      className="p-3.5 rounded-xl backdrop-blur-md border cyber-card-interactive flex flex-col gap-3 relative overflow-hidden"
      style={{
        backgroundColor: theme.card,
        borderColor: isDefcon ? '#ef4444' : theme.cardBorder,
        boxShadow: isDefcon ? '0 0 25px rgba(239,68,68,0.35)' : `0 0 20px ${theme.glow}`,
      }}
    >
      {/* Module Title Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
          <h3 className="text-xs font-bold font-orbitron tracking-wider uppercase text-slate-100 flex items-center gap-1.5">
            <span>NEON REACTOR &amp; SILICON THERMAL HEATMAP</span>
          </h3>
        </div>
        <span
          className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold tracking-widest uppercase border ${
            isDefcon
              ? 'bg-rose-950/80 text-rose-300 border-rose-500/60 animate-pulse'
              : 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40'
          }`}
        >
          {isDefcon ? 'CONTAINMENT // DEFCON 1' : 'RAPL // HARDWARE MSR'}
        </span>
      </div>

      {/* Top Section: Concentric SVG Reactor & Real-Time Energy Readouts */}
      <div className="grid grid-cols-12 gap-3 items-center">
        {/* Concentric Neon Reactor SVG Turbine with Dynamic Plasma Eye */}
        <div className="col-span-5 relative flex items-center justify-center py-1">
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* Ambient Background Glow */}
            <div
              className="absolute inset-0 rounded-full blur-xl opacity-40 transition-colors duration-500"
              style={{
                background: isDefcon
                  ? 'radial-gradient(circle, #ef4444 0%, transparent 70%)'
                  : `radial-gradient(circle, ${theme.primary} 0%, ${theme.secondary} 50%, transparent 80%)`,
              }}
            />

            {/* Embedded Real-Time Magnetohydrodynamic Plasma Canvas */}
            <canvas
              ref={plasmaCanvasRef}
              width={110}
              height={110}
              className="absolute z-15 pointer-events-none rounded-full"
            />

            <svg viewBox="0 0 200 200" className="w-full h-full relative z-10">
              {/* Outer Metallic Bevel Ring */}
              <circle
                cx="100"
                cy="100"
                r="92"
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="2.5"
                strokeDasharray="4 6"
              />

              {/* Counter-Rotating Outer Containment Ring (12s spin) */}
              <g className="animate-spin-cw-12 origin-center">
                <circle
                  cx="100"
                  cy="100"
                  r="84"
                  fill="none"
                  stroke={isDefcon ? '#ef4444' : theme.primary}
                  strokeWidth="2"
                  strokeDasharray="14 18 3 8"
                  opacity="0.8"
                />
                {/* Outer Ring Flanges */}
                {[0, 60, 120, 180, 240, 300].map((deg) => (
                  <rect
                    key={deg}
                    x="97"
                    y="10"
                    width="6"
                    height="8"
                    fill={isDefcon ? '#ef4444' : theme.primary}
                    transform={`rotate(${deg} 100 100)`}
                    opacity="0.9"
                  />
                ))}
              </g>

              {/* Counter-Rotating Inner Inductor Ring (7s reverse spin) */}
              <g className="animate-spin-ccw-7 origin-center">
                <circle
                  cx="100"
                  cy="100"
                  r="52"
                  fill="none"
                  stroke={isDefcon ? '#f87171' : theme.secondary}
                  strokeWidth="2"
                  strokeDasharray="8 12 2 6"
                  opacity="0.85"
                />
                {/* 12 Radial Plasma Inductor Pistons */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <line
                    key={i}
                    x1="100"
                    y1="56"
                    x2="100"
                    y2="66"
                    stroke={isDefcon ? '#ef4444' : (i % 2 === 0 ? theme.primary : theme.secondary)}
                    strokeWidth="2.5"
                    transform={`rotate(${i * 30} 100 100)`}
                    opacity="0.8"
                  />
                ))}
              </g>

              {/* Dynamic Wattage Progress Arc */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="6"
                strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
                strokeLinecap="round"
                transform="rotate(135 100 100)"
              />
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={isDefcon ? '#ef4444' : theme.primary}
                strokeWidth="6"
                strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(135 100 100)"
                style={{
                  transition: 'stroke-dashoffset 0.5s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.3s ease',
                  filter: isDefcon ? 'drop-shadow(0 0 8px #ef4444)' : `drop-shadow(0 0 10px ${theme.primary})`,
                }}
              />
            </svg>

            {/* Central Holographic Digital Readout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 pointer-events-none">
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-mono">
                TOTAL POWER
              </span>
              <div className="text-2xl font-black font-orbitron tracking-tight text-white flex items-baseline justify-center gap-0.5">
                <span className={isDefcon ? 'text-rose-400' : 'text-white'}>
                  {totalWatts}
                </span>
                <span className="text-xs font-normal text-slate-400">W</span>
              </div>
              <span className="text-[8px] font-mono text-cyan-300">
                {wattagePct.toFixed(1)}% TDP
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Real-Time Power Subsystem Breakdown with Peak-Hold Indicators */}
        <div className="col-span-7 flex flex-col gap-2 font-mono">
          <div className="bg-black/50 p-1.5 rounded border border-white/5 text-[10px] text-slate-400 flex items-center justify-between">
            <span className="text-slate-500">P_tot = P_cpu + P_gpu + P_ram + 45W</span>
            <span className="text-cyan-400 font-bold">{totalWatts} W</span>
          </div>

          {/* Subsystem Rows */}
          <div className="space-y-1.5">
            {/* CPU RAPL Watts */}
            <div>
              <div className="flex justify-between text-[10px] text-slate-300 mb-0.5">
                <span className="flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-cyan-400" />
                  CPU (Linux RAPL):
                </span>
                <span className="font-bold text-cyan-300">{cpuWatts.toFixed(1)} W</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5 relative">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (cpuWatts / 250) * 100)}%` }}
                />
              </div>
            </div>

            {/* GPU TDP Watts */}
            <div>
              <div className="flex justify-between text-[10px] text-slate-300 mb-0.5">
                <span className="flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-fuchsia-400" />
                  GPU NVML TDP:
                </span>
                <span className="font-bold text-fuchsia-300">{gpuWatts.toFixed(1)} W</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5 relative">
                <div
                  className="h-full bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (gpuWatts / 450) * 100)}%` }}
                />
              </div>
            </div>

            {/* DRAM Plane Watts */}
            <div>
              <div className="flex justify-between text-[10px] text-slate-300 mb-0.5">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  DRAM Energy:
                </span>
                <span className="font-bold text-amber-300">{dramWatts.toFixed(1)} W</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5 relative">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (dramWatts / 50) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Peak Silicon Temp & Saturation stats */}
          <div className="grid grid-cols-2 gap-2 mt-1 pt-1 border-t border-white/5 text-[10px]">
            <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded">
              <Flame className={`w-3.5 h-3.5 ${peakTemp > 78 ? 'text-rose-500 animate-pulse' : 'text-amber-400'}`} />
              <div>
                <span className="text-slate-400 text-[8px] block">PEAK SILICON</span>
                <span className={`font-bold ${peakTemp > 78 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {peakTemp.toFixed(1)}°C
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded">
              <AlertTriangle className="w-3.5 h-3.5 text-cyan-400" />
              <div>
                <span className="text-slate-400 text-[8px] block">THROTTLE STAT</span>
                <span className="font-bold text-emerald-400">UNTHROTTLED</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 16-Core Silicon Die Heatmap Matrix ($2 \times 8$) */}
      <div className="space-y-1.5 pt-1 border-t border-white/10">
        <div className="flex items-center justify-between text-[10px] font-mono">
          <span className="text-slate-300 font-bold tracking-wider flex items-center gap-1">
            <Cpu className="w-3 h-3 text-cyan-400" />
            16-CORE SILICON DIE HEATMAP
          </span>
          <div className="flex items-center gap-2 text-[8px]">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> &lt;65°C
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> 65-78°C
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> &gt;78°C
            </span>
          </div>
        </div>

        {/* 2 Rows of 8 Cores with High-Density Micro Indicators */}
        <div className="grid grid-cols-8 gap-1.5">
          {cores.map((core, idx) => {
            const styling = getCoreColor(core.temp);
            return (
              <div
                key={idx}
                className={`p-1 rounded flex flex-col items-center justify-center border text-center transition-all duration-300 relative overflow-hidden ${styling.bg} ${styling.border}`}
              >
                {/* Micro peak thermal line at top */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{
                    backgroundColor: core.temp > 78 ? '#ef4444' : core.temp > 65 ? '#f59e0b' : '#00f5d4',
                    boxShadow: '0 0 4px currentColor',
                  }}
                />
                <span className="text-[8px] text-slate-400 font-mono">C{idx < 10 ? `0${idx}` : idx}</span>
                <span className={`text-[10px] font-bold font-mono ${styling.text}`}>
                  {core.temp.toFixed(0)}°
                </span>
                <span className="text-[7px] text-slate-400 font-mono mt-0.5">
                  {core.load.toFixed(0)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* PCIe Gen5 Lane Saturation Bar */}
      <div className="pt-1 border-t border-white/5 font-mono text-[10px]">
        <div className="flex justify-between items-center mb-1">
          <span className="text-slate-400 flex items-center gap-1">
            <span>PCIe Gen5 x16 BUS SATURATION</span>
          </span>
          <span className="text-cyan-400 font-bold">128 GB/s (74.2%)</span>
        </div>
        <div className="h-2 w-full bg-slate-950 rounded-sm border border-white/10 overflow-hidden flex gap-0.5 p-0.5">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 rounded-xs transition-colors duration-300 ${
                i < 12
                  ? (i < 8 ? 'bg-cyan-400 shadow-[0_0_4px_rgba(0,245,212,0.6)]' : 'bg-fuchsia-400 shadow-[0_0_4px_rgba(247,37,133,0.6)]')
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
