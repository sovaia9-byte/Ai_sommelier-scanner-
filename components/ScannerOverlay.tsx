import React from 'react';
import { Logo } from './Logo';
import { AppState } from '../types';

interface ScannerOverlayProps {
  state: AppState;
  onCapture: () => void;
  onGalleryClick: () => void;
  onOpenCollection: () => void;
  isLoading: boolean;
}

export const ScannerOverlay: React.FC<ScannerOverlayProps> = ({ 
  state,
  onCapture, 
  onGalleryClick, 
  onOpenCollection,
  isLoading
}) => {
  const isScanning = state === 'scanning';

  return (
    <div className="absolute inset-0 z-10 flex flex-col pointer-events-none overflow-hidden">
      {/* Scanning Line Animation */}
      {isScanning && <div className="scanner-line" />}

      {/* Header HUD */}
      <div className="pt-10 px-6 flex justify-between items-start w-full">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-3">
            <Logo className="w-8 h-8" />
            <div className="text-rose-600 uppercase tracking-[0.3em] text-[10px] font-bold">AI Sommelier</div>
          </div>
          <div className="bg-rose-950/40 border border-rose-600/30 px-3 py-1 rounded-full text-[9px] text-amber-500 font-bold uppercase tracking-widest backdrop-blur-sm">
            Neural Scan Active
          </div>
        </div>
        <div className="flex flex-col items-end opacity-40">
           <div className="text-[8px] uppercase tracking-widest text-white">Sensor: 4K Optic</div>
           <div className="text-[8px] uppercase tracking-widest text-white">Status: Locked</div>
        </div>
      </div>

      {/* Main Scanner Area - Now Full Screen instead of a small box */}
      <div className="flex-grow flex items-center justify-center relative">
        {isScanning && (
          <div className="w-full h-full relative">
             {/* Corner Accents for the whole screen */}
             <div className="absolute top-10 left-6 w-10 h-10 border-t-2 border-l-2 border-rose-600 opacity-50"></div>
             <div className="absolute top-10 right-6 w-10 h-10 border-t-2 border-r-2 border-rose-600 opacity-50"></div>
             <div className="absolute bottom-10 left-6 w-10 h-10 border-b-2 border-l-2 border-rose-600 opacity-50"></div>
             <div className="absolute bottom-10 right-6 w-10 h-10 border-b-2 border-r-2 border-rose-600 opacity-50"></div>
             
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/20 border border-white/5 px-4 py-2 rounded-lg backdrop-blur-[2px]">
                   <span className="text-white/40 text-[9px] tracking-[0.5em] uppercase font-medium">Ready for capture</span>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Footer Area */}
      <div className="pb-10 pt-4 flex flex-col items-center space-y-8 bg-gradient-to-t from-black via-black/40 to-transparent">
        <button 
          onClick={onGalleryClick}
          className="pointer-events-auto flex items-center space-x-3 bg-white/5 border border-white/10 px-6 py-3 rounded-full backdrop-blur-xl hover:bg-white/10 transition-all active:scale-95"
        >
          <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <span className="text-white/80 tracking-[0.2em] text-[9px] font-bold uppercase">Import from Photo</span>
        </button>

        <div className="flex items-center justify-between w-full px-12 pb-4">
          <div className="flex flex-col items-center space-y-1 opacity-40">
             <div className="w-10 h-10 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
             </div>
             <span className="text-[9px] text-white font-bold tracking-widest uppercase">Scanner</span>
          </div>

          <div className="relative pointer-events-auto">
            <button 
              onClick={onCapture}
              disabled={isLoading}
              className="w-20 h-20 rounded-full border-2 border-white/30 flex items-center justify-center p-1.5 transition-all hover:border-amber-500 active:scale-90 disabled:opacity-30"
            >
              <div className="w-full h-full bg-rose-600 rounded-full shadow-[0_0_20px_rgba(225,29,72,0.4)]"></div>
            </button>
            {isScanning && (
              <div className="absolute -inset-4 border border-rose-600/20 rounded-full animate-ping [animation-duration:2s]"></div>
            )}
          </div>

          <button 
            onClick={onOpenCollection}
            className="flex flex-col items-center space-y-1 pointer-events-auto opacity-70 hover:opacity-100 transition-opacity"
          >
             <div className="w-10 h-10 flex items-center justify-center text-amber-500">
                <Logo className="w-6 h-6" />
             </div>
             <span className="text-[9px] text-amber-500 font-bold tracking-widest uppercase">Cellar</span>
          </button>
        </div>
      </div>
    </div>
  );
};