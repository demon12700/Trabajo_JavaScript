import dotenv from "dotenv";
import fs from "fs/promises";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const consultarIA = async (pregunta) => {
  console.log("=== CONTROL DE API KEY ===");
  console.log("Valor actual de GEMINI_API_KEY:", process.env.GEMINI_API_KEY);
  console.log("==========================");

  if (!process.env.GEMINI_API_KEY) {
    return "Error de configuración: La API Key de Gemini llega vacía al servicio. Revisá el archivo .env.";
  }

  let contexto = "";
  try {
    contexto = await fs.readFile("./prompts/prompt.text", "utf-8");
  } catch (err) {
    console.warn("⚠️ No se pudo leer './prompts/prompt.text'. Usando contexto de emergencia.");
    contexto = "Actúa como un asistente de soporte técnico cordial y conciso.";
  }

  const prompt = `
${contexto}

Cliente:
${pregunta}
`;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    return response.text;

  } catch (error) {
    console.error("❌ Error al llamar a la API de Gemini:", error);
    return "Disculpas, en este momento tengo problemas para procesar tu solicitud. Por favor, intenta de nuevo en unos instantes.";
  }
};

export { consultarIA };