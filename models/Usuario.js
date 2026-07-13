import crypto from "crypto";
import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

usuarioSchema.methods.validarPassword = function(password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 64, "sha512")
    .toString("hex");

  return this.passwordHash === hash;
};

usuarioSchema.statics.crearPasswordSeguro = function(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const passwordHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return { salt, passwordHash };
};

export default mongoose.model("Usuario", usuarioSchema);
