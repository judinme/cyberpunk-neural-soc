import React, { useState } from 'react';
import { X, Server, Terminal, Copy, Check, ShieldCheck, Zap, Cpu, Radio } from 'lucide-react';

export default function AgentModal({
  isOpen,
  onClose,
  wsStatus,
  wsUrl,
  onToggleConnect,
  socketLogs
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const runCommand = 'python aether_soc_agent.py';

  const handleCopy = () => {
    navigator.clipboard?.writeText(runCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        className="w-full max-w-3xl rounded-xl border border-cyan-500/40 bg-slate-950/95 shadow-[0_0_35px_rgba(0,245,212,0.3)] overflow-hidden flex flex-col font-mono text-xs text-slate-200"
        style={{ maxHeight: '90vh' }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <span className="font-bold font-orbitron tracking-wider text-white text-sm">
              BI-DIRECTIONAL PYTHON OS, RAPL &amp; eBPF AGENT
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Connection Status Banner */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-black/60 border border-white/10">
            <div className="flex items-center gap-3">
              <span
                className={`w-3 h-3 rounded-full ${
                  wsStatus === 'CONNECTED'
                    ? 'bg-emerald-400 shadow-[0_0_10px_#10b981] animate-pulse'
                    : 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                }`}
              />
              <div>
                <div className="font-bold text-white text-xs flex items-center gap-2">
                  <span>STATUS: {wsStatus}</span>
                  <span className="text-[10px] font-normal text-slate-400">({wsUrl})</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {wsStatus === 'CONNECTED'
                    ? 'Streaming real Linux powercap RAPL, eBPF kprobes & nvidia-smi telemetry.'
                    : 'Auto-fallback active: Synthetic high-fidelity kernel telemetry is keeping the cockpit 100% operational.'}
                </div>
              </div>
            </div>

            <button
              onClick={onToggleConnect}
              className={`px-3 py-1.5 rounded font-bold text-xs tracking-wider border transition-all ${
                wsStatus === 'CONNECTED'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 hover:bg-rose-500/40'
                  : 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 hover:bg-cyan-500/40 shadow-[0_0_10px_rgba(0,245,212,0.3)]'
              }`}
            >
              {wsStatus === 'CONNECTED' ? 'DISCONNECT' : 'RETRY CONNECT'}
            </button>
          </div>

          {/* Quick-Run Instructions */}
          <div className="bg-black/40 p-3 rounded-lg border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-slate-300 font-bold text-[11px]">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                HOW TO RUN THE KERNEL AGENT LOCALLY:
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-200 text-[10px]"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-cyan-400" />}
                {copied ? 'COPIED!' : 'COPY COMMAND'}
              </button>
            </div>

            <div className="bg-black/90 p-2.5 rounded border border-white/5 text-[11px] text-emerald-400 font-mono select-all">
              python aether_soc_agent.py
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed">
              The agent starts a WebSocket server on <code className="text-cyan-300">ws://127.0.0.1:8765</code>.
              It streams CPU microjoule counter deltas from <code className="text-cyan-300">/sys/class/powercap/intel-rapl</code>,
              SoftIRQ counters from <code className="text-cyan-300">/proc/net/softnet_stat</code>, and listens for bi-directional <code className="text-fuchsia-300">KILL_PID</code> and <code className="text-fuchsia-300">RENICE_PID</code> commands.
            </p>
          </div>

          {/* Kernel Subsystem Architecture Diagram */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-black/40 p-2.5 rounded-lg border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px]">
                <Cpu className="w-3.5 h-3.5" />
                <span>POWERCAP RAPL</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Monotonically increasing MSR hardware energy registers mapped into sysfs. Computes real silicon Watts over Δt.
              </p>
            </div>

            <div className="bg-black/40 p-2.5 rounded-lg border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-fuchsia-400 font-bold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>eBPF &amp; XDP HOOKS</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Attaches BCC kprobe to <code className="text-fuchsia-300">tcp_v4_conn_request</code>. Drops SYN floods before sk_buff memory allocation.
              </p>
            </div>

            <div className="bg-black/40 p-2.5 rounded-lg border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
                <Zap className="w-3.5 h-3.5" />
                <span>NVIDIA SMI TELEMETRY</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Queries NVML for SM clock speeds, memory usage, temperature, and board power consumption with sub-second polling.
              </p>
            </div>
          </div>

          {/* Bi-Directional WebSocket Log */}
          <div className="bg-black/70 rounded-lg p-2.5 border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px] border-b border-white/5 pb-1">
              <span className="flex items-center gap-1">
                <Radio className="w-3 h-3 text-cyan-400" />
                SOCKET INBOUND / OUTBOUND ACTIVITY
              </span>
              <span>PORT 8765</span>
            </div>
            <div className="h-24 overflow-y-auto space-y-0.5 text-[9px] font-mono">
              {socketLogs && socketLogs.length > 0 ? (
                socketLogs.map((log, i) => (
                  <div key={i} className="text-slate-300">
                    <span className="text-slate-500">[{log.time}]</span> {log.msg}
                  </div>
                ))
              ) : (
                <div className="text-slate-500 italic py-2">
                  No socket events yet. Connect agent or trigger BOOST/KILL actions to view bi-directional JSON RPC payloads.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 border-t border-white/10 bg-white/5 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
