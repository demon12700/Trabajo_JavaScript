import express from "express";
import Vehiculo from "../models/Vehiculo.js";

import {
    crearVehiculo,
    obtenerVehiculos,
    obtenerVehiculoPorID,
    actualizarVehiculo,
    eliminarVehiculo
} from "../controllers/vehiculoController.js"


const router = express.Router();

router.get("/", obtenerVehiculos);
router.get("/api", async (req, res) => {
    try {
        const Vehiculos = await Vehiculo.find(); // Busca todos los documentos de la colección
        res.json(Vehiculos);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener Vehiculos...",
            error: error.message
        });
    }
});

router.get("/:placa", obtenerVehiculoPorID);
router.post("/", crearVehiculo);
router.put("/:placa", actualizarVehiculo);
router.delete("/:placa", eliminarVehiculo);

export default router;