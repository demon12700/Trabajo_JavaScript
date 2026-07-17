import Chat from "./models/Chat.js";
import soporteRoutes from './routes/soporteRoutes.js';

app.get("/soporte", protegerRuta, (req, res) => {
    res.render("chatLocal", { usuario: req.usuario || null });
  });

// =======================
// WEBSOCKET ACTUALIZADO (Socket.io)
// =======================
io.on("connection", (socket) => {
  console.log("Un cliente se ha conectado");

  // Escuchamos el evento de nuestro nuevo chat widget
  socket.on("mensaje_chat", async (datos) => {
    try {
      const { nombre, email, texto } = datos;

      // 1. Buscamos si ya existe un documento de Chat activo para este correo
      let chatExistente = await Chat.findOne({ emailUsuario: email });

      if (!chatExistente) {
        // 2. Si no existe, creamos un nuevo registro en la base de datos
        chatExistente = new Chat({
          nombreUsuario: nombre,
          emailUsuario: email,
          mensajes: []
        });
      }

      // 3. Añadimos el nuevo mensaje al arreglo del historial
      chatExistente.mensajes.push({
        emisor: nombre,
        texto: texto
      });

      await chatExistente.save();

      // 4. Retransmitimos el mensaje en tiempo real a todos los clientes
      io.emit("mensaje_chat", datos);

    } catch (error) {
      console.error("Error al procesar el chat en la base de datos:", error);
    }
  });

  // Mantener el resto de sockets originales...
  socket.on("mensaje", async (datos) => {
     // ... tu lógica para mensajes generales de @gemini[cite: 33]
  });
});

// En tu app.js o index.js...

// 1. Importás el archivo de rutas


// ... (donde tengas configurados tus otros middlewares y router de Express)

// 2. Registrás la ruta para que Express la reconozca
app.use('/', soporteRoutes);