
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const refineText = async (text: string, context: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Melhore o seguinte texto para um currículo profissional. O contexto é: ${context}. Texto original: "${text}". Retorne apenas o texto melhorado em português.`,
  });
  return response.text || text;
};

export const editPhotoWithAI = async (base64Image: string, prompt: string): Promise<string | null> => {
  const ai = getAI();
  try {
    // Clean base64 string
    const base64Data = base64Image.split(',')[1] || base64Image;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: 'image/png',
            },
          },
          {
            text: `${prompt}. Make sure the result is a high-quality professional portrait suitable for a resume. Return the edited image.`,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("AI Photo Edit Error:", error);
    return null;
  }
};
