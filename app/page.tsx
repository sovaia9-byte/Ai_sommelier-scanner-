
'use client';

// @google/genai guidelines followed: Using property access for response.text and correct initialization.
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { analyzeWineImage } from '../services/geminiService';
import { WineDetails, AppState, UserStats } from '../types';
import { ScannerOverlay } from '../components/ScannerOverlay';
import { WineResult } from '../components/WineResult';
import { Logo } from '../components/Logo';
import { SavedCollection } from '../components/SavedCollection';

const STORAGE_KEY = 'ai_sommelier_global_archive';

// Define AIStudio interface for key management to match global definitions
interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    // Use readonly modifier to match potential existing global definitions of aistudio
    readonly aistudio: AIStudio;
  }
}

export default function Home() {
  const [state, setState] = useState<AppState>('landing');
  const [wineDetails, setWineDetails] = useState<WineDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [stats, setStats] = useState<UserStats>({ savedWines: [] });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize stats from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setStats(JSON.parse(saved));
    } catch (e) {
      console.warn("Storage access failed", e);
    }
  }, []);

  useEffect(() => {
    if (stats.savedWines.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    }
  }, [stats]);

  useEffect(() => {
    let activeStream: MediaStream | null = null;

    if (state === 'scanning' && videoRef.current) {
      const initCamera = async () => {
        try {
          const videoConstraints: any = { 
            facingMode: 'environment', 
            width: { ideal: 3840 }, 
            height: { ideal: 2160 },
            focusMode: 'continuous'
          };
          const stream = await navigator.mediaDevices.getUserMedia({
            video: videoConstraints
          });
          activeStream = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Camera access failed:", err);
          setError("CAMERA ERROR: Optical sensor access denied. Please check permissions.");
          setState('error');
        }
      };
      initCamera();
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [state]);

  const resetApp = useCallback(() => {
    setWineDetails(null);
    setError(null);
    setState('landing');
  }, []);

  const handleStartScanner = async () => {
    if (!process.env.API_KEY) {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await window.aistudio.openSelectKey();
        }
      }
    }
    setState('scanning');
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
    processImage(canvas.toDataURL('image/jpeg', 0.98).split(',')[1]);
  }, []);

  const processImage = async (base64: string) => {
    setState('loading');
    try {
      const details = await analyzeWineImage(base64);
      setWineDetails({ ...details, id: Date.now().toString(), scanDate: new Date().toISOString() });
      setState('results');
    } catch (err: any) {
      console.error("Processing Error:", err);
      let friendlyMessage = "Imperial sensor disruption. Ensure the label is clear and well-lit.";
      
      if (err.message === "MISSING_API_KEY" || err.message === "INVALID_KEY") {
        friendlyMessage = "AUTHORIZATION ERROR: A valid API key is required. Check Vercel Environment Variables.";
        if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
           await window.aistudio.openSelectKey();
        }
      } else if (err.message === "QUOTA_EXHAUSTED") {
        friendlyMessage = "SYSTEM ALERT: Quota exceeded. Please check your API usage limits.";
      }
      
      setError(friendlyMessage);
      setState('error');
    }
  };

  const handleSaveWine = (wine: WineDetails) => {
    setStats(prev => {
      if (prev.savedWines.some(w => w.name === wine.name && w.vintage === wine.vintage)) return prev;
      return { ...prev, savedWines: [wine, ...prev.savedWines] };
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = (event.target?.result as string)?.split(',')[1];
        if (base64) processImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative h-screen w-screen bg-ruby-radial flex flex-col items-center justify-center overflow-hidden selection:bg-rose-500/30">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
        accept="image/*" 
        className="hidden" 
      />

      {state === 'landing' && (
        <div className="flex flex-col items-center justify-center w-full h-full p-8 animate-in fade-in duration-1000">
          <div className="mb-12 relative flex justify-center">
            <div className="absolute inset-0 bg-[#9b111e]/40 blur-[100px] rounded-full scale-150 animate-pulse"></div>
            <Logo className="w-32 h-32 relative z-10" />
          </div>

          <div className="text-center w-full max-w-xs select-none mb-10">
            <div className="flex flex-col items-center space-y-1">
              <div className="text-[#d4af37] text-[2.6rem] font-light tracking-[0.4em] mr-[-0.4em] leading-none uppercase">AI</div>
              <div className="text-[#d4af37] text-[1.6rem] font-light tracking-[0.25em] mr-[-0.25em] uppercase leading-none">SOMMELIER</div>
            </div>
            <div className="relative flex items-center justify-center w-full mt-7 mb-4">
              <div className="h-[0.5px] w-24 bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent"></div>
            </div>
            <p className="text-[#b25c6c] font-medium tracking-[0.3em] uppercase text-[8px] opacity-80">IMPERIAL VITICULTURE PROTOCOL</p>
          </div>

          <div className="flex flex-col w-full max-w-[240px] space-y-10 items-center">
            <button 
              onClick={handleStartScanner}
              className="w-full bg-[#2d080a]/30 border border-[#d4af37]/20 hover:border-[#d4af37]/50 hover:bg-[#4a0404]/40 rounded-full py-4 px-4 transition-all active:scale-95 shadow-[0_0_40px_rgba(74,4,4,0.3)] group relative overflow-hidden backdrop-blur-md"
            >
              <span className="text-[#d4af37] font-bold uppercase tracking-[0.25em] text-[11px]">START SCANNER</span>
            </button>

            <div className="flex flex-col items-center space-y-4">
              <button 
                onClick={() => setState('collection')}
                className="flex items-center space-x-2 text-[#d4af37]/50 hover:text-[#d4af37] transition-all uppercase tracking-[0.2em] text-[9px] font-bold"
              >
                <span>THE CELLAR ({stats.savedWines.length})</span>
                <span className="text-sm opacity-40 leading-none">→</span>
              </button>
              <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[8px] uppercase tracking-[0.3em] text-white/30 hover:text-[#d4af37] transition-colors"
              >
                Billing Documentation
              </a>
            </div>
          </div>
        </div>
      )}

      {(state === 'scanning' || state === 'loading') && (
        <div className="absolute inset-0 z-20">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className={`absolute inset-0 w-full h-full object-cover ${state !== 'scanning' ? 'opacity-0' : 'opacity-100'} transition-opacity duration-700`}
          />
          <canvas ref={canvasRef} className="hidden" />
          <ScannerOverlay 
            state={state}
            onCapture={handleCapture}
            onGalleryClick={() => fileInputRef.current?.click()}
            onOpenCollection={() => setState('collection')}
            isLoading={state === 'loading'}
          />
          {state === 'loading' && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-3xl">
              <Logo className="w-24 h-24 mb-10 animate-pulse" />
              <div className="text-center space-y-4">
                <p className="text-[#d4af37] font-black tracking-[0.5em] uppercase text-xs animate-pulse">Neural Decoding</p>
                <p className="text-white/20 text-[8px] uppercase tracking-widest max-w-[180px] leading-relaxed mx-auto">Interrogating high-fidelity viticultural archives...</p>
              </div>
            </div>
          )}
        </div>
      )}

      {state === 'results' && wineDetails && (
        <div className="absolute inset-0 z-30 bg-ruby-radial overflow-y-auto">
          <WineResult 
            details={wineDetails} 
            onReset={resetApp} 
            onSave={handleSaveWine}
            isSaved={stats.savedWines.some(w => w.name === wineDetails.name && w.vintage === wineDetails.vintage)}
          />
        </div>
      )}

      {state === 'collection' && (
        <div className="absolute inset-0 z-30 bg-ruby-radial overflow-y-auto">
          <SavedCollection 
            savedWines={stats.savedWines} 
            onSelect={(wine) => {
              setWineDetails(wine);
              setState('results');
            }}
            onBack={resetApp}
          />
        </div>
      )}

      {state === 'error' && (
        <div className="flex flex-col items-center justify-center min-h-screen w-full p-10 text-center bg-ruby-radial animate-in zoom-in duration-300">
          <div className="w-24 h-24 bg-rose-950/20 border border-rose-600/30 rounded-full flex items-center justify-center text-rose-500 mb-10">
             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
             </svg>
          </div>
          <div className="space-y-6 max-w-sm mb-12">
            <h2 className="text-3xl font-light uppercase tracking-[0.4em] text-[#d4af37]">System Alert</h2>
            <div className="bg-rose-950/30 p-8 rounded-3xl border border-rose-600/10 backdrop-blur-md">
              <p className="text-rose-100/60 text-[11px] leading-relaxed uppercase tracking-[0.2em]">
                {error || "Technical disruption in the Imperial sensor array."}
              </p>
            </div>
          </div>
          <div className="flex flex-col w-full max-w-xs space-y-4">
            <button 
              onClick={resetApp}
              className="w-full bg-[#2d080a] border border-[#d4af37]/40 text-[#d4af37] py-4 rounded-full font-bold uppercase tracking-[0.2em] text-[11px]"
            >
              Return to Dashboard
            </button>
            <button 
              onClick={async () => {
                if (window.aistudio) await window.aistudio.openSelectKey();
                resetApp();
              }}
              className="w-full bg-amber-500/10 border border-amber-500/20 text-amber-500 py-3 rounded-full font-bold uppercase tracking-[0.2em] text-[9px]"
            >
              Update API Key
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
