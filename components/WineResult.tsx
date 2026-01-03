
import React, { useState } from 'react';
import { WineDetails } from '../types';

interface WineResultProps {
  details: WineDetails;
  onReset: () => void;
  onSave: (wine: WineDetails) => void;
  isSaved?: boolean;
}

export const WineResult: React.FC<WineResultProps> = ({ details, onReset, onSave, isSaved: initialIsSaved }) => {
  const [isSaved, setIsSaved] = useState(initialIsSaved);

  const handleSave = () => {
    onSave(details);
    setIsSaved(true);
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white pb-20 p-6 space-y-8 max-w-2xl mx-auto overflow-y-auto">
      <div className="flex items-center justify-between">
         <button onClick={onReset} className="p-2 -ml-2 text-white/60 hover:text-rose-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
         </button>
         <h1 className="text-sm font-bold tracking-widest uppercase text-amber-500">Imperial Insight</h1>
         <div className="flex items-center">
            {!isSaved ? (
              <button onClick={handleSave} className="text-rose-600 hover:text-rose-400 transition-colors">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
              </button>
            ) : (
              <div className="text-amber-500">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
              </div>
            )}
         </div>
      </div>

      <header className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold">{details.name}</h2>
          <p className="text-rose-600 font-semibold tracking-wide uppercase text-sm">
            {details.vintage} — {details.region}, {details.country}
          </p>
        </div>
        <div className="flex items-center space-x-4">
           <div className="bg-rose-900/30 border border-rose-600/50 px-3 py-1 rounded text-amber-400 text-xs font-bold uppercase">
             Rating: {details.rating}
           </div>
           <div className="bg-amber-900/10 border border-amber-600/30 px-3 py-1 rounded text-white/80 text-xs font-bold uppercase">
             ABV: {details.abv}
           </div>
        </div>
      </header>

      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-amber-600/50">Sommelier's Exposition</h3>
        <p className="text-white/80 leading-relaxed text-sm">{details.description}</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
           <h4 className="text-[10px] font-bold uppercase tracking-widest text-amber-600/50">Cuvée Composition</h4>
           <p className="text-sm">{details.grapesVariety}</p>
        </div>
        <div className="space-y-2">
           <h4 className="text-[10px] font-bold uppercase tracking-widest text-amber-600/50">Macro-Climate</h4>
           <p className="text-sm">{details.climate}</p>
        </div>
        <div className="space-y-2">
           <h4 className="text-[10px] font-bold uppercase tracking-widest text-amber-600/50">Geological Matrix</h4>
           <p className="text-sm">{details.soilStructure}</p>
        </div>
        <div className="space-y-2">
           <h4 className="text-[10px] font-bold uppercase tracking-widest text-amber-600/50">Organoleptic Perception</h4>
           <p className="text-sm italic">"{details.judgmentPerception}"</p>
        </div>
      </div>

      <section className="space-y-4 bg-rose-950/20 border border-amber-600/20 p-4 rounded-xl">
        <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500">Palate & Aroma</h3>
        <p className="text-rose-100/90 leading-relaxed text-sm">{details.tastingNotes}</p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-amber-600/50">Culinary Alliances</h3>
        <div className="flex flex-wrap gap-2">
          {details.foodPairings.map((food, i) => (
            <span key={i} className="bg-rose-900/10 border border-rose-600/30 px-3 py-1 rounded-full text-xs text-rose-100/80">
              {food}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-3 bg-amber-500/5 border border-amber-500/10 p-5 rounded-2xl">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
          <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500">Viticultural Trivia</h3>
        </div>
        <p className="text-sm text-amber-100/70 leading-relaxed italic">{details.funFact}</p>
      </section>

      <div className="pt-8">
        <button 
          onClick={onReset}
          className="w-full bg-rose-700 text-amber-400 font-bold py-4 rounded-xl uppercase tracking-[0.2em] text-xs hover:bg-rose-600 transition-colors shadow-lg border border-amber-500/30"
        >
          Archive & Re-Scan
        </button>
      </div>
    </div>
  );
};
