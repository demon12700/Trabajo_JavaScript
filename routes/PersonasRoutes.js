import express from "express";
import Persona from "../models/Persona.js";

import {
    probarIA,
    obtenerPersonasVista,
    obtenerPersonaPorId,
    crearPersona,
    actualizarPersona,
    eliminarPersona,
} from "../controllers/personasController.js";

const router = express.Router();


// Rutas CRUD
router.get("/ia", probarIA);
router.get("/", obtenerPersonasVista);
router.get("/api", async (req, res) => {
    try {
        const personas = await Persona.find(); // Busca todos los documentos de la colección
        res.json(personas);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener personas"
        });
    }
});
router.get("/:id", obtenerPersonaPorId);
router.post("/", crearPersona);
router.put("/:id", actualizarPersona);
router.delete("/:id", eliminarPersona);

export default router;