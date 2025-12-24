

export enum AspectRatio {
  SQUARE = "1:1",
  PORTRAIT_2_3 = "2:3",
  LANDSCAPE_3_2 = "3:2",
  PORTRAIT_3_4 = "3:4",
  LANDSCAPE_4_3 = "4:3",
  PORTRAIT_9_16 = "9:16",
  LANDSCAPE_16_9 = "16:9",
  CINEMATIC_21_9 = "21:9"
}

export enum ImageResolution {
  RES_1K = "1K",
  RES_2K = "2K",
  RES_4K = "4K"
}

export interface GeneratedImage {
  id: string;
  base64: string;
  prompt: string;
  category: string; // Added to prevent bleeding between tabs
  aspectRatio: AspectRatio;
  resolution: ImageResolution;
  timestamp: number;
}

export interface VibeSettings {
  saturation: number; // 0-100, default 50
  contrast: number;   // 0-100, default 50
  brightness: number; // 0-100, default 50
  styleIntensity: number; // 0-100, default 50
  hue: number;        // 0-100, default 50
  vibrance: number;   // 0-100, default 50
  sharpness: number;  // 0-100, default 50
}

export interface AITool {
  name: string;
  description: string;
  collaborationType: string;
  iconEmoji: string;
}

export interface AIEmployee {
  name: string;
  role: string;
  bio: string;
  topSkills: string[];
  criticalDeficiency: string; // The "flaw"
  avatarEmoji: string;
  salaryExpectation: string;
  type?: 'employee' | 'agent' | 'friend';
}

export interface ColorPalette {
  name: string;
  description: string;
  colors: string[]; // Hex codes
}

export interface APISchema {
    name: string;
    method: string;
    endpoint: string;
    description: string;
    parameters: Record<string, string>;
    responseSnippet: string;
}

export interface GenerationConfig {
  prompt: string;
  aspectRatio: AspectRatio;
  resolution: ImageResolution;
  referenceImage?: string; // base64 string for remixing
  settings: VibeSettings;
}

export interface UserCredits {
  tier1: number; // Complex: Dashboards, Home Pages, Mobile Pages
  tier2: number; // Simple: Tools, UI Components, Palettes, Employees
}

export type TabId = 'home' | 'employee' | 'agents' | 'friending' | 'devtools' | 'agenttools' | 'warehouse' | 'api' | 'components' | 'uiux' | 'palette' | 'dashboard' | 'landing' | 'mobile' | 'json' | 'css' | 'js' | 'ts' | 'md' | 'py' | 'admin';

// Backend / Store Types
export type InventoryType = 'image' | 'code' | 'employee' | 'palette' | 'api' | 'tool';

export interface InventoryItem {
    id: string;
    type: InventoryType;
    category: string;
    name: string; // or Prompt
    content: any; // The actual data (base64, code string, object)
    price: number; // Simulated price
    dateCreated: number;
}
