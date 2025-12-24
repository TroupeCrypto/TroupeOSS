import React, { useState, useEffect } from 'react';
import { AITool } from '../types';
import { generateAITools } from '../services/geminiService';
import { IconBrain, IconClose, IconWarehouse, IconCode, IconSettings } from './Icons';

interface ToolWarehouseProps {
  category: 'dev' | 'agent' | 'general';
  deductCredit: () => boolean;
}

const ToolWarehouse: React.FC<ToolWarehouseProps> = ({ category, deductCredit }) => {
  const [tools, setTools] = useState<AITool[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Reset when category changes
  useEffect(() => {
    setTools([]);
    setHasGenerated(false);
  }, [category]);

  const handleGenerateTools = async () => {
    if (!deductCredit()) return;
    setIsLoading(true);
    try {
      const newTools = await generateAITools(category);
      setTools(prev => [...newTools, ...prev]);
      setHasGenerated(true);
    } catch (error) {
      console.error(error);
      alert("Failed to manufacture new tools.");
    } finally {
      setIsLoading(false);
    }
  };

  const getHeaderInfo = () => {
    switch (category) {
      case 'dev':
        return {
          title: 'Dev Tool Forge',
          subtitle: 'Next-Gen debugging & coding assistants',
          icon: <IconCode className="w-6 h-6" />,
          color: 'text-green-400',
          bg: 'bg-green-500/10'
        };
      case 'agent':
        return {
          title: 'Agent Armory',
          subtitle: 'Autonomous tools for AI agents',
          icon: <IconSettings className="w-6 h-6" />,
          color: 'text-purple-400',
          bg: 'bg-purple-500/10'
        };
      default:
        return {
          title: 'General Warehouse',
          subtitle: 'Virtual equipment for any task',
          icon: <IconWarehouse className="w-6 h-6" />,
          color: 'text-blue-400',
          bg: 'bg-blue-500/10'
        };
    }
  };

  const header = getHeaderInfo();

  return (
    <div className="flex flex-col h-full bg-gray-900 animate-fade-in w-full max-w-4xl mx-auto rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-800/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${header.color} ${header.bg}`}>
                {header.icon}
            </div>
            <div>
                <h2 className="text-lg font-bold text-white">{header.title}</h2>
                <p className="text-xs text-gray-400">{header.subtitle}</p>
            </div>
        </div>
        
        <button 
            onClick={handleGenerateTools}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
                isLoading 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20'
            }`}
        >
            {isLoading ? 'Forging...' : 'Manufacture New Batch'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 min-h-[400px]">
        {!hasGenerated && tools.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-6">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center animate-pulse bg-gray-800`}>
                    <IconWarehouse className="w-10 h-10 text-gray-600" />
                </div>
                <div className="max-w-xs">
                    <h3 className="text-xl font-bold text-white mb-2">Inventory Empty</h3>
                    <p className="text-gray-400">
                        Initialize the forge to manufacture specialized {category === 'dev' ? 'developer' : category === 'agent' ? 'agent' : ''} tools.
                    </p>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tools.map((tool, idx) => (
                <div key={idx} className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-primary/50 transition-all group">
                    <div className="flex items-start justify-between mb-3">
                        <div className="text-3xl bg-gray-900 w-12 h-12 flex items-center justify-center rounded-lg shadow-inner">
                            {tool.iconEmoji || '📦'}
                        </div>
                        <span className="text-xs font-mono text-gray-400 bg-gray-900 px-2 py-1 rounded border border-gray-700">
                            v1.0
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">{tool.name}</h3>
                    <p className="text-sm text-gray-300 mb-4 leading-relaxed">{tool.description}</p>
                    
                    <div className="border-t border-gray-700 pt-3 mt-auto">
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Collaboration</p>
                        <p className="text-xs text-gray-400">{tool.collaborationType}</p>
                    </div>
                </div>
            ))}
            
            {/* Loading Skeleton */}
            {isLoading && (
                <>
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-800/50 border border-gray-800 rounded-xl p-5 animate-pulse">
                        <div className="w-12 h-12 bg-gray-700 rounded-lg mb-3"></div>
                        <div className="h-6 bg-gray-700 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-700 rounded w-full mb-4"></div>
                        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    </div>
                ))}
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default ToolWarehouse;
