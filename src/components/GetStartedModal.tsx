import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GetStartedModal: React.FC<GetStartedModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1600);
    }
  };

  return (
    <div
      id="get-started-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="get-started-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="bg-[#ffffff] border border-[#c3c5d8] rounded-2xl w-full max-w-md shadow-2xl p-6 relative overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#737687] hover:text-[#181c21] p-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <BrandLogo size="lg" />
          </div>
          <h3 className="text-xl font-bold font-headline text-[#181c21]">
            Experience Precision Markets
          </h3>
          <p className="text-xs text-[#434656] mt-1.5">
            Institutional-grade charts, real-time tick streaming, and cross-asset market intelligence.
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center py-6 bg-[#089981]/10 border border-[#089981]/30 rounded-xl">
            <span className="material-symbols-outlined text-4xl text-[#089981] mb-1 block">
              check_circle
            </span>
            <h4 className="font-bold text-sm text-[#089981]">Welcome to Precision Markets Pro</h4>
            <p className="text-xs text-[#434656] mt-1">Terminal connection verified.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#181c21] block mb-1">
                Enter your work or trader email
              </label>
              <input
                type="email"
                required
                placeholder="trader@hedgefund.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#f7f9ff] border border-[#c3c5d8] rounded-xl p-3 text-sm text-[#181c21] focus:border-[#0049db] focus:ring-1 focus:ring-[#0049db] focus:outline-none"
              />
            </div>

            <div className="space-y-2 text-xs text-[#434656]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#089981] text-[16px]">check</span>
                <span>Zero-latency streaming WebSocket ticks</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#089981] text-[16px]">check</span>
                <span>Global Indices, Equities, Futures, Forex & Bonds</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#089981] text-[16px]">check</span>
                <span>Unlimited custom watchlists and price alerts</span>
              </div>
            </div>

            <button
              type="submit"
              className="gradient-bg w-full text-white py-3 rounded-xl font-bold text-sm tracking-wide shadow-md hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer mt-2"
            >
              Launch Pro Access (Free 30 Days)
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
