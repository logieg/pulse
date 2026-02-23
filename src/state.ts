import { signal } from "@preact/signals";

export interface Track {
  id: string;
  name: string;
  steps: boolean[];
}

export const isPlaying = signal(false);
export const bpm = signal(120);
export const currentStep = signal(0);

// 4 Tracks (Kick, Snare, Closed Hihat, Open Hihat), 16 steps each
export const tracks = signal<Track[]>([
  { id: 'kick', name: 'Kick', steps: new Array(16).fill(false) },
  { id: 'snare', name: 'Snare', steps: new Array(16).fill(false) },
  { id: 'closedhat', name: 'Closed HH', steps: new Array(16).fill(false) },
  { id: 'openhat', name: 'Open HH', steps: new Array(16).fill(false) },
]);

export const toggleStep = (trackIndex: number, stepIndex: number) => {
  const newTracks = [...tracks.value];
  newTracks[trackIndex] = { ...newTracks[trackIndex] };
  newTracks[trackIndex].steps = [...newTracks[trackIndex].steps];
  newTracks[trackIndex].steps[stepIndex] = !newTracks[trackIndex].steps[stepIndex];
  tracks.value = newTracks;
};

// Synth State
export type Tab = 'drums' | 'synth';
export const activeTab = signal<Tab>('drums');

export const synthWaveform = signal<OscillatorType>('sawtooth');
export const synthSteps = signal<string[][]>(Array.from({ length: 16 }, () => []));

export const toggleSynthStep = (stepIndex: number, note: string) => {
  const newSteps = [...synthSteps.value];
  const stepNotes = newSteps[stepIndex] || [];
  if (stepNotes.includes(note)) {
    newSteps[stepIndex] = stepNotes.filter(n => n !== note);
  } else {
    newSteps[stepIndex] = [...stepNotes, note];
  }
  synthSteps.value = newSteps;
};

export const notification = signal<string | null>(null);
let notificationTimer: any = null;
export const showNotification = (msg: string) => {
  notification.value = msg;
  if (notificationTimer) clearTimeout(notificationTimer);
  notificationTimer = setTimeout(() => {
    notification.value = null;
  }, 2000);
};
