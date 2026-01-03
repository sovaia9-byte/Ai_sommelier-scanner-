
import React from 'react';
import { Logo } from './Logo';

interface ScannerOverlayProps {
  onCapture: () => void;
  onGalleryClick: () => void;
  onOpenCollection: () => void;
  onUpgrade: () => void;
  isLoading: boolean;
  points: number;
  isPremium: boolean;
}

export const ScannerOverlay: React.FC<ScannerOverlayProps> = ({ 
  onCapture, 
  onGalleryClick, 
  onOpenCollection,
  onUpgrade,
  isLoading, 
  points, 
  isPremium 
}) => {
  return (
    <div className="absolute inset-0 z-10 flex flex-col pointer-events-none">
      {/* Header */}
      <div className="pt-10 px-6 flex justify-between items-start w-full">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-3">
            <Logo className="w-8 h-8" />
            <div className="text-rose-600 uppercase tracking-[0.3em] text-[10px] font-bold">AI Sommelier</div>
          </div>
          <div className="pointer-events-auto">
            {!isPremium ? (
              <button 
                onClick={onUpgrade}
                className="bg-rose-900/30 border border-rose-600/50 px-3 py-1 rounded-full text-[9px] text-amber-400 font-bold uppercase tracking-widest hover:bg-rose-900/50 transition-all"
              >
                Upgrade to Ruby Premium
              </button>
            ) : (
              <div className="bg-amber-900/30 border border-amber-600/50 px-3 py-1 rounded-full text-[9px] text-rose-500 font-bold uppercase tracking-widest">
                Imperial Member
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end space-y-2 pointer-events-auto">
           <div className="bg-rose-950/40 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] text-white/80 border border-amber-600/30 flex flex-col items-end">
             <div className="flex items-center space-x-2">
               <span className="opacity-60 uppercase tracking-tighter">Reserves</span>
               <span className="font-bold text-amber-400">{isPremium ? 'UNLIMITED' : `${points} PTS`}</span>
             </div>
             {!isPremium && (
               <div className="w-24 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                 <div className="h-full bg-rose-600" style={{ width: `${(points / 100) * 100}%` }}></div>
               </div>
             )}
           </div>
        </div>
      </div>

      {/* Main Scanner Frame */}
      <div className="flex-grow flex items-center justify-center relative">
        <div className="w-64 h-96 relative">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-amber-500 rounded-tl-xl"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-amber-500 rounded-tr-xl"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-amber-500 rounded-bl-xl"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-amber-500 rounded-br-xl"></div>
          
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="text-amber-500/60 text-[10px] tracking-[0.2em] uppercase font-bold text-center w-full mt-40">
                {points < 10 && !isPremium ? 'Depleted Points' : 'Frame the vintage'}
             </div>
          </div>
        </div>
      </div>

      {/* Footer Area */}
      <div className="pb-10 pt-4 flex flex-col items-center space-y-8 bg-gradient-to-t from-black via-rose-950/40 to-transparent">
        <button 
          onClick={onGalleryClick}
          className="pointer-events-auto flex items-center space-x-3 bg-rose-900/20 border border-amber-500/20 px-8 py-4 rounded-full backdrop-blur-md hover:bg-rose-900/40 transition-colors"
        >
          <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <span className="text-amber-100/90 tracking-[0.2em] text-[10px] font-bold uppercase">Library Import</span>
        </button>

        <div className="flex items-center justify-between w-full px-12 pb-4">
          <div className="flex flex-col items-center space-y-1 opacity-100">
             <div className="w-10 h-10 flex items-center justify-center">
                <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
             </div>
             <span className="text-[10px] text-rose-600 font-bold tracking-widest uppercase">Scan</span>
          </div>

          <div className="relative pointer-events-auto">
            <button 
              onClick={onCapture}
              disabled={isLoading || (points < 10 && !isPremium)}
              className="w-16 h-16 rounded-full border-4 border-amber-500 flex items-center justify-center p-1 transition-transform active:scale-95 disabled:opacity-30"
            >
              <div className="w-full h-full bg-rose-700 rounded-full"></div>
            </button>
            <div className="absolute -inset-2 border border-rose-600/30 rounded-full"></div>
          </div>

          <button 
            onClick={onOpenCollection}
            className="flex flex-col items-center space-y-1 pointer-events-auto opacity-70 hover:opacity-100 transition-opacity"
          >
             <div className="w-10 h-10 flex items-center justify-center text-amber-500">
                <Logo className="w-6 h-6" />
             </div>
             <span className="text-[10px] text-amber-500 font-bold tracking-widest uppercase">Cellar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
