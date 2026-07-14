import express from "express";
import Vehiculo from "../models/Vehiculo.js";

import {
    crearVehiculo,
    obtenerVehiculos,
    obtenerVehiculoPorID,
    actualizarVehiculo,
    eliminarVehiculo,
    mostrarFormularioEditar,
    actualizarVehiculoWeb
} from "../controllers/vehiculoController.js";

const router = express.Router();

router.get("/", obtenerVehiculos);

router.get("/agregar", async (req, res) => {
    try {
        const VehiculosExistentes = await Vehiculo.find();
        res.render("AgregarDatos", {
            listaVehiculos: VehiculosExistentes
        });
    } catch (error) {
        res.status(500).send("Error al cargar la página de registro");
    }
});

router.get("/api", async (req, res) => {
    try {
        const Vehiculos = await Vehiculo.find(); 
        res.json(Vehiculos);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener Vehiculos...",
            error: error.message
        });
    }
});

router.get("/editar/:placa", mostrarFormularioEditar);
router.post("/editar/:placa", actualizarVehiculoWeb);
router.get("/:placa", obtenerVehiculoPorID);
router.post("/", crearVehiculo);
router.put("/:placa", actualizarVehiculo);
router.delete("/:placa", eliminarVehiculo);

export default router;