import Cambios from "../models/Cambios.js";
import Vehiculo from "../models/Vehiculo.js";

//CREAR

const crearCambios = async (req, res) => {
    try {
        console.log("Crear Cambios", req.body);
        const {tipo, cambio, detalles, encargado, placa} = req.body;
        if (!placa) {
            return res.status(400).json({mensaje: "La placa del vehiculo es requerido para crear un cambio..."});
        }
        const vehiculoExistente = await Vehiculo.findOne({placa: placa});
        if (!vehiculoExistente) {
            return res.status(404).json({mensaje: "No se encontró un vehiculo con la placa proporcionada..."});
        }
        const nuevoCambios = new Cambios(req.body);
        const CambiosGuardados = await nuevoCambios.save();
        res.status(201).json(CambiosGuardados);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear el cambio...", error: error.message });
    }
}

//LEER POR VEHICULO

const obtenerCambiosPorVehiculo = async (req, res) => {
    try {
        vehiculoExistente = await Vehiculo.findOne({placa: req.params.placa});
        if (!vehiculoExistente) {
            return res.status(404).json({mensaje: "No se encontró un vehiculo con la placa proporcionada..."});
        }
        const CambiosEncontrados = await Cambios.find({placa: req.params.placa});
        res.status(200).json(CambiosEncontrados);
        if (CambiosEncontrados.length === 0) {
            return res.status(404).json({ mensaje: "No se encontraron cambios para este vehiculo..." });
        }
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los cambios...", error: error.message });
    }
}

//ELIMINAR CAMBIOS DE VEHICULO CON PLACA

const eliminarCambiosPorVehiculo = async (req, res) => {
    try {
        vehiculoExistente = await Vehiculo.findOne({placa: req.params.placa});
        if (!vehiculoExistente) {
            return res.status(404).json({mensaje: "No se encontró un vehiculo con la placa proporcionada..."});
        }
        const CambiosEliminados = await Cambios.deleteMany({placa: req.params.placa});
        if (CambiosEliminados.deletedCount === 0) {
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