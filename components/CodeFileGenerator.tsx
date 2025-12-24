
import React, { useState } from 'react';
import { generateCodeSnippet } from '../services/geminiService';
import { IconCode, IconSparkles, IconDownload, IconSave } from './Icons';
import { InventoryItem } from '../types';

interface CodeFileGeneratorProps {
  fileType: string;
  deductCredit: () => boolean;
  onSaveToInventory?: (item: InventoryItem) => void;
}

const CodeFileGenerator: React.FC<CodeFileGeneratorProps> = ({ fileType, deductCredit, onSaveToInventory }) => {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    if (!deductCredit()) return;

    setIsLoading(true);
    try {
      const result = await generateCodeSnippet(fileType, prompt);
      setCode(result);
    } catch (error) {
      console.error(error);
      alert(`Failed to generate .${fileType} file.`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
  };

  const handleSave = () => {
      if (code && onSaveToInventory) {
          onSaveToInventory({
              id: Date.now().toString(),
              type: 'code',
              category: fileType,
              name: `${prompt.slice(0, 20)}.${fileType}`,
              content: code,
              price: 0.50,
              dateCreated: Date.now()
          });
      }
  };

  return (
    <div className="flex flex-col h-full p-4 animate-fade-in max-w-4xl mx-auto w-full">
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <IconCode className="w-6 h-6" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-white">Drop In: .{fileType.toUpperCase()}</h2>
                <p className="text-xs text-gray-400">Generate production-ready code snippets.</p>
            </div>
        </div>
        
        <div className="flex gap-2">
            <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder={`Describe the contents of the .${fileType} file...`}
                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            />
            <button 
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 rounded-xl font-bold disabled:opacity-50 shadow-lg shadow-blue-900/20"
            >
                {isLoading ? <IconSparkles className="w-5 h-5 animate-spin" /> : 'Generate'}
            </button>
        </div>
      </div>

      {code && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden flex-1 flex flex-col shadow-xl min-h-[400px]">
            <div className="bg-gray-900/50 p-4 border-b border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="font-mono text-white text-sm">generated_file.{fileType}</span>
                </div>
                <div className="flex gap-2">
                    {onSaveToInventory && (
                        <button 
                            onClick={handleSave}
                            className="text-xs flex items-center gap-1 text-gray-400 hover:text-white transition-colors border border-gray-700 px-2 py-1 rounded bg-gray-800"
                        >
                            <IconSave className="w-3 h-3" />
                            Stock
                        </button>
                    )}
                    <button 
                        onClick={copyToClipboard}
                        className="text-xs flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                    >
                        <IconDownload className="w-4 h-4" />
                        Copy
                    </button>
                </div>
            </div>
            
            <div className="p-0 overflow-y-auto flex-1 relative bg-[#0d1117]">
                <pre className="text-sm font-mono text-gray-300 p-4 leading-relaxed whitespace-pre-wrap">
                    {code}
                </pre>
            </div>
        </div>
      )}
    </div>
  );
};

export default CodeFileGenerator;
