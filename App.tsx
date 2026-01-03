
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { analyzeWineImage } from './services/geminiService';
import { WineDetails, AppState, UserStats } from './types';
import { ScannerOverlay } from './components/ScannerOverlay';
import { WineResult } from './components/WineResult';
import { Logo } from './components/Logo';
import { SavedCollection } from './components/SavedCollection';

const STORAGE_KEY = 'ai_sommelier_stats_v2';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('landing');
  const [wineDetails, setWineDetails] = useState<WineDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return {
      savedWines: []
    };
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setState('scanning');
      }
    } catch (err) {
      console.error("Camera access denied", err);
      setError("CAMERA ACCESS DENIED: Imperial scanners require permission to operate.");
      setState('error');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleCapture = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
    
    processImage(base64);
  }, []);

  const processImage = async (base64: string) => {
    setState('loading');
    stopCamera();
    try {
      const details = await analyzeWineImage(base64);
      setWineDetails({ ...details, id: Date.now().toString(), scanDate: new Date().toISOString() });
      setState('results');
    } catch (err: any) {
      console.error("App Process Error:", err);
      setError(err.message || "ANALYSIS FAILED: The Imperial core encountered a sensor disruption.");
      setState('error');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      processImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const saveWine = (wine: WineDetails) => {
    setStats(prev => {
      const exists = prev.savedWines.some(w => w.name === wine.name && w.vintage === wine.vintage);
      if (exists) return prev;
      return {
        ...prev,
        savedWines: [wine, ...prev.savedWines]
      };
    });
  };

  const resetApp = () => {
    setWineDetails(null);
    setError(null);
    setState('landing');
  };

  useEffect(() => {
    if (state === 'scanning') {
      startCamera();
    }
    return () => stopCamera();
  }, [state]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#0c0c0c] flex flex-col items-center justify-center text-white selection:bg-rose-500/30">
      <canvas ref={canvasRef} className="hidden" />
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Landing Page */}
      {state === 'landing' && (
        <div className="flex flex-col items-center justify-center space-y-12 animate-in fade-in zoom-in duration-1000 px-8 text-center">
          <div className="relative">
            <div className="absolute -inset-16 bg-rose-700/10 blur-[80px] rounded-full animate-pulse"></div>
            <Logo className="w-56 h-56 relative z-10 filter drop-shadow-[0_0_30px_rgba(155,17,30,0.3)]" />
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-light tracking-[0.4em] uppercase text-amber-500 drop-shadow-lg">AI SOMMELIER</h1>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-amber-600/50 to-transparent mx-auto"></div>
            <p className="text-rose-400/60 text-[11px] tracking-[0.3em] uppercase font-bold">Imperial Viticulture Authority</p>
          </div>
          <div className="flex flex-col items-center space-y-6 w-full max-w-xs">
            <button 
              onClick={() => setState('scanning')}
              className="group relative w-full px-12 py-5 overflow-hidden rounded-full border border-amber-600/30 hover:border-rose-500/50 transition-all duration-700 shadow-[0_0_20px_rgba(212,175,55,0.05)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-rose-950/20 via-rose-900/40 to-rose-950/20 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative text-xs tracking-[0.4em] font-black uppercase text-amber-500 group-hover:text-rose-400 transition-colors">Initiate Scan</span>
            </button>
            <button 
              onClick={() => setState('collection')}
              className="text-[10px] uppercase tracking-[0.25em] text-amber-600/60 hover:text-rose-400 transition-all font-bold flex items-center space-x-2"
            >
              <span>Grand Reserve Archive ({stats.savedWines.length})</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* Camera / Scanning View */}
      {(state === 'scanning' || state === 'loading' || state === 'error') && (
        <div className="relative w-full h-full flex flex-col">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`absolute inset-0 w-full h-full object-cover grayscale opacity-50 ${state !== 'scanning' ? 'hidden' : ''}`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 pointer-events-none" />
          
          <ScannerOverlay 
            state={state}
            onCapture={handleCapture}
            onGalleryClick={() => fileInputRef.current?.click()}
            onOpenCollection={() => setState('collection')}
            isLoading={state === 'loading'}
          />

          {state === 'loading' && (
            <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl z-50 flex flex-col items-center justify-center space-y-10 animate-in fade-in duration-700">
              <div className="relative">
                <Logo className="w-28 h-28 animate-pulse" />
                <div className="absolute inset-0 border-2 border-rose-600/40 rounded-full animate-ping [animation-duration:3s]"></div>
                <div className="absolute -inset-4 border border-amber-500/20 rounded-full animate-spin [animation-duration:8s]"></div>
              </div>
              <div className="text-center space-y-4 px-12">
                <h2 className="text-xl font-bold tracking-[0.3em] uppercase text-amber-500">Decanting Data</h2>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] max-w-[200px] leading-relaxed">Cross-referencing global viticulture archives...</p>
                <div className="flex items-center justify-center space-x-3 pt-4">
                  <span className="w-2 h-2 bg-rose-700 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-rose-800 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-rose-900 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}

          {state === 'error' && (
            <div className="absolute inset-0 bg-black/98 z-[60] flex flex-col items-center justify-center p-10 text-center space-y-10 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-rose-950/40 text-rose-500 rounded-full flex items-center justify-center border border-rose-600/30 shadow-[0_0_50px_rgba(155,17,30,0.3)]">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div className="space-y-6">
                <h2 className="text-2xl font-bold uppercase tracking-[0.3em] text-amber-500">Sensor Disruption</h2>
                <div className="text-rose-100/90 text-xs max-w-sm mx-auto uppercase tracking-widest leading-relaxed font-bold bg-rose-950/40 p-6 rounded-2xl border border-rose-600/30 shadow-xl">
                  {error}
                </div>
              </div>
              <div className="flex flex-col space-y-4 w-full max-w-xs pt-4">
                <button 
                  onClick={resetApp}
                  className="bg-rose-800 hover:bg-rose-700 text-amber-400 px-10 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl border border-amber-500/20 active:scale-95 transition-all"
                >
                  Return to Imperial Core
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results View */}
      {state === 'results' && wineDetails && (
        <WineResult 
          details={wineDetails} 
          onReset={resetApp} 
          onSave={saveWine}
          isSaved={stats.savedWines.some(w => w.name === wineDetails.name && w.vintage === wineDetails.vintage)}
        />
      )}

      {/* Collection View */}
      {state === 'collection' && (
        <SavedCollection 
          savedWines={stats.savedWines} 
          onSelect={(wine) => {
            setWineDetails(wine);
            setState('results');
          }}
          onBack={() => setState('landing')}
        />
      )}
    </div>
  );
};

export default App;
