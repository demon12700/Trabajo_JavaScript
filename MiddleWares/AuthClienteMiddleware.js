import jwt from "jsonwebtoken";
import UsuariosExternos from "../models/Usuario_Externo.js";

export const protegerCliente = async (req, res, next) => {
  // 1. Obtener el token de las cookies
  const { token_cliente } = req.cookies;

  if (!token_cliente) {
    req.usuario = null;
    return next();
  }

  try {
    // 2. Verificar el token
    const decoded = jwt.verify(token_cliente, process.env.JWT_SECRET);
    
    // 3. Buscar al usuario en la base de datos de externos
    const usuario = await UsuariosExternos.findById(decoded.id).select("-passwordHash -salt"); 

    if (usuario) {
      req.usuario = usuario; // Se lo inyectamos a la petición
    } else {
      req.usuario = null;
    }
    
    return next();
  } catch (error) {
    console.error("Error en autenticación de cliente:", error);
    req.usuario = null;
    return next();
  }
};