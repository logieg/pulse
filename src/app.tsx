import { Controls } from './components/Controls';
import { Grid } from './components/Grid';

export function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center py-12 px-4 selection:bg-cyan-500/30">
      <div className="w-full max-w-4xl">
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
          <Grid />
        </main>
        
        {/* Footer */}
        <footer className="mt-12 text-center text-slate-500 text-sm font-medium">
          Pure Web Audio API • No Samples • Client Side
        </footer>
      </div>
    </div>
  );
}
