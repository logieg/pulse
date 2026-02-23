import { isPlaying, bpm, currentStep, tracks } from './state.js';

let audioCtx = null;
let nextNoteTime = 0;
let currentNote = 0;
let timerID;

const lookahead = 25.0; // ms
const scheduleAheadTime = 0.1; // s

// Get or resume audio context
export function getContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

// Procedural synthesis functions
function playKick(time) {
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

function playSnare(time) {
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

function playHiHat(time, isOpen) {
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

function scheduleNote(beatNumber, time) {
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
