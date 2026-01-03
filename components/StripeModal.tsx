
import React, { useState } from 'react';

interface StripeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const StripeModal: React.FC<StripeModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#1a0505] text-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-amber-600/30 animate-in zoom-in-95 duration-300">
        <div className="bg-rose-900 p-6 text-amber-400 flex justify-between items-center border-b border-amber-600/20">
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M13.911 11.235a3.9 3.9 0 00-1.543-1.07 1.83 1.83 0 011.543 1.07zm-1.157 1.543a3.9 3.9 0 00-1.543-1.071 1.83 1.83 0 011.543 1.071zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.924 14.39a3.9 3.9 0 01-1.543-1.07 1.83 1.83 0 001.543 1.07zm1.157-1.543a3.9 3.9 0 01-1.543-1.07 1.83 1.83 0 001.543 1.07z"/></svg>
            <span className="font-bold tracking-tight uppercase text-xs">Imperial Unlocked</span>
          </div>
          <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-amber-500">$10.00</div>
            <div className="text-sm text-rose-300/60 mt-1 uppercase tracking-widest font-medium">Perpetual Unlimited</div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-amber-600/50">Credit Instrument</label>
              <div className="border border-amber-600/20 rounded-lg p-4 flex items-center space-x-4 bg-black/40">
                <div className="flex-grow text-sm font-mono tracking-widest opacity-80">4242 4242 4242 4242</div>
                <div className="text-[10px] text-amber-500/60 uppercase font-bold">01/26 CVC</div>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-[10px] text-rose-300/40 italic">
               <svg className="w-4 h-4 text-amber-600/50" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zM10 2.25a10.741 10.741 0 01-7.744 3.033A10.741 10.741 0 012.25 7c0 4.605 2.943 8.522 7 9.97 4.057-1.448 7-5.365 7-9.97 0-.967-.103-1.91-.299-2.817A10.741 10.741 0 0110 2.25z" clipRule="evenodd" /></svg>
               <span>Encrypted Transaction via Stripe Vault</span>
            </div>
          </div>

          <button 
            onClick={handlePay}
            disabled={loading}
            className="w-full bg-rose-700 hover:bg-rose-600 text-amber-400 font-bold py-4 rounded-lg transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 flex items-center justify-center border border-amber-500/30"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              'Initiate Unlimited Scan Authority'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
