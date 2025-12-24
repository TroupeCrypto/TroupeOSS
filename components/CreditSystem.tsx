import React from 'react';
import { UserCredits } from '../types';
import { IconCoin, IconSparkles } from './Icons';

interface CreditSystemProps {
  credits: UserCredits;
  onPurchase: (tier: 'tier1' | 'tier2', amount: number) => void;
}

const CreditSystem: React.FC<CreditSystemProps> = ({ credits, onPurchase }) => {
  return (
    <div className="w-full bg-gray-900 border-b border-gray-800 p-2">
      <div className="container mx-auto max-w-4xl flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Tier 1 (Pro)</span>
                <div className="flex items-center gap-1 text-primary-hover font-bold">
                    <IconSparkles className="w-4 h-4" />
                    <span>{credits.tier1} Left</span>
                </div>
            </div>
             <div className="w-px h-8 bg-gray-800"></div>
            <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Tier 2 (Basic)</span>
                <div className="flex items-center gap-1 text-blue-400 font-bold">
                    <IconCoin className="w-4 h-4" />
                    <span>{credits.tier2} Left</span>
                </div>
            </div>
        </div>

        <div className="flex gap-2">
             <button 
                onClick={() => onPurchase('tier2', 3)}
                className="text-xs bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg border border-gray-700 transition-colors flex items-center gap-1"
             >
                <span className="text-gray-400">$0.99</span>
                <span>Top Up T2</span>
             </button>
             <button 
                 onClick={() => onPurchase('tier1', 2)}
                 className="text-xs bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded-lg shadow-lg shadow-primary/20 transition-colors flex items-center gap-1"
             >
                <span className="text-white/80">$5.00</span>
                <span>Top Up T1</span>
             </button>
        </div>
      </div>
    </div>
  );
};

export default CreditSystem;