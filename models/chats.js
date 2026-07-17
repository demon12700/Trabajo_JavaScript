// models/chats.js
import mongoose from 'mongoose';

const mensajeSchema = new mongoose.Schema({
    emisor: String,
    nombre: String,
    email: String,
    texto: String,
  createdAt: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
  usuarioExterno: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UsuariosExternos', // ◄ CORREGIDO: Ahora coincide exactamente con el nombre de tu modelo registrado
    required: true,
    unique: true 
  },
  mensajes: [mensajeSchema] 
}, { timestamps: true });

export default mongoose.model('Chat', chatSchema);