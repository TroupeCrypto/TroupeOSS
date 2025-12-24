
import React from 'react';
import { AspectRatio, ImageResolution, VibeSettings } from '../types';

interface ControlsProps {
  aspectRatio: AspectRatio;
  setAspectRatio: (ar: AspectRatio) => void;
  resolution: ImageResolution;
  setResolution: (res: ImageResolution) => void;
  settings: VibeSettings;
  setSettings: (settings: VibeSettings) => void;
}

const SliderControl: React.FC<{
  label: string;
  value: number;
  onChange: (val: number) => void;
}> = ({ label, value, onChange }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs text-gray-400 uppercase tracking-wider">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <input
      type="range"
      min="0"
      max="100"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
    />
  </div>
);

const Controls: React.FC<ControlsProps> = ({ 
  aspectRatio, 
  setAspectRatio, 
  resolution, 
  setResolution,
  settings,
  setSettings
}) => {
  const updateSetting = (key: keyof VibeSettings, value: number) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <div className="w-full bg-gray-800/95 border-t border-gray-700 p-4 space-y-6 backdrop-blur-sm max-h-[60vh] overflow-y-auto">
      {/* Vibe Tuning */}
      <div className="space-y-3 pb-2 border-b border-gray-700/50">
        <h3 className="text-sm font-bold text-white mb-2">Vibe Tuning</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <SliderControl 
            label="Saturation" 
            value={settings.saturation} 
            onChange={(v) => updateSetting('saturation', v)} 
          />
          <SliderControl 
            label="Contrast" 
            value={settings.contrast} 
            onChange={(v) => updateSetting('contrast', v)} 
          />
          <SliderControl 
            label="Brightness" 
            value={settings.brightness} 
            onChange={(v) => updateSetting('brightness', v)} 
          />
           <SliderControl 
            label="Style Intensity" 
            value={settings.styleIntensity} 
            onChange={(v) => updateSetting('styleIntensity', v)} 
          />
          <SliderControl 
            label="Hue" 
            value={settings.hue} 
            onChange={(v) => updateSetting('hue', v)} 
          />
          <SliderControl 
            label="Vibrance" 
            value={settings.vibrance} 
            onChange={(v) => updateSetting('vibrance', v)} 
          />
          <SliderControl 
            label="Sharpness" 
            value={settings.sharpness} 
            onChange={(v) => updateSetting('sharpness', v)} 
          />
        </div>
      </div>

      {/* Basic Settings */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Aspect Ratio</label>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {Object.values(AspectRatio).map((ratio) => (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  aspectRatio === ratio
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Resolution</label>
          <div className="flex gap-2">
            {Object.values(ImageResolution).map((res) => (
              <button
                key={res}
                onClick={() => setResolution(res)}
                className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  resolution === res
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {res}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;