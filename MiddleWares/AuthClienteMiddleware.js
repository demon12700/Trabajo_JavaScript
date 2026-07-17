// MiddleWares/AuthClienteMiddleware.js
import jwt from "jsonwebtoken";
import UsuariosExternos from "../models/Usuario_Externo.js"; // Asegurate de que la ruta sea correcta

export const protegerCliente = async (req, res, next) => {
  // 1. Obtener el token de las cookies (usamos un nombre de cookie diferente, ej: 'token_cliente')
  const { token_cliente } = req.cookies;

  if (!token_cliente) {
    req.usuario = null;
    return next();
  }

  try {
    // 2. Verificar el token
    const decoded = jwt.verify(token_cliente, process.env.JWT_SECRET);
    
    // 3. Buscar al usuario en la base de datos de externos
    const usuario = await UsuariosExternos.findById(decoded.id).select("-passwordHash -salt"); //[cite: 46]

    if (usuario) {
      req.usuario = usuario; // Se lo inyectamos a la petición[cite: 45]
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