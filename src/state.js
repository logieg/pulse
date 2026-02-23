import { signal } from "@preact/signals";

export const isPlaying = signal(false);
export const bpm = signal(120);
export const currentStep = signal(0);

// 4 Tracks (Kick, Snare, Closed Hihat, Open Hihat), 16 steps each
export const tracks = signal([
  { id: 'kick', name: 'Kick', steps: new Array(16).fill(false) },
  { id: 'snare', name: 'Snare', steps: new Array(16).fill(false) },
  { id: 'closedhat', name: 'Closed HH', steps: new Array(16).fill(false) },
  { id: 'openhat', name: 'Open HH', steps: new Array(16).fill(false) },
]);

// Helper to toggle a step
export const toggleStep = (trackIndex, stepIndex) => {
  const newTracks = [...tracks.value];
  newTracks[trackIndex] = { ...newTracks[trackIndex] };
  newTracks[trackIndex].steps = [...newTracks[trackIndex].steps];
  newTracks[trackIndex].steps[stepIndex] = !newTracks[trackIndex].steps[stepIndex];
  tracks.value = newTracks;
};
