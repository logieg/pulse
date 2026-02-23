import { Controls } from './components/Controls';
import { DrumMachine } from './components/DrumMachine';
import { SynthSequencer } from './components/SynthSequencer';
import { activeTab, notification } from './state';

export function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center py-12 px-4 selection:bg-cyan-500/30">
      <div className="w-full max-w-4xl relative">
        {/* Toast Notification */}
        {notification.value && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-6 py-2 rounded-full font-bold tracking-wide shadow-[0_0_15px_rgba(99,102,241,0.5)] z-50">
            {notification.value}
          </div>
        )}

        {/* Header */}
        <header className="mb-10 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-br from-cyan-400 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm pb-1">
              Pulse
            </h1>
            <p className="text-slate-400 font-medium tracking-wide mt-1">Procedural Sequencer</p>
          </div>
          <div className="flex gap-2">
            <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse mt-2 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse mt-2 shadow-[0_0_8px_rgba(99,102,241,0.8)]" style={{animationDelay: '150ms'}}></div>
            <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse mt-2 shadow-[0_0_8px_rgba(244,63,94,0.8)]" style={{animationDelay: '300ms'}}></div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-col gap-6">
          <Controls />
          
          {/* Tabs */}
          <div className="flex gap-4 border-b border-slate-800 pb-2">
            <button
              onClick={() => activeTab.value = 'drums'}
              className={`text-lg font-bold tracking-wider uppercase px-4 py-2 transition-colors ${
                activeTab.value === 'drums' 
                  ? 'text-cyan-400 border-b-2 border-cyan-400' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Drum Machine
            </button>
            <button
              onClick={() => activeTab.value = 'synth'}
              className={`text-lg font-bold tracking-wider uppercase px-4 py-2 transition-colors ${
                activeTab.value === 'synth' 
                  ? 'text-indigo-400 border-b-2 border-indigo-400' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Synth Sequencer
            </button>
          </div>

          {activeTab.value === 'drums' ? <DrumMachine /> : <SynthSequencer />}
        </main>
        
        {/* Footer */}
        <footer className="mt-12 text-center text-slate-500 text-sm font-medium">
          Pure Web Audio API • No Samples • Client Side
        </footer>
      </div>
    </div>
  );
}
