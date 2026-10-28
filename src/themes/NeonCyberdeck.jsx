import React, { useState, useEffect, useRef } from 'react';
import { Binary, Key, Sparkles } from 'lucide-react';
import { cyberAudio } from '../audio';

export default function NeonCyberdeck({
  isDefcon,
}) {
  // Hex Editor Memory State
  const memoryOffset = '0x7FFF84A0';
  const [selectedByte, setSelectedByte] = useState(12);
  const [hexBytes, setHexBytes] = useState([
    '48', '89', 'E5', '48', '83', 'EC', '20', 'C7', '45', 'FC', '00', '00', '00', '00', '8B', '45',
    '7F', '45', '4C', '46', '02', '01', '01', '00', '00', '00', '00', '00', '00', '00', '00', '00',
    'B8', '01', '00', '00', '00', 'BF', '01', '00', '00', '00', '0F', '05', 'C3', '90', '90', '90',
    '55', '48', '89', 'E5', '48', '8D', '3D', 'B4', '0E', '00', '00', 'E8', 'D7', 'FE', 'FF', 'FF',
  ]);

  // Synapse Flow Canvas
  const canvasRef = useRef(null);
  const [synapseVelocity, setSynapseVelocity] = useState(1.2);
  const [activeSynapsesCount, setActiveSynapsesCount] = useState(240);

  // Cipher Cracker State
  const targetHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
  const [isCracking, setIsCracking] = useState(false);
  const [crackedPayload, setCrackedPayload] = useState(null);
  const [entropy, setEntropy] = useState(7.94);

  // Mutate byte on click
  const handleByteClick = (idx) => {
    cyberAudio.playChirp('click');
    setSelectedByte(idx);
    const newBytes = [...hexBytes];
    const randHex = Math.floor(Math.random() * 255).toString(16).toUpperCase().padStart(2, '0');
    newBytes[idx] = randHex;
    setHexBytes(newBytes);
  };

  // Run Cipher Cracker
  const handleCrackCipher = () => {
    cyberAudio.playBoostSound();
    setIsCracking(true);
    setCrackedPayload(null);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setEntropy((prev) => Math.max(1.2, +(prev - 0.5).toFixed(2)));
      if (progress >= 100) {
        clearInterval(interval);
        setIsCracking(false);
        setCrackedPayload('DECRYPTED: ARASAKA_KEY_0x7F9B // ACCESS_LEVEL: ROOT_ADMIN');
      }
    }, 120);
  };

  // Synapse Bioluminescent Canvas Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let t = 0;

    // Generate neuron nodes
    const nodes = [];
    for (let i = 0; i < 48; i++) {
      nodes.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.002,
        vy: (Math.random() - 0.5) * 0.002,
        size: Math.random() * 3 + 1.5,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    const render = () => {
      t += 0.02 * synapseVelocity;
      const w = canvas.width = canvas.offsetWidth;
      const h = canvas.height = canvas.offsetHeight;

      ctx.fillStyle = '#06010f';
      ctx.fillRect(0, 0, w, h);

      // Draw connecting dendrites
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = (nodes[i].x - nodes[j].x) * w;
          const dy = (nodes[i].y - nodes[j].y) * h;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.45;
            ctx.strokeStyle = isDefcon
              ? `rgba(239, 68, 68, ${alpha})`
              : (i % 2 === 0 ? `rgba(255, 0, 127, ${alpha})` : `rgba(0, 245, 212, ${alpha})`);

            ctx.beginPath();
            ctx.moveTo(nodes[i].x * w, nodes[i].y * h);
            ctx.lineTo(nodes[j].x * w, nodes[j].y * h);
            ctx.stroke();

            // Synaptic action potential pulse
            if (Math.sin(t * 3 + i) > 0.7) {
              const pulsePos = (t * 2 + i) % 1;
              const px = nodes[i].x * w + (nodes[j].x * w - nodes[i].x * w) * pulsePos;
              const py = nodes[i].y * h + (nodes[j].y * h - nodes[i].y * h) * pulsePos;
              ctx.fillStyle = '#ffffff';
              ctx.shadowColor = '#ff007f';
              ctx.shadowBlur = 8;
              ctx.beginPath();
              ctx.arc(px, py, 2.2, 0, Math.PI * 2);
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        }
      }

      // Draw nodes
      nodes.forEach((n, idx) => {
        n.x += n.vx * synapseVelocity;
        n.y += n.vy * synapseVelocity;
        if (n.x < 0 || n.x > 1) n.vx *= -1;
        if (n.y < 0 || n.y > 1) n.vy *= -1;

        const nx = n.x * w;
        const ny = n.y * h;
        const glow = Math.sin(t * 2 + n.pulse) * 0.4 + 0.6;

        ctx.fillStyle = isDefcon ? '#ef4444' : (idx % 2 === 0 ? '#ff007f' : '#00f5d4');
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 10 * glow;
        ctx.beginPath();
        ctx.arc(nx, ny, n.size * glow, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [synapseVelocity, isDefcon]);

  // Click canvas to inject action potential
  const handleCanvasClick = () => {
    cyberAudio.playChirp('click');
    setSynapseVelocity((prev) => Math.min(3.0, prev + 0.5));
    setTimeout(() => setSynapseVelocity(1.2), 1500);
  };

  return (
    <div className="grid grid-cols-12 gap-3 w-full font-mono">
      {/* =========================================================================
          LEFT WIDGET: LIVE MEMORY HEX EDITOR & DECOMPILER
          ========================================================================= */}
      <div className="col-span-12 lg:col-span-6 flex flex-col gap-3">
        <div
          className="p-4 rounded-xl backdrop-blur-md border border-fuchsia-500/40 relative overflow-hidden flex flex-col gap-3 cyber-card-interactive"
          style={{
            backgroundColor: 'rgba(15, 5, 30, 0.88)',
            boxShadow: '0 0 25px rgba(255, 0, 127, 0.25)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-fuchsia-500/30 pb-2">
            <div className="flex items-center gap-2">
              <Binary className="w-4 h-4 text-fuchsia-400" />
              <span className="font-bold text-xs font-orbitron tracking-widest text-fuchsia-300">
                LIVE MEMORY DECOMPILER // HEX MATRIX
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="text-slate-400">BASE:</span>
              <span className="px-2 py-0.5 rounded bg-fuchsia-950/80 text-fuchsia-300 border border-fuchsia-600/50">
                {memoryOffset}
              </span>
            </div>
          </div>

          {/* Interactive Hex Dump Grid */}
          <div className="bg-black/80 rounded-lg p-3 border border-white/10 text-xs">
            <div className="flex justify-between text-[9px] text-slate-500 border-b border-white/10 pb-1 mb-2">
              <span>OFFSET</span>
              <span>00 01 02 03 04 05 06 07  08 09 0A 0B 0C 0D 0E 0F</span>
              <span>ASCII DECODE</span>
            </div>

            {/* Rows of 16 Bytes */}
            {[0, 16, 32, 48].map((rowOffset) => {
              const rowBytes = hexBytes.slice(rowOffset, rowOffset + 16);
              const ascii = rowBytes
                .map((b) => {
                  const code = parseInt(b, 16);
                  return code >= 32 && code <= 126 ? String.fromCharCode(code) : '.';
                })
                .join('');

              return (
                <div key={rowOffset} className="flex items-center justify-between py-0.5 font-mono text-[11px]">
                  <span className="text-cyan-400 select-none">
                    +0x{(rowOffset).toString(16).toUpperCase().padStart(2, '0')}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {rowBytes.map((b, byteIdx) => {
                      const absoluteIdx = rowOffset + byteIdx;
                      const isSelected = selectedByte === absoluteIdx;
                      return (
                        <button
                          key={byteIdx}
                          onClick={() => handleByteClick(absoluteIdx)}
                          className={`w-5 text-center rounded transition-all ${
                            isSelected
                              ? 'bg-fuchsia-500 text-white font-bold shadow-[0_0_8px_#ff007f]'
                              : 'text-slate-300 hover:text-cyan-300 hover:bg-white/10'
                          }`}
                        >
                          {b}
                        </button>
                      );
                    })}
                  </div>

                  <span className="text-emerald-400 font-mono tracking-widest text-[10px]">
                    {ascii}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Real-Time Disassembly Stream */}
          <div className="bg-black/60 p-2.5 rounded-lg border border-white/5 text-[10px] space-y-1">
            <div className="text-slate-400 text-[8px] uppercase tracking-wider flex items-center justify-between">
              <span>DISASSEMBLED INSTRUCTION OPCODES</span>
              <span className="text-cyan-400">ARCH: x86_64</span>
            </div>
            <div className="text-cyan-300 font-mono">0x7FFF84A0:  mov rbp, rsp           ; establish stack frame</div>
            <div className="text-fuchsia-300 font-mono">0x7FFF84A3:  sub rsp, 0x20          ; allocate 32-byte DMA buffer</div>
            <div className="text-emerald-300 font-mono">0x7FFF84A7:  mov dword [rbp-4], 0   ; initialize mutex lock</div>
            <div className="text-amber-300 font-mono">0x7FFF84B0:  syscall                ; eBPF ring-buffer dispatch</div>
          </div>
        </div>

        {/* Cryptographic Cipher Cracker */}
        <div
          className="p-4 rounded-xl backdrop-blur-md border border-cyan-500/40 relative overflow-hidden flex flex-col gap-2.5"
          style={{ backgroundColor: 'rgba(15, 5, 30, 0.88)' }}
        >
          <div className="flex items-center justify-between border-b border-cyan-500/30 pb-1.5">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-xs font-orbitron tracking-widest text-cyan-300">
                CIPHER CRACKER // SHA-256 KEY DECRYPTOR
              </span>
            </div>
            <span className="text-[10px] text-slate-400">ENTROPY: {entropy} bits</span>
          </div>

          <div className="bg-black/70 p-2 rounded border border-white/10 text-[10px] text-slate-300 break-all font-mono">
            <span className="text-slate-500">TARGET: </span>{targetHash}
          </div>

          {crackedPayload && (
            <div className="p-2 rounded bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-[10px] font-bold animate-pulse">
              {crackedPayload}
            </div>
          )}

          <div className="flex items-center justify-between mt-1">
            <button
              onClick={handleCrackCipher}
              disabled={isCracking}
              className="px-4 py-1.5 rounded bg-gradient-to-r from-fuchsia-500 to-cyan-500 hover:brightness-125 text-white font-bold text-xs shadow-[0_0_12px_rgba(255,0,127,0.4)] disabled:opacity-50"
            >
              {isCracking ? 'BRUTE-FORCING AES-256...' : 'CRACK CIPHER KEYS'}
            </button>
            <span className="text-[9px] text-slate-400">ALGORITHM: AES-GCM-256</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          RIGHT WIDGET: BIOLUMINESCENT SYNAPSE NEURAL FLOW CANVAS
          ========================================================================= */}
      <div className="col-span-12 lg:col-span-6 flex flex-col gap-3">
        <div
          className="flex-1 min-h-[460px] p-4 rounded-xl backdrop-blur-md border border-cyan-500/40 relative overflow-hidden flex flex-col gap-3 shadow-2xl"
          style={{
            backgroundColor: 'rgba(15, 5, 30, 0.88)',
            boxShadow: '0 0 25px rgba(0, 245, 212, 0.25)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              <span className="font-bold text-xs font-orbitron tracking-widest text-cyan-300">
                SYNAPTIC NEURAL FLOW // BIO-LUMINESCENCE
              </span>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
              CLICK TO STIMULATE
            </span>
          </div>

          {/* Interactive Neural Canvas */}
          <div
            className="flex-1 w-full rounded-lg overflow-hidden relative cursor-pointer border border-white/10"
            onClick={handleCanvasClick}
          >
            <canvas ref={canvasRef} className="w-full h-full block" />
            <div className="absolute bottom-2 left-2 pointer-events-none text-[9px] text-slate-400 bg-black/60 px-2 py-1 rounded border border-white/10 font-mono">
              VELOCITY: {synapseVelocity.toFixed(1)}x • DENDRITES: {activeSynapsesCount}
            </div>
          </div>

          {/* Interactive Controls */}
          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-white/10 text-xs">
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>ACTION POTENTIAL VELOCITY:</span>
                <span className="text-cyan-300 font-bold">{synapseVelocity.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={synapseVelocity}
                onChange={(e) => setSynapseVelocity(parseFloat(e.target.value))}
                className="w-full accent-fuchsia-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>SYNAPSE ACTIVATIONS:</span>
                <span className="text-fuchsia-300 font-bold">{activeSynapsesCount} / sec</span>
              </div>
              <input
                type="range"
                min="100"
                max="500"
                step="10"
                value={activeSynapsesCount}
                onChange={(e) => setActiveSynapsesCount(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
