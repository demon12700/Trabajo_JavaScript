import express from "express";
import dotenv from "dotenv";

import { conectarDB } from "./config/db.js";
import VehiculosRoutes from "./routes/VehiculosRoutes.js";

dotenv.config()

const PORT = process.env.PORT || 3000;

const app = express()

try {

    await conectarDB();
  
  } catch (error) {
  
    console.error("Error al iniciar:", error);
  
  }
  app.use("/vehiculos", VehiculosRoutes);

  // =======================
  // Inicio del servidor
  // =======================
  
  app.listen(PORT, () => {
  
    console.log(`Servidor corriendo en puerto ${PORT}`);
  
  });