
import React, { useState } from 'react';
import { APISchema, InventoryItem } from '../types';
import { generateAPISchema } from '../services/geminiService';
import { IconCode, IconSparkles, IconSave, IconWarehouse } from './Icons';

interface APIGeneratorProps {
  deductCredit: () => boolean;
  onSaveToInventory?: (item: InventoryItem) => void;
}

const APIGenerator: React.FC<APIGeneratorProps> = ({ deductCredit, onSaveToInventory }) => {
  const [prompt, setPrompt] = useState('');
  const [schema, setSchema] = useState<APISchema | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    if (!deductCredit()) return;

    setIsLoading(true);
    try {
      const result = await generateAPISchema(prompt);
      setSchema(result);
    } catch (error) {
      console.error(error);
      alert("Failed to compile API schema.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
      if (schema && onSaveToInventory) {
          onSaveToInventory({
              id: Date.now().toString(),
              type: 'api',
              category: 'api',
              name: `${schema.method} ${schema.endpoint}`,
              content: schema,
              price: 0.10, // Micro-transaction value
              dateCreated: Date.now()
          });
      }
  };

  return (
    <div className="flex flex-col h-full p-4 animate-fade-in max-w-3xl mx-auto w-full">
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
            <IconCode className="w-32 h-32" />
        </div>
        
        <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                <IconCode className="w-6 h-6" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-white">API Schema Forge</h2>
                <p className="text-xs text-gray-400">Define your data contract.</p>
            </div>
        </div>

        {/* Instructions */}
        <div className="mb-4 bg-gray-900/50 p-3 rounded-lg border border-gray-700/50 text-xs text-gray-400 relative z-10">
            <span className="font-bold text-gray-300">How to use:</span> Specify the Method, Endpoint, and Goal. <br/>
            <span className="italic text-gray-500">Ex: "GET /v1/users/profile - Returns user details including avatar and subscription tier."</span>
        </div>
        
        <div className="flex gap-2 relative z-10">
            <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="e.g. POST /auth/login with JWT response..."
                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-green-500 focus:outline-none font-mono text-sm"
            />
            <button 
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className="bg-green-600 hover:bg-green-500 text-white px-6 rounded-xl font-bold disabled:opacity-50 shadow-lg shadow-green-900/20 flex items-center gap-2"
            >
                {isLoading ? <IconSparkles className="w-5 h-5 animate-spin" /> : 'Forge'}
            </button>
        </div>
      </div>

      {schema && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden flex-1 flex flex-col shadow-xl animate-fade-in">
            <div className="bg-gray-900/50 p-4 border-b border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                        schema.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                        schema.method === 'POST' ? 'bg-green-500/20 text-green-400' :
                        schema.method === 'DELETE' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                    }`}>
                        {schema.method}
                    </span>
                    <span className="font-mono text-white text-sm">{schema.endpoint}</span>
                </div>
                <div className="flex items-center gap-2">
                     <span className="text-gray-500 text-xs font-mono hidden md:inline">{schema.name}</span>
                     {onSaveToInventory && (
                        <button 
                            onClick={handleSave}
                            className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                        >
                            <IconSave className="w-3 h-3" />
                            <span>Save to DB</span>
                        </button>
                     )}
                </div>
            </div>
            
            <div className="p-4 overflow-y-auto space-y-6">
                <div>
                    <h3 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Description</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{schema.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Parameters</h3>
                         <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs border border-gray-700/50">
                            {Object.entries(schema.parameters).length > 0 ? (
                                <ul className="space-y-2">
                                    {Object.entries(schema.parameters).map(([key, type]) => (
                                        <li key={key} className="text-gray-300 flex justify-between border-b border-gray-800 pb-1 last:border-0 last:pb-0">
                                            <span className="text-purple-400">{key}</span>
                                            <span className="text-yellow-400/80">{type as string}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <span className="text-gray-600 italic">No parameters required.</span>
                            )}
                        </div>
                    </div>
                     <div>
                        <h3 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Response Preview</h3>
                        <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs border border-gray-700/50 overflow-x-auto">
                            <pre className="text-green-400/90 whitespace-pre-wrap">
                                {schema.responseSnippet}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default APIGenerator;
