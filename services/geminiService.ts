import { GoogleGenAI, Type } from "@google/genai";
import { WineDetails } from "../types";

export async function analyzeWineImage(base64Image: string): Promise<WineDetails> {
  const apiKey = process.env.API_KEY;

  // Explicit check for the API key to prevent vague "sensor disruption" errors
  if (!apiKey || apiKey === "undefined" || apiKey.length < 10) {
    throw new Error(
      "API KEY MISSING: The Imperial Sommelier requires a Gemini API Key. " +
      "Please add 'API_KEY' to your Vercel Environment Variables and re-deploy."
    );
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      // Using Flash for high-speed image processing/label scanning
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
        Provide a luxurious and professional viticultural analysis. 
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

    const resultText = response.text?.trim();
    if (!resultText) throw new Error("The Imperial archives returned an empty response.");
    
    return JSON.parse(resultText) as WineDetails;
  } catch (error: any) {
    console.error("Sommelier Service Error:", error);
    
    // Check if it's an API Key or Auth error
    if (error.message?.includes("API key") || error.status === 401 || error.status === 403) {
      throw new Error("AUTHENTICATION FAILED: The Imperial API Key is invalid or restricted.");
    }

    throw new Error(error.message || "SCAN FAILED: The Imperial core encountered a sensor disruption.");
  }
}