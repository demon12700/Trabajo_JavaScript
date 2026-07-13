import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

import { conectarDB } from "./config/db.js";

import CambiosRoutes from "./routes/CambiosRoutes.js";
import VehiculosRoutes from "./routes/VehiculosRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { protegerRuta } from "./MiddleWares/AuthMiddleware.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
const server = createServer(app);
const io = new Server(server);

// =======================
// Configuraciones del motor de vistas y parser
// =======================
app.use(cookieParser());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Configura la carpeta "public" para servir archivos estáticos (como styles.css)
app.use(express.static("public")); 

app.set("view engine", "pug");
app.set("views", "./views");

// =======================
// WebSocket (Socket.io)
// =======================
io.on("connection", (socket) => {
  socket.on("mensaje", async (datos) => {
    io.emit("mensaje", datos);
    if (datos.texto && datos.texto.startsWith("@gemini")) {
      const pregunta = datos.texto.replace("@gemini", "");
      const respuesta = await consultarIA(pregunta);
      io.emit("mensaje", {
        usuario: "Gemini",
        texto: respuesta
      });
    }
  });
});

// =======================
// Inicialización de Base de Datos
// =======================
try {
  await conectarDB();
} catch (error) {
  console.error("Error al iniciar la base de datos:", error);
}

// =======================
// Rutas de Autenticación (Públicas)
// =======================

app.get("/", protegerRuta, (req, res) => {
  res.render("index", { usuario: req.usuario }); // Le pasamos el usuario logueado por si quieres usar su nombre
});

app.use("/", authRoutes);

// =======================
// Rutas del Negocio (Protegidas)
// =======================
app.use("/vehiculos", VehiculosRoutes);
app.use("/cambios", CambiosRoutes);

// =======================
// Inicio del servidor
// =======================
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});