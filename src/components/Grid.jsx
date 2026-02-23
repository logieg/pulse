import { tracks, currentStep } from '../state.js';
import { TrackRow } from './TrackRow.jsx';

export function Grid() {
  return (
    <div className="flex flex-col bg-slate-900 rounded-2xl p-4 shadow-2xl border border-slate-800">
      {/* Beat Indicators */}
      <div className="flex items-center gap-2 mb-4 p-2">
        <div className="w-24 flex-shrink-0 text-right pr-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Steps
        </div>
        <div className="flex flex-1 gap-1.5">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="w-10 flex-shrink-0 flex justify-center">
              <div
                className={`w-2 h-2 rounded-full transition-colors ${currentStep.value === i ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 'bg-slate-700'}`}
              />
            </div>
          ))}
        </div>
      </div>

      {tracks.value.map((track, idx) => (
        <TrackRow key={track.id} track={track} trackIndex={idx} />
      ))}
    </div>
  );
}
