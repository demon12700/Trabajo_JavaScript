import mongoose from "mongoose";
import crypto from "crypto";

const UsuarioExternoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
        //ej: para crear una cuenta que se vincule a un vehiculo en medida de Gmail iguales.
    },
    passwordHash: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    }

}, 
{
    timestamps: true  //Guarda tiempo de creacion/Modificacion
});

UsuarioExternoSchema.methods.validarPassword = function(password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 64, "sha512")
    .toString("hex");

  return this.passwordHash === hash;
};

UsuarioExternoSchema.statics.crearPasswordSeguro = function(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const passwordHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return { salt, passwordHash };
};

export default mongoose.model("UsuariosExternos", UsuarioExternoSchema);