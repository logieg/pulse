import { toggleStep, currentStep, Track } from '../state';

export function TrackRow({ track, trackIndex }: { track: Track, trackIndex: number }) {
  return (
    <div className="flex items-center gap-2 mb-3 bg-slate-800/50 p-2 rounded-lg hover:bg-slate-800 transition-colors relative">
      <div className="w-24 sticky left-0 bg-slate-800 z-10 flex-shrink-0 text-right pr-4 py-2 rounded font-mono font-medium text-slate-300 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.3)]">
        {track.name}
      </div>
      <div className="flex flex-1 gap-1.5">
        {track.steps.map((isActive, stepIndex) => {
          const isCurrent = currentStep.value === stepIndex;
          const isQuarterStart = stepIndex % 4 === 0;

          let btnClass = "w-10 h-12 rounded-md flex-shrink-0 transition-all duration-75 relative outline-none ";

          if (isActive) {
            btnClass += "bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.6)] ";
            if (isCurrent) btnClass += "brightness-150 scale-105 ";
          } else {
            btnClass += isQuarterStart ? "bg-slate-700 " : "bg-slate-700/60 ";
            if (isCurrent) btnClass += "bg-slate-600 scale-105 ";
            btnClass += "hover:bg-slate-600 ";
          }

          return (
            <button
              key={stepIndex}
              onClick={() => toggleStep(trackIndex, stepIndex)}
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
}
