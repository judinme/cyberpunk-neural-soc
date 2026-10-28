import React, { useState, useEffect } from 'react';
import { Bot, Zap, Sparkles, Terminal } from 'lucide-react';

export default function InferenceCrown({
  theme,
  telemetry,
  isDefcon,
  onTriggerSurge
}) {
  const [selectedModel, setSelectedModel] = useState('llama-3.1-8b-q4_K_M');
  const [promptInput, setPromptInput] = useState('');
  const [streamingOutput, setStreamingOutput] = useState(
    'AETHER.AI v2.4 initialized. Ready for neural prompt injection. Weights cached in unified VRAM.'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [tokenRateHistory, setTokenRateHistory] = useState([78, 82, 85, 90, 84, 86, 92, 89, 85, 88, 91, 87]);

  const models = [
    { id: 'llama-3.1-8b-q4_K_M', name: 'LLaMA 3.1 8B (Q4_K_M)', vram: '6.2 GB', ctx: '128k' },
    { id: 'qwen-2.5-coder-7b', name: 'Qwen 2.5 Coder 7B', vram: '5.8 GB', ctx: '32k' },
    { id: 'deepseek-r1:8b-distill', name: 'DeepSeek R1 8B Distill', vram: '7.1 GB', ctx: '64k' },
  ];

  // Update rolling token rate graph
  useEffect(() => {
    const interval = setInterval(() => {
      const baseTok = isGenerating ? 128.4 : (telemetry.tokSec || 85.2);
      const jitter = (Math.random() - 0.5) * 8;
      const newRate = Math.max(20, Math.min(160, baseTok + jitter));
      setTokenRateHistory((prev) => [...prev.slice(1), Math.round(newRate)]);
    }, 800);
    return () => clearInterval(interval);
  }, [isGenerating, telemetry.tokSec]);

  // Handle Prompt Injection
  const handleInjectPrompt = (customText) => {
    const text = customText || promptInput.trim();
    if (!text) return;

    onTriggerSurge();
    setIsGenerating(true);
    setStreamingOutput(`> INJECTING SURGE: "${text}"\n> Allocating KV Cache blocks... Done.\n> Streaming tokens:\n`);

    const responses = [
      `Synthesizing eBPF XDP filter rule for hardware bypass... Ingress packet dropped at NIC ring buffer. DMA channels rebalanced. Execution latency: 0.18ms.`,
      `Neural inference completed across 32 attention heads. KV cache paged to VRAM block #4120. Monolith Spire operating at maximum tensor throughput.`,
      `Optimizing CPU scheduling quantum for PID 4109 (ollama-runner). SoftIRQ overhead mitigated. GPU SM clock boosted to 2610 MHz.`,
    ];
    const sample = responses[Math.floor(Math.random() * responses.length)];
    let charIdx = 0;

    const timer = setInterval(() => {
      if (charIdx < sample.length) {
        setStreamingOutput((prev) => prev + sample.charAt(charIdx));
        charIdx++;
      } else {
        clearInterval(timer);
        setIsGenerating(false);
      }
    }, 20);

    setPromptInput('');
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
          <Bot className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold font-orbitron tracking-wider uppercase text-slate-100 flex items-center gap-1.5">
            <span>LOCAL AI &amp; LLM INFERENCE CROWN</span>
          </h3>
        </div>
        <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold tracking-widest uppercase bg-fuchsia-950/60 text-fuchsia-300 border border-fuchsia-500/40 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-fuchsia-400 animate-spin" />
          OLLAMA // vLLM
        </span>
      </div>

      {/* Model Selector Tabs */}
      <div className="grid grid-cols-3 gap-1.5 font-mono text-xs">
        {models.map((m) => {
          const isSelected = selectedModel === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setSelectedModel(m.id)}
              className={`p-1.5 rounded border text-left transition-all duration-200 ${
                isSelected
                  ? 'bg-cyan-500/20 border-cyan-400/80 shadow-[0_0_10px_rgba(0,245,212,0.3)]'
                  : 'bg-black/40 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="text-[9px] font-bold text-white truncate">{m.name}</div>
              <div className="flex items-center justify-between text-[8px] text-slate-400 mt-0.5">
                <span>{m.vram}</span>
                <span className="text-cyan-400">{m.ctx}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Live AI Telemetry: tok/s, TTFT, VRAM & KV Cache */}
      <div className="grid grid-cols-12 gap-3 items-center bg-black/50 p-2.5 rounded border border-white/5 font-mono text-xs">
        {/* Token Generation Gauge */}
        <div className="col-span-4 border-r border-white/10 pr-2">
          <div className="text-[9px] text-slate-400 uppercase">GENERATION SPEED</div>
          <div className="text-xl font-bold font-orbitron text-white flex items-baseline gap-1 mt-0.5">
            {isGenerating ? '128.4' : ((telemetry.tokSec || 84.6).toFixed(1))}
            <span className="text-[10px] font-normal text-cyan-400 font-mono">tok/s</span>
          </div>

          {/* Rolling Sparkline */}
          <div className="h-6 w-full flex items-end gap-0.5 mt-1 bg-slate-950 p-0.5 rounded border border-white/5">
            {tokenRateHistory.map((val, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-cyan-500 to-fuchsia-500 rounded-t-xs"
                style={{ height: `${(val / 150) * 100}%` }}
              />
            ))}
          </div>
        </div>

        {/* Memory & Cache Saturation Bars */}
        <div className="col-span-8 flex flex-col gap-2 pl-1">
          {/* VRAM Allocation */}
          <div>
            <div className="flex justify-between text-[10px] text-slate-300 mb-0.5">
              <span>UNIFIED VRAM (RTX 4090 24GB):</span>
              <span className="text-fuchsia-300 font-bold">20.4 / 24.0 GB (85%)</span>
            </div>
            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400 rounded-full"
                style={{ width: '85%' }}
              />
            </div>
          </div>

          {/* PagedAttention KV Cache */}
          <div>
            <div className="flex justify-between text-[10px] text-slate-300 mb-0.5">
              <span>PAGED_ATTN KV CACHE:</span>
              <span className="text-cyan-300 font-bold">68.2% (12.4k TOKENS)</span>
            </div>
            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                style={{ width: '68.2%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Streaming Terminal Output */}
      <div className="bg-black/80 rounded-lg p-2.5 border border-white/10 font-mono text-[10px] text-slate-300 relative min-h-[70px] max-h-[90px] overflow-y-auto">
        <div className="flex items-center justify-between text-slate-500 border-b border-white/5 pb-1 mb-1 text-[8px]">
          <span className="flex items-center gap-1">
            <Terminal className="w-3 h-3 text-cyan-400" />
            TENSOR OUTPUT STREAM
          </span>
          {isGenerating ? (
            <span className="text-cyan-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" /> GENERATING
            </span>
          ) : (
            <span className="text-slate-500">READY</span>
          )}
        </div>
        <p className="whitespace-pre-wrap leading-relaxed text-slate-200">
          {streamingOutput}
        </p>
      </div>

      {/* Interactive Prompt Injector Bar */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={promptInput}
          onChange={(e) => setPromptInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleInjectPrompt()}
          placeholder="Inject prompt (e.g. Generate eBPF XDP rule...)"
          className="flex-1 bg-black/60 border border-white/15 focus:border-cyan-400 rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-500 font-mono outline-none transition-colors"
        />
        <button
          onClick={() => handleInjectPrompt()}
          disabled={isGenerating}
          className="flex items-center gap-1 px-3 py-1.5 rounded bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:brightness-125 text-white font-mono font-bold text-xs shadow-[0_0_12px_rgba(0,245,212,0.4)] transition-all disabled:opacity-50"
        >
          <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
          INJECT SURGE
        </button>
      </div>

      {/* Quick Prompts Suggestions */}
      <div className="flex items-center gap-1.5 text-[8px] font-mono text-slate-400">
        <span className="text-slate-500">PRESETS:</span>
        <button
          onClick={() => handleInjectPrompt('Generate eBPF XDP firewall rule')}
          className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5"
        >
          #eBPF_XDP
        </button>
        <button
          onClick={() => handleInjectPrompt('Analyze kernel microjoule RAPL telemetry')}
          className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5"
        >
          #RAPL_ENERGY
        </button>
        <button
          onClick={() => handleInjectPrompt('Optimize VRAM KV cache paging')}
          className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5"
        >
          #KV_CACHE
        </button>
      </div>
    </div>
  );
}
