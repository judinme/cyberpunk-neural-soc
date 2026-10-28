import React, { useState, useRef, useEffect } from 'react';
import { Terminal, CornerDownLeft } from 'lucide-react';
import { cyberAudio } from './audio';

export default function CliTerminal({
  theme,
  onExecuteCommand,
  logs,
  onClearLogs
}) {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    cyberAudio.playChirp();
    setHistory((prev) => [...prev, cmd]);
    setHistoryIdx(-1);
    setInputVal('');

    if (cmd.toLowerCase() === 'clear') {
      onClearLogs();
      return;
    }

    onExecuteCommand(cmd);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setInputVal(history[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx === -1) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx >= history.length) {
        setHistoryIdx(-1);
        setInputVal('');
      } else {
        setHistoryIdx(nextIdx);
        setInputVal(history[nextIdx]);
      }
    }
  };

  return (
    <div
      className="rounded-lg backdrop-blur-md border border-white/10 font-mono text-xs overflow-hidden flex flex-col"
      style={{ backgroundColor: 'rgba(2, 4, 10, 0.88)' }}
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10 bg-white/5 text-[10px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold text-slate-200">AETHER CLI // SOC KERNEL DISPATCHER</span>
        </div>
        <div className="flex items-center gap-2 text-[9px]">
          <span>Type <code className="text-cyan-300 font-bold">help</code> for commands</span>
          <button
            onClick={onClearLogs}
            className="text-slate-500 hover:text-slate-300"
          >
            clear
          </button>
        </div>
      </div>

      {/* Terminal History Logs */}
      <div className="p-2.5 h-20 overflow-y-auto space-y-1 font-mono text-[10px] text-slate-300">
        {logs.map((log, i) => (
          <div key={i} className="flex items-start gap-1 leading-tight">
            <span className="text-slate-500 select-none">[{log.time}]</span>
            <span
              className={
                log.type === 'error'
                  ? 'text-rose-400'
                  : (log.type === 'cmd'
                    ? 'text-cyan-300 font-bold'
                    : (log.type === 'success' ? 'text-emerald-300' : 'text-slate-300'))
              }
            >
              {log.text}
            </span>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>

      {/* Input Prompt Line */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-1.5 px-2.5 py-1.5 border-t border-white/10 bg-black/60"
      >
        <span className="text-cyan-400 font-bold select-none text-[11px]">
          aether@{theme.id.toLowerCase()} $
        </span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="prompt <query> | kill <pid> | defcon | theme <id> | agent | help"
          className="flex-1 bg-transparent text-white font-mono text-[11px] outline-none placeholder-slate-600"
        />
        <button
          type="submit"
          className="p-1 rounded bg-white/5 hover:bg-white/15 text-cyan-400"
          title="Execute Command"
        >
          <CornerDownLeft className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
}
