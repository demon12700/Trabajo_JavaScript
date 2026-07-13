import dotenv from "dotenv";
import fs from "fs/promises";
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config();



const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

const consultarIA = async (pregunta) => {

  const contexto = await fs.readFile(
    "./prompts/vendedor.txt",
    "utf-8"
  );

  const prompt = `
${contexto}

Cliente:
${pregunta}
`;

  const result =
    await model.generateContent(prompt);

  return result.response.text();

};

export {
  consultarIA
};