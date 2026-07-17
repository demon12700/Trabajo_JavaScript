import dotenv from "dotenv";
import fs from "fs/promises";
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash" 
});

const consultarIA = async (pregunta) => {
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
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("❌ Error al llamar a la API de Gemini:", error);
    return "Disculpas, en este momento tengo problemas para procesar tu solicitud. Por favor, intenta de nuevo en unos instantes.";
  }
};

export { consultarIA };