
import { GoogleGenAI } from "@google/genai";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductDescription = async (productName: string, category: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a beautiful, luxury, and persuasive marketing description for a product named "${productName}" in the "${category}" category. Keep it under 60 words.`,
      config: {
        temperature: 0.7,
      }
    });
    // Property .text is a getter, not a method.
    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating AI description.";
  }
};

export const suggestPrice = async (productName: string, category: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Suggest a competitive and realistic price for a product: ${productName} in category: ${category}. Respond with ONLY a number representing the price in Nigerian Naira (NGN).`,
    });
    const priceStr = response.text?.trim().match(/\d+(\.\d{1,2})?/);
    return priceStr ? parseFloat(priceStr[0]) : 25000;
  } catch (error) {
    return 25000;
  }
};
