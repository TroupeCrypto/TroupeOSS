import React, { useState, useEffect } from 'react';
import { AIEmployee } from '../types';
import { generateAIEmployees } from '../services/geminiService';
import { IconUsers, IconBrain, IconSparkles } from './Icons';

interface AIEmployeeGeneratorProps {
  mode: 'employee' | 'agents' | 'friending';
  deductCredit: () => boolean;
}

const AIEmployeeGenerator: React.FC<AIEmployeeGeneratorProps> = ({ mode, deductCredit }) => {
  const [promptInput, setPromptInput] = useState('');
  const [employees, setEmployees] = useState<AIEmployee[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Clear results when switching major modes
  useEffect(() => {
    setEmployees([]);
    setPromptInput('');
  }, [mode]);

  const handleGenerate = async () => {
    if (!deductCredit()) return;

    setIsLoading(true);
    try {
      const typeMap = {
          'employee': 'employee',
          'agents': 'agent',
          'friending': 'friend'
      } as const;

      const type = typeMap[mode];
      const count = mode === 'friending' ? 1 : 3;
      
      const newEmployees = await generateAIEmployees(promptInput, count, type);
      setEmployees(newEmployees);
    } catch (error) {
      console.error(error);
      alert("Failed to generate profiles.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaceholder = () => {
      if (mode === 'agents') return "Task for autonomous agents (e.g. Data entry optimization)...";
      if (mode === 'employee') return "Job Role (e.g. Senior Rust Engineer)...";
      return "Random generation...";
  };

  const getTitle = () => {
    if (mode === 'agents') return "Autonomous Workforce";
    if (mode === 'friending') return "Speed Friending";
    return "Talent Acquisition";
  };

  return (
    <div className="h-full flex flex-col animate-fade-in max-w-4xl mx-auto w-full p-4">
        <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">{getTitle()}</h2>
            <p className="text-gray-400 text-sm">
                {mode === 'friending' ? "Meet eccentric AI personalities." : "Scale your virtual operations."}
            </p>
        </div>

       {/* Input Section */}
       {mode !== 'friending' && (
            <div className="mb-8">
                <div className="flex gap-2 max-w-2xl mx-auto">
                    <input 
                        type="text" 
                        value={promptInput}
                        onChange={(e) => setPromptInput(e.target.value)}
                        placeholder={getPlaceholder()}
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none"
                    />
                    <button 
                        onClick={handleGenerate}
                        disabled={isLoading || !promptInput.trim()}
                        className="bg-primary hover:bg-primary-hover text-white px-6 rounded-xl font-bold disabled:opacity-50 shadow-lg shadow-primary/25"
                    >
                        {isLoading ? 'Processing...' : 'Recruit'}
                    </button>
                </div>
            </div>
       )}

       {mode === 'friending' && (
            <div className="flex justify-center mb-8">
                <button 
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="bg-pink-600 hover:bg-pink-500 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-pink-900/20 flex items-center gap-2 transform active:scale-95 transition-all"
                >
                    {isLoading ? <IconSparkles className="w-5 h-5 animate-spin" /> : <IconUsers className="w-5 h-5" />}
                    Meet Someone New
                </button>
            </div>
       )}

       {/* Results Grid */}
       <div className={`grid gap-4 ${mode === 'friending' ? 'max-w-md mx-auto w-full' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
            {employees.map((emp, idx) => (
                <div key={idx} className="bg-gray-800 border border-gray-700 rounded-xl p-6 relative overflow-hidden group hover:border-gray-500 transition-all flex flex-col h-full">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl select-none group-hover:scale-110 transition-transform grayscale group-hover:grayscale-0">
                        {emp.avatarEmoji}
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-inner ${
                            mode === 'agents' ? 'bg-purple-900/50' : 
                            mode === 'friending' ? 'bg-pink-900/50' : 'bg-blue-900/50'
                        }`}>
                            {emp.avatarEmoji}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white leading-tight">{emp.name}</h3>
                            <p className={`text-xs font-bold uppercase tracking-wider ${
                                mode === 'agents' ? 'text-purple-400' : 
                                mode === 'friending' ? 'text-pink-400' : 'text-blue-400'
                            }`}>
                                {emp.role}
                            </p>
                        </div>
                    </div>

                    <div className="flex-1">
                        <p className="text-sm text-gray-300 mb-4 line-clamp-3 italic">"{emp.bio}"</p>
                        
                        <div className="space-y-3">
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">Top Skills</p>
                                <div className="flex flex-wrap gap-1">
                                    {emp.topSkills.map((skill, sIdx) => (
                                        <span key={sIdx} className="bg-gray-900 text-gray-400 text-xs px-2 py-1 rounded border border-gray-700">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="pt-2 border-t border-gray-700/50">
                                <p className="text-[10px] text-red-400/80 uppercase tracking-widest font-semibold mb-1">
                                    {mode === 'agents' ? 'Optimization Constraint' : 'Critical Flaw'}
                                </p>
                                <p className="text-xs text-red-300">{emp.criticalDeficiency}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
       </div>
    </div>
  );
};

export default AIEmployeeGenerator;
