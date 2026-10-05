import { GoogleGenAI } from "@google/genai";



export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,

  retryConfig: {
    attempts: 1,
  },
});

export const geminiModel = 'gemini-3.8-flash';