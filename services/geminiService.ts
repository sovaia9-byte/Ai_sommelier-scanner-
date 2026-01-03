
import { GoogleGenAI, Type } from "@google/genai";
import { WineDetails } from "../types";

export async function analyzeWineImage(base64Image: string): Promise<WineDetails> {
  // Initializing inside the function ensures we grab the latest environment variables
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";

  const prompt = `Analyze this wine label and provide detailed information. If some details are not visible, use your knowledge to provide the most accurate estimation based on the producer and style. 
  Focus on high-quality viticultural details. Return a professional sommelier's perspective.`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
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
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Full name of the wine" },
          vintage: { type: Type.STRING, description: "Year of production" },
          region: { type: Type.STRING, description: "Specific wine region" },
          country: { type: Type.STRING, description: "Country of origin" },
          rating: { type: Type.STRING, description: "Estimated critic or average rating (e.g. 92 pts)" },
          abv: { type: Type.STRING, description: "Alcohol by volume percentage" },
          description: { type: Type.STRING, description: "A brief professional overview of the wine" },
          grapesVariety: { type: Type.STRING, description: "Main grape varieties used" },
          foodPairings: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of recommended food pairings"
          },
          judgmentPerception: { type: Type.STRING, description: "Subjective perception or stylistic judgment of the wine" },
          climate: { type: Type.STRING, description: "The climate of the region where it was grown" },
          tastingNotes: { type: Type.STRING, description: "Aromatic and palate-based tasting notes" },
          soilStructure: { type: Type.STRING, description: "The geological/soil characteristics of the vineyard" },
          funFact: { type: Type.STRING, description: "An interesting piece of trivia about this wine or producer" },
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
  if (!resultText) throw new Error("The Imperial Sommelier was unable to decant the data. Please try again.");
  
  return JSON.parse(resultText) as WineDetails;
}
