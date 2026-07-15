import express from "express";
import Cambios from "../models/Cambios.js"; 

import {
    crearCambios,
    obtenerCambiosPorVehiculo,
    eliminarCambiosPorVehiculo
}
from "../controllers/System/CambiosController.js"

const router = express.Router();

router.get("/:placa", obtenerCambiosPorVehiculo);
router.post("/", crearCambios);
router.delete("/:placa", eliminarCambiosPorVehiculo);

export default router;