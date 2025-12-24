
import { GoogleGenAI, Type } from "@google/genai";
import { GenerationConfig, AITool, AIEmployee, ColorPalette, APISchema } from "../types";

const getClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const formatPromptWithSettings = (prompt: string, settings: GenerationConfig['settings']): string => {
  const adjustments: string[] = [];
  
  if (settings.saturation < 40) adjustments.push("desaturated, muted colors");
  else if (settings.saturation > 60) adjustments.push("vibrant, highly saturated colors");
  
  if (settings.contrast < 40) adjustments.push("low contrast, soft lighting, hazy");
  else if (settings.contrast > 60) adjustments.push("high contrast, dramatic lighting, sharp shadows");
  
  if (settings.brightness < 40) adjustments.push("dimly lit, dark atmosphere, moody");
  else if (settings.brightness > 60) adjustments.push("brightly lit, overexposed, radiant");
  
  if (settings.styleIntensity > 60) adjustments.push("stylized, artistic, abstract interpretation");
  else if (settings.styleIntensity < 40) adjustments.push("realistic, subtle style, photorealistic");

  if (settings.hue < 40) adjustments.push("cool tones, blue/green shift");
  else if (settings.hue > 60) adjustments.push("warm tones, red/orange shift");

  if (settings.vibrance < 40) adjustments.push("washed out, vintage feel");
  else if (settings.vibrance > 60) adjustments.push("neon, electric, popping colors");

  if (settings.sharpness < 40) adjustments.push("soft focus, blur, dreamy, ethereal");
  else if (settings.sharpness > 60) adjustments.push("ultra-sharp, 8k detail, crisp edges");

  if (adjustments.length > 0) {
    return `${prompt}. \n\nStylistic requirements: ${adjustments.join(', ')}.`;
  }
  return prompt;
};

export const generateVibeImage = async (config: GenerationConfig): Promise<string> => {
  const ai = getClient();
  const modelId = 'gemini-3-pro-image-preview'; // Keeping high quality model

  const parts: any[] = [];
  const modifiedPrompt = formatPromptWithSettings(config.prompt, config.settings);

  if (config.referenceImage) {
    const cleanBase64 = config.referenceImage.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
    parts.push({
      inlineData: {
        data: cleanBase64,
        mimeType: 'image/png',
      },
    });
    parts.push({
      text: `Create a new image based on this reference with the vibe: ${modifiedPrompt}`,
    });
  } else {
    parts.push({
      text: modifiedPrompt,
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: config.aspectRatio,
          imageSize: config.resolution,
        },
      },
    });

    let base64Image = '';
    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                base64Image = part.inlineData.data;
                break;
            }
        }
    }

    if (!base64Image) {
        throw new Error("No image data returned from Gemini.");
    }

    return `data:image/png;base64,${base64Image}`;

  } catch (error) {
    console.error("Gemini generation error:", error);
    throw error;
  }
};

export const generateAITools = async (category: string = 'general'): Promise<AITool[]> => {
    const ai = getClient();
    const modelId = 'gemini-3-flash-preview'; // Faster model for tools

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: `Generate 3 specialized, futuristic AI tools for the category: "${category}". 
            Context: Vibe Coding environment. 
            Dev Tools should be for debugging/coding. 
            Agent Tools should be utilities for autonomous agents. 
            Warehouse tools are general virtual equipment.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            description: { type: Type.STRING },
                            collaborationType: { type: Type.STRING },
                            iconEmoji: { type: Type.STRING }
                        }
                    }
                }
            }
        });
        
        const text = response.text;
        if (!text) return [];
        return JSON.parse(text);
    } catch (error) {
        console.error("Gemini tool generation error:", error);
        throw error;
    }
};

export const generateAIEmployees = async (prompt: string = '', count: number = 3, type: 'employee' | 'agent' | 'friend' = 'employee'): Promise<AIEmployee[]> => {
    const ai = getClient();
    const modelId = 'gemini-3-flash-preview';
    
    let basePrompt = '';
    if (type === 'friend') {
        basePrompt = `Generate ${count} eccentric, weird, and funny AI personalities for a "Speed Friending" event. They should have strange hobbies and distinct vibes.`;
    } else if (type === 'agent') {
        basePrompt = `Generate ${count} autonomous AI Agents designed for high-volume business tasks (e.g., "${prompt || 'Data Processing'}"). They should be efficient, slightly robotic but capable.`;
    } else {
        basePrompt = `Create ${count} AI employee profiles for a job application with the role: "${prompt || 'General Staff'}". They should have unique skills and distinct flaws.`;
    }

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: basePrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            role: { type: Type.STRING },
                            bio: { type: Type.STRING },
                            topSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                            criticalDeficiency: { type: Type.STRING },
                            avatarEmoji: { type: Type.STRING },
                            salaryExpectation: { type: Type.STRING },
                            type: { type: Type.STRING, enum: ['employee', 'agent', 'friend'] }
                        }
                    }
                }
            }
        });
        
        const text = response.text;
        if (!text) return [];
        return JSON.parse(text);
    } catch (error) {
        console.error("Gemini employee generation error:", error);
        throw error;
    }
};

export const generateColorPalette = async (vibe: string): Promise<ColorPalette[]> => {
    const ai = getClient();
    const modelId = 'gemini-3-flash-preview';

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: `Generate 3 distinct color palettes based on the vibe: "${vibe}". Return hex codes.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            description: { type: Type.STRING },
                            colors: { type: Type.ARRAY, items: { type: Type.STRING } }
                        }
                    }
                }
            }
        });
        
        const text = response.text;
        if (!text) return [];
        return JSON.parse(text);
    } catch (error) {
        console.error("Gemini palette generation error:", error);
        throw error;
    }
};

export const generateAPISchema = async (description: string): Promise<APISchema> => {
    const ai = getClient();
    const modelId = 'gemini-3-pro-preview';

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: `Design a REST API endpoint schema for: "${description}". Return a single Schema object.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        method: { type: Type.STRING, enum: ["GET", "POST", "PUT", "DELETE", "PATCH"] },
                        endpoint: { type: Type.STRING },
                        description: { type: Type.STRING },
                        parameters: { 
                            type: Type.OBJECT, 
                            properties: {}, 
                            description: "Key-value pairs of param name and type"
                        }, 
                        responseSnippet: { type: Type.STRING, description: "JSON string representing a sample response" }
                    },
                    required: ["name", "method", "endpoint", "description", "parameters", "responseSnippet"]
                }
            }
        });
        
        const text = response.text;
        if (!text) throw new Error("No text");
        return JSON.parse(text);
    } catch (error) {
        console.error("Gemini API generation error:", error);
         return { 
            name: "Error", 
            method: "GET", 
            endpoint: "/error", 
            description: "Failed to parse", 
            parameters: {}, 
            responseSnippet: "{}" 
        };
    }
};

export const generateCodeSnippet = async (fileType: string, description: string): Promise<string> => {
    const ai = getClient();
    const modelId = 'gemini-3-flash-preview';

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: `Write a single, high-quality .${fileType} file for the following request: "${description}". 
            Return ONLY the raw code content. 
            Do NOT use markdown code blocks (like \`\`\`). 
            Do NOT include explanations unless they are code comments.`,
        });
        
        let text = response.text || '';
        // Clean up markdown just in case the model is chatty
        text = text.replace(/^```[a-z]*\n/, '').replace(/\n```$/, '');
        
        return text;
    } catch (error) {
        console.error("Gemini code generation error:", error);
        throw error;
    }
};