import Cambios from "../models/Cambios.js";
import Vehiculo from "../models/Vehiculo.js";

//CREAR

const crearCambios = async (req, res) => {
    try {
        console.log("Crear Cambios", req.body);
        const nuevoCambios = new Cambios(req.body);
        const CambiosGuardados = await nuevoCambios.save();
        res.status(201).json(CambiosGuardados);
    } catch (error) {
        res.status(500).json({mensaje: "Error al crear el Cambio...", error: error.message});
    }
}

//LEER POR VEHICULO

const obtenerCambiosPorVehiculo = async (req, res) => {
    try {
        const cambiosEncontrados = await Cambios.find({ vehiculo: req.params.placa });
        if (!cambiosEncontrados || cambiosEncontrados.length === 0) {
            return res.status(404).json({ mensaje: "No se encontraron cambios en tal Vehiculo..." });
        }
        res.status(200).json(cambiosEncontrados);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los cambios...", error: error.message });
    }
}

//ELIMINAR CAMBIOS DE VEHICULO CON PLACA

const eliminarCambiosPorVehiculo = async (req, res) => {
    try {
        const cambiosEliminados = await Cambios.deleteMany({ vehiculo: req.params.placa });
        if (cambiosEliminados.deletedCount === 0) {
            return res.status(404).json({ mensaje: "No se encontraron cambios para eliminar en el Vehiculo..." });
        }
        res.status(200).json({ mensaje: "Cambios eliminados exitosamente..." });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar los cambios...", error: error.message });
    }
}

//Eportar funciones Controller

export {
    crearCambios,
    obtenerCambiosPorVehiculo,
    eliminarCambiosPorVehiculo
}