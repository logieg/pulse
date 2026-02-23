import { togglePlay } from '../engine';
import { bpm as bpmSignal, isPlaying as isPlayingSignal } from '../state';

export function Controls() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-800 rounded-xl mb-6 shadow-lg border border-slate-700">
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className={`flex items-center justify-center w-14 h-14 rounded-full transition-all flex-shrink-0 ${isPlayingSignal.value
            ? 'bg-rose-500 hover:bg-rose-600 shadow-[0_0_15px_rgba(244,63,94,0.5)]'
            : 'bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
          }`}
        >
          {isPlayingSignal.value ? (
            <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
          ) : (
            <svg className="w-8 h-8 text-white ml-2" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-400 tracking-wider uppercase">Transport</span>
          <span className="text-xl font-bold text-white">{isPlayingSignal.value ? 'PLAYING' : 'STOPPED'}</span>
        </div>
      </div>

      <div className="flex flex-col flex-1 max-w-xs min-w-[200px]">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm font-semibold text-slate-400 tracking-wider uppercase">Tempo</span>
          <span className="text-xl font-mono text-cyan-400">{bpmSignal.value} <span className="text-sm text-slate-500">BPM</span></span>
        </div>
        <input
          type="range"
          min="60"
          max="200"
          value={bpmSignal.value}
          onInput={(e) => bpmSignal.value = parseInt((e.target as HTMLInputElement).value, 10)}
          className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
      </div>
    </div>
  );
}
