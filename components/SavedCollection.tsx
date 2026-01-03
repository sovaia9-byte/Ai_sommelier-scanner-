
import React from 'react';
import { WineDetails } from '../types';
import { Logo } from './Logo';

interface SavedCollectionProps {
  savedWines: WineDetails[];
  onSelect: (wine: WineDetails) => void;
  onBack: () => void;
}

export const SavedCollection: React.FC<SavedCollectionProps> = ({ savedWines, onSelect, onBack }) => {
  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white p-6 max-w-2xl mx-auto w-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-2 -ml-2 text-white/60 hover:text-rose-500 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-sm font-bold tracking-[0.3em] uppercase text-amber-500">Grand Reserve Cellar</h1>
        <div className="w-6 h-6"></div>
      </div>

      {savedWines.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center space-y-4 opacity-30">
          <Logo className="w-24 h-24" />
          <p className="text-xs uppercase tracking-widest text-amber-100">Cellar currently vacant</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {savedWines.map((wine) => (
            <button
              key={wine.id}
              onClick={() => onSelect(wine)}
              className="bg-rose-950/20 border border-amber-600/30 p-5 rounded-2xl flex items-center justify-between group hover:bg-rose-900/30 transition-all text-left"
            >
              <div className="space-y-1">
                <h3 className="font-bold text-lg group-hover:text-amber-400 transition-colors">{wine.name}</h3>
                <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-rose-300/60">
                  <span>{wine.vintage}</span>
                  <span>•</span>
                  <span>{wine.region}</span>
                </div>
              </div>
              <div className="bg-rose-900/40 border border-amber-500/20 px-3 py-1 rounded-lg text-amber-500 font-bold text-xs">
                {wine.rating}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
