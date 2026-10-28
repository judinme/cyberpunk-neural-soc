import React, { useState } from 'react';
import { Activity, Zap, XCircle, RotateCcw, Layers } from 'lucide-react';
import { cyberAudio } from './audio';

export default function ProcessMatrix({
  theme,
  isDefcon,
  onSendCommand
}) {
  const [processes, setProcesses] = useState([
    {
      pid: 4109,
      name: 'ollama-runner',
      type: 'AI Engine',
      nice: 0,
      cpu: 34.2,
      mem: '14.2 GB VRAM',
      io: '1.2 GB/s DMA',
      stages: ['NVMe', 'DDR5', 'CPU', 'GPU'],
      status: 'RUNNING',
    },
    {
      pid: 1842,
      name: 'ebpf-xdp-router',
      type: 'Net Kernel',
      nice: -15,
      cpu: 4.8,
      mem: '128 MB RAM',
      io: '142k pps XDP',
      stages: ['XDP', 'CPU'],
      status: 'RUNNING',
    },
    {
      pid: 6204,
      name: 'qdrant-vectordb',
      type: 'Docker Vector DB',
      nice: 0,
      cpu: 12.1,
      mem: '6.4 GB RAM',
      io: '480 MB/s NVMe',
      stages: ['NVMe', 'DDR5', 'CPU'],
      status: 'RUNNING',
    },
    {
      pid: 7731,
      name: 'vllm-kv-worker',
      type: 'AI Worker',
      nice: -5,
      cpu: 28.5,
      mem: '6.2 GB VRAM',
      io: '840 MB/s PCIe',
      stages: ['DDR5', 'CPU', 'GPU'],
      status: 'RUNNING',
    },
    {
      pid: 3095,
      name: 'postgres-wal',
      type: 'Storage DB',
      nice: 0,
      cpu: 6.3,
      mem: '1.8 GB RAM',
      io: '840 MB/s NVMe',
      stages: ['NVMe', 'DDR5', 'CPU'],
      status: 'RUNNING',
    },
  ]);

  const STAGES = ['NVMe', 'XDP', 'DDR5', 'CPU', 'GPU'];

  const handleBoost = (pid) => {
    cyberAudio.playBoostSound();
    setProcesses((prev) =>
      prev.map((p) => {
        if (p.pid === pid) {
          return { ...p, nice: -10, status: 'BOOSTED' };
        }
        return p;
      })
    );
    if (onSendCommand) {
      onSendCommand({ action: 'RENICE_PID', pid, nice: -10 });
    }
  };

  const handleKill = (pid) => {
    cyberAudio.playKillSound();
    setProcesses((prev) =>
      prev.map((p) => {
        if (p.pid === pid) {
          return { ...p, status: 'TERMINATED', cpu: 0, io: '0 MB/s' };
        }
        return p;
      })
    );
    if (onSendCommand) {
      onSendCommand({ action: 'KILL_PID', pid });
    }
  };

  const handleRespawn = (pid) => {
    cyberAudio.playChirp();
    setProcesses((prev) =>
      prev.map((p) => {
        if (p.pid === pid) {
          return { ...p, status: 'RUNNING', cpu: Math.round(15 + Math.random() * 20), nice: 0 };
        }
        return p;
      })
    );
  };

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
          <Activity className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold font-orbitron tracking-wider uppercase text-slate-100 flex items-center gap-1.5">
            <span>PROCESS &amp; 5-STAGE DMA PIPELINE MATRIX</span>
          </h3>
        </div>
        <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold tracking-widest uppercase bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
          BI-DIRECTIONAL IPC
        </span>
      </div>

      {/* 5-Stage DMA Pipeline Legend Banner */}
      <div className="flex items-center justify-between bg-black/50 px-2.5 py-1.5 rounded border border-white/5 font-mono text-[9px] text-slate-400">
        <span className="flex items-center gap-1 text-slate-300">
          <Layers className="w-3 h-3 text-cyan-400" />
          DMA PIPELINE:
        </span>
        <div className="flex items-center gap-1">
          {STAGES.map((stg, i) => (
            <React.Fragment key={stg}>
              <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-cyan-300 font-bold">
                {stg}
              </span>
              {i < STAGES.length - 1 && <span className="text-slate-600">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Process Table with 5-Stage DMA Pills */}
      <div className="border border-white/10 rounded-lg overflow-hidden bg-black/60 font-mono text-xs">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-[9px] text-slate-400 uppercase tracking-wider">
              <th className="py-1 px-2">PROCESS (PID)</th>
              <th className="py-1 px-2">CPU / NICE</th>
              <th className="py-1 px-2">DMA PIPELINE ACTIVE</th>
              <th className="py-1 px-2">STATUS</th>
              <th className="py-1 px-2 text-right">CONTROLS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-[10px]">
            {processes.map((p) => {
              const isTerminated = p.status === 'TERMINATED';
              const isBoosted = p.status === 'BOOSTED';

              return (
                <tr
                  key={p.pid}
                  className={`transition-colors ${
                    isTerminated
                      ? 'bg-rose-950/20 text-slate-500 line-through'
                      : (isBoosted ? 'bg-cyan-950/20 text-slate-200' : 'hover:bg-white/5 text-slate-200')
                  }`}
                >
                  {/* Name and Type */}
                  <td className="py-1.5 px-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span className="font-bold text-white">{p.name}</span>
                      <span className="text-[8px] text-slate-500 font-mono">[{p.pid}]</span>
                    </div>
                    <div className="text-[8px] text-slate-400 pl-3">{p.type} • {p.mem}</div>
                  </td>

                  {/* CPU Load & Nice */}
                  <td className="py-1.5 px-2 font-mono">
                    <span className="font-bold text-slate-200">{p.cpu}%</span>
                    <span className={`text-[8px] ml-1 px-1 rounded ${p.nice < 0 ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-500'}`}>
                      nice {p.nice}
                    </span>
                  </td>

                  {/* 5-Stage DMA Pills */}
                  <td className="py-1.5 px-2">
                    <div className="flex items-center gap-1">
                      {STAGES.map((stage) => {
                        const isActive = p.stages.includes(stage) && !isTerminated;
                        return (
                          <span
                            key={stage}
                            className={`px-1 py-0.2 rounded text-[7px] font-bold ${
                              isActive
                                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/40'
                                : 'bg-slate-900 text-slate-600 border border-white/5'
                            }`}
                          >
                            {stage}
                          </span>
                        );
                      })}
                    </div>
                  </td>

                  {/* Status Pill */}
                  <td className="py-1.5 px-2">
                    <span
                      className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${
                        isTerminated
                          ? 'bg-rose-950/80 text-rose-400 border border-rose-500/40'
                          : (isBoosted
                            ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/50 shadow-[0_0_8px_rgba(0,245,212,0.4)]'
                            : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40')
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  {/* Control Buttons (BOOST & KILL) */}
                  <td className="py-1.5 px-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {isTerminated ? (
                        <button
                          onClick={() => handleRespawn(p.pid)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold"
                        >
                          <RotateCcw className="w-2.5 h-2.5" />
                          RESPAWN
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleBoost(p.pid)}
                            disabled={p.nice <= -10}
                            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-400/40 text-[9px] font-bold transition-all disabled:opacity-40"
                            title="Boost Scheduler Priority (nice -10)"
                          >
                            <Zap className="w-2.5 h-2.5" />
                            BOOST
                          </button>
                          <button
                            onClick={() => handleKill(p.pid)}
                            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-400/40 text-[9px] font-bold transition-all"
                            title="Terminate Process (SIGTERM)"
                          >
                            <XCircle className="w-2.5 h-2.5" />
                            KILL
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
