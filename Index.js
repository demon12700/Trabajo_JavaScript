import express from "express";
import dotenv from "dotenv";

import { conectarDB } from "./config/db.js";
import VehiculosRoutes from "./routes/VehiculosRoutes.js";
import CambiosRoutes from "./routes/CambiosRoutes.js";

dotenv.config()

const PORT = process.env.PORT || 3000;
const app = express()

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

try {

    await conectarDB();
  
  } catch (error) {
  
    console.error("Error al iniciar:", error);
  
  }
  app.use("/vehiculos", VehiculosRoutes);
  app.use("/cambios", CambiosRoutes);
  // =======================
  // Inicio del servidor
  // =======================
  
  app.listen(PORT, () => {
  
    console.log(`Servidor corriendo en puerto ${PORT}`);

  });