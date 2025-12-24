
import React from 'react';
import { IconSparkles, IconUsers, IconCode, IconWarehouse, IconPalette, IconSettings, IconBrain } from './Icons';

interface Section {
  title: string;
  items: {
    id: string;
    title: string;
    description: string;
    color: string;
    icon: React.ReactNode;
  }[];
}

interface VibePresetsProps {
  onSelect: (presetId: string) => void;
}

const SECTIONS: Section[] = [
  {
    title: "Workforce",
    items: [
      {
        id: 'employee',
        title: 'AI Employee',
        description: 'Local chatbots & task assistants',
        color: 'from-green-500/20 to-emerald-500/20',
        icon: <IconUsers className="w-5 h-5" />
      },
      {
        id: 'agents',
        title: 'Agents',
        description: 'High-volume business task runners',
        color: 'from-blue-500/20 to-indigo-500/20',
        icon: <IconBrain className="w-5 h-5" />
      },
      {
        id: 'friending',
        title: 'Speed Friending',
        description: 'Eccentric AI personalities',
        color: 'from-pink-500/20 to-rose-500/20',
        icon: <IconSparkles className="w-5 h-5" />
      }
    ]
  },
  {
    title: "Development",
    items: [
      {
        id: 'devtools',
        title: 'Dev Tools',
        description: 'Debugging & coding assistants',
        color: 'from-cyan-500/20 to-sky-500/20',
        icon: <IconCode className="w-5 h-5" />
      },
      {
        id: 'agenttools',
        title: 'Agent Tools',
        description: 'Utilities for AI agents',
        color: 'from-violet-500/20 to-purple-500/20',
        icon: <IconSettings className="w-5 h-5" />
      },
      {
        id: 'warehouse',
        title: 'Tool Warehouse',
        description: 'General virtual equipment',
        color: 'from-amber-500/20 to-yellow-500/20',
        icon: <IconWarehouse className="w-5 h-5" />
      }
    ]
  },
  {
    title: "Technical",
    items: [
      {
        id: 'api',
        title: 'API Generator',
        description: 'Compile REST Schemas',
        color: 'from-emerald-500/20 to-teal-500/20',
        icon: <IconCode className="w-5 h-5" />
      },
      {
        id: 'components',
        title: 'Components',
        description: 'Isolated UI elements',
        color: 'from-fuchsia-500/20 to-purple-500/20',
        icon: <IconSparkles className="w-5 h-5" />
      },
      {
        id: 'uiux',
        title: 'UI/UX Patterns',
        description: 'User flow visualizations',
        color: 'from-rose-500/20 to-pink-500/20',
        icon: <IconSparkles className="w-5 h-5" />
      }
    ]
  },
  {
    title: "Design Studio",
    items: [
      {
        id: 'dashboard',
        title: 'Dashboards',
        description: 'Data analytics & controls',
        color: 'from-blue-500/20 to-cyan-500/20',
        icon: <IconSparkles className="w-5 h-5" />
      },
      {
        id: 'landing',
        title: 'Web Pages',
        description: 'Hero sections & marketing',
        color: 'from-purple-500/20 to-pink-500/20',
        icon: <IconSparkles className="w-5 h-5" />
      },
      {
        id: 'mobile',
        title: 'Mobile Apps',
        description: 'iOS & Android flows',
        color: 'from-orange-500/20 to-red-500/20',
        icon: <IconSparkles className="w-5 h-5" />
      },
      {
        id: 'palette',
        title: 'Palette Gen',
        description: 'Chromatic extraction',
        color: 'from-indigo-500/20 to-violet-500/20',
        icon: <IconPalette className="w-5 h-5" />
      }
    ]
  },
  {
    title: "Drop In",
    items: [
      {
        id: 'json',
        title: '.JSON',
        description: 'Structured Objects',
        color: 'from-yellow-500/20 to-orange-500/20',
        icon: <IconCode className="w-5 h-5" />
      },
      {
        id: 'css',
        title: '.CSS',
        description: 'Style Sheets',
        color: 'from-blue-500/20 to-cyan-500/20',
        icon: <IconCode className="w-5 h-5" />
      },
      {
        id: 'js',
        title: '.JS',
        description: 'JavaScript',
        color: 'from-yellow-400/20 to-yellow-600/20',
        icon: <IconCode className="w-5 h-5" />
      },
      {
        id: 'ts',
        title: '.TS',
        description: 'TypeScript',
        color: 'from-blue-600/20 to-blue-800/20',
        icon: <IconCode className="w-5 h-5" />
      },
      {
        id: 'md',
        title: '.MD',
        description: 'Markdown Doc',
        color: 'from-gray-500/20 to-gray-700/20',
        icon: <IconCode className="w-5 h-5" />
      },
      {
        id: 'py',
        title: '.PY',
        description: 'Python Script',
        color: 'from-green-500/20 to-emerald-500/20',
        icon: <IconCode className="w-5 h-5" />
      }
    ]
  }
];

const VibePresets: React.FC<VibePresetsProps> = ({ onSelect }) => {
  return (
    <div className="w-full animate-fade-in pb-10 space-y-10">
      <div className="text-center mb-8 space-y-2">
         <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 tracking-tight">
            System Core
         </h2>
         <p className="text-gray-400 max-w-md mx-auto">
            Select a module to initialize.
         </p>
      </div>

      {SECTIONS.map((section, sIdx) => (
        <div key={sIdx} className="space-y-4">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-1 border-l-4 border-gray-700 ml-1">
            {section.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.items.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(preset.id);
                }}
                className={`group relative h-40 w-full overflow-hidden rounded-xl bg-gradient-to-br ${preset.color} border border-white/5 p-5 text-left transition-all hover:border-white/20 hover:shadow-xl hover:translate-y-[-2px] cursor-pointer z-10`}
              >
                <div className="relative z-20 flex h-full flex-col justify-between pointer-events-none">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-white/90 transition-colors">
                      {preset.title}
                    </h3>
                    <p className="text-sm font-medium text-gray-300/80">
                      {preset.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-white/60 bg-black/20 w-fit p-2 rounded-lg backdrop-blur-md">
                    {preset.icon}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60 pointer-events-none z-10"></div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VibePresets;