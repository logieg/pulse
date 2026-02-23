import { isPlaying, bpm, currentStep, tracks, synthSteps, synthWaveform } from './state';

let audioCtx: AudioContext | null = null;
let nextNoteTime = 0;
let currentNote = 0;
let timerID: ReturnType<typeof setTimeout> | undefined;

const lookahead = 25.0; // ms
const scheduleAheadTime = 0.1; // s

// Get or resume audio context
export function getContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

// Procedural synthesis functions
const NOTE_FREQS: Record<string, number> = {
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13,
  'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00,
  'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88
};

function playSynth(time: number, note: string) {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = synthWaveform.value || 'sawtooth';
  osc.frequency.setValueAtTime(NOTE_FREQS[note] || 440, time);

  // Filter sweep
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2000, time);
  filter.frequency.exponentialRampToValueAtTime(400, time + 0.3);

  // Envelope
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(0.5, time + 0.02); // Attack
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.4); // Decay/Release

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(time);
  osc.stop(time + 0.5);
}
function playKick(time: number) {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.frequency.setValueAtTime(150, time);
  osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);

  gain.gain.setValueAtTime(1, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

  osc.start(time);
  osc.stop(time + 0.5);
}

function playSnare(time: number) {
  const ctx = getContext();

  // Noise buffer
  const bufferSize = ctx.sampleRate * 0.5;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = buffer;
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.value = 1000;
  noiseSource.connect(noiseFilter);

  const noiseEnvelope = ctx.createGain();
  noiseFilter.connect(noiseEnvelope);
  noiseEnvelope.connect(ctx.destination);

  noiseEnvelope.gain.setValueAtTime(1, time);
  noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
  noiseSource.start(time);
  noiseSource.stop(time + 0.2);

  // Snap oscillator
  const osc = ctx.createOscillator();
  const oscEnvelope = ctx.createGain();
  osc.type = 'triangle';
  osc.connect(oscEnvelope);
  oscEnvelope.connect(ctx.destination);

  osc.frequency.setValueAtTime(250, time);
  oscEnvelope.gain.setValueAtTime(0.7, time);
  oscEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
  osc.start(time);
  osc.stop(time + 0.2);
}

function playHiHat(time: number, isOpen: boolean) {
  const ctx = getContext();

  const bufferSize = ctx.sampleRate * 0.5;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 10000;

  const gain = ctx.createGain();

  noiseSource.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  const decayTime = isOpen ? 0.3 : 0.05;
  gain.gain.setValueAtTime(0.8, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + decayTime);

  noiseSource.start(time);
  noiseSource.stop(time + decayTime);
}

function nextNote() {
  const secondsPerBeat = 60.0 / bpm.value;
  // 16th notes
  nextNoteTime += 0.25 * secondsPerBeat;
  currentNote = (currentNote + 1) % 16;
}

function scheduleNote(beatNumber: number, time: number) {
  const ctx = getContext();
  const timeDifference = time - ctx.currentTime;

  // Sync UI update
  setTimeout(() => {
    currentStep.value = beatNumber;
  }, Math.max(0, timeDifference * 1000));

  // Trigger audio based on tracks signals
  const t = tracks.value;
  if (t[0].steps[beatNumber]) playKick(time);
  if (t[1].steps[beatNumber]) playSnare(time);
  if (t[2].steps[beatNumber]) playHiHat(time, false);
  if (t[3].steps[beatNumber]) playHiHat(time, true);

  const synthNoteArray = synthSteps.value[beatNumber];
  if (synthNoteArray && synthNoteArray.length > 0) {
    synthNoteArray.forEach(note => playSynth(time, note));
  }
}

function scheduler() {
  const ctx = getContext();
  while (nextNoteTime < ctx.currentTime + scheduleAheadTime) {
    scheduleNote(currentNote, nextNoteTime);
    nextNote();
  }
  timerID = setTimeout(scheduler, lookahead);
}

export function togglePlay() {
  const ctx = getContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  if (isPlaying.value) {
    clearTimeout(timerID);
    isPlaying.value = false;
  } else {
    isPlaying.value = true;
    currentNote = 0;
    // Align with audio context timeline
    nextNoteTime = ctx.currentTime + 0.05;
    scheduler();
  }
}
