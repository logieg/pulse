import { tracks, bpm, synthSteps, synthWaveform, Track, showNotification } from './state';

const STORAGE_KEY = 'pulse_state';

interface PulseState {
  bpm: number;
  tracks: Track[];
  synthSteps: any[];
  synthWaveform: OscillatorType;
}

export function saveState() {
  const state: PulseState = {
    bpm: bpm.value,
    tracks: tracks.value,
    synthSteps: synthSteps.value,
    synthWaveform: synthWaveform.value,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  console.log('Pulse state saved to localStorage.');
  showNotification('State Saved!');
}

export function loadState() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      const state = JSON.parse(data) as PulseState;
      bpm.value = state.bpm || 120;
      if (state.tracks) tracks.value = state.tracks;
      if (state.synthSteps) {
        synthSteps.value = state.synthSteps.map(step => {
          if (Array.isArray(step)) return step;
          return step ? [step] : [];
        });
      }
      if (state.synthWaveform) synthWaveform.value = state.synthWaveform;
      console.log('Pulse state loaded from localStorage.');
      showNotification('State Loaded!');
    } catch (e) {
      console.error('Failed to parse Pulse state from localStorage:', e);
    }
  } else {
    console.log('No Pulse state found in localStorage.');
  }
}

export function exportState() {
  const state: PulseState = {
    bpm: bpm.value,
    tracks: tracks.value,
    synthSteps: synthSteps.value,
    synthWaveform: synthWaveform.value,
  };
  const json = JSON.stringify(state);
  const base64 = btoa(encodeURIComponent(json));
  navigator.clipboard.writeText(base64).then(() => {
    showNotification('Share code copied to clipboard!');
  }).catch(() => {
    showNotification('Failed to copy. Check console.');
    console.log("Share code:", base64)
  });
}

export function importState() {
  const code = prompt('Enter share code:');
  if (!code) return;
  try {
    const json = decodeURIComponent(atob(code));
    const state = JSON.parse(json) as PulseState;
    if (state.bpm) bpm.value = state.bpm;
    if (state.tracks) tracks.value = state.tracks;
    if (state.synthSteps) {
      synthSteps.value = state.synthSteps.map(step => {
        if (Array.isArray(step)) return step;
        return step ? [step] : [];
      });
    }
    if (state.synthWaveform) synthWaveform.value = state.synthWaveform;
    showNotification('State Imported from Code!');
  } catch (e) {
    console.error('Failed to import state:', e);
    showNotification('Invalid share code');
  }
}
