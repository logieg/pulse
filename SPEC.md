**Project Specification: "Pulse" – Minimalist Procedural Music Sequencer**

### 1. Overview
**Pulse** is a lightweight, web-based music creation tool for beats and simple synth arrangements.  
**All sound is generated procedurally in real-time using pure JavaScript math** (Web Audio API + oscillators, noise buffers, ramps, filters — no samples, no external assets).  

The app is **100% client-side** with zero server or network dependency.

- **Core philosophy**: Keep the **interface and audio engine** extremely minimalist — instant load, focused on fun creation, no bloat.  
- **Target users**: Beat-makers, live-coders, educators, sound explorers.  
- **Scope**: 16-step sequencer with drum + melodic synth tracks, live keyboard, pattern management.  
- **Non-goals**: Complex DAW features, sample import, cloud sync, heavy effects.  

### 2. Features
- Global: Play/pause, BPM (60–200), tap tempo, master volume.  
- 16-step grid with live step highlighter.  
- 8 tracks (4 drum + 4 synth):  
  - Drums: Kick, Snare, Closed/Open Hi-Hat (procedural).  
  - Synths: Monophonic, per-step note or rest, waveform select.  
- Live QWERTY/on-screen keyboard (record-to-track optional).  
- Pattern slots (4–8), clear/random/copy, JSON export/import.  
- Visuals: Step LEDs + optional tiny canvas oscilloscope.  

Nice-to-haves (v1.1): Per-track volume/decay/filter, scale selector, swing.

### 3. Technical Stack
- **Frontend UI**: **Preact** (signals for reactive state, full JSX support) + **Vite** for fast builds/hot-reload and multi-file component organization.  
  - Multiple components for maintainability (no single-file constraint).  
  - `@preact/preset-vite` or standard Preact + Vite template.  
  - Dark minimalist theme (Tailwind or plain CSS — keep lightweight).  
- **Audio Engine**: Pure **Web Audio API** (AudioContext, OscillatorNode, GainNode, BiquadFilterNode, PeriodicWave, AnalyserNode). All math in JS.  
- **Other**: LocalStorage, keyboard events, canvas for visualiser. No external JS libraries beyond Preact.

### 4. Architecture
- **Frontend** (Vite + Preact):  
  - `src/`  
    - `main.jsx` (entry)  
    - `App.jsx` (root with signals)  
    - `components/` (Grid.jsx, Track.jsx, Keyboard.jsx, Controls.jsx, Visualiser.jsx, etc.)  
    - `engine.js` (audio scheduler + generators — pure JS, imported by components)  
    - `state.js` (Preact signals for bpm, isPlaying, patterns, currentStep)  
- **Audio Engine** (separate, imperative):  
  - Single shared `AudioContext`.  
  - Scheduler uses `AudioContext.currentTime` + lookahead (same precise code as before).  
  - Reusable functions: `playKick(time)`, `playSnare(time)`, `playSynth(freq, duration, wave, time)`.  
  - Polyphony & custom PeriodicWave via math (Fourier arrays).  
- **Communication**: Preact components call engine functions directly (import).  
- **State Flow**: Preact Signals → UI re-renders on change. Audio scheduler reads current pattern state on each step (no blocking).  
- **Mobile Optimizations**:  
  - Touch-compatible grid and keyboard.  
  - Portrait-friendly layout (stacked controls).  
  - Capacitive touch latency handled by Web Audio.

### 5. Audio Implementation Details
All procedural math in JS.  
Noise buffer, pitch sweeps, filter ramps, custom waveforms — all generated on-the-fly.

### 6. UI/UX Design
- Single-screen minimalist layout (dark/neon).  
- Top bar: Logo + BPM + transport + export.  
- Left sidebar: Track list (name, mute, type).  
- Center: 16-step grid (tap to toggle; long-press or modal for synth note edit).  
- Bottom: Live keyboard + waveform picker.  
- Responsive: Auto-adjusts for desktop vs mobile screen sizes.  
- Shortcuts + touch gestures preserved.

### 7. Data & Persistence
- Patterns as plain JS objects → JSON.  
- LocalStorage by default.

### 8. Performance & Best Practices
- Web Audio scheduling (lookahead 100 ms, setTimeout/RAF loop).  
- Preact Signals = minimal re-renders.  
- AudioContext resumed on first tap (complies with autoplay policies on all platforms).  

### 9. Project Structure (High-level)
```
pulse/
├── src/
│   ├── components/          # Grid, TrackRow, Keyboard, etc.
│   ├── engine.js            # All Web Audio math + scheduler
│   ├── state.js             # Preact signals
│   ├── App.jsx
│   └── main.jsx
├── vite.config.js
├── package.json
```

(Validated against Web Audio compatibility as of Feb 2026.)
