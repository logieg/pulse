import { currentStep, synthSteps, synthWaveform, toggleSynthStep } from '../state';

const NOTES = [
  'B4', 'A#4', 'A4', 'G#4', 'G4', 'F#4', 'F4', 'E4', 'D#4', 'D4', 'C#4', 'C4'
];

const isBlackKey = (note: string) => note.includes('#');

export function SynthSequencer() {
  return (
    <div className="flex flex-col bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden">
      {/* Waveform Selector */}
      <div className="flex flex-wrap justify-between items-center p-4 border-b border-slate-800 gap-4">
        <div className="w-24 flex-shrink-0 text-left md:text-right pr-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Waveform
        </div>
        <div className="flex flex-1 gap-2 flex-wrap">
          {['sawtooth', 'square', 'sine', 'triangle'].map(wave => (
            <button
              key={wave}
              onClick={() => synthWaveform.value = wave as OscillatorType}
              className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors flex-1 min-w-[70px] ${
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

      {/* Sequencer Grid with unified scrolling */}
      <div className="overflow-auto max-h-[60vh] thin-scrollbar bg-slate-900 relative">
        <div className="min-w-max p-4">
          
          {/* Beat Indicators (Sticky Top) */}
          <div className="flex items-center gap-2 mb-2 pb-2 sticky top-0 z-30 bg-slate-900 shadow-[0_4px_10px_-4px_rgba(0,0,0,0.5)] border-b border-slate-800/50">
            <div className="w-24 sticky left-0 z-40 bg-slate-900 flex-shrink-0 text-right pr-4 text-xs font-semibold uppercase tracking-wider text-slate-500 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.3)]">
              Steps
            </div>
            <div className="flex flex-1 gap-1.5 pr-2">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-10 flex-shrink-0 flex justify-center">
                  <div
                    className={`w-2 h-2 rounded-full transition-colors ${currentStep.value === i ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 'bg-slate-700'}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Note Rows */}
          <div className="flex flex-col gap-1 pb-2">
            {NOTES.map(note => {
              const black = isBlackKey(note);
              return (
                <div key={note} className="flex items-center gap-2 relative hover:bg-slate-800/30 rounded-lg transition-colors">
                  <div className={`w-24 sticky left-0 z-10 bg-slate-900 py-1 flex-shrink-0 text-right pr-4 font-mono font-medium text-sm shadow-[4px_0_8px_-4px_rgba(0,0,0,0.3)] ${black ? 'text-slate-500' : 'text-slate-300'}`}>
                    {note}
                  </div>
                  <div className="flex flex-1 gap-1.5 pr-2">
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
      </div>
    </div>
  );
}
