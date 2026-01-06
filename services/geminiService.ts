
import { GoogleGenAI, Type } from "@google/genai";
import { WineDetails } from "../types";

export async function analyzeWineImage(base64Image: string): Promise<WineDetails> {
  const apiKey = process.env.API_KEY;


  // Always create a new instance to ensure we use the current environment's key
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          {
            text: "You are a Master Sommelier. Analyze this wine label with 100% precision. Identify the exact producer, wine name, vintage year, sub-region, and grape varietal composition. Provide high-accuracy technical insights into the terroir soil geological structure, macro-climate conditions, and a definitive stylistic judgment. Return the results strictly as a JSON object."
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
        ],
      },
      config: {
        systemInstruction: `You are the AI Imperial Sommelier. Your task is to analyze wine labels with absolute precision. 
        Extract data directly from the image with a focus on high accuracy. If certain details are not explicitly printed, use your deep viticultural knowledge to provide the most technically accurate profile based on the producer's known cuvées.
        The output MUST be valid JSON matching the schema. Do not include any markdown or conversational filler.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Full commercial name of the wine including producer" },
            vintage: { type: Type.STRING, description: "Year of production (e.g., '2019')" },
            region: { type: Type.STRING, description: "Detailed wine region (e.g., 'Pommard, Côte de Beaune, Burgundy')" },
            country: { type: Type.STRING, description: "Country of origin" },
            rating: { type: Type.STRING, description: "Sommelier rating out of 100" },
            abv: { type: Type.STRING, description: "Alcohol by volume percentage (e.g., '13.5%')" },
            description: { type: Type.STRING, description: "A technical and sophisticated sommelier overview of the vintage and wine" },
            grapesVariety: { type: Type.STRING, description: "Exact grape varieties or detailed blend percentages" },
            foodPairings: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "High-end gastronomic food pairings"
            },
            judgmentPerception: { type: Type.STRING, description: "A technical stylistic judgment of the wine's character and aging potential" },
            climate: { type: Type.STRING, description: "Specific macro-climate conditions of the vineyard" },
            tastingNotes: { type: Type.STRING, description: "Detailed organoleptic profile: aromas, palate weight, acidity, tannins, and finish" },
            soilStructure: { type: Type.STRING, description: "Detailed geological composition of the vineyard terroir" },
            funFact: { type: Type.STRING, description: "An obscure historical or technical detail about this specific wine or producer" },
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
    if (!resultText) throw new Error("EMPTY_RESPONSE");
    
    return JSON.parse(resultText) as WineDetails;
  } catch (error: any) {
    console.error("Sommelier Intelligence Error:", error);
    const errorMsg = error?.message || String(error);

    }
    throw new Error("SCAN_ERROR");
  }
}
