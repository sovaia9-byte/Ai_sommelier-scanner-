
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { analyzeWineImage } from './services/geminiService';
import { WineDetails, AppState, UserStats } from './types';
import { ScannerOverlay } from './components/ScannerOverlay';
import { WineResult } from './components/WineResult';
import { Logo } from './components/Logo';
import { SavedCollection } from './components/SavedCollection';
import { StripeModal } from './components/StripeModal';

const STORAGE_KEY = 'ai_sommelier_stats';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('landing');
  const [wineDetails, setWineDetails] = useState<WineDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStripeOpen, setIsStripeOpen] = useState(false);
  
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return {
      points: 100,
      isPremium: false,
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
      setError("Camera access is required for scanning.");
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
    
    if (!stats.isPremium && stats.points < 10) {
      setError("Reserve points depleted. Upgrade to Ruby Premium for infinite scan capacity.");
      setState('error');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
    
    processImage(base64);
  }, [stats]);

  const processImage = async (base64: string) => {
    setState('loading');
    stopCamera();
    try {
      const details = await analyzeWineImage(base64);
      
      if (!stats.isPremium) {
        setStats(prev => ({ ...prev, points: Math.max(0, prev.points - 10) }));
      }

      setWineDetails({ ...details, id: Date.now().toString(), scanDate: new Date().toISOString() });
      setState('results');
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Please ensure the label is adequately illuminated.");
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

  const handlePremiumSuccess = () => {
    setStats(prev => ({ ...prev, isPremium: true }));
    setIsStripeOpen(false);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#0c0c0c] flex flex-col items-center justify-center text-white">
      <canvas ref={canvasRef} className="hidden" />
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        className="hidden" 
      />

      <StripeModal 
        isOpen={isStripeOpen} 
        onClose={() => setIsStripeOpen(false)} 
        onSuccess={handlePremiumSuccess} 
      />

      {/* Landing Page */}
      {state === 'landing' && (
        <div className="flex flex-col items-center justify-center space-y-12 animate-in fade-in zoom-in duration-1000">
          <div className="relative">
            <div className="absolute -inset-10 bg-rose-700/20 blur-3xl rounded-full"></div>
            <Logo className="w-52 h-52 relative z-10" />
          </div>
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-light tracking-[0.4em] uppercase text-amber-500">AI Sommelier</h1>
            <p className="text-rose-400/50 text-[10px] tracking-widest uppercase font-bold">Imperial Viticulture Analysis</p>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <button 
              onClick={() => setState('scanning')}
              className="group relative px-12 py-4 overflow-hidden rounded-full border border-amber-600/30 hover:border-rose-500/50 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-rose-950/20 group-hover:bg-rose-900/40 transition-colors"></div>
              <span className="relative text-sm tracking-[0.3em] font-bold uppercase text-amber-500 group-hover:text-rose-500 transition-colors">Initiate Protocol</span>
            </button>
            <button 
              onClick={() => setState('collection')}
              className="text-[10px] uppercase tracking-widest text-amber-600/60 hover:text-rose-400 transition-colors font-semibold"
            >
              Access Cellar Archive ({stats.savedWines.length})
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
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 pointer-events-none" />
          
          <ScannerOverlay 
            onCapture={handleCapture}
            onGalleryClick={() => fileInputRef.current?.click()}
            onOpenCollection={() => setState('collection')}
            onUpgrade={() => setIsStripeOpen(true)}
            isLoading={state === 'loading'}
            points={stats.points}
            isPremium={stats.isPremium}
          />

          {state === 'loading' && (
            <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl z-50 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
              <div className="relative">
                <Logo className="w-24 h-24 animate-pulse" />
                <div className="absolute inset-0 border-2 border-rose-600/30 rounded-full animate-ping"></div>
              </div>
              <div className="text-center space-y-3">
                <h2 className="text-lg font-bold tracking-[0.2em] uppercase text-amber-500">Extracting Aroma</h2>
                <div className="flex items-center justify-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}

          {state === 'error' && (
            <div className="absolute inset-0 bg-black/98 z-50 flex flex-col items-center justify-center p-8 text-center space-y-8 animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-rose-900/20 text-rose-500 rounded-full flex items-center justify-center border border-rose-600/30">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold uppercase tracking-widest text-amber-500">Sensor Disruption</h2>
                <p className="text-rose-200/50 text-xs max-w-xs mx-auto uppercase tracking-wider leading-relaxed font-medium">{error}</p>
              </div>
              <div className="flex flex-col space-y-3 w-full max-w-xs">
                {stats.points < 10 && !stats.isPremium && (
                  <button 
                    onClick={() => setIsStripeOpen(true)}
                    className="bg-rose-700 text-amber-400 px-10 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] transition-all shadow-lg border border-amber-500/20"
                  >
                    Authorize Imperial Access
                  </button>
                )}
                <button 
                  onClick={resetApp}
                  className="bg-rose-950/40 hover:bg-rose-900/60 text-amber-100/80 px-10 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] border border-amber-600/20 transition-all"
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
