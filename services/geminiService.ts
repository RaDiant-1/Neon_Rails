import { GoogleGenAI, Type } from "@google/genai";
import { AIResponseStation, AIResponseEvent } from '../types';

// Initialize the API client
// Note: process.env.API_KEY is injected by the runtime environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = 'gemini-2.5-flash';

export const generateStationDetails = async (): Promise<AIResponseStation> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: "Generate a unique, futuristic cyberpunk metro station. It should have a name, a short atmospheric description (max 20 words), and a type (RESIDENTIAL, COMMERCIAL, INDUSTRIAL, or CYBERNETIC).",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            type: { type: Type.STRING }
          },
          required: ["name", "description", "type"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text returned from AI");
    return JSON.parse(text) as AIResponseStation;
  } catch (error) {
    console.error("AI Station Gen Error:", error);
    return {
      name: `Sector ${Math.floor(Math.random() * 9000)}`,
      description: "Data corrupted. A generic industrial zone.",
      type: "INDUSTRIAL"
    };
  }
};

export const generateRandomGameEvent = async (currentReputation: number): Promise<AIResponseEvent> => {
  try {
    const prompt = `Generate a random short event for a futuristic metro system. Current reputation is ${currentReputation}.
    Return JSON with: title, description (max 15 words), impactType (positive, negative, neutral), and creditChange (integer between -200 and 200).`;
    
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            impactType: { type: Type.STRING },
            creditChange: { type: Type.INTEGER }
          },
          required: ["title", "description", "impactType", "creditChange"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text returned from AI");
    return JSON.parse(text) as AIResponseEvent;
  } catch (error) {
    console.error("AI Event Gen Error:", error);
    return {
      title: "Signal Lost",
      description: "Communications disruption in the lower sectors.",
      impactType: "neutral",
      creditChange: 0
    };
  }
};

export const chatWithPassenger = async (stationName: string, message: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: `You are a tired, cynical commuter in a cyberpunk metro station named "${stationName}". Reply to this message: "${message}". Keep it short (max 25 words) and slang-heavy.`,
        });
        return response.text || "...";
    } catch (e) {
        return "The passenger ignores you.";
    }
}