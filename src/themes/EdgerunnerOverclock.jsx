import React, { useState } from 'react';
import { Zap, Flame, Wind, BatteryCharging } from 'lucide-react';
import { cyberAudio } from '../audio';

export default function EdgerunnerOverclock() {
  // Sandevistan Time Dilation & Overclocking
  const [isSandevistanActive, setIsSandevistanActive] = useState(false);
  const [temporalDilation, setTemporalDilation] = useState(1.0); // 1.0x (normal) down to 0.15x (warp)
  const [clockGhz, setClockGhz] = useState(5.4); // 3.6 to 6.8 GHz
  const [coreTemp, setCoreTemp] = useState(74.2);
  const [isVentingCryo, setIsVentingCryo] = useState(false);

  // Kinetic Railgun Capacitors
  const [caps, setCaps] = useState([85, 92, 78, 96]);
  const [hasDischarged, setHasDischarged] = useState(false);

  // Engage Sandevistan Warp
  const handleToggleSandevistan = () => {
    cyberAudio.playSandevistanSound();
    const nextState = !isSandevistanActive;
    setIsSandevistanActive(nextState);

    if (nextState) {
      setTemporalDilation(0.15);
      setClockGhz(6.6);
      setCoreTemp((prev) => Math.min(94, prev + 12));
    } else {
      setTemporalDilation(1.0);
      setClockGhz(5.4);
    }
  };

  // Vent Liquid Nitrogen
  const handleVentCryo = () => {
    cyberAudio.playCryoVentSound();
    setIsVentingCryo(true);
    setCoreTemp((prev) => Math.max(38, prev - 25));
    setTimeout(() => setIsVentingCryo(false), 1200);
  };

  // Charge / Fire Railgun Capacitors
  const handleFireRailgun = () => {
    cyberAudio.playBoostSound();
    setHasDischarged(true);
    setCaps([0, 0, 0, 0]);
    setTimeout(() => {
      setHasDischarged(false);
      // Re-charge
      setCaps([100, 100, 100, 100]);
    }, 2000);
  };

  return (
    <div className={`grid grid-cols-12 gap-3 w-full font-mono transition-all duration-300 ${isSandevistanActive ? 'brightness-125 sandevistan-trails' : ''}`}>
      {/* =========================================================================
          LEFT WIDGET: SANDEVISTAN OVERCLOCK & TIME-DILATION COCKPIT
          ========================================================================= */}
      <div className="col-span-12 lg:col-span-6 flex flex-col gap-3">
        <div
          className="p-4 rounded-xl border border-[#ccff00]/60 relative overflow-hidden flex flex-col gap-3 cyber-card-interactive"
          style={{
            backgroundColor: 'rgba(18, 5, 35, 0.88)',
            boxShadow: isSandevistanActive ? '0 0 35px #ccff00' : '0 0 20px rgba(204, 255, 0, 0.25)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#ccff00]/30 pb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#ccff00] animate-bounce" />
              <span className="font-extrabold text-sm uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] via-[#00ffff] to-[#7b2cbf] font-orbitron tracking-widest">
                SANDEVISTAN OVERCLOCK // WARP ENGINE
              </span>
            </div>
            <span
              className={`text-[9px] px-2 py-0.5 rounded font-black tracking-widest uppercase border ${
                isSandevistanActive
                  ? 'bg-[#ccff00] text-black border-[#ccff00] shadow-[0_0_12px_#ccff00] animate-pulse'
                  : 'bg-white/5 text-slate-400 border-white/10'
              }`}
            >
              {isSandevistanActive ? 'WARP ENGAGED (0.15x)' : 'STANDBY (1.0x)'}
            </span>
          </div>

          {/* Sandevistan Activation Hero Button */}
          <button
            onClick={handleToggleSandevistan}
            className={`w-full py-3 rounded-lg font-black font-orbitron tracking-widest text-sm uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
              isSandevistanActive
                ? 'bg-gradient-to-r from-[#ccff00] to-[#00ffff] text-black shadow-[0_0_25px_#ccff00] scale-[1.01]'
                : 'bg-gradient-to-r from-[#ccff00]/20 to-[#7b2cbf]/30 hover:bg-[#ccff00]/30 text-[#ccff00] border border-[#ccff00]/50'
            }`}
          >
            <Zap className="w-4 h-4 fill-current" />
            {isSandevistanActive ? 'DISENGAGE SANDEVISTAN' : 'ENGAGE SANDEVISTAN WARP DILATION'}
          </button>

          {/* Clock Speed & Overclock Gauges */}
          <div className="grid grid-cols-2 gap-3 bg-black/60 p-3 rounded-lg border border-white/10">
            <div>
              <div className="flex justify-between text-xs text-slate-300 font-bold mb-1">
                <span>CPU WARP FREQUENCY:</span>
                <span className="text-[#ccff00] text-sm">{clockGhz.toFixed(2)} GHz</span>
              </div>
              <input
                type="range"
                min="3.6"
                max="6.8"
                step="0.1"
                value={clockGhz}
                onChange={(e) => setClockGhz(parseFloat(e.target.value))}
                className="w-full accent-[#ccff00]"
              />
              <div className="flex justify-between text-[8px] text-slate-500 mt-0.5">
                <span>3.6 GHz (BASE)</span>
                <span>6.8 GHz (MAX OC)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-bold mb-1">
                <span>TEMPORAL DILATION:</span>
                <span className="text-[#00ffff] text-sm">{temporalDilation}x</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={temporalDilation}
                onChange={(e) => setTemporalDilation(parseFloat(e.target.value))}
                className="w-full accent-[#00ffff]"
              />
              <div className="flex justify-between text-[8px] text-slate-500 mt-0.5">
                <span>0.1x (BULLET TIME)</span>
                <span>1.0x (REALTIME)</span>
              </div>
            </div>
          </div>

          {/* Cryogenic Nitrogen Cooling Purge */}
          <div className="bg-black/70 p-3 rounded-lg border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Flame className={`w-4 h-4 ${coreTemp > 80 ? 'text-rose-500 animate-pulse' : 'text-amber-400'}`} />
                <span>CORE TEMPERATURE: </span>
                <span className={`text-sm ${coreTemp > 80 ? 'text-rose-400' : 'text-[#ccff00]'}`}>
                  {coreTemp.toFixed(1)}°C
                </span>
              </div>
              <div className="text-[9px] text-slate-400">
                {isVentingCryo ? 'PURGING LIQUID NITROGEN...' : 'ACCUMULATED SYNAPSE THERMAL LOAD'}
              </div>
            </div>

            <button
              onClick={handleVentCryo}
              disabled={isVentingCryo}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold font-mono uppercase tracking-wider transition-all ${
                isVentingCryo
                  ? 'bg-cyan-500 text-black shadow-[0_0_15px_#00ffff] animate-pulse'
                  : 'bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-400/50'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              VENT CRYO
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          RIGHT WIDGET: KINETIC RAILGUN CAPACITOR BANK
          ========================================================================= */}
      <div className="col-span-12 lg:col-span-6 flex flex-col gap-3">
        <div
          className="p-4 rounded-xl border border-[#00ffff]/60 relative overflow-hidden flex flex-col gap-3 h-full cyber-card-interactive"
          style={{
            backgroundColor: 'rgba(18, 5, 35, 0.88)',
            boxShadow: hasDischarged ? '0 0 45px #ffffff' : '0 0 20px rgba(0, 255, 255, 0.25)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#00ffff]/30 pb-2">
            <div className="flex items-center gap-2">
              <BatteryCharging className="w-5 h-5 text-[#00ffff]" />
              <span className="font-extrabold text-sm uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#00ffff] via-[#ccff00] to-[#7b2cbf] font-orbitron tracking-widest">
                KINETIC RAILGUN // CAPACITOR BANK
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-[#00ffff] border border-[#00ffff]/40 font-bold">
              4x 800V COILS
            </span>
          </div>

          {/* 4 Capacitor Banks */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {caps.map((val, idx) => (
              <div key={idx} className="bg-black/70 p-2.5 rounded-lg border border-white/10 flex flex-col items-center gap-1.5">
                <span className="text-[9px] text-slate-400 font-bold">BANK 0{idx + 1}</span>
                <div className="h-24 w-6 bg-slate-950 rounded-sm p-0.5 border border-white/10 flex flex-col justify-end">
                  <div
                    className="w-full bg-gradient-to-t from-[#ccff00] to-[#00ffff] rounded-xs transition-all duration-300"
                    style={{ height: `${val}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-white">{val}%</span>
              </div>
            ))}
          </div>

          {/* Discharge Kinetic Pulse Button */}
          <div className="mt-auto space-y-2 pt-2 border-t border-white/10">
            <button
              onClick={handleFireRailgun}
              className="w-full py-3 rounded-lg font-black font-orbitron tracking-widest text-sm uppercase bg-gradient-to-r from-cyan-400 via-[#ccff00] to-fuchsia-500 text-black shadow-[0_0_20px_rgba(0,255,255,0.5)] hover:brightness-125 transition-all"
            >
              DISCHARGE KINETIC RAILGUN PULSE
            </button>
            <div className="flex justify-between text-[9px] text-slate-400 px-1">
              <span>STORED ENERGY: 4.8 MEGAJOULES</span>
              <span className="text-[#ccff00]">VELOCITY: MACH 7.4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
