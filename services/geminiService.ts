import { GoogleGenAI, Type } from "@google/genai";
import { WineDetails } from "../types";

export async function analyzeWineImage(base64Image: string): Promise<WineDetails> {
  // Always use the API key directly from process.env.API_KEY as per the @google/genai coding guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              text: "Analyze this wine label. You are an Imperial Sommelier. Provide a precise, luxurious, and professional viticultural analysis."
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
        If specific data points are not visible on the label, use your extensive knowledge of producers and regions to provide highly accurate estimations.
        The output must be strictly valid JSON following the provided schema. No markdown, no extra text.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Full prestigious name of the wine" },
            vintage: { type: Type.STRING, description: "Production year (e.g., '2018')" },
            region: { type: Type.STRING, description: "Specific wine region/appellation" },
            country: { type: Type.STRING, description: "Country of origin" },
            rating: { type: Type.STRING, description: "Professional sommelier score (e.g., '95/100 Imperial Points')" },
            abv: { type: Type.STRING, description: "Alcohol by volume percentage" },
            description: { type: Type.STRING, description: "A poetic yet technical sommelier overview" },
            grapesVariety: { type: Type.STRING, description: "Detailed grape variety breakdown" },
            foodPairings: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Elite culinary pairings"
            },
            judgmentPerception: { type: Type.STRING, description: "A singular, definitive stylistic judgment" },
            climate: { type: Type.STRING, description: "Macro-climate and terroir description" },
            tastingNotes: { type: Type.STRING, description: "Rich aromatic and flavor profile notes" },
            soilStructure: { type: Type.STRING, description: "The geological composition of the vineyard" },
            funFact: { type: Type.STRING, description: "A captivating viticultural history or fact" },
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

    // Directly access the .text property from the GenerateContentResponse object.
    const resultText = response.text;
    if (!resultText) throw new Error("The Imperial archives returned an empty response.");
    
    return JSON.parse(resultText) as WineDetails;
  } catch (error: any) {
    console.error("Sommelier Error:", error);
    
    const message = error?.message || "";
    if (message.includes("API_KEY_INVALID") || message.includes("401")) {
      throw new Error("UNAUTHORIZED: Your API Key is invalid. Please update it in your hosting settings.");
    }
    if (message.includes("quota") || message.includes("429")) {
      throw new Error("QUOTA EXCEEDED: The Imperial API limit has been reached. Please try again later.");
    }
    
    throw new Error("SENSOR MALFUNCTION: Unable to read the vintage label. Ensure the label is clear and well-lit.");
  }
}