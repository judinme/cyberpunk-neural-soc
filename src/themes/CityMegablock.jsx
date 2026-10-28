import React, { useState } from 'react';
import { Building2, Satellite, Crosshair, Power } from 'lucide-react';
import { cyberAudio } from '../audio';

export default function CityMegablock() {
  // District Grid Power Matrix
  const [districts, setDistricts] = useState([
    { id: 'watson', name: 'WATSON INDUSTRIAL SECTOR', mw: 480, online: true, sub: 'SUB-01' },
    { id: 'corpo', name: 'CORPO PLAZA TOWERS', mw: 1240, online: true, sub: 'SUB-04' },
    { id: 'westbrook', name: 'WESTBROOK LUXURY BLOCKS', mw: 620, online: true, sub: 'SUB-07' },
    { id: 'heywood', name: 'HEYWOOD MUNICIPAL GRID', mw: 310, online: false, sub: 'SUB-09' },
    { id: 'pacifica', name: 'PACIFICA COASTAL COMBAT ZONE', mw: 140, online: false, sub: 'SUB-12' },
  ]);

  // Orbital Satellite Telemetry
  const [azimuth, setAzimuth] = useState(142.4);
  const [elevation, setElevation] = useState(48.2);
  const interceptedMsg = `ENCRYPTED: KANG_TAO_ORBITAL-07 // AZ: ${azimuth}° EL: ${elevation}° // CARRIER FREQ: ${(14.28 + azimuth * 0.01).toFixed(3)} GHz // SECURE BI-DIRECTIONAL COMMS`;

  // Security Drone Swarm
  const [drones, setDrones] = useState([
    { id: 'DRONE-01', callsign: 'VIPER-LEAD', alt: '142m', bat: 84, target: 'LOCKED // TARGET #4109', alert: false },
    { id: 'DRONE-02', callsign: 'VIPER-TWO', alt: '185m', bat: 92, target: 'PATROLLING SECTOR 4', alert: false },
    { id: 'DRONE-03', callsign: 'SHADOW-ONE', alt: '95m', bat: 45, target: 'INTRUSION DETECTED', alert: true },
    { id: 'DRONE-04', callsign: 'GHOST-NINE', alt: '210m', bat: 78, target: 'ORBITAL RELAY SYNC', alert: false },
  ]);

  const toggleDistrictPower = (id) => {
    cyberAudio.playChirp('click');
    setDistricts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, online: !d.online } : d))
    );
  };

  const handleDeployDrones = () => {
    cyberAudio.playBoostSound();
    setDrones((prev) =>
      prev.map((dr) => ({ ...dr, target: 'ENGAGING STRIKE PROTOCOL', alert: true }))
    );
  };

  return (
    <div className="grid grid-cols-12 gap-3 w-full font-mono text-slate-100">
      {/* =========================================================================
          LEFT WIDGET: METROPOLIS MULTI-DISTRICT POWER ROUTING
          ========================================================================= */}
      <div className="col-span-12 lg:col-span-6 flex flex-col gap-3">
        <div
          className="p-4 rounded-xl border border-[#ff00ff]/50 relative overflow-hidden flex flex-col gap-3 cyber-card-interactive"
          style={{
            backgroundColor: 'rgba(14, 2, 28, 0.88)',
            boxShadow: '0 0 25px rgba(255, 0, 255, 0.25)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#ff00ff]/30 pb-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#ff00ff]" />
              <span className="font-extrabold text-sm uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#7209b7] via-[#ff00ff] to-[#3a0ca3] font-orbitron tracking-widest">
                METROPOLIS MEGABLOCK POWER SUBSTATIONS
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-fuchsia-950 text-[#ff00ff] border border-[#ff00ff]/40 font-bold">
              GRID: BALANCED
            </span>
          </div>

          {/* District Power Matrix */}
          <div className="space-y-2">
            {districts.map((d) => (
              <div
                key={d.id}
                className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                  d.online
                    ? 'bg-black/60 border-white/10 hover:border-[#ff00ff]/60'
                    : 'bg-black/30 border-white/5 opacity-50'
                }`}
              >
                <div>
                  <div className="font-bold text-xs text-white flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${d.online ? 'bg-[#ff00ff] shadow-[0_0_8px_#ff00ff]' : 'bg-slate-700'}`} />
                    <span>{d.name}</span>
                  </div>
                  <div className="text-[9px] text-slate-400 pl-4">
                    SUBSTATION {d.sub} • {d.mw} MEGAWATTS
                  </div>
                </div>

                <button
                  onClick={() => toggleDistrictPower(d.id)}
                  className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-bold transition-all ${
                    d.online
                      ? 'bg-[#ff00ff]/20 text-[#ff00ff] border border-[#ff00ff]/50 hover:bg-[#ff00ff]/40'
                      : 'bg-slate-800 text-slate-400 border border-white/10'
                  }`}
                >
                  <Power className="w-3 h-3" />
                  {d.online ? 'ONLINE' : 'BLACKOUT'}
                </button>
              </div>
            ))}
          </div>

          {/* Total Megawatt Draw */}
          <div className="flex justify-between items-center text-xs bg-black/50 p-2 rounded border border-white/10 mt-1">
            <span className="text-slate-400">TOTAL CITY CONSUMPTION:</span>
            <span className="text-[#ff00ff] font-bold text-sm">
              {districts.filter((d) => d.online).reduce((sum, d) => sum + d.mw, 0)} MW
            </span>
          </div>
        </div>

        {/* Orbital Spy Satellite Uplink */}
        <div
          className="p-4 rounded-xl border border-[#3a0ca3]/60 relative overflow-hidden flex flex-col gap-2.5"
          style={{ backgroundColor: 'rgba(14, 2, 28, 0.88)' }}
        >
          <div className="flex items-center justify-between border-b border-[#3a0ca3]/40 pb-1.5">
            <div className="flex items-center gap-2">
              <Satellite className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-xs font-orbitron tracking-widest text-cyan-300">
                ORBITAL SATELLITE UPLINK // KANG-TAO ORBITAL-07
              </span>
            </div>
            <span className="text-[10px] text-slate-400">POLAR ORBIT: 480 KM</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                <span>DISH AZIMUTH:</span>
                <span className="text-cyan-300 font-bold">{azimuth}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={azimuth}
                onChange={(e) => setAzimuth(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                <span>DISH ELEVATION:</span>
                <span className="text-[#ff00ff] font-bold">{elevation}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                value={elevation}
                onChange={(e) => setElevation(parseFloat(e.target.value))}
                className="w-full accent-[#ff00ff]"
              />
            </div>
          </div>

          <div className="bg-black/80 p-2 rounded border border-white/10 text-[10px] text-emerald-400 break-all">
            {interceptedMsg}
          </div>
        </div>
      </div>

      {/* =========================================================================
          RIGHT WIDGET: AUTONOMOUS SECURITY DRONE SWARM COMMAND
          ========================================================================= */}
      <div className="col-span-12 lg:col-span-6 flex flex-col gap-3">
        <div
          className="p-4 rounded-xl border border-[#ff00ff]/50 relative overflow-hidden flex flex-col gap-3 h-full cyber-card-interactive"
          style={{
            backgroundColor: 'rgba(14, 2, 28, 0.88)',
            boxShadow: '0 0 25px rgba(114, 9, 183, 0.25)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#ff00ff]/30 pb-2">
            <div className="flex items-center gap-2">
              <Crosshair className="w-5 h-5 text-[#ff00ff]" />
              <span className="font-extrabold text-sm uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] via-[#7209b7] to-cyan-400 font-orbitron tracking-widest">
                AUTONOMOUS SECURITY DRONE SWARM COMMAND
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-fuchsia-950 text-[#ff00ff] border border-[#ff00ff]/40 font-bold">
              SWARM ACTIVE (4/4)
            </span>
          </div>

          {/* Drones Roster */}
          <div className="space-y-2">
            {drones.map((drone) => (
              <div
                key={drone.id}
                className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
                  drone.alert ? 'bg-rose-950/30 border-rose-500/60' : 'bg-black/60 border-white/10'
                }`}
              >
                <div>
                  <div className="font-bold text-xs text-white flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${drone.alert ? 'bg-rose-500 animate-ping' : 'bg-cyan-400'}`} />
                    <span>{drone.id} [{drone.callsign}]</span>
                  </div>
                  <div className="text-[9px] text-slate-400 mt-0.5">
                    ALT: {drone.alt} • BATTERY: {drone.bat}% • {drone.target}
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                    drone.alert ? 'bg-rose-500 text-white' : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                  }`}>
                    {drone.alert ? 'ALERT LOCK' : 'PATROL'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Action Trigger */}
          <div className="mt-auto pt-2 border-t border-white/10 space-y-2">
            <button
              onClick={handleDeployDrones}
              className="w-full py-3 rounded-lg font-black font-orbitron tracking-widest text-xs uppercase bg-gradient-to-r from-[#ff00ff] to-[#3a0ca3] text-white shadow-[0_0_20px_rgba(255,0,255,0.4)] hover:brightness-125 transition-all"
            >
              DEPLOY DRONE STRIKE INTERCEPTION PROTOCOL
            </button>
            <div className="flex justify-between text-[9px] text-slate-400 px-1">
              <span>TARGET COORDINATES: 35.6895° N, 139.6917° E</span>
              <span className="text-[#ff00ff]">INTERCEPT TIME: 14s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
