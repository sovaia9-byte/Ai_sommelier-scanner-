
import { GoogleGenAI, Type } from "@google/genai";
import { WineDetails } from "../types";

export async function analyzeWineImage(base64Image: string): Promise<WineDetails> {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey.length < 10) {
    throw new Error(
      "CONFIGURATION ERROR: The Imperial API Key is missing. " +
      "If you are using Sevalla or Render: Go to 'Environment Variables' in your dashboard, " +
      "add a variable named 'API_KEY', and paste your Gemini Key there."
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
            rating: { type: Type.STRING, description: "Sommelier rating (e.g. 95/100)" },
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
    if (!resultText) throw new Error("The Imperial archives returned an empty response.");
    
    return JSON.parse(resultText) as WineDetails;
  } catch (error: any) {
    console.error("Sommelier Error:", error);
    if (error.message.includes("API_KEY")) throw error;
    throw new Error("UNABLE TO SCAN: Ensure the label is well-lit and the API Key is valid.");
  }
}
