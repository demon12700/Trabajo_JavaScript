// routes/soporteRoutes.js
import express from 'express';
import { 
    mostrarSoporte, 
    mostrarLoginCliente, 
    autenticarCliente, 
    cerrarSesionCliente,
    obtenerChatAPI
} from '../controllers/User/soporteControllers.js';

import { protegerCliente } from '../MiddleWares/AuthClienteMiddleware.js';
import { protegerRuta } from '../MiddleWares/AuthMiddleware.js';
import { mostrarDashboardSoporte } from '../controllers/User/soporteControllers.js';

const router = express.Router();

// Ruta de la pantalla de chat de soporte (Pasa por el middleware para leer la cookie)
router.get('/soporte', protegerCliente, mostrarSoporte);

// Rutas de inicio y cierre de sesión de soporte para clientes
router.get('/soporte/login', mostrarLoginCliente);
router.post('/soporte/login', autenticarCliente);
router.get('/soporte/logout', cerrarSesionCliente);
router.get('/soporte/dashboard', protegerRuta, mostrarDashboardSoporte);
router.get('/soporte/api/chat/:id', protegerRuta, obtenerChatAPI);

export default router;