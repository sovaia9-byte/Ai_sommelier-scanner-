import { GoogleGenAI, Type } from "@google/genai";
import { WineDetails } from "../types";

export async function analyzeWineImage(base64Image: string): Promise<WineDetails> {
  const apiKey = process.env.API_KEY;

  // Diagnostic check: If this fails, you need to check Vercel Environment Variables
  if (!apiKey || apiKey === "" || apiKey === "undefined") {
    console.error("CRITICAL: API_KEY is not defined in the environment.");
    throw new Error(
      "CONFIGURATION ERROR: The Imperial API Key is missing. " +
      "Please add 'API_KEY' to your Vercel Project Settings and Re-Deploy."
    );
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              text: "Analyze this wine label. You are an Imperial Sommelier. Provide a precise, luxurious, and technical viticultural analysis."
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image,
              },
            },
          ],
        },
      ],
      config: {
        systemInstruction: `You are the AI Imperial Sommelier. Your task is to analyze wine labels with absolute precision. 
        The output must be strictly valid JSON following the provided schema. No markdown, no extra text.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Full name of the wine" },
            vintage: { type: Type.STRING, description: "Production year" },
            region: { type: Type.STRING, description: "Wine region" },
            country: { type: Type.STRING, description: "Country of origin" },
            rating: { type: Type.STRING, description: "Sommelier rating" },
            abv: { type: Type.STRING, description: "Alcohol content" },
            description: { type: Type.STRING, description: "Technical sommelier overview" },
            grapesVariety: { type: Type.STRING, description: "Grape variety breakdown" },
            foodPairings: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Food pairings"
            },
            judgmentPerception: { type: Type.STRING, description: "Definitive stylistic judgment" },
            climate: { type: Type.STRING, description: "Terroir climate" },
            tastingNotes: { type: Type.STRING, description: "Detailed flavor profile" },
            soilStructure: { type: Type.STRING, description: "Soil composition" },
            funFact: { type: Type.STRING, description: "Interesting viticultural fact" },
          },
          required: [
            "name", "vintage", "region", "country", "rating", "abv", 
            "description", "grapesVariety", "foodPairings", 
            "judgmentPerception", "climate", "tastingNotes", 
            "soilStructure", "funFact"
          ],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) throw new Error("Empty response from Imperial Archives.");
    
    return JSON.parse(resultText) as WineDetails;
  } catch (error: any) {
    console.error("Sommelier Service Error Details:", error);
    
    // Check for common API errors
    if (error.status === 401 || error.status === 403) {
      throw new Error("AUTHENTICATION ERROR: Your API Key is invalid or restricted.");
    }
    
    throw new Error(error.message || "SCAN ERROR: The Imperial core encountered a sensor disruption.");
  }
}