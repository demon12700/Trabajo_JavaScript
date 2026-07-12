import mongoose from "mongoose";

const CambiosSchema = new mongoose.Schema({
    Nombre: {
        type: String,
        required: true
    },
    Gmail: {
        type: String,
        required: true
    },
    Contraseña: {
        type: String,
        required: true
    },
    encargado: {
        type: String,
        required: true
    }
}, 
{
    timestamps: true  //Guarda tiempo de creacion
});

export default mongoose.model("Usuarios", UsuariosSchema);