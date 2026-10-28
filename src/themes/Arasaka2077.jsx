import React, { useState, useEffect } from 'react';
import { Shield, Zap, Skull, Crosshair, AlertTriangle, Layers } from 'lucide-react';
import { cyberAudio } from '../audio';

export default function Arasaka2077({
  telemetry,
}) {
  // Cyberdeck RAM state (16 RAM units)
  const maxRam = 16;
  const [currentRam, setCurrentRam] = useState(12);
  const [activeHack, setActiveHack] = useState(null);
  const [hackProgress, setHackProgress] = useState(0);

  // Vitals & Cyberpsychosis meter
  const [cyberpsychosisRisk, setCyberpsychosisRisk] = useState(62);
  const adrenalineBpm = 134;

  // Braindance Scrubber Layer
  const [activeBdLayer, setActiveBdLayer] = useState('THERMAL'); // 'VISUAL' | 'THERMAL' | 'AUDIO'
  const [bdProgress, setBdProgress] = useState(38);

  const QUICKHACKS = [
    { id: 'ping', name: 'PING.DAEMON', cost: 2, desc: 'Reveal host ICE & connected local sub-nets', icon: Crosshair },
    { id: 'short', name: 'SHORT_CIRCUIT', cost: 4, desc: 'Discharge 240V EMP overload into target cyberware', icon: Zap },
    { id: 'overheat', name: 'OVERHEAT.EXE', cost: 5, desc: 'Ignite neural processor thermal runaway', icon: AlertTriangle },
    { id: 'psycho', name: 'CYBERPSYCHOSIS', cost: 9, desc: 'Override target optic cortex to attack friendly drones', icon: Skull },
    { id: 'reset', name: 'SYSTEM_RESET', cost: 10, desc: 'Crash brainstem operating system with instant knockout', icon: Shield },
  ];

  // RAM regeneration over time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentRam((prev) => Math.min(maxRam, prev + 1));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  // Execute Quickhack
  const handleExecuteQuickhack = (hack) => {
    if (currentRam < hack.cost || activeHack) return;
    cyberAudio.playQuickhackSound();
    setCurrentRam((prev) => prev - hack.cost);
    setActiveHack(hack);
    setHackProgress(0);

    // Increase cyberpsychosis stress on heavy hacks
    setCyberpsychosisRisk((prev) => Math.min(98, prev + hack.cost * 2));

    let prog = 0;
    const interval = setInterval(() => {
      prog += 20;
      setHackProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setTimeout(() => setActiveHack(null), 800);
      }
    }, 150);
  };

  return (
    <div className="grid grid-cols-12 gap-3 w-full font-mono text-slate-100">
      {/* 2077 Night City Hero Banner with Authentic Cyberpunk Stencil Logo */}
      <div
        className="col-span-12 p-3.5 rounded-xl border-2 border-[#fcee0a] shadow-[4px_4px_0px_#00ff66] flex flex-wrap items-center justify-between gap-3 relative overflow-hidden cyber-card-interactive"
        style={{ backgroundColor: 'rgba(10, 22, 12, 0.95)' }}
      >
        <div className="flex items-center gap-4">
          <img
            src="/textures/cyberpunk_logo.png"
            alt="Cyberpunk 2077"
            className="h-10 sm:h-12 w-auto object-contain filter drop-shadow-[0_0_12px_#fcee0a] drop-shadow-[2px_2px_0px_#00ff66]"
          />
          <div className="border-l-2 border-[#fcee0a]/40 pl-3">
            <div className="text-xs sm:text-sm font-black uppercase text-[#fcee0a] tracking-widest drop-shadow-[1px_1px_0px_#00ff66]">
              NIGHT CITY // ARASAKA SUB-DERMAL ICE BREAKER DECK
            </div>
            <div className="text-[9px] sm:text-[10px] text-[#00ff66] font-bold">
              MILITECH SANDEVISTAN MK.V • 16-SLOT CYBERDECK RAM • BRAINDANCE LAYER SENSORS
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2.5 py-1 bg-[#fcee0a] text-black font-black uppercase tracking-wider shadow-[2px_2px_0px_#00ff66]">
            RELIC INTEGRITY: 94.2%
          </span>
          <span className="text-[10px] px-2.5 py-1 bg-[#00ff66]/20 border border-[#00ff66] text-[#00ff66] font-black uppercase tracking-wider">
            ICE BREACH READY
          </span>
        </div>
      </div>

      {/* =========================================================================
          LEFT WIDGET: CYBERWARE BIO-MONITOR & NEURAL VITALS
          ========================================================================= */}
      <div className="col-span-12 lg:col-span-6 flex flex-col gap-3">
        <div
          className="p-4 rounded-xl border-2 border-[#fcee0a] relative overflow-hidden flex flex-col gap-3 cyber-card-interactive"
          style={{
            backgroundColor: 'rgba(10, 22, 12, 0.92)',
            boxShadow: '4px 4px 0px #00ff66',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-[#fcee0a] pb-2 bg-[#fcee0a]/10 p-2 rounded">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#fcee0a] rotate-45" />
              <span className="font-black text-sm uppercase text-[#fcee0a] tracking-tight drop-shadow-[2px_2px_0px_#00ff66]">
                ARASAKA CYBERWARE BIO-MONITOR // MK.IV
              </span>
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 bg-[#fcee0a] text-black uppercase">
              SECURITY LVL 5
            </span>
          </div>

          {/* Vitals Equalizer Bar */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-black/60 p-2 rounded border border-[#00ff66]/40">
              <span className="text-[9px] text-[#00ff66] block font-bold">NEURAL STRESS</span>
              <span className="text-lg font-black text-white">{telemetry.cpuLoad || 54}%</span>
            </div>
            <div className="bg-black/60 p-2 rounded border border-[#fcee0a]/40">
              <span className="text-[9px] text-[#fcee0a] block font-bold">PULSE ADRENALINE</span>
              <span className="text-lg font-black text-white">{adrenalineBpm} <span className="text-[9px]">BPM</span></span>
            </div>
            <div className={`p-2 rounded border ${cyberpsychosisRisk > 80 ? 'bg-rose-950/80 border-rose-500 animate-pulse' : 'bg-black/60 border-white/20'}`}>
              <span className={`text-[9px] block font-bold ${cyberpsychosisRisk > 80 ? 'text-rose-400' : 'text-slate-400'}`}>
                CYBERPSYCHOSIS
              </span>
              <span className={`text-lg font-black ${cyberpsychosisRisk > 80 ? 'text-rose-400' : 'text-[#00ff66]'}`}>
                {cyberpsychosisRisk}%
              </span>
            </div>
          </div>

          {/* Cyberware Implants Loadout */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[10px] font-bold text-[#fcee0a] uppercase tracking-wider">
              INSTALLED NEURAL HARDWARE &amp; IMPLANTS
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-black/70 p-2 rounded border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-[11px]">Militech Sandevistan</div>
                  <div className="text-[9px] text-slate-400">OS SLOT • DILATION 40%</div>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-[#00ff66] font-bold">
                  ACTIVE
                </span>
              </div>

              <div className="bg-black/70 p-2 rounded border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-[11px]">Kiroshi Optics V3</div>
                  <div className="text-[9px] text-slate-400">OCULAR • THREAT SCANNER</div>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-[#0099ff] font-bold">
                  LINKED
                </span>
              </div>

              <div className="bg-black/70 p-2 rounded border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-[11px]">Sub-Dermal Armor</div>
                  <div className="text-[9px] text-slate-400">INTEGUMENTARY • 480 AR</div>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-[#fcee0a] font-bold">
                  98.4%
                </span>
              </div>

              <div className="bg-black/70 p-2 rounded border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-[11px]">Gorilla Arms</div>
                  <div className="text-[9px] text-slate-400">ARMS • KINETIC IMPACT</div>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-[#00ff66] font-bold">
                  PRIMED
                </span>
              </div>
            </div>
          </div>

          {/* Braindance Neuro-Sensory Layer Scrubber */}
          <div className="bg-black/80 p-2.5 rounded-lg border border-white/10 space-y-2 mt-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-bold text-[#fcee0a] flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-[#00ff66]" />
                BRAINDANCE SENSORY RECORDER
              </span>
              <div className="flex items-center gap-1 text-[8px]">
                {['VISUAL', 'THERMAL', 'AUDIO'].map((layer) => (
                  <button
                    key={layer}
                    onClick={() => setActiveBdLayer(layer)}
                    className={`px-2 py-0.5 rounded font-bold transition-all ${
                      activeBdLayer === layer
                        ? 'bg-[#fcee0a] text-black shadow-[2px_2px_0px_#00ff66]'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {layer}
                  </button>
                ))}
              </div>
            </div>

            {/* BD Scrubber Bar */}
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={bdProgress}
                onChange={(e) => setBdProgress(parseInt(e.target.value, 10))}
                className="w-full accent-[#00ff66]"
              />
              <div className="flex justify-between text-[8px] text-slate-400 mt-0.5">
                <span>00:00.00</span>
                <span className="text-[#00ff66] font-bold">CLUE DETECTED @ 00:38.24</span>
                <span>02:45.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          RIGHT WIDGET: INTERACTIVE CYBERDECK QUICKHACK INJECTOR
          ========================================================================= */}
      <div className="col-span-12 lg:col-span-6 flex flex-col gap-3">
        <div
          className="p-4 rounded-xl border-2 border-[#00ff66] relative overflow-hidden flex flex-col gap-3 h-full cyber-card-interactive"
          style={{
            backgroundColor: 'rgba(10, 22, 12, 0.92)',
            boxShadow: '4px 4px 0px #fcee0a',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-[#00ff66] pb-2 bg-[#00ff66]/10 p-2 rounded">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#00ff66]" />
              <span className="font-black text-sm uppercase text-[#00ff66] tracking-tight drop-shadow-[2px_2px_0px_#fcee0a]">
                CYBERDECK DAEMON &amp; QUICKHACK CONSOLE
              </span>
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 bg-[#00ff66] text-black uppercase">
              MILITECH PARALINE
            </span>
          </div>

          {/* Cyberdeck RAM Buffer Meter (16 Units) */}
          <div className="bg-black/70 p-3 rounded-lg border border-white/10 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#00ff66]">CYBERDECK RAM BUFFER:</span>
              <span className="text-[#fcee0a]">{currentRam} / {maxRam} RAM AVAILABLE</span>
            </div>

            {/* RAM Unit Blocks */}
            <div className="grid grid-cols-16 gap-1 h-4">
              {Array.from({ length: maxRam }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-xs transition-all duration-300 ${
                    i < currentRam
                      ? 'bg-[#00ff66] shadow-[0_0_8px_#00ff66]'
                      : 'bg-slate-900 border border-white/10'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Active Quickhack Progress Indicator */}
          {activeHack && (
            <div className="p-2.5 rounded bg-black/90 border border-[#fcee0a] space-y-1 animate-pulse">
              <div className="flex justify-between text-xs font-bold text-[#fcee0a]">
                <span>UPLOADING DAEMON: {activeHack.name}</span>
                <span>{hackProgress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00ff66] to-[#fcee0a] transition-all duration-150"
                  style={{ width: `${hackProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Quickhacks List */}
          <div className="space-y-1.5 flex-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              EQUIPPED DAEMON PROTOCOLS
            </div>

            {QUICKHACKS.map((hack) => {
              const canAfford = currentRam >= hack.cost;
              const Icon = hack.icon;

              return (
                <div
                  key={hack.id}
                  className={`p-2 rounded-lg border flex items-center justify-between transition-all ${
                    canAfford
                      ? 'bg-black/60 border-white/15 hover:border-[#fcee0a] hover:bg-[#fcee0a]/5'
                      : 'bg-black/40 border-white/5 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded bg-white/5 border border-white/10 text-[#00ff66]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-black text-xs text-white flex items-center gap-2">
                        <span>{hack.name}</span>
                        <span className="text-[9px] px-1 rounded bg-[#00ff66]/20 text-[#00ff66] font-bold">
                          {hack.cost} RAM
                        </span>
                      </div>
                      <div className="text-[9px] text-slate-400">{hack.desc}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleExecuteQuickhack(hack)}
                    disabled={!canAfford || activeHack !== null}
                    className={`px-3 py-1 rounded text-xs font-black uppercase tracking-wider transition-all ${
                      canAfford && !activeHack
                        ? 'bg-[#fcee0a] hover:bg-[#ffe600] text-black shadow-[2px_2px_0px_#00ff66]'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    UPLOAD
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
