
import React, { useState, useEffect } from 'react';
import { AspectRatio, ImageResolution, GeneratedImage, VibeSettings, UserCredits, TabId, InventoryItem } from './types';
import { generateVibeImage } from './services/geminiService';
import { initStorage, saveItem, getItems, deleteItem } from './services/storageService';
import { IconSparkles, IconSettings, IconKey, IconClose, IconWarehouse, IconUsers, IconPalette, IconCode, IconShield, IconTrash, IconDownload, IconSave } from './components/Icons';
import Lightbox from './components/Lightbox';
import Controls from './components/Controls';
import ToolWarehouse from './components/ToolWarehouse';
import VibePresets from './components/VibePresets';
import CreditSystem from './components/CreditSystem';
import AIEmployeeGenerator from './components/AIEmployeeGenerator';
import ColorPaletteGenerator from './components/ColorPaletteGenerator';
import APIGenerator from './components/APIGenerator';
import CodeFileGenerator from './components/CodeFileGenerator';
import AdminDashboard from './components/AdminDashboard';

const VIBE_SUGGESTIONS = [
    "Describe your vibe (e.g., rainy cyberpunk lo-fi)...",
    "Try: 'A futuristic garden in a Mars glass dome'",
    "Try: '90s anime style coffee shop, cozy'",
    "Try: 'Vaporwave sunset highway, outrun style'",
    "Try: 'Isometric pixel art bedroom, messy'",
    "Try: 'Bioluminescent underwater city, 4k'",
    "Try: 'Noir detective office, rainy window'",
    "Try: 'Pastel goth tea party in a forest'"
];

const App: React.FC = () => {
  // Authentication State
  const [apiKeyVerified, setApiKeyVerified] = useState<boolean>(false);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [showAdmin, setShowAdmin] = useState(false);

  // Image Gen State
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [resolution, setResolution] = useState<ImageResolution>(ImageResolution.RES_1K);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  
  // UI Toggles & Metadata
  const [showSettings, setShowSettings] = useState(false);
  const [referenceImage, setReferenceImage] = useState<GeneratedImage | null>(null);
  const [placeholderText, setPlaceholderText] = useState(VIBE_SUGGESTIONS[0]);

  // Persistent Inventory State (managed by storageService, but reflected here)
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  // Initialize Storage Service
  useEffect(() => {
    initStorage().then(() => {
        loadInventory();
    });
  }, []);

  const loadInventory = async () => {
      const items = await getItems();
      setInventory(items);
  };

  const handleSaveToInventory = async (item: InventoryItem) => {
      const success = await saveItem(item);
      if (success) {
          alert("Asset saved to warehouse.");
          loadInventory();
      } else {
          alert("Item already exists or save failed.");
      }
  };

  // Advanced Vibe Settings
  const [vibeSettings, setVibeSettings] = useState<VibeSettings>({
    saturation: 50,
    contrast: 50,
    brightness: 50,
    styleIntensity: 50,
    hue: 50,
    vibrance: 50,
    sharpness: 50
  });

  // Credits System
  const [credits, setCredits] = useState<UserCredits>(() => {
      const saved = localStorage.getItem('vibe_credits');
      return saved ? JSON.parse(saved) : { tier1: 2, tier2: 3 };
  });

  useEffect(() => {
      localStorage.setItem('vibe_credits', JSON.stringify(credits));
  }, [credits]);

  // Rotate Placeholder Effect
  useEffect(() => {
      const interval = setInterval(() => {
          setPlaceholderText(prev => {
              const currentIndex = VIBE_SUGGESTIONS.indexOf(prev);
              const nextIndex = (currentIndex + 1) % VIBE_SUGGESTIONS.length;
              return VIBE_SUGGESTIONS[nextIndex];
          });
      }, 3500);
      return () => clearInterval(interval);
  }, []);

  // Update Settings/Prompt based on Tab Selection
  useEffect(() => {
      if (activeTab === 'mobile') {
          setAspectRatio(AspectRatio.PORTRAIT_9_16);
          setPrompt('');
          setPlaceholderText("Describe the mobile app interface (e.g. Fintech iOS app)...");
      } else if (activeTab === 'landing') {
          setAspectRatio(AspectRatio.LANDSCAPE_3_2);
          setPrompt('');
          setPlaceholderText("Describe the landing page (e.g. SaaS hero section)...");
      } else if (activeTab === 'dashboard') {
          setAspectRatio(AspectRatio.LANDSCAPE_16_9);
          setPrompt('');
          setPlaceholderText("Describe the analytics dashboard (e.g. Cyberpunk data center)...");
      } else if (activeTab === 'components' || activeTab === 'uiux') {
          setAspectRatio(AspectRatio.SQUARE);
          setPlaceholderText("Describe the UI component (e.g. Glassmorphism card)...");
      } else if (['json', 'css', 'js', 'ts', 'md', 'py'].includes(activeTab)) {
          setPlaceholderText(`Describe contents for .${activeTab} file...`);
      } else if (activeTab === 'home') {
          setPlaceholderText(VIBE_SUGGESTIONS[0]);
      }
  }, [activeTab]);

  // Initial API Key Verification
  useEffect(() => {
    const verifyKey = async () => {
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setApiKeyVerified(hasKey);
      } else {
         setApiKeyVerified(true);
      }
    };
    verifyKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
        await window.aistudio.openSelectKey();
        setApiKeyVerified(true);
    }
  };

  const handlePurchase = (tier: 'tier1' | 'tier2', amount: number) => {
      const price = tier === 'tier1' ? 5.00 : 0.99;
      if (window.confirm(`Process payment of $${price} for ${amount} ${tier === 'tier1' ? 'Pro' : 'Basic'} credits?`)) {
          setCredits(prev => ({
              ...prev,
              [tier]: prev[tier] + amount
          }));
      }
  };

  const deductCredit = (tier: 'tier1' | 'tier2'): boolean => {
      if (credits[tier] > 0) {
          setCredits(prev => ({ ...prev, [tier]: prev[tier] - 1 }));
          return true;
      } else {
          alert(`Insufficient ${tier === 'tier1' ? 'Pro' : 'Basic'} credits. Please top up to continue.`);
          return false;
      }
  };

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return;
    if (!deductCredit('tier1')) return;

    setIsLoading(true);
    setShowSettings(false); 

    try {
      const base64Data = await generateVibeImage({
        prompt: prompt,
        aspectRatio: aspectRatio,
        resolution: resolution,
        referenceImage: referenceImage?.base64,
        settings: vibeSettings
      });

      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        base64: base64Data,
        prompt: prompt,
        category: activeTab, // VITAL: Tags image with current tab to prevent bleeding
        aspectRatio,
        resolution,
        timestamp: Date.now()
      };

      setImages(prev => [newImage, ...prev]);
      if (referenceImage) {
        setReferenceImage(null);
      }
    } catch (error) {
        console.error("Generation failed", error);
        setCredits(prev => ({ ...prev, tier1: prev.tier1 + 1 })); // Refund on failure

        if (error instanceof Error && error.message.includes("Requested entity was not found")) {
            setApiKeyVerified(false);
            alert("API Key session expired or invalid. Please select your key again.");
        } else {
            alert("Failed to generate vibe. Please try again.");
        }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = async (id: string) => {
      if(window.confirm("Delete this vibe?")) {
        // If it was saved to inventory, we should delete it from there too if desired, 
        // but currently we just delete from the session view.
        setImages(prev => prev.filter(img => img.id !== id));
      }
  };

  // Deletion from Admin Dashboard
  const handleAdminDelete = async (id: string) => {
      await deleteItem(id);
      loadInventory(); // Refresh
  };

  const saveImageToInventory = (image: GeneratedImage) => {
      handleSaveToInventory({
          id: image.id,
          type: 'image',
          category: image.category,
          name: image.prompt.slice(0, 30),
          content: image.base64,
          price: 1.00,
          dateCreated: image.timestamp
      });
  };

  const handleRemix = (image: GeneratedImage) => {
    setReferenceImage(image);
    setPrompt(image.prompt);
    setSelectedImage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePresetSelect = (presetId: string) => {
    setActiveTab(presetId as TabId);
  };

  // Auth Screen
  if (!apiKeyVerified) {
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-primary/20">
                <IconKey className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Access Required</h1>
            <p className="text-gray-400 mb-8 max-w-md">
                To generate high-fidelity 4K vibes, you must connect a valid Gemini API key from a paid GCP project.
            </p>
            <button 
                onClick={handleSelectKey}
                className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg shadow-primary/30 flex items-center gap-2"
            >
                <IconKey className="w-5 h-5" />
                Select API Key
            </button>
            <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-6 text-sm text-gray-500 hover:text-gray-300 underline"
            >
                Billing Documentation
            </a>
        </div>
    );
  }

  // Determine if we are in an image generation mode
  const isImageMode = ['dashboard', 'landing', 'mobile', 'components', 'uiux'].includes(activeTab);
  const isCodeMode = ['json', 'css', 'js', 'ts', 'md', 'py'].includes(activeTab);

  // Filter images for the current tab to prevent bleeding
  const currentTabImages = images.filter(img => img.category === activeTab);

  return (
    <div className="min-h-screen bg-gray-900 pb-32">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
             <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" 
                        onClick={() => setActiveTab('home')}
                    >
                        <div className="w-8 h-8 bg-gradient-to-tr from-primary to-blue-500 rounded-lg flex items-center justify-center">
                            <IconSparkles className="text-white w-5 h-5" />
                        </div>
                        <span className="font-bold text-lg tracking-tight hidden md:block text-white">VibeCoder</span>
                    </button>
                    {activeTab === 'home' && (
                        <button 
                            onClick={() => setShowAdmin(true)}
                            className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded flex items-center gap-1 hover:bg-red-500/20 transition-colors"
                        >
                            <IconShield className="w-3 h-3" />
                            Backend
                        </button>
                    )}
                </div>
                <CreditSystem credits={credits} onPurchase={handlePurchase} />
            </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 container mx-auto max-w-4xl min-h-[50vh]">
            
            {showAdmin && (
                <AdminDashboard 
                    inventory={inventory}
                    setInventory={setInventory} // Optimistic updates
                    refreshData={loadInventory} // Cloud sync
                    onClose={() => setShowAdmin(false)}
                />
            )}

            {/* Dashboard / Home */}
            {activeTab === 'home' && (
                <div className="py-4">
                    <VibePresets onSelect={handlePresetSelect} />
                </div>
            )}

            {/* Back Button for Sub-pages */}
            {activeTab !== 'home' && (
                <button onClick={() => setActiveTab('home')} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <IconClose className="w-4 h-4" /> <span>Back to Dashboard</span>
                </button>
            )}

            {/* Specialized Generators */}
            {(activeTab === 'employee' || activeTab === 'agents' || activeTab === 'friending') && (
                <AIEmployeeGenerator 
                    mode={activeTab} 
                    deductCredit={() => deductCredit('tier2')} 
                />
            )}

            {(activeTab === 'devtools' || activeTab === 'agenttools' || activeTab === 'warehouse') && (
                <ToolWarehouse 
                    category={activeTab === 'devtools' ? 'dev' : activeTab === 'agenttools' ? 'agent' : 'general'}
                    deductCredit={() => deductCredit('tier2')}
                />
            )}

            {activeTab === 'api' && (
                <APIGenerator 
                    deductCredit={() => deductCredit('tier2')} 
                    onSaveToInventory={handleSaveToInventory}
                />
            )}

            {isCodeMode && (
                <CodeFileGenerator 
                    fileType={activeTab}
                    deductCredit={() => deductCredit('tier2')} 
                    onSaveToInventory={handleSaveToInventory}
                />
            )}

            {activeTab === 'palette' && (
                <div className="relative min-h-[600px]">
                    <ColorPaletteGenerator 
                        onClose={() => setActiveTab('home')}
                        deductCredit={() => deductCredit('tier2')}
                    />
                </div>
            )}

            {/* Image Generation Gallery */}
            {isImageMode && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {currentTabImages.length === 0 && !isLoading && (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500 text-center">
                            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4 opacity-50">
                                <IconSparkles className="w-8 h-8" />
                            </div>
                            <p>Ready to generate visuals for <span className="text-primary font-bold capitalize">{activeTab}</span>.</p>
                            <p className="text-xs mt-2 text-gray-600">Enter a prompt below to begin.</p>
                        </div>
                    )}
                    
                    {isLoading && (
                        <div 
                            style={{ aspectRatio: aspectRatio.replace(':', '/') }}
                            className={`bg-gray-800 rounded-xl animate-pulse border border-gray-700 flex items-center justify-center w-full`}
                        >
                            <IconSparkles className="w-8 h-8 text-gray-600 animate-spin" />
                        </div>
                    )}

                    {currentTabImages.map((img) => (
                        <div 
                            key={img.id}
                            className="group relative bg-gray-800 rounded-xl overflow-hidden cursor-pointer border border-gray-800 hover:border-primary/50 transition-all aspect-square"
                        >
                            <img 
                                onClick={() => setSelectedImage(img)}
                                src={img.base64} 
                                alt={img.prompt}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"
                            />
                            {/* Hover Actions */}
                            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleDeleteImage(img.id); }}
                                    className="p-1.5 bg-black/60 hover:bg-red-500/80 rounded-lg text-white backdrop-blur-sm transition-colors"
                                    title="Delete"
                                >
                                    <IconTrash className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); saveImageToInventory(img); }}
                                    className="p-1.5 bg-black/60 hover:bg-green-500/80 rounded-lg text-white backdrop-blur-sm transition-colors"
                                    title="Save to Warehouse"
                                >
                                    <IconSave className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2 pointer-events-none">
                                 <p className="text-xs text-white truncate w-full">{img.prompt}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>

        {/* Bottom Bar Controls (Only for Image Modes) */}
        {isImageMode && (
            <div className="fixed bottom-0 left-0 right-0 z-40">
                {showSettings && (
                    <Controls 
                        aspectRatio={aspectRatio}
                        setAspectRatio={setAspectRatio}
                        resolution={resolution}
                        setResolution={setResolution}
                        settings={vibeSettings}
                        setSettings={setVibeSettings}
                    />
                )}
                
                <div className="bg-gray-900 border-t border-gray-800 p-4 pb-6">
                    {referenceImage && (
                        <div className="flex items-center justify-between bg-gray-800 rounded-t-lg p-2 px-3 -mt-16 mb-2 border border-primary/30 mx-auto max-w-2xl w-full">
                            <div className="flex items-center gap-2">
                                <img src={referenceImage.base64} className="w-8 h-8 rounded object-cover border border-gray-600" />
                                <span className="text-xs text-primary font-medium">Remixing Active</span>
                            </div>
                            <button onClick={() => setReferenceImage(null)} className="text-gray-400 hover:text-white">
                                <IconClose className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    <div className="max-w-2xl mx-auto flex gap-2">
                        <button 
                            onClick={() => setShowSettings(!showSettings)}
                            className={`p-3 rounded-xl border transition-colors ${showSettings ? 'bg-gray-800 border-primary text-primary' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'}`}
                        >
                            <IconSettings className="w-6 h-6" />
                        </button>
                        
                        <div className="flex-1 bg-gray-800 border border-gray-700 rounded-xl flex items-center pr-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                            <input 
                                type="text" 
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleGenerateImage()}
                                placeholder={placeholderText}
                                className="bg-transparent border-none text-white placeholder-gray-500 text-sm w-full p-3 focus:outline-none"
                            />
                        </div>

                        <button 
                            onClick={handleGenerateImage}
                            disabled={isLoading || !prompt.trim()}
                            className={`p-3 rounded-xl font-bold transition-all flex items-center justify-center ${
                                isLoading || !prompt.trim() 
                                ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                                : 'bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/25'
                            }`}
                        >
                            {isLoading ? (
                                <IconSparkles className="w-6 h-6 animate-spin" />
                            ) : (
                                <IconSparkles className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Lightbox */}
        {selectedImage && (
            <Lightbox 
                image={selectedImage}
                onClose={() => setSelectedImage(null)}
                onRemix={handleRemix}
            />
        )}
    </div>
  );
};

export default App;
