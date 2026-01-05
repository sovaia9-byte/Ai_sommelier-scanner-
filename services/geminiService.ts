
import { GoogleGenAI, Type } from "@google/genai";
import { WineDetails } from "../types";

// Always initialize GoogleGenAI with a named parameter using process.env.API_KEY directly
export async function analyzeWineImage(base64Image: string): Promise<WineDetails> {
  // Use the API key directly from process.env.API_KEY as per the @google/genai directive.
  // This avoids requesting the user for an API key in the UI or code logic.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      // Technical wine analysis is a complex reasoning task, so gemini-3-pro-preview is selected
      model: "gemini-3-pro-preview",
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

    // Access the .text property directly (not a method call) as specified in the SDK documentation
    const resultText = response.text?.trim();
    if (!resultText) throw new Error("The Imperial archives returned an empty response.");
    
    return JSON.parse(resultText) as WineDetails;
  } catch (error: any) {
    console.error("Sommelier Error:", error);
    // Generic error message for internal issues to maintain a smooth user experience
    throw new Error("UNABLE TO SCAN: The Imperial core encountered a sensor disruption. Ensure the label is well-lit.");
  }
}
