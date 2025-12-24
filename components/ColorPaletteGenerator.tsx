import React, { useState } from 'react';
import { ColorPalette } from '../types';
import { generateColorPalette } from '../services/geminiService';
import { IconPalette } from './Icons';

interface ColorPaletteGeneratorProps {
  onClose: () => void;
  deductCredit: () => boolean;
}

const ColorPaletteGenerator: React.FC<ColorPaletteGeneratorProps> = ({ onClose, deductCredit }) => {
  const [vibe, setVibe] = useState('');
  const [palettes, setPalettes] = useState<ColorPalette[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!vibe.trim()) return;
    if (!deductCredit()) return;

    setIsLoading(true);
    try {
      const results = await generateColorPalette(vibe);
      setPalettes(results);
    } catch (error) {
      console.error(error);
      alert("Failed to extract colors from the ether.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    // Could add toast notification here
  };

  return (
    <div className="fixed inset-0 z-40 bg-gray-900 flex flex-col animate-fade-in pt-16">
      <div className="p-4 border-b border-gray-800 bg-gray-900">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <IconPalette className="w-6 h-6 text-purple-500" />
            Vibe Palette Generator
        </h2>
        <div className="flex gap-2 max-w-xl">
            <input 
                type="text" 
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="Describe the mood (e.g. Neon Tokyo Rain)..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
            />
            <button 
                onClick={handleGenerate}
                disabled={isLoading || !vibe.trim()}
                className="bg-purple-600 hover:bg-purple-500 text-white px-6 rounded-xl font-bold disabled:opacity-50 shadow-lg shadow-purple-900/20"
            >
                {isLoading ? 'Mixing...' : 'Generate'}
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {palettes.map((palette, idx) => (
            <div key={idx} className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 shadow-xl">
                <div className="flex h-32 md:h-40">
                    {palette.colors.map((color, cIdx) => (
                        <div 
                            key={cIdx} 
                            style={{ backgroundColor: color }} 
                            className="flex-1 group relative cursor-pointer"
                            onClick={() => copyToClipboard(color)}
                        >
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity">
                                <span className="text-white text-xs font-mono font-bold drop-shadow-md">{color}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4">
                    <h3 className="text-white font-bold text-lg">{palette.name}</h3>
                    <p className="text-gray-400 text-sm">{palette.description}</p>
                    <div className="mt-3 flex gap-2">
                        {palette.colors.map((color, cIdx) => (
                             <span key={cIdx} className="text-[10px] text-gray-500 font-mono bg-gray-900 px-1.5 py-0.5 rounded">
                                 {color}
                             </span>
                        ))}
                    </div>
                </div>
            </div>
        ))}

        {palettes.length === 0 && !isLoading && (
             <div className="text-center text-gray-600 mt-20">
                <IconPalette className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>Enter a vibe to visualize its chromatic essence.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ColorPaletteGenerator;