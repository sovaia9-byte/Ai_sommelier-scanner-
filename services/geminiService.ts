
import { GoogleGenAI, Type } from "@google/genai";
import { WineDetails } from "../types";

export async function analyzeWineImage(base64Image: string): Promise<WineDetails> {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey.length < 10) {
    throw new Error("IMPERIAL KEY MISSING: The API_KEY environment variable is not configured correctly in the Imperial Core (Vercel).");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              text: "Analyze this wine label. You are an Imperial Sommelier. Be precise, elegant, and insightful."
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
        If data is missing from the label, use your extensive knowledge of producers and vintages to provide accurate estimations.
        The output must be strictly valid JSON following the provided schema.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Full prestigious name of the wine" },
            vintage: { type: Type.STRING, description: "Production year" },
            region: { type: Type.STRING, description: "Wine region and sub-appellation" },
            country: { type: Type.STRING, description: "Country of origin" },
            rating: { type: Type.STRING, description: "Sommelier rating (e.g., 94/100 Imperial Points)" },
            abv: { type: Type.STRING, description: "Alcohol content percentage" },
            description: { type: Type.STRING, description: "A poetic yet professional sommelier overview" },
            grapesVariety: { type: Type.STRING, description: "Detailed grape variety breakdown" },
            foodPairings: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Elite culinary pairings"
            },
            judgmentPerception: { type: Type.STRING, description: "The definitive stylistic judgment" },
            climate: { type: Type.STRING, description: "Detailed macro-climate description" },
            tastingNotes: { type: Type.STRING, description: "Aromatic and palate-based tasting notes" },
            soilStructure: { type: Type.STRING, description: "The geological matrix of the vineyard" },
            funFact: { type: Type.STRING, description: "A captivating piece of viticultural history" },
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
    const message = error?.message || "";
    
    // Categorizing common Google API errors
    if (message.includes("API_KEY_INVALID") || message.includes("unauthorized") || message.includes("401")) {
      throw new Error("UNAUTHORIZED ACCESS: The provided API key is invalid or restricted. Please check your Google AI Studio credentials.");
    }
    if (message.includes("quota") || message.includes("429")) {
      throw new Error("QUOTA EXHAUSTED: The Imperial archives are currently overwhelmed. Please try again in a moment.");
    }
    if (message.includes("Safety") || message.includes("HARM_CATEGORY")) {
      throw new Error("PROTOCOL BREACH: The visual data was flagged by safety filters. Ensure the label is appropriate.");
    }
    
    console.error("Sommelier Error:", error);
    throw new Error(error.message || "SENSOR MALFUNCTION: The vintage data could not be decanted. Ensure the label is clear.");
  }
}
