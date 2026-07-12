import Cambios from "../models/Cambios.js";
import Vehiculo from "../models/Vehiculo.js";

//CREAR

const crearCambios = async (req, res) => {
    try {
        const { tipo, parte, detalles, encargado, placa } = req.body;
        
        if (!placa) {
            return res.status(400).json({ mensaje: "La placa del vehiculo es requerido para crear un cambio..." });
        }
        const vehiculoExistente = await Vehiculo.findOne({ placa: placa });
        if (!vehiculoExistente) {
            return res.status(404).json({ mensaje: "No se encontró un vehiculo con la placa proporcionada..." });
        }
        const nuevoCambio = new Cambios({
            tipo,
            parte,
            detalles,
            encargado,
            placa: vehiculoExistente._id
        })
        const cambiosGuardados = await nuevoCambio.save();
        res.status(201).json(cambiosGuardados);
        res.redirect("/vehiculos");
    }catch (error) {
        res.status(500).json({ mensaje: "Error al crear el cambio...", error: error.message });
    }
}

//LEER POR VEHICULO

const obtenerCambiosPorVehiculo = async (req, res) => {
    try {
        const VehiculoExistente = await Vehiculo.findOne({ placa: req.params.placa});
        if (!VehiculoExistente) {
            return res.status(404).json({ mensaje: "No se encontró un vehiculo con la placa proporcionada..." });
        }
        const cambiosEncontrados = await Cambios.find({ placa: VehiculoExistente._id});
        if (cambiosEncontrados.length === 0) {
            return res.status(404).json({ mensaje: "No se encontraron cambios para el vehiculo con la placa proporcionada..." });
        }
        res.status(200).json(cambiosEncontrados);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los cambios...", error: error.message });
    }
}

//ELIMINAR CAMBIOS DE VEHICULO CON PLACA

const eliminarCambiosPorVehiculo = async (req, res) => {
    try {
        const VehiculoExistente = await Vehiculo.findOne({ placa: req.params.placa});
        if (!VehiculoExistente) {
            return res.status(404).json({ mensaje: "No se encontró un vehiculo con la placa proporcionada..." });
        }
        const cambiosEliminados = await Cambios.deleteMany({ placa: VehiculoExistente._id});
        res.status(200).json({ mensaje: "Cambios eliminados correctamente", cambiosEliminados });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar los cambios...", error: error.message });
    }
}

//Exportar funciones Controller

export {
    crearCambios,
    obtenerCambiosPorVehiculo,
    eliminarCambiosPorVehiculo
}