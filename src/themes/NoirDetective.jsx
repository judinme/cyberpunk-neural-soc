import React, { useState, useEffect, useRef } from 'react';
import { CloudRain, Search, FileText, Filter } from 'lucide-react';
import { cyberAudio } from '../audio';

export default function NoirDetective() {
  const rainCanvasRef = useRef(null);

  // Rain Simulator State
  const [rainIntensity, setRainIntensity] = useState(45); // 10 to 100
  const [isWiping, setIsWiping] = useState(false);

  // Spectral Wiretap De-Noiser State
  const [noiseFilter, setNoiseFilter] = useState(78); // %
  const [harmonicBoost, setHarmonicBoost] = useState(65);

  // Cold Case Evidence Carver
  const [evidenceFiles, setEvidenceFiles] = useState([
    { id: 'EV-01', name: 'wiretap_intercept_0x41.pcap', size: '14.2 MB', hash: 'e3b0c44298fc...', status: 'RECOVERED', anomaly: true },
    { id: 'EV-02', name: 'arasaka_payroll_corrupt.dat', size: '8.4 MB', hash: '8f434346648f...', status: 'CARVING', anomaly: false },
    { id: 'EV-03', name: 'dockside_cctv_frame_91.vault', size: '42.1 MB', hash: '2c26b46b68ff...', status: 'VERIFIED', anomaly: false },
  ]);

  // Trigger Wiper Sweep
  const handleWiper = () => {
    cyberAudio.playCryoVentSound();
    setIsWiping(true);
    setTimeout(() => setIsWiping(false), 900);
  };

  // Procedural Screen Raindrops Canvas Render Loop
  useEffect(() => {
    const canvas = rainCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let drops = [];

    const initDrops = (count) => {
      drops = [];
      for (let i = 0; i < count; i++) {
        drops.push({
          x: Math.random(),
          y: Math.random(),
          length: Math.random() * 18 + 10,
          speed: Math.random() * 8 + 4,
          opacity: Math.random() * 0.5 + 0.3,
          isSlidingDroplet: Math.random() > 0.7,
        });
      }
    };

    initDrops(rainIntensity * 3);

    const render = () => {
      const w = canvas.width = canvas.offsetWidth;
      const h = canvas.height = canvas.offsetHeight;

      ctx.fillStyle = 'rgba(1, 4, 8, 0.45)';
      ctx.fillRect(0, 0, w, h);

      if (isWiping) {
        // Physical Wiper Arm Sweep
        const wiperPivotX = w * 0.5;
        const wiperPivotY = h;
        const wiperLen = Math.min(w, h) * 0.95;
        const wiperProgress = (Date.now() % 900) / 900;
        const wiperAngle = -Math.PI * 0.65 + Math.sin(wiperProgress * Math.PI) * Math.PI * 1.3;

        ctx.save();
        ctx.strokeStyle = '#457b9d';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(wiperPivotX, wiperPivotY);
        ctx.lineTo(
          wiperPivotX + Math.cos(wiperAngle) * wiperLen,
          wiperPivotY + Math.sin(wiperAngle) * wiperLen
        );
        ctx.stroke();

        // Rubber blade edge
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      } else {
        // Draw falling rain streaks & sliding glass droplets
        ctx.lineWidth = 1.2;
        drops.forEach((d) => {
          d.y += (d.speed * 0.001 * rainIntensity) / 30;
          if (d.y > 1) {
            d.y = 0;
            d.x = Math.random();
          }

          const rx = d.x * w;
          const ry = d.y * h;

          if (d.isSlidingDroplet) {
            // Glass droplet with refraction ring
            ctx.fillStyle = `rgba(69, 123, 157, ${d.opacity})`;
            ctx.beginPath();
            ctx.arc(rx, ry, 2.5, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Falling rain streak
            ctx.strokeStyle = `rgba(69, 123, 157, ${d.opacity})`;
            ctx.beginPath();
            ctx.moveTo(rx, ry);
            ctx.lineTo(rx - 2, ry + d.length);
            ctx.stroke();
          }
        });
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [rainIntensity, isWiping]);

  return (
    <div className="grid grid-cols-12 gap-3 w-full font-mono text-slate-100">
      {/* =========================================================================
          LEFT WIDGET: PROCEDURAL SCREEN CONDENSATION & WIPER
          ========================================================================= */}
      <div className="col-span-12 lg:col-span-6 flex flex-col gap-3">
        <div
          className="p-4 rounded-xl border border-[#457b9d]/50 relative overflow-hidden flex flex-col gap-3 cyber-card-interactive"
          style={{
            backgroundColor: 'rgba(10, 18, 30, 0.92)',
            boxShadow: '0 0 25px rgba(69, 123, 157, 0.25)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#457b9d]/30 pb-2">
            <div className="flex items-center gap-2">
              <CloudRain className="w-5 h-5 text-[#457b9d]" />
              <span className="font-extrabold text-sm uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#457b9d] via-[#1d3557] to-[#e63946] font-orbitron tracking-widest">
                NEO-TOKYO RAIN CONDENSATION SIMULATOR
              </span>
            </div>
            <button
              onClick={handleWiper}
              disabled={isWiping}
              className="px-3 py-1 rounded bg-[#457b9d]/20 hover:bg-[#457b9d]/40 text-cyan-300 border border-[#457b9d]/50 text-xs font-bold transition-all"
            >
              {isWiping ? 'WIPING GLASS...' : 'WINDSHIELD WIPER'}
            </button>
          </div>

          {/* Raindrop Glass Canvas */}
          <div className="h-56 w-full rounded-lg overflow-hidden border border-white/10 relative bg-black/60">
            <canvas ref={rainCanvasRef} className="w-full h-full block" />
            <div className="absolute bottom-2 left-2 text-[9px] text-slate-400 font-mono bg-black/70 px-2 py-0.5 rounded border border-white/10">
              PRECIPITATION: {rainIntensity} mm/hr • HUMIDITY: 98%
            </div>
          </div>

          {/* Rain Intensity Slider */}
          <div className="bg-black/50 p-2.5 rounded-lg border border-white/10 text-xs">
            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
              <span>MONSOON PRECIPITATION RATE:</span>
              <span className="text-[#457b9d] font-bold">{rainIntensity} mm/h</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={rainIntensity}
              onChange={(e) => setRainIntensity(parseInt(e.target.value, 10))}
              className="w-full accent-[#457b9d]"
            />
          </div>
        </div>

        {/* Wiretap Spectral Voice De-Noiser */}
        <div
          className="p-4 rounded-xl border border-[#1d3557]/60 relative overflow-hidden flex flex-col gap-2.5"
          style={{ backgroundColor: 'rgba(10, 18, 30, 0.92)' }}
        >
          <div className="flex items-center justify-between border-b border-[#1d3557]/40 pb-1.5">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-xs font-orbitron tracking-widest text-cyan-300">
                WIRETAP SPECTRAL VOICE DE-NOISER
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold">SIGNAL ISOLATED</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                <span>RAIN NOISE FILTER:</span>
                <span className="text-cyan-300 font-bold">{noiseFilter}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={noiseFilter}
                onChange={(e) => setNoiseFilter(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400"
              />
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                <span>VOCAL HARMONIC ISOLATION:</span>
                <span className="text-[#e63946] font-bold">{harmonicBoost}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={harmonicBoost}
                onChange={(e) => setHarmonicBoost(parseInt(e.target.value, 10))}
                className="w-full accent-[#e63946]"
              />
            </div>
          </div>

          <div className="bg-black/80 p-2.5 rounded border border-white/10 text-[10px] text-slate-300 italic">
            "...intercepted audio transcript: target confirmed meeting with Arasaka courier under the expressway bridge at 03:00 hours..."
          </div>
        </div>
      </div>

      {/* =========================================================================
          RIGHT WIDGET: COLD-CASE MEMORY DUMP & FORENSIC CARVER
          ========================================================================= */}
      <div className="col-span-12 lg:col-span-6 flex flex-col gap-3">
        <div
          className="p-4 rounded-xl border border-[#457b9d]/50 relative overflow-hidden flex flex-col gap-3 h-full cyber-card-interactive"
          style={{
            backgroundColor: 'rgba(10, 18, 30, 0.92)',
            boxShadow: '0 0 25px rgba(230, 57, 70, 0.25)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#457b9d]/30 pb-2">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-[#e63946]" />
              <span className="font-extrabold text-sm uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#457b9d] via-[#1d3557] to-[#e63946] font-orbitron tracking-widest">
                CYBER-FORENSIC DISK &amp; PACKET CARVER
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-[#e63946] border border-[#e63946]/40 font-bold">
              3 EVIDENCE OBJECTS
            </span>
          </div>

          {/* Recovered Files Table */}
          <div className="space-y-2">
            {evidenceFiles.map((f) => (
              <div
                key={f.id}
                className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
                  f.anomaly ? 'bg-rose-950/20 border-rose-500/50' : 'bg-black/60 border-white/10'
                }`}
              >
                <div>
                  <div className="font-bold text-xs text-white flex items-center gap-2">
                    <FileText className={`w-3.5 h-3.5 ${f.anomaly ? 'text-[#e63946]' : 'text-cyan-400'}`} />
                    <span>{f.name}</span>
                  </div>
                  <div className="text-[9px] text-slate-400 mt-0.5">
                    SIZE: {f.size} • HASH: {f.hash}
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                    f.anomaly
                      ? 'bg-rose-500 text-white shadow-[0_0_8px_#e63946]'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {f.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Deep Carve Trigger */}
          <div className="mt-auto pt-2 border-t border-white/10 space-y-2">
            <button
              onClick={() => {
                cyberAudio.playBoostSound();
                setEvidenceFiles((prev) => [
                  ...prev,
                  {
                    id: `EV-0${prev.length + 1}`,
                    name: `reconstructed_kernel_dump_${Date.now().toString().slice(-4)}.bin`,
                    size: '18.7 MB',
                    hash: '9a31f4e198aa...',
                    status: 'VERIFIED',
                    anomaly: true,
                  },
                ]);
              }}
              className="w-full py-3 rounded-lg font-black font-orbitron tracking-widest text-xs uppercase bg-gradient-to-r from-[#457b9d] via-[#1d3557] to-[#e63946] text-white shadow-[0_0_20px_rgba(230,57,70,0.4)] hover:brightness-125 transition-all"
            >
              RUN DEEP CARVE CORRUPTED NVMe SECTORS
            </button>
            <div className="flex justify-between text-[9px] text-slate-400 px-1">
              <span>SECTOR RANGE: 0x0000_A000 - 0x0000_FFFF</span>
              <span className="text-[#e63946]">CHECKSUM: BLAKE3 PASS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
