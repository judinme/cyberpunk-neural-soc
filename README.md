# AETHER // CYBERPUNK NEURAL ARCHITECTURE & SOC COMMAND CORE
### High-Density FUI Telemetry Cockpit, 8-Theme Workstation Architecture, Kernel Agent & Programmatic 60FPS Motion Engine

[![React 19](https://img.shields.io/badge/React-19.3-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38b2ac?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Oxlint](https://img.shields.io/badge/Oxlint-0_warnings-10b981?style=flat-square)](https://oxc.rs/)
[![Remotion 60FPS](https://img.shields.io/badge/Remotion-60FPS_Deterministic-ff007f?style=flat-square)](https://remotion.dev/)

---

## ⚡ Overview

**AETHER** is a real-time, bi-directional hardware telemetry cockpit, local AI inference monitor, and Security Operations Center (SOC) control plane. Built with **React 19**, **Tailwind CSS v4**, **HTML5 `<canvas>`**, and a zero-dependency **Web Audio API** synthesizer, it delivers a high-density Fantasy User Interface (FUI) experience inspired by high-performance data centers, anime cyberpunk aesthetics, and industrial brutalism.

---

## 🌌 8 Differentiated Theme Workstations

Unlike simple color reskins, each of AETHER's 8 themes features a completely unique layout, specialized subsystems, distinct visual geometry, and unique interactive instruments:

| # | Theme Palette | ID Key | Layout Paradigm | Specialized Subsystems & Instrumentation |
|---|---|---|---|---|
| **01** | **Cyberpunk** | `CYBERPUNK` | `GRID_HEX` | Concentric Neon Reactor Arc Turbine, 16-Core Silicon Die Thermal Heatmap, PCIe Gen5 128 GB/s Duplex Flow Meter, eBPF XDP Threat Radar, and LLM Inference Crown. |
| **02** | **Cyberpunk Neon** | `CYBERPUNK_NEON` | `SLANTED_MATRIX` | Live Virtual Memory Hex Dump & Patcher (`0x7FFF84A0`), x86_64 Disassembly Opcode Stream, Bioluminescent Synaptic Neural Flow canvas, and SHA-256 Multi-threaded Cipher Cracker. |
| **03** | **Cyberpunk 2077** | `CYBERPUNK_2077` | `INDUSTRIAL_BRUTALIST` | Distressed Chrome Stencil Logo Hero Banner, Cyberware Bio-Monitor (Neural Stress, Adrenaline BPM, Cyberpsychosis Risk), 16-Slot Cyberdeck RAM with interactive Quickhack executions (`PING`, `SHORT_CIRCUIT`, `OVERHEAT`, `CYBERPSYCHOSIS`, `SYSTEM_RESET`), and 3-Layer Braindance scrubber (`VISUAL`, `THERMAL`, `AUDIO`). |
| **04** | **Edgerunners** | `CYBERPUNK_EDGERUNNERS` | `HIGH_VOLTAGE` | Sandevistan $0.15\times$ Temporal Dilation Warp (with audio pitch drop), 6.82 GHz Overclock Tuning Core, Liquid Nitrogen Cryo Vent Valve with real-time PSI venting & audio hiss, and 4-Bank Kinetic Railgun Capacitor staged discharge. |
| **05** | **Retrowave** | `CYBERPUNK_RETROWAVE` | `LASER_GRID` | 3D Outrun Perspective Wireframe Road, Animated Spinning Dual-Spool C-90 Cassette Tape Deck, Lissajous Vector Phase-Space Oscilloscope, and Playable 8-Key Web Audio Synthesizer Keyboard (C4–C5). |
| **06** | **Neon Bright** | `CYBERPUNK_NEON_BRIGHT` | `PULSE_CORE` | Tokamak Magnetic Plasma Torus Canvas (18 magnetic confinement coils, 148.5 MK core temperature), Deuterium-Tritium Fuel Injector, and 8-Qubit Quantum Entanglement Register with interactive Hadamard ($H$) and Pauli-X ($X$) gates. |
| **07** | **City Megablock** | `CYBERPUNK_CITY` | `MEGABLOCK` | 5-District Power Substation Blackout Matrix & rolling brownouts, Kang-Tao Orbital Recon Spy Satellite Tracker with intercepted military audio transcripts, and 4-Drone Autonomous Swarm Grid (Patrol, Escort, Intercept). |
| **08** | **Noir Rain** | `CYBERPUNK_RAIN` | `NOIR_TERMINAL` | Procedural Screen Raindrop Condensation Canvas with running droplets, Animated Swinging Windshield Wiper Blade, Wiretap Audio De-Noiser with 5-band spectral equalizer, and Forensic NVMe Hex Disk Carver. |

---

## 🎬 Programmatic 60FPS Motion Engine (Remotion)

Incorporates the viral FUI motion specifications from Prompt 0A & 0B (`cloud runtime · {9000 + frame} frames`):
- **Live In-App Player Modal (`[🎬 60FPS REEL]`)**: Scrub through a 900-frame (15.0s @ 60fps) deterministic timeline across 4 Acts (Ingestion, Qualification, Overdrive, DEFCON 1 Human Gate).
- **Zero Dropped Frames**: 180 additive-blended cubic Bezier splines and particle flows rendered purely as a mathematical function of `frame`.
- **Standalone Remotion Composition**: Located at [`src/remotion/AetherReelComposition.jsx`](file:///d:/CyberPunk/src/remotion/AetherReelComposition.jsx) and [`src/remotion/Root.jsx`](file:///d:/CyberPunk/src/remotion/Root.jsx).
- **Headless Lossless MP4 Export Command**:
  ```bash
  npx remotion render src/remotion/Root.jsx AetherReel out/aether-soc-reel.mp4 --codec=h264 --crf=18
  ```

---

## 🔊 Zero-Dependency Web Audio Synthesizer

Built with native browser `AudioContext` oscillators (zero external audio files required):
- **135 Hz Sub-Drone**: Low-pass filtered sawtooth drone simulating a high-voltage reactor core.
- **Micro-Chirps**: High-frequency dual-frequency sine chirps on all button interactions.
- **Neural Surge Arpeggio**: Multi-harmonic chord triggered when executing AI prompts.
- **DEFCON Siren**: Warbling dual-oscillator alarm when DEFCON 1 is engaged.
- **Quickhack Audio**: High-tech upload beep sequence on cyberdeck execution.
- **Sandevistan Warp**: Pitch-bending time-dilation sound effect.
- **Cryo Vent Hiss**: Filtered noise burst simulating liquid nitrogen decompression.
- **Playable 8-Key Keyboard**: Synthesizes notes C4 through C5 on the Retrowave workstation.

---

## 🛰️ Kernel Telemetry Agent (`aether_soc_agent.py`)

Streams real Linux kernel and hardware metrics to the cockpit over `ws://127.0.0.1:8765`:
1. **Linux `powercap` RAPL**: Reads CPU package & DRAM microjoules (`/sys/class/powercap/intel-rapl*/energy_uj`).
2. **eBPF / XDP Network Counters**: BCC C kernel probes on `kprobe:tcp_v4_conn_request` with zero-dependency `/proc/net/softnet_stat` fallback.
3. **NVIDIA GPU NVML**: Real-time CUDA core saturation, VRAM usage, and power draw via `nvidia-smi`.
4. **Bi-Directional Command Bus**: Executes `KILL_PID` (SIGTERM/SIGKILL) and `RENICE_PID` (-10 priority) commands directly from the UI.
5. **Simulated Fallback**: Automatically activates high-fidelity simulated telemetry when running outside Linux or when the agent is disconnected.

---

## 🚀 Quickstart

### 1. Run the Web Cockpit
```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Or build and preview production bundle
npm run build
npm run preview -- --port 4173
```

### 2. (Optional) Run the Real Hardware Agent on Linux
```bash
pip install psutil websockets
sudo chmod -R a+r /sys/class/powercap/intel-rapl*
python3 aether_soc_agent.py
```

### 3. Verification & Code Quality
```bash
# Run blazing-fast Oxlint check (0 warnings, 0 errors)
npx oxlint
```
