import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CYBERPUNK_PALETTES } from './themes';
import { cyberAudio } from './audio';
import CyberpunkSOC from './themes/CyberpunkSOC';
import NeonCyberdeck from './themes/NeonCyberdeck';
import Arasaka2077 from './themes/Arasaka2077';
import EdgerunnerOverclock from './themes/EdgerunnerOverclock';
import RetrowaveLab from './themes/RetrowaveLab';
import TokamakFusion from './themes/TokamakFusion';
import CityMegablock from './themes/CityMegablock';
import NoirDetective from './themes/NoirDetective';
import FlightRecorder from './FlightRecorder';
import CliTerminal from './CliTerminal';
import AgentModal from './AgentModal';
import RemotionReelModal from './RemotionReelModal';
import CinematicLensOverlay from './CinematicLensOverlay';
import {
  Volume2,
  VolumeX,
  Tv,
  Maximize2,
  Server,
  Video,
} from 'lucide-react';

export default function App() {
  // Theme Engine State
  const [activeThemeKey, setActiveThemeKey] = useState('CYBERPUNK');
  const theme = CYBERPUNK_PALETTES[activeThemeKey] || CYBERPUNK_PALETTES.CYBERPUNK;

  // Global Operational States
  const [isDefcon, setIsDefcon] = useState(false);
  const [isSurging, setIsSurging] = useState(false);
  const [activeNode, setActiveNode] = useState('NODE-01');
  const [activeTexture, setActiveTexture] = useState('citadel');
  const [customTextureUrl, setCustomTextureUrl] = useState(null);
  const [explodedView, setExplodedView] = useState(false);

  // Audio & Display Overlays
  const [isMuted, setIsMuted] = useState(true);
  const [scanlinesEnabled, setScanlinesEnabled] = useState(true);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [isRemotionModalOpen, setIsRemotionModalOpen] = useState(false);

  // Time-Travel Flight Recorder State
  const [isPaused, setIsPaused] = useState(false);
  const [playbackIndex, setPlaybackIndex] = useState(null);
  const [historyBuffer, setHistoryBuffer] = useState([]);

  // Terminal & Socket Logs
  const [terminalLogs, setTerminalLogs] = useState([
    { time: '11:00:01', text: 'AETHER Master Command Core online. 8 Theme Workstations ready.', type: 'info' },
    { time: '11:00:02', text: 'Select any theme in the top bar to switch UI layout & specialized subsystems.', type: 'success' },
  ]);
  const [socketLogs, setSocketLogs] = useState([]);

  // Live Telemetry State
  const [liveTelemetry, setLiveTelemetry] = useState({
    cpuWatts: 128.4,
    gpuWatts: 285.0,
    dramWatts: 18.2,
    cpuLoad: 42.5,
    cpuTemp: 58.2,
    nvme0Temp: 44.1,
    tokSec: 85.4,
    ttftMs: 142,
    vramUsedGb: 20.4,
    vramTotalGb: 24.0,
    softirqPps: 142800,
    tcpRetransmits: 3,
    napiTimeSqueeze: 0,
    diskReadMbs: 940.5,
    diskWriteMbs: 320.1,
    cpuCores: [
      { load: 42, temp: 58.2 }, { load: 55, temp: 62.4 }, { load: 78, temp: 72.1 }, { load: 84, temp: 76.5 },
      { load: 38, temp: 56.0 }, { load: 45, temp: 59.8 }, { load: 92, temp: 81.3 }, { load: 64, temp: 66.7 },
      { load: 51, temp: 61.5 }, { load: 48, temp: 60.1 }, { load: 72, temp: 69.8 }, { load: 61, temp: 65.4 },
      { load: 39, temp: 57.2 }, { load: 44, temp: 58.9 }, { load: 88, temp: 79.4 }, { load: 58, temp: 64.2 },
    ],
  });

  // WebSocket Connection State
  const [wsStatus, setWsStatus] = useState('SIMULATED'); // 'CONNECTED' | 'DISCONNECTED' | 'SIMULATED'
  const wsRef = useRef(null);
  const WS_URL = 'ws://127.0.0.1:8765';

  // Toggle Audio Engine
  const handleToggleAudio = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    cyberAudio.setMuted(nextMuted);
  };

  // Toggle DEFCON 1
  const handleToggleDefcon = () => {
    const nextDefcon = !isDefcon;
    setIsDefcon(nextDefcon);
    cyberAudio.setDefcon(nextDefcon);

    const logEntry = {
      time: new Date().toLocaleTimeString(),
      text: nextDefcon
        ? 'DEFCON 1 ENGAGED: Intrusion siren active. eBPF XDP dropping SYN_FLOOD packets.'
        : 'DEFCON 1 STAND DOWN: Normal containment re-established.',
      type: nextDefcon ? 'error' : 'success',
    };
    setTerminalLogs((prev) => [...prev, logEntry]);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const msg = JSON.stringify({ action: 'DEFCON_LOCKDOWN', enabled: nextDefcon });
      wsRef.current.send(msg);
      setSocketLogs((prev) => [...prev, { time: new Date().toLocaleTimeString(), msg: `OUT -> ${msg}` }]);
    }
  };

  // Trigger Neural Surge
  const handleTriggerSurge = () => {
    setIsSurging(true);
    cyberAudio.playNeuralSurge();

    setTerminalLogs((prev) => [
      ...prev,
      {
        time: new Date().toLocaleTimeString(),
        text: 'NEURAL SURGE FIRED: High-velocity tensor burst traversing Citadel Monolith tiers T1->T6.',
        type: 'success',
      },
    ]);

    setTimeout(() => {
      setIsSurging(false);
    }, 1800);
  };

  // Send Bi-Directional WebSocket Command
  const handleSendCommand = (cmdObj) => {
    const msg = JSON.stringify(cmdObj);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(msg);
      setSocketLogs((prev) => [...prev, { time: new Date().toLocaleTimeString(), msg: `OUT -> ${msg}` }]);
    }
    setTerminalLogs((prev) => [
      ...prev,
      {
        time: new Date().toLocaleTimeString(),
        text: `IPC DISPATCH: ${cmdObj.action} (PID ${cmdObj.pid || 'N/A'})`,
        type: 'cmd',
      },
    ]);
  };

  // Real or Synthetic Telemetry Poller Loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPaused) return;

      // Jitter simulation for realistic hardware fluctuation
      setLiveTelemetry((prev) => {
        const jitter = (Math.random() - 0.5);
        const cpuJitter = jitter * 4;
        const newCpuLoad = Math.max(15, Math.min(95, prev.cpuLoad + cpuJitter));
        const newCpuWatts = Math.max(50, Math.min(240, prev.cpuWatts + jitter * 6));
        const newGpuWatts = Math.max(180, Math.min(420, prev.gpuWatts + jitter * 12));
        const newTokSec = isSurging ? 128.4 : Math.max(60, Math.min(115, prev.tokSec + jitter * 3));

        const updatedCores = prev.cpuCores.map((c) => ({
          load: Math.max(10, Math.min(100, Math.round(c.load + (Math.random() - 0.5) * 8))),
          temp: Math.max(48, Math.min(84, +(c.temp + (Math.random() - 0.5) * 0.8).toFixed(1))),
        }));

        const snapshot = {
          ...prev,
          cpuLoad: +newCpuLoad.toFixed(1),
          cpuWatts: +newCpuWatts.toFixed(1),
          gpuWatts: +newGpuWatts.toFixed(1),
          tokSec: +newTokSec.toFixed(1),
          cpuCores: updatedCores,
          time: new Date().toLocaleTimeString(),
        };

        // Rolling 60-second snapshot buffer
        setHistoryBuffer((hBuf) => {
          const nextBuf = [...hBuf, snapshot];
          if (nextBuf.length > 60) nextBuf.shift();
          return nextBuf;
        });

        return snapshot;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isPaused, isSurging]);

  // Connect WebSocket to real hardware aether_soc_agent.py
  const connectWebSocket = useCallback(() => {
    let ws = null;
    try {
      ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsStatus('CONNECTED');
        setTerminalLogs((prev) => [
          ...prev,
          { time: new Date().toLocaleTimeString(), text: `WebSocket connected to ${WS_URL}`, type: 'success' },
        ]);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLiveTelemetry((prev) => ({ ...prev, ...data }));
          setSocketLogs((prev) => [
            ...prev.slice(-30),
            { time: new Date().toLocaleTimeString(), msg: `IN <- ${event.data.slice(0, 75)}...` },
          ]);
        } catch {
          // Parse safe
        }
      };

      ws.onclose = () => {
        setWsStatus('SIMULATED');
      };

      ws.onerror = () => {
        setWsStatus('SIMULATED');
      };
    } catch {
      // Safe
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      connectWebSocket();
    }, 50);
    return () => {
      clearTimeout(timer);
      if (wsRef.current) wsRef.current.close();
    };
  }, [connectWebSocket]);

  // Active telemetry for display (live vs time-travel replay)
  const activeTelemetry = isPaused && playbackIndex !== null && historyBuffer[playbackIndex]
    ? historyBuffer[playbackIndex]
    : liveTelemetry;

  // CLI Command Execution Handler
  const handleExecuteCommand = (commandStr) => {
    const parts = commandStr.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    const logEntry = (text, type = 'info') => {
      setTerminalLogs((prev) => [...prev, { time: new Date().toLocaleTimeString(), text, type }]);
    };

    switch (cmd) {
      case 'help':
        logEntry('Available Commands:');
        logEntry('  prompt <query>     - Injects query into local LLM and fires Citadel surge');
        logEntry('  kill <pid>         - Sends SIGTERM to process ID');
        logEntry('  boost <pid>        - Renices process to -10 high priority');
        logEntry('  defcon / lockdown  - Toggles DEFCON 1 emergency lockdown');
        logEntry('  theme <name>       - Switches theme (cyberpunk, neon, 2077, edgerunners, retrowave, bright, city, rain)');
        logEntry('  node <1-4>         - Switches mesh node (NODE-01 to NODE-04)');
        logEntry('  audio              - Toggles procedural Web Audio engine');
        logEntry('  ws / agent         - Opens Python kernel agent connection modal');
        logEntry('  reel / remotion    - Opens 60fps deterministic Remotion video engine modal');
        logEntry('  clear              - Clears terminal output');
        break;

      case 'prompt':
        if (!arg) {
          logEntry('Error: specify a prompt query (e.g. "prompt analyze memory bus")', 'error');
        } else {
          handleTriggerSurge();
          logEntry(`Surge injected: "${arg}"`, 'success');
        }
        break;

      case 'kill':
        if (!arg) {
          logEntry('Error: specify PID to kill (e.g. "kill 4109")', 'error');
        } else {
          const pid = parseInt(arg, 10);
          handleSendCommand({ action: 'KILL_PID', pid });
        }
        break;

      case 'boost':
        if (!arg) {
          logEntry('Error: specify PID to boost (e.g. "boost 4109")', 'error');
        } else {
          const pid = parseInt(arg, 10);
          handleSendCommand({ action: 'RENICE_PID', pid, nice: -10 });
        }
        break;

      case 'defcon':
      case 'lockdown':
        handleToggleDefcon();
        break;

      case 'audio':
        handleToggleAudio();
        logEntry(`Audio engine ${!isMuted ? 'muted' : 'activated'}.`, 'info');
        break;

      case 'ws':
      case 'agent':
        setIsAgentModalOpen(true);
        break;

      case 'reel':
      case 'remotion':
        setIsRemotionModalOpen(true);
        logEntry('Opened 60fps deterministic Remotion video engine modal.', 'success');
        break;

      case 'node':
        const nodeNum = arg.replace(/\D/g, '');
        if (['1', '2', '3', '4'].includes(nodeNum)) {
          setActiveNode(`NODE-0${nodeNum}`);
          logEntry(`Switched active node to NODE-0${nodeNum}`, 'success');
        } else {
          logEntry('Error: node must be 1, 2, 3, or 4', 'error');
        }
        break;

      case 'theme':
        const matchingKey = Object.keys(CYBERPUNK_PALETTES).find(
          (k) => k.toLowerCase().includes(arg.toLowerCase())
        );
        if (matchingKey) {
          setActiveThemeKey(matchingKey);
          logEntry(`Switched theme to ${CYBERPUNK_PALETTES[matchingKey].name}`, 'success');
        } else {
          logEntry(`Unknown theme. Choose from: ${Object.keys(CYBERPUNK_PALETTES).join(', ')}`, 'error');
        }
        break;

      default:
        logEntry(`Command not recognized: "${cmd}". Type "help" for syntax.`, 'error');
        break;
    }
  };

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  // Dynamic Theme Workstation Renderer
  const renderThemeWorkstation = () => {
    switch (activeThemeKey) {
      case 'CYBERPUNK_NEON':
        return (
          <NeonCyberdeck
            theme={theme}
            telemetry={activeTelemetry}
            isDefcon={isDefcon}
            onSendCommand={handleSendCommand}
          />
        );

      case 'CYBERPUNK_2077':
        return (
          <Arasaka2077
            theme={theme}
            telemetry={activeTelemetry}
            isDefcon={isDefcon}
            onSendCommand={handleSendCommand}
          />
        );

      case 'CYBERPUNK_EDGERUNNERS':
        return (
          <EdgerunnerOverclock
            theme={theme}
            telemetry={activeTelemetry}
            isDefcon={isDefcon}
            onSendCommand={handleSendCommand}
          />
        );

      case 'CYBERPUNK_RETROWAVE':
        return (
          <RetrowaveLab
            theme={theme}
            telemetry={activeTelemetry}
            isDefcon={isDefcon}
            onSendCommand={handleSendCommand}
          />
        );

      case 'CYBERPUNK_NEON_BRIGHT':
        return (
          <TokamakFusion
            theme={theme}
            telemetry={activeTelemetry}
            isDefcon={isDefcon}
            onSendCommand={handleSendCommand}
          />
        );

      case 'CYBERPUNK_CITY':
        return (
          <CityMegablock
            theme={theme}
            telemetry={activeTelemetry}
            isDefcon={isDefcon}
            onSendCommand={handleSendCommand}
          />
        );

      case 'CYBERPUNK_RAIN':
        return (
          <NoirDetective
            theme={theme}
            telemetry={activeTelemetry}
            isDefcon={isDefcon}
            onSendCommand={handleSendCommand}
          />
        );

      case 'CYBERPUNK':
      default:
        return (
          <CyberpunkSOC
            theme={theme}
            telemetry={activeTelemetry}
            isDefcon={isDefcon}
            isSurging={isSurging}
            onTriggerSurge={handleTriggerSurge}
            activeTexture={activeTexture}
            onSelectTexture={setActiveTexture}
            customTextureUrl={customTextureUrl}
            onUploadCustomTexture={(url) => {
              setCustomTextureUrl(url);
              setActiveTexture('custom');
            }}
            explodedView={explodedView}
            onToggleExplodedView={() => setExplodedView((prev) => !prev)}
            onToggleDefcon={handleToggleDefcon}
            activeNode={activeNode}
            onSelectNode={setActiveNode}
            onSendCommand={handleSendCommand}
          />
        );
    }
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-500 flex flex-col font-mono select-none ${
        scanlinesEnabled ? 'crt-scanlines' : ''
      }`}
      style={{
        backgroundColor: theme.void,
        color: '#e2e8f0',
        backgroundImage: theme.layout === 'LASER_GRID'
          ? 'linear-gradient(rgba(255, 0, 85, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.04) 1px, transparent 1px)'
          : (theme.layout === 'INDUSTRIAL_BRUTALIST'
            ? 'repeating-linear-gradient(-45deg, rgba(252, 238, 10, 0.02), rgba(252, 238, 10, 0.02) 15px, transparent 15px, transparent 30px)'
            : 'radial-gradient(rgba(0, 245, 212, 0.06) 1px, transparent 0)'),
        backgroundSize: theme.layout === 'LASER_GRID' ? '28px 28px' : '22px 22px',
      }}
    >
      {/* Cinematic Optical Layer: Anamorphic Flare & Vignette */}
      <CinematicLensOverlay isDefcon={isDefcon} isSurging={isSurging} theme={theme} />

      {/* =========================================================================
          TOP COMMAND HEADER & 8-PALETTE THEME SWITCHER
          ========================================================================= */}
      <header className="sticky top-0 z-40 bg-black/85 backdrop-blur-md border-b border-white/10 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        {/* Left Branding & Active Palette Signature */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <img
              src="/textures/cyberpunk_logo.png"
              alt="Cyberpunk"
              className="h-6 sm:h-7 w-auto object-contain transition-all duration-300 select-none filter hover:brightness-125"
              style={{
                filter: activeThemeKey === 'CYBERPUNK_2077'
                  ? 'drop-shadow(0 0 8px rgba(252,238,10,0.8)) drop-shadow(2px 2px 0px #00ff66)'
                  : `drop-shadow(0 0 10px ${theme.glow})`,
              }}
            />
            <div className="h-5 w-[1px] bg-white/20 hidden sm:block" />
            <h1 className="text-sm sm:text-base font-orbitron font-extrabold tracking-wider text-white flex items-center gap-1.5">
              <span>AETHER</span>
              <span className="text-xs font-normal text-slate-500">//</span>
              <span className={theme.titleTypographyClass}>
                {theme.cardTitleSignature}
              </span>
            </h1>
          </div>

          <span
            className={`hidden xl:inline-block text-[9px] px-2 py-0.5 rounded font-mono font-bold tracking-widest uppercase border ${theme.badgeClass}`}
          >
            {theme.layout}
          </span>
        </div>

        {/* Center: 8 Cyberpunk Theme Selector Pills */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full py-0.5 px-1 bg-white/5 rounded-lg border border-white/10">
          {Object.entries(CYBERPUNK_PALETTES).map(([key, pal]) => {
            const isSelected = activeThemeKey === key;
            return (
              <button
                key={key}
                onClick={() => {
                  cyberAudio.playChirp();
                  setActiveThemeKey(key);
                }}
                className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-mono font-bold tracking-wider transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-white/20 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
                style={{
                  border: isSelected ? `1px solid ${pal.primary}` : '1px solid transparent',
                  boxShadow: isSelected ? `0 0 10px ${pal.glow}` : 'none',
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: pal.primary }}
                />
                <span>{pal.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Cockpit Action Controls */}
        <div className="flex items-center gap-2 text-xs">
          {/* Audio Synthesizer Toggle */}
          <button
            onClick={handleToggleAudio}
            className={`flex items-center gap-1 px-2.5 py-1 rounded border text-[10px] font-bold font-mono transition-all ${
              !isMuted
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_10px_rgba(0,245,212,0.3)]'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
            }`}
            title="Toggle Procedural Audio Synthesizer"
          >
            {!isMuted ? <Volume2 className="w-3 h-3 text-cyan-400" /> : <VolumeX className="w-3 h-3 text-slate-400" />}
            <span>{!isMuted ? 'AUDIO: ON' : 'MUTED'}</span>
          </button>

          {/* CRT Scanline Toggle */}
          <button
            onClick={() => setScanlinesEnabled((prev) => !prev)}
            className={`flex items-center gap-1 px-2 py-1 rounded border text-[10px] font-mono transition-all ${
              scanlinesEnabled
                ? 'bg-purple-500/20 text-purple-300 border-purple-400/40'
                : 'bg-white/5 text-slate-500 border-white/10'
            }`}
            title="Toggle CRT Scanlines & Tube Distortion"
          >
            <Tv className="w-3 h-3" />
            <span className="hidden sm:inline">CRT</span>
          </button>

          {/* Agent Modal Button */}
          <button
            onClick={() => setIsAgentModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[10px] font-mono font-bold transition-all ${
              wsStatus === 'CONNECTED'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-[0_0_10px_#10b981]'
                : 'bg-amber-500/20 text-amber-300 border-amber-400/40 hover:bg-amber-500/30'
            }`}
          >
            <Server className="w-3 h-3" />
            <span>AGENT: {wsStatus}</span>
          </button>

          {/* 60FPS Remotion Reel Modal Toggle */}
          <button
            onClick={() => {
              cyberAudio.playChirp();
              setIsRemotionModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded border text-[10px] font-mono font-bold bg-pink-500/20 text-pink-300 border-pink-400/50 hover:bg-pink-500/30 shadow-[0_0_10px_rgba(247,37,133,0.3)] transition-all"
            title="Open 60fps Deterministic Remotion Motion Engine"
          >
            <Video className="w-3 h-3 text-pink-400" />
            <span className="hidden sm:inline">60FPS REEL</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={handleToggleFullscreen}
            className="p-1 rounded bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white border border-white/10"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>
      </header>

      {/* Theme Personality Banner */}
      <div className="bg-black/60 border-b border-white/5 px-4 py-1.5 flex items-center justify-between text-[11px] font-mono">
        <span className="text-slate-400 flex items-center gap-2">
          <span className="text-cyan-400 font-bold uppercase">{theme.name} WORKSTATION:</span>
          <span>{theme.tagline}</span>
        </span>
        <span className="text-[10px] text-slate-500">
          LAYOUT: <span className="text-white font-bold">{theme.layout}</span>
        </span>
      </div>

      {/* =========================================================================
          DYNAMIC THEME WORKSTATION MAIN VIEWPORT
          ========================================================================= */}
      <main className="flex-1 p-3 max-w-[1920px] mx-auto w-full flex flex-col gap-3">
        {/* Render Dedicated Theme Subsystems & Workstation Layout with Smooth Cinematic Transition */}
        <div key={activeThemeKey} className="animate-workstation-enter w-full">
          {renderThemeWorkstation()}
        </div>

        {/* BOTTOM SECTION: 60-STEP FLIGHT RECORDER & INTERACTIVE CLI TERMINAL */}
        <section className="grid grid-cols-12 gap-3 mt-1">
          <div className="col-span-12 lg:col-span-7">
            <FlightRecorder
              theme={theme}
              historyBuffer={historyBuffer}
              isPaused={isPaused}
              playbackIndex={playbackIndex}
              onSelectFrame={(idx) => {
                setIsPaused(true);
                setPlaybackIndex(idx);
              }}
              onTogglePause={() => setIsPaused((prev) => !prev)}
              onReturnToLive={() => {
                setIsPaused(false);
                setPlaybackIndex(null);
              }}
            />
          </div>

          <div className="col-span-12 lg:col-span-5">
            <CliTerminal
              theme={theme}
              onExecuteCommand={handleExecuteCommand}
              logs={terminalLogs}
              onClearLogs={() => setTerminalLogs([])}
            />
          </div>
        </section>
      </main>

      {/* =========================================================================
          BI-DIRECTIONAL PYTHON AGENT CONFIGURATION MODAL
          ========================================================================= */}
      <AgentModal
        isOpen={isAgentModalOpen}
        onClose={() => setIsAgentModalOpen(false)}
        wsStatus={wsStatus}
        wsUrl={WS_URL}
        onToggleConnect={() => {
          if (wsStatus === 'CONNECTED') {
            if (wsRef.current) wsRef.current.close();
            setWsStatus('DISCONNECTED');
          } else {
            connectWebSocket();
          }
        }}
        socketLogs={socketLogs}
      />

      {/* =========================================================================
          PROGRAMMATIC 60FPS REMOTION MOTION ENGINE MODAL
          ========================================================================= */}
      <RemotionReelModal
        isOpen={isRemotionModalOpen}
        onClose={() => setIsRemotionModalOpen(false)}
      />
    </div>
  );
}
