import express from "express";

import {
    mostrarFormularioRegistro,
    regristrarUsuarioExterno,
    conseguirUsuarios
} from "../controllers/User/userController.js";

const router = express.Router();

router.get("/registro", mostrarFormularioRegistro);

router.post("/registro", regristrarUsuarioExterno);

router.get("/lista", conseguirUsuarios);

export default router;