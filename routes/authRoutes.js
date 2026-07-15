import express from "express";
import { 
  mostrarLogin, 
  mostrarRegistro, 
  registrarUsuario, 
  iniciarSesion, 
  cerrarSesion 
} from "../controllers/System/authController.js"; // Ajusta la ruta a tu carpeta de controladores


const router = express.Router();

router.get("/login", mostrarLogin);
router.post("/login", iniciarSesion);

router.get("/registro", mostrarRegistro);
router.post("/registro", registrarUsuario);
router.get("/logout", cerrarSesion); 

export default router;