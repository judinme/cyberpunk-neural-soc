import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Radio, Server, Network, AlertOctagon, Crosshair } from 'lucide-react';

const MESH_NODES = [
  { id: 'NODE-01', name: 'UAQ-WORKSTATION', ip: '100.64.0.1', role: 'Local LLM & Dev Core', ping: '1.2ms', status: 'ONLINE', r: 0.38, theta: 0.8 },
  { id: 'NODE-02', name: 'HETZNER-VPS', ip: '100.64.0.14', role: 'BGP / XDP Firewall', ping: '24.8ms', status: 'ONLINE', r: 0.65, theta: 2.4 },
  { id: 'NODE-03', name: 'TRUENAS-SCALE', ip: '100.64.0.28', role: 'ZFS RAID-Z3 / Vector DB', ping: '4.6ms', status: 'ONLINE', r: 0.52, theta: 3.8 },
  { id: 'NODE-04', name: 'ASIC-RIG-01', ip: '100.64.0.99', role: 'vLLM Distributed Node', ping: '8.1ms', status: 'ONLINE', r: 0.78, theta: 5.4 },
];

export default function ThreatRadar({
  theme,
  telemetry,
  isDefcon,
  onToggleDefcon,
  activeNode,
  onSelectNode
}) {
  const [droppedSockets, setDroppedSockets] = useState({});
  const radarCanvasRef = useRef(null);

  const sockets = [
    { id: 'sock-1', remote: '100.64.0.14:51820', proto: 'UDP/WG', state: 'ESTABLISHED', pps: '84.2k', ping: '24ms', anomaly: false },
    { id: 'sock-2', remote: '185.220.101.7:22', proto: 'TCP/SYN', state: isDefcon ? 'XDP_DROPPED' : 'SYN_FLOOD', pps: isDefcon ? '0' : '412.5k', ping: '98ms', anomaly: true, r: 0.68, theta: 4.8 },
    { id: 'sock-3', remote: '100.64.0.28:6333', proto: 'TCP/HTTP', state: 'ESTABLISHED', pps: '12.4k', ping: '4ms', anomaly: false },
    { id: 'sock-4', remote: '100.64.0.99:8000', proto: 'TCP/vLLM', state: 'ESTABLISHED', pps: '56.1k', ping: '8ms', anomaly: false },
  ];

  const handleDropManual = (id) => {
    setDroppedSockets((prev) => ({ ...prev, [id]: true }));
  };

  // =========================================================================
  // AUTHENTIC RADIAL PHOSPHOR CRT RADAR CANVAS WITH PERSISTENCE DECAY
  // =========================================================================
  useEffect(() => {
    const canvas = radarCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let sweepAngle = 0;
    const sweepSpeed = 0.032; // rad per frame

    // Phosphor blip activation memories
    const blipActivations = {
      'NODE-01': 0.5,
      'NODE-02': 0.3,
      'NODE-03': 0.4,
      'NODE-04': 0.6,
      'sock-2': 0.9,
    };

    const pingWaves = [];

    const renderRadar = () => {
      sweepAngle = (sweepAngle + sweepSpeed) % (Math.PI * 2);

      const w = canvas.width;
      const h = canvas.height;
      const cx = w * 0.5;
      const cy = h * 0.5;
      const maxRadius = Math.min(cx, cy) * 0.92;

      // 1. CRT Background with subtle phosphor green/cyan tint
      ctx.fillStyle = '#02050c';
      ctx.fillRect(0, 0, w, h);

      // Radial scope background glow
      const scopeGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, maxRadius);
      scopeGrad.addColorStop(0, isDefcon ? 'rgba(239, 68, 68, 0.12)' : 'rgba(0, 245, 212, 0.08)');
      scopeGrad.addColorStop(0.8, isDefcon ? 'rgba(239, 68, 68, 0.04)' : 'rgba(0, 187, 249, 0.04)');
      scopeGrad.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
      ctx.fillStyle = scopeGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, maxRadius, 0, Math.PI * 2);
      ctx.fill();

      // 2. Concentric Range Rings (10km, 25km, 50km)
      ctx.lineWidth = 1;
      const rings = [0.33, 0.66, 1.0];
      rings.forEach((rFrac) => {
        ctx.strokeStyle = isDefcon ? 'rgba(239, 68, 68, 0.25)' : 'rgba(0, 245, 212, 0.22)';
        ctx.beginPath();
        ctx.arc(cx, cy, maxRadius * rFrac, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Crosshairs & Bearing ticks
      ctx.strokeStyle = isDefcon ? 'rgba(239, 68, 68, 0.3)' : 'rgba(0, 245, 212, 0.25)';
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(cx - maxRadius, cy);
      ctx.lineTo(cx + maxRadius, cy);
      ctx.moveTo(cx, cy - maxRadius);
      ctx.lineTo(cx, cy + maxRadius);
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Sweeping Beam with Phosphor Gradient Wedge Tail
      ctx.save();
      const wedgeAngle = Math.PI * 0.35; // 63 degree decay trail
      const wedgeSegments = 24;
      for (let i = 0; i < wedgeSegments; i++) {
        const segAngle = sweepAngle - (wedgeAngle * (i / wedgeSegments));
        const alpha = Math.pow(1 - (i / wedgeSegments), 2.2) * (isDefcon ? 0.35 : 0.28);
        ctx.strokeStyle = isDefcon
          ? `rgba(239, 68, 68, ${alpha})`
          : `rgba(0, 245, 212, ${alpha})`;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(segAngle) * maxRadius, cy + Math.sin(segAngle) * maxRadius);
        ctx.stroke();
      }

      // Bright leading sweep needle
      ctx.strokeStyle = isDefcon ? '#ff2a6d' : '#00ffff';
      ctx.lineWidth = 2;
      ctx.shadowColor = isDefcon ? '#ef4444' : '#00f5d4';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(sweepAngle) * maxRadius, cy + Math.sin(sweepAngle) * maxRadius);
      ctx.stroke();
      ctx.restore();

      // 4. Target Blips Plotted at Polar Coordinates
      const allTargets = [
        ...MESH_NODES.map((n) => ({ ...n, type: 'node' })),
        { id: 'sock-2', name: '185.220.101.7', r: 0.68, theta: 4.8, type: 'threat' }
      ];

      allTargets.forEach((target) => {
        const bx = cx + Math.cos(target.theta) * (maxRadius * target.r);
        const by = cy + Math.sin(target.theta) * (maxRadius * target.r);

        // Check if sweep beam passes over target
        let angleDiff = sweepAngle - target.theta;
        while (angleDiff < 0) angleDiff += Math.PI * 2;
        while (angleDiff >= Math.PI * 2) angleDiff -= Math.PI * 2;

        if (angleDiff < 0.08) {
          blipActivations[target.id] = 1.0;
          // Spawn expanding ping wave
          if (pingWaves.length < 12) {
            pingWaves.push({ x: bx, y: by, r: 2, maxR: 20, alpha: 1.0, color: target.type === 'threat' ? '#ff2a6d' : '#00f5d4' });
          }
        } else {
          // Exponential phosphor decay
          blipActivations[target.id] = Math.max(0.15, (blipActivations[target.id] || 0.2) * 0.988);
        }

        const act = blipActivations[target.id];

        ctx.save();
        if (target.type === 'threat') {
          // Anomalous Threat Blip
          ctx.fillStyle = `rgba(239, 68, 68, ${act})`;
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = act * 14;

          // Blip circle
          ctx.beginPath();
          ctx.arc(bx, by, 3.5 + act * 2, 0, Math.PI * 2);
          ctx.fill();

          // DEFCON 1 Tracking Reticle Box
          if (isDefcon) {
            ctx.strokeStyle = '#ff2a6d';
            ctx.lineWidth = 1.5;
            const bSize = 8 + Math.sin(Date.now() * 0.008) * 2;
            ctx.strokeRect(bx - bSize, by - bSize, bSize * 2, bSize * 2);

            // Vector heading track line
            ctx.beginPath();
            ctx.moveTo(bx, by);
            ctx.lineTo(bx + Math.cos(target.theta - 1.2) * 16, by + Math.sin(target.theta - 1.2) * 16);
            ctx.stroke();

            // Threat Label
            ctx.font = '8px monospace';
            ctx.fillStyle = '#ff2a6d';
            ctx.fillText('ANOMALY // XDP DROP', bx + 12, by - 4);
          }
        } else {
          // Friendly Mesh Node Blip
          ctx.fillStyle = target.id === activeNode ? '#00f5d4' : `rgba(0, 187, 249, ${act})`;
          ctx.shadowColor = '#00f5d4';
          ctx.shadowBlur = act * 10;
          ctx.beginPath();
          ctx.arc(bx, by, 3 + act * 1.5, 0, Math.PI * 2);
          ctx.fill();

          // Mini Node Label
          ctx.font = '7px monospace';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fillText(target.id, bx + 6, by + 3);
        }
        ctx.restore();
      });

      // 5. Render Expanding Radar Ping Shockwaves
      for (let i = pingWaves.length - 1; i >= 0; i--) {
        const pw = pingWaves[i];
        pw.r += 0.8;
        pw.alpha -= 0.035;
        if (pw.alpha <= 0 || pw.r >= pw.maxR) {
          pingWaves.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.strokeStyle = pw.color;
        ctx.globalAlpha = Math.max(0, pw.alpha);
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(pw.x, pw.y, pw.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 6. Outer Metallic Bezel Ring with Degree Labels
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, maxRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.font = '7px monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.textAlign = 'center';
      ctx.fillText('000°', cx, cy - maxRadius - 2);
      ctx.fillText('090°', cx + maxRadius + 12, cy + 2);
      ctx.fillText('180°', cx, cy + maxRadius + 9);
      ctx.fillText('270°', cx - maxRadius - 12, cy + 2);

      animId = requestAnimationFrame(renderRadar);
    };

    renderRadar();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isDefcon, activeNode]);

  return (
    <div
      className="p-3.5 rounded-xl backdrop-blur-md border cyber-card-interactive flex flex-col gap-3 relative overflow-hidden"
      style={{
        backgroundColor: theme.card,
        borderColor: isDefcon ? '#ef4444' : theme.cardBorder,
        boxShadow: isDefcon ? '0 0 25px rgba(239,68,68,0.35)' : `0 0 20px ${theme.glow}`,
      }}
    >
      {/* Header with DEFCON 1 Action Button */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-fuchsia-400" />
          <h3 className="text-xs font-bold font-orbitron tracking-wider uppercase text-slate-100 flex items-center gap-1.5">
            <span>MULTI-NODE MESH &amp; eBPF THREAT RADAR</span>
          </h3>
        </div>

        {/* DEFCON 1 Lockdown Toggle Button */}
        <button
          onClick={onToggleDefcon}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold font-mono tracking-widest transition-all ${
            isDefcon
              ? 'bg-rose-600 text-white border border-rose-400 shadow-[0_0_15px_#ef4444] animate-pulse'
              : 'bg-rose-950/40 text-rose-300 border border-rose-700/50 hover:bg-rose-900/60'
          }`}
        >
          <AlertOctagon className="w-3.5 h-3.5" />
          {isDefcon ? 'DEFCON 1 ACTIVE' : 'ENGAGE DEFCON 1'}
        </button>
      </div>

      {/* Main Radar Grid: Canvas Scope on Left, Mesh Nodes on Right */}
      <div className="grid grid-cols-12 gap-3 items-center">
        {/* Radial Phosphor CRT Scope Canvas */}
        <div className="col-span-12 sm:col-span-5 flex flex-col items-center justify-center p-2 rounded-lg bg-black/60 border border-white/10 relative">
          <canvas
            ref={radarCanvasRef}
            width={220}
            height={200}
            className="w-full max-w-[220px] h-[190px] object-contain"
          />
          <div className="flex items-center justify-between w-full text-[8px] font-mono text-slate-400 mt-1 px-1">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              RANGE: 50 KM
            </span>
            <span>BEARING: 360° SWEEP</span>
          </div>
        </div>

        {/* Right: 4 Switchable Mesh Nodes Selection Bar & Telemetry */}
        <div className="col-span-12 sm:col-span-7 flex flex-col gap-2">
          <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>TAILSCALE / WIREGUARD TOPOLOGY</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse" /> 4 NODES SYNCED
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {MESH_NODES.map((node) => {
              const isActive = activeNode === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => onSelectNode(node.id)}
                  className={`p-2 rounded border text-left font-mono transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-500/20 border-cyan-400/80 shadow-[0_0_10px_rgba(0,245,212,0.3)]'
                      : 'bg-black/40 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-bold ${isActive ? 'text-cyan-300' : 'text-slate-300'}`}>
                      {node.id}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-[9px] font-semibold text-white truncate mt-0.5">
                    {node.name}
                  </div>
                  <div className="flex items-center justify-between text-[7px] text-slate-400 mt-1">
                    <span>{node.ip}</span>
                    <span className="text-cyan-400">{node.ping}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* eBPF & SoftIRQ Packet Rate Telemetry Bar */}
          <div className="grid grid-cols-4 gap-1.5 bg-black/50 p-2 rounded border border-white/5 font-mono text-center">
            <div>
              <span className="text-[7px] text-slate-400 block">SOFTIRQ PPS</span>
              <span className="text-xs font-bold text-cyan-300">
                {(telemetry.softirqPps ? (telemetry.softirqPps / 1000).toFixed(1) : '142.8')}k
              </span>
            </div>
            <div>
              <span className="text-[7px] text-slate-400 block">XDP RING DROPS</span>
              <span className={`text-xs font-bold ${isDefcon ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                {isDefcon ? '184.2k/s' : '0/s'}
              </span>
            </div>
            <div>
              <span className="text-[7px] text-slate-400 block">TCP RETRANS</span>
              <span className="text-xs font-bold text-amber-300">
                {telemetry.tcpRetransmits || 4}
              </span>
            </div>
            <div>
              <span className="text-[7px] text-slate-400 block">NAPI SQUEEZE</span>
              <span className="text-xs font-bold text-slate-300">
                {telemetry.napiTimeSqueeze || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Kernel Sockets & Threat Radar Table */}
      <div className="space-y-1">
        <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
          <span>ACTIVE INGRESS / EGRESS SOCKETS</span>
          <span className="text-[9px] text-slate-500">eBPF RING-BUFFER</span>
        </div>

        <div className="border border-white/10 rounded-lg overflow-hidden bg-black/60 font-mono text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[9px] text-slate-400 uppercase tracking-wider">
                <th className="py-1 px-2">REMOTE ENDPOINT</th>
                <th className="py-1 px-2">PROTOCOL</th>
                <th className="py-1 px-2">PPS</th>
                <th className="py-1 px-2">STATE</th>
                <th className="py-1 px-2 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[10px]">
              {sockets.map((sock) => {
                const isDropped = (isDefcon && sock.anomaly) || droppedSockets[sock.id];
                return (
                  <tr
                    key={sock.id}
                    className={`transition-colors ${
                      sock.anomaly
                        ? (isDropped ? 'bg-slate-900/40 text-slate-500' : 'bg-rose-950/30 text-rose-200 animate-pulse')
                        : 'hover:bg-white/5 text-slate-200'
                    }`}
                  >
                    <td className="py-1.5 px-2 font-semibold">
                      <div className="flex items-center gap-1.5">
                        {sock.anomaly ? (
                          <ShieldAlert className={`w-3 h-3 ${isDropped ? 'text-slate-500' : 'text-rose-500'}`} />
                        ) : (
                          <Server className="w-3 h-3 text-cyan-400" />
                        )}
                        <span>{sock.remote}</span>
                      </div>
                    </td>
                    <td className="py-1.5 px-2 text-slate-400">{sock.proto}</td>
                    <td className="py-1.5 px-2 font-mono text-cyan-300">{sock.pps}</td>
                    <td className="py-1.5 px-2">
                      <span
                        className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${
                          isDropped
                            ? 'bg-rose-950/80 text-rose-400 border border-rose-600/50'
                            : (sock.anomaly ? 'bg-rose-600 text-white' : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40')
                        }`}
                      >
                        {isDropped ? 'XDP_DROP' : sock.state}
                      </span>
                    </td>
                    <td className="py-1.5 px-2 text-right">
                      {sock.anomaly && !isDropped ? (
                        <button
                          onClick={() => handleDropManual(sock.id)}
                          className="px-1.5 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-[8px] font-bold tracking-wider"
                        >
                          DROP
                        </button>
                      ) : (
                        <span className="text-[8px] text-slate-500 flex items-center justify-end gap-1">
                          <Crosshair className="w-2.5 h-2.5 text-cyan-400" /> MONITOR
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
