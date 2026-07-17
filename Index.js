import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

import { conectarDB } from "./config/db.js";

import CambiosRoutes from "./routes/CambiosRoutes.js";
import userExRoutes from "./routes/userExRoutes.js";
import VehiculosRoutes from "./routes/VehiculosRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import soporteRoutes from './routes/soporteRoutes.js';

import { protegerRuta } from "./MiddleWares/AuthMiddleware.js";
import { consultarIA } from "./services/geminiService.js"; // Importamos tu servicio de IA
import Chat from "./models/chats.js"; // Importamos tu modelo de historial de chats

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
  console.log("Un cliente se ha conectado al soporte");

  // Escuchamos el evento de nuestro chat widget o del dashboard de soporte
  socket.on('mensaje_chat', async (datos) => {
    try {
      const { usuarioId, nombre, email, texto } = datos;

      // 1. Buscamos por el ID único del usuario externo
      let chatExistente = await Chat.findOne({ usuarioExterno: usuarioId });

      if (!chatExistente) {
        // 2. Si no existe un chat para este usuario, creamos el registro inicial
        chatExistente = new Chat({
          usuarioExterno: usuarioId,
          nombreUsuario: nombre,
          emailUsuario: email,
          mensajes: []
        });
      }

      // 3. Añadimos el nuevo mensaje al arreglo del historial utilizando 'emisor'
      chatExistente.mensajes.push({
        emisor: nombre, // Almacena "Soporte Técnico" o el nombre del cliente correspondientemente
        texto: texto
      });

      await chatExistente.save();

      // 4. Retransmitimos el mensaje en tiempo real a todos los clientes conectados
      io.emit("mensaje_chat", datos);

      // 5. Verificamos si el mensaje empieza con @gemini para disparar la IA
      if (texto && texto.trim().startsWith("@gemini")) {
        const pregunta = texto.replace("@gemini", "").trim();
        
        try {
          // Llamamos a tu servicio de IA
          const respuesta = await consultarIA(pregunta);

          const datosIA = {
            usuarioId: usuarioId, // Mantenemos el contexto del usuario actual
            nombre: "Gemini (Soporte IA)",
            email: "gemini@soporte.com",
            texto: respuesta
          };

          // Guardamos también la respuesta de la IA en la base de datos
          chatExistente.mensajes.push({
            emisor: datosIA.nombre,
            texto: datosIA.texto
          });
          await chatExistente.save();

          // Emitimos la respuesta de la IA a todos en tiempo real
          io.emit("mensaje_chat", datosIA);

        } catch (error) {
          console.error("Error al consultar a Gemini:", error);
          io.emit("mensaje_chat", {
            usuarioId: usuarioId,
            nombre: "Gemini (Soporte IA)",
            email: "gemini@soporte.com",
            texto: "Disculpame, en este momento no puedo procesar tu consulta."
          });
        }
      }

    } catch (error) {
      console.error("Error al procesar el chat en la base de datos:", error);
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
  res.render("index", { usuario: req.usuario }); 
});

app.use("/", authRoutes);
app.use("/", soporteRoutes); 

// =======================
// Rutas del Negocio (Protegidas)
// =======================
app.use("/vehiculos", VehiculosRoutes);
app.use("/cambios", CambiosRoutes);
app.use("/usuarios", userExRoutes);

// =======================
// Inicio del servidor
// =======================
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});