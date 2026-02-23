import { currentStep, synthSteps, synthWaveform, toggleSynthStep } from '../state';

const NOTES = [
  'B4', 'A#4', 'A4', 'G#4', 'G4', 'F#4', 'F4', 'E4', 'D#4', 'D4', 'C#4', 'C4'
];

const isBlackKey = (note: string) => note.includes('#');

export function SynthSequencer() {
  return (
    <div className="flex flex-col bg-slate-900 rounded-2xl p-4 shadow-2xl border border-slate-800">
      <div className="flex justify-between items-center mb-4 p-2 relative">
        <div className="w-24 flex-shrink-0 text-right pr-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Waveform
        </div>
        <div className="flex flex-1 gap-2">
          {['sawtooth', 'square', 'sine', 'triangle'].map(wave => (
            <button
              key={wave}
              onClick={() => synthWaveform.value = wave as OscillatorType}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                synthWaveform.value === wave 
                  ? 'bg-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.6)]' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {wave}
            </button>
          ))}
        </div>
      </div>

      {/* Beat Indicators */}
      <div className="flex items-center gap-2 mb-2 p-2 pt-0">
        <div className="w-24 flex-shrink-0 text-right pr-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Steps
        </div>
        <div className="flex flex-1 gap-1.5 overflow-x-auto pb-1 pr-2 hide-scrollbar">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="w-10 flex-shrink-0 flex justify-center">
              <div
                className={`w-2 h-2 rounded-full transition-colors ${currentStep.value === i ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 'bg-slate-700'}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1 overflow-y-auto max-h-[400px] pr-1 thin-scrollbar">
        {NOTES.map(note => {
          const black = isBlackKey(note);
          return (
            <div key={note} className="flex items-center gap-2">
              <div className={`w-24 flex-shrink-0 text-right pr-4 font-mono font-medium text-sm ${black ? 'text-slate-500' : 'text-slate-300'}`}>
                {note}
              </div>
              <div className="flex flex-1 gap-1.5 overflow-x-auto pb-1 pr-2 hide-scrollbar">
                {synthSteps.value.map((activeNotes, stepIndex) => {
                  const isActive = (activeNotes || []).includes(note);
                  const isCurrent = currentStep.value === stepIndex;
                  const isQuarterStart = stepIndex % 4 === 0;

                  let btnClass = "w-10 h-8 rounded-md flex-shrink-0 transition-all duration-75 relative outline-none ";

                  if (isActive) {
                    btnClass += "bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)] ";
                    if (isCurrent) btnClass += "brightness-150 scale-105 ";
                  } else {
                    btnClass += isQuarterStart ? "bg-slate-700 " : "bg-slate-700/60 ";
                    if (black && !isQuarterStart) btnClass += "opacity-80 ";
                    if (isCurrent) btnClass += "bg-slate-600 scale-105 ";
                    btnClass += "hover:bg-slate-600 ";
                  }

                  return (
                    <button
                      key={stepIndex}
                      onClick={() => toggleSynthStep(stepIndex, note)}
                      className={btnClass}
                    >
                      {isCurrent && (
                        <div className="absolute inset-0 border-2 border-white/40 rounded-md pointer-events-none" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
