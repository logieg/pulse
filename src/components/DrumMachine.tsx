import { tracks, currentStep } from '../state';
import { TrackRow } from './TrackRow';

export function DrumMachine() {
  return (
    <div className="flex flex-col bg-slate-900 rounded-2xl p-4 shadow-2xl border border-slate-800 overflow-hidden">
      <div className="overflow-x-auto pb-2 thin-scrollbar">
        <div className="min-w-max">
          {/* Beat Indicators */}
          <div className="flex items-center gap-2 mb-4 p-2 relative">
            <div className="w-24 sticky left-0 z-10 bg-slate-900 py-1 flex-shrink-0 text-right pr-4 text-xs font-semibold uppercase tracking-wider text-slate-500 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.3)]">
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
      </div>
    </div>
  );
}
