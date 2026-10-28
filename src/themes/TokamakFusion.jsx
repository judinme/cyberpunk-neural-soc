import React, { useState, useEffect, useRef } from 'react';
import { Atom, Sparkles } from 'lucide-react';
import { cyberAudio } from '../audio';

export default function TokamakFusion() {
  const torusCanvasRef = useRef(null);

  // Tokamak Fusion State
  const [magneticTesla, setMagneticTesla] = useState(11.8); // 5 to 15 Tesla
  const [plasmaMegaKelvin, setPlasmaMegaKelvin] = useState(148.5); // MK
  const [deuteriumPurity, setDeuteriumPurity] = useState(99.4);

  // 8-Qubit Quantum State
  const [qubits, setQubits] = useState([
    { id: 0, state: 0, prob0: 1.0, prob1: 0.0, entangled: [1] },
    { id: 1, state: 0, prob0: 1.0, prob1: 0.0, entangled: [0] },
    { id: 2, state: 1, prob0: 0.0, prob1: 1.0, entangled: [] },
    { id: 3, state: 'super', prob0: 0.5, prob1: 0.5, entangled: [4] },
    { id: 4, state: 'super', prob0: 0.5, prob1: 0.5, entangled: [3] },
    { id: 5, state: 0, prob0: 0.8, prob1: 0.2, entangled: [] },
    { id: 6, state: 1, prob0: 0.1, prob1: 0.9, entangled: [] },
    { id: 7, state: 'super', prob0: 0.5, prob1: 0.5, entangled: [] },
  ]);

  // Inject Deuterium Fuel
  const handleInjectFuel = () => {
    cyberAudio.playNeuralSurge();
    setPlasmaMegaKelvin((prev) => Math.min(220, prev + 25));
    setTimeout(() => {
      setPlasmaMegaKelvin(148.5);
    }, 2500);
  };

  // Apply Quantum Gate (Hadamard, Pauli-X)
  const handleApplyGate = (qubitId, gateType) => {
    cyberAudio.playChirp('click');
    setQubits((prev) =>
      prev.map((q) => {
        if (q.id === qubitId) {
          if (gateType === 'H') {
            return { ...q, state: 'super', prob0: 0.5, prob1: 0.5 };
          } else if (gateType === 'X') {
            const next0 = q.prob1;
            const next1 = q.prob0;
            return { ...q, state: next1 > 0.5 ? 1 : 0, prob0: next0, prob1: next1 };
          }
        }
        return q;
      })
    );
  };

  // Canvas Torus Plasma Simulation
  useEffect(() => {
    const canvas = torusCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let t = 0;

    const render = () => {
      t += 0.025;
      const w = canvas.width = canvas.offsetWidth;
      const h = canvas.height = canvas.offsetHeight;
      const cx = w * 0.5;
      const cy = h * 0.5;

      ctx.fillStyle = '#06010a';
      ctx.fillRect(0, 0, w, h);

      // Magnetic Toroid Rings
      const R = Math.min(w, h) * 0.32; // Major radius
      const r = Math.min(w, h) * 0.14; // Minor radius

      ctx.lineWidth = 1.2;
      ctx.strokeStyle = '#7209b7';
      ctx.shadowColor = '#ff007f';
      ctx.shadowBlur = 12;

      // Draw 18 toroidal magnetic field coils
      for (let i = 0; i < 18; i++) {
        const phi = (i / 18) * Math.PI * 2 + t * 0.2;
        const coilCx = cx + R * Math.cos(phi);
        const coilCy = cy + (R * 0.45) * Math.sin(phi);

        ctx.beginPath();
        ctx.ellipse(coilCx, coilCy, r * 0.5, r, phi, 0, Math.PI * 2);
        ctx.stroke();
      }

      // High-temperature core plasma glow
      const plasmaGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, R + r);
      plasmaGrad.addColorStop(0, '#ffffff');
      plasmaGrad.addColorStop(0.3, '#ff007f');
      plasmaGrad.addColorStop(0.7, '#7209b7');
      plasmaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = plasmaGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.75, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="grid grid-cols-12 gap-3 w-full font-mono text-slate-100">
      {/* =========================================================================
          LEFT WIDGET: TOKAMAK MAGNETIC FUSION PLASMA ACCELERATOR
          ========================================================================= */}
      <div className="col-span-12 lg:col-span-6 flex flex-col gap-3">
        <div
          className="p-4 rounded-xl border border-[#ff007f]/50 relative overflow-hidden flex flex-col gap-3 cyber-card-interactive"
          style={{
            backgroundColor: 'rgba(25, 4, 38, 0.88)',
            boxShadow: '0 0 25px rgba(255, 0, 127, 0.3)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#ff007f]/30 pb-2">
            <div className="flex items-center gap-2">
              <Atom className="w-5 h-5 text-[#ff007f] animate-spin" />
              <span className="font-extrabold text-sm uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#d90429] via-[#ff007f] to-[#7209b7] font-orbitron tracking-widest">
                TOKAMAK MAGNETIC FUSION // PULSE CORE
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-[#ff007f] border border-[#ff007f]/40 font-bold">
              CONTAINMENT: 100%
            </span>
          </div>

          {/* Torus Canvas */}
          <div className="h-56 w-full rounded-lg overflow-hidden border border-white/10 relative">
            <canvas ref={torusCanvasRef} className="w-full h-full block" />
            <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded border border-white/10 text-[10px]">
              <span className="text-slate-400">PLASMA CORE: </span>
              <span className="text-[#ff007f] font-black">{plasmaMegaKelvin.toFixed(1)} MK</span>
            </div>
          </div>

          {/* Fusion Parameters & Fuel Injection */}
          <div className="grid grid-cols-2 gap-3 bg-black/60 p-3 rounded-lg border border-white/10 text-xs">
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>MAGNETIC CONFINEMENT:</span>
                <span className="text-[#ff007f] font-bold">{magneticTesla} Tesla</span>
              </div>
              <input
                type="range"
                min="5.0"
                max="15.0"
                step="0.2"
                value={magneticTesla}
                onChange={(e) => setMagneticTesla(parseFloat(e.target.value))}
                className="w-full accent-[#ff007f]"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>D-T FUEL PURITY:</span>
                <span className="text-emerald-400 font-bold">{deuteriumPurity}%</span>
              </div>
              <input
                type="range"
                min="90.0"
                max="100.0"
                step="0.1"
                value={deuteriumPurity}
                onChange={(e) => setDeuteriumPurity(parseFloat(e.target.value))}
                className="w-full accent-emerald-400"
              />
            </div>
          </div>

          <button
            onClick={handleInjectFuel}
            className="w-full py-2.5 rounded-lg font-black font-orbitron tracking-widest text-xs uppercase bg-gradient-to-r from-[#d90429] via-[#ff007f] to-[#7209b7] text-white shadow-[0_0_15px_rgba(255,0,127,0.4)] hover:brightness-125 transition-all"
          >
            INJECT DEUTERIUM-TRITIUM FUEL PULSE
          </button>
        </div>
      </div>

      {/* =========================================================================
          RIGHT WIDGET: 8-QUBIT QUANTUM ENTANGLEMENT CORE
          ========================================================================= */}
      <div className="col-span-12 lg:col-span-6 flex flex-col gap-3">
        <div
          className="p-4 rounded-xl border border-[#7209b7]/60 relative overflow-hidden flex flex-col gap-3 h-full cyber-card-interactive"
          style={{
            backgroundColor: 'rgba(25, 4, 38, 0.88)',
            boxShadow: '0 0 25px rgba(114, 9, 183, 0.3)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#7209b7]/30 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#7209b7] animate-pulse" />
              <span className="font-extrabold text-sm uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#7209b7] via-[#ff007f] to-[#d90429] font-orbitron tracking-widest">
                8-QUBIT QUANTUM ENTANGLEMENT CORE
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-[#7209b7] border border-[#7209b7]/40 font-bold">
              SUPERPOSITION: ACTIVE
            </span>
          </div>

          {/* 8 Qubits Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {qubits.map((q) => (
              <div
                key={q.id}
                className="bg-black/70 p-2.5 rounded-lg border border-white/10 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-[#ff007f]">q[{q.id}]</span>
                  <span className={`text-[8px] px-1.5 py-0.2 rounded font-bold ${
                    q.state === 'super' ? 'bg-[#7209b7]/40 text-[#ff007f] border border-[#ff007f]/40' : 'bg-white/10 text-slate-300'
                  }`}>
                    {q.state === 'super' ? '|ψ⟩ = α|0⟩+β|1⟩' : `|${q.state}⟩`}
                  </span>
                </div>

                <div className="space-y-0.5 text-[9px] text-slate-400 mb-2 font-mono">
                  <div className="flex justify-between">
                    <span>P(|0⟩): {(q.prob0 * 100).toFixed(0)}%</span>
                    <span>P(|1⟩): {(q.prob1 * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden flex">
                    <div className="bg-[#7209b7]" style={{ width: `${q.prob0 * 100}%` }} />
                    <div className="bg-[#ff007f]" style={{ width: `${q.prob1 * 100}%` }} />
                  </div>
                </div>

                {/* Gate Injectors */}
                <div className="flex items-center gap-1.5 justify-end">
                  <button
                    onClick={() => handleApplyGate(q.id, 'H')}
                    className="px-2 py-0.5 rounded bg-white/10 hover:bg-[#7209b7] text-white text-[9px] font-bold border border-white/10"
                    title="Apply Hadamard Gate (H)"
                  >
                    H-GATE
                  </button>
                  <button
                    onClick={() => handleApplyGate(q.id, 'X')}
                    className="px-2 py-0.5 rounded bg-white/10 hover:bg-[#ff007f] text-white text-[9px] font-bold border border-white/10"
                    title="Apply Pauli-X NOT Gate (X)"
                  >
                    X-NOT
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
