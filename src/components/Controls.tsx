import { togglePlay } from '../engine';
import { bpm as bpmSignal, isPlaying as isPlayingSignal } from '../state';
import { saveState, loadState, exportState, importState } from '../storage';
import { useSignal } from '@preact/signals';

export function Controls() {
  const showSettings = useSignal(false);
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
            <svg className="w-8 h-8 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
          ) : (
            <svg className="w-8 h-8 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
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

      <div className="flex gap-2 ml-auto relative">
        <button
          onClick={() => showSettings.value = !showSettings.value}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-semibold rounded-lg transition-colors shadow-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          Settings
        </button>
        {showSettings.value && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 overflow-hidden flex flex-col">
            <button
              onClick={() => { saveState(); showSettings.value = false; }}
              className="px-4 py-3 text-left bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold uppercase tracking-wider transition-colors border-b border-slate-700/50 flex justify-between items-center"
            >
              Save Local
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
            </button>
            <button
              onClick={() => { loadState(); showSettings.value = false; }}
              className="px-4 py-3 text-left bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold uppercase tracking-wider transition-colors border-b border-slate-700/50 flex justify-between items-center"
            >
              Load Local
              <svg className="w-3.5 h-3.5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
            </button>
            <button
              onClick={() => { exportState(); showSettings.value = false; }}
              className="px-4 py-3 text-left bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold uppercase tracking-wider transition-colors border-b border-slate-700/50 flex justify-between items-center"
            >
              Export Code
              <svg className="w-3.5 h-3.5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            </button>
            <button
              onClick={() => { importState(); showSettings.value = false; }}
              className="px-4 py-3 text-left bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold uppercase tracking-wider transition-colors flex justify-between items-center"
            >
              Import Code
              <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
